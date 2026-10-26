// Web tracking pages opened from the links in Live Tracking 2.0's "Web
// Tracking Links" modal (MOVE-3676). One page, two audiences:
//
//   driver    — Map + traffic, Driver's location, Schedule details, Route points
//   passenger — the same, plus ETA, Passenger location and a call-driver button
//
// Product review (22 Oct 2026, Figma comments tagged #Req): the Route List,
// the Register action and the per-point status lines ("Registered at …",
// "Next · ETA", "Not registered") were all "no need", so both pages are
// view-only. Points the bus has already passed still show green on the rail.
//
// Behaviour from MOVE-1685 (FMS): keep the screen awake while the driver page
// is open, hide the bus icon when there's no location, and show "Trip has
// ended, tracking unavailable" once the link expires (1 hour after trip end).
//
// Built for a phone browser first, but the same page lays out as map + side
// panel on a desktop browser (the product team asked for both).
//
// No backend: the driver's position is simulated along the route. On the
// driver page the browser is still asked for location permission, because
// whether that is granted is a real state the page has to handle.

import { useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, Marker, Polyline, TrafficLayer, useJsApiLoader } from '@react-google-maps/api'
import { MapContainer, TileLayer, Marker as LMarker, Polyline as LPolyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Avatar, Button, Popover, Segmented, Switch, Tag, Typography, message, theme } from 'antd'
import {
  AimOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DisconnectOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  MobileOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { trafficSegments, TRAFFIC_COLOR } from './trackingData'
import stopPhoto from '../../assets/stop-photo-joo-koon.jpg'
import {
  formatAmPm,
  positionAlong,
  webTrip,
  type WebTrackingAudience,
  type WtPoint,
} from './webTrackingData'

const { Text } = Typography
const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? ''

const BLUE = '#1677ff'
const GREEN = '#16a34a'
const GREY = '#8c8c8c'
const MIN_PER_LEG = 8 // demo: scheduled minutes between consecutive points

/** Demo-only switch, so every state the page can be in is reachable without a backend. */
type DemoState = 'live' | 'stop-photo' | 'location-off' | 'driver-offline' | 'expired'

/** Demo wait time at the stop being headed to (the app shows "Wait time N min"). */
const STOP_WAIT_MIN = 2

function useIsMobile() {
  const q = '(max-width: 767px)'
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

/* ───────────────────────────── Map ───────────────────────────── */

interface MapProps {
  points: WtPoint[]
  passed: Record<string, string>
  nextPointId: string | null
  driverPos: [number, number] | null
  passengerPos: [number, number] | null
  showTraffic: boolean
  focus: [number, number] | null
}

const busSvg = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="${BLUE}" stroke="#fff" stroke-width="3"/><rect x="12" y="11" width="16" height="16" rx="3" fill="#fff"/><rect x="14" y="13" width="12" height="6" rx="1" fill="${BLUE}"/><circle cx="15.5" cy="24" r="1.6" fill="${BLUE}"/><circle cx="24.5" cy="24" r="1.6" fill="${BLUE}"/><rect x="13" y="27" width="3" height="3" rx="1" fill="#fff"/><rect x="24" y="27" width="3" height="3" rx="1" fill="#fff"/></svg>`

const pointSvg = (n: number, state: 'done' | 'next' | 'todo') => {
  const fill = state === 'done' ? GREEN : state === 'next' ? BLUE : '#fff'
  const stroke = state === 'todo' ? '#8c8c8c' : '#fff'
  const color = state === 'todo' ? '#595959' : '#fff'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><text x="14" y="18.5" font-family="Inter,Arial" font-size="12" font-weight="700" text-anchor="middle" fill="${color}">${n}</text></svg>`
}

const passengerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15" fill="${BLUE}" fill-opacity="0.18"/><circle cx="17" cy="17" r="7" fill="${BLUE}" stroke="#fff" stroke-width="3"/></svg>`

const dataUrl = (svg: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`

function pointState(p: WtPoint, passed: Record<string, string>, nextPointId: string | null) {
  return p.id in passed ? 'done' : p.id === nextPointId ? 'next' : 'todo'
}

function GoogleTrackingMap({ points, passed, nextPointId, driverPos, passengerPos, showTraffic, focus }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: GOOGLE_MAPS_API_KEY })
  const mapRef = useRef<google.maps.Map | null>(null)
  useEffect(() => {
    if (focus && mapRef.current) mapRef.current.panTo({ lat: focus[0], lng: focus[1] })
  }, [focus])
  if (loadError) return <MapMessage text={`Failed to load Google Maps: ${loadError.message}`} />
  if (!isLoaded) return <MapMessage text="Loading map…" />
  return (
    <GoogleMap
      center={{ lat: points[1]?.lat ?? 1.33, lng: points[1]?.lng ?? 103.8 }}
      zoom={14}
      mapContainerStyle={{ height: '100%', width: '100%' }}
      onLoad={(m) => {
        mapRef.current = m
        const b = new google.maps.LatLngBounds()
        points.forEach((p) => b.extend({ lat: p.lat, lng: p.lng }))
        m.fitBounds(b, 60)
      }}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false, clickableIcons: false }}
    >
      {showTraffic && <TrafficLayer />}
      <Polyline path={points.map((p) => ({ lat: p.lat, lng: p.lng }))} options={{ strokeColor: BLUE, strokeWeight: 6, strokeOpacity: 0.85 }} />
      {points.map((p, i) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          title={p.name}
          icon={{ url: dataUrl(pointSvg(i + 1, pointState(p, passed, nextPointId))), anchor: new google.maps.Point(14, 14) }}
        />
      ))}
      {passengerPos && (
        <Marker position={{ lat: passengerPos[0], lng: passengerPos[1] }} title="You" icon={{ url: dataUrl(passengerSvg), anchor: new google.maps.Point(17, 17) }} />
      )}
      {driverPos && (
        <Marker position={{ lat: driverPos[0], lng: driverPos[1] }} title="Driver" zIndex={10} icon={{ url: dataUrl(busSvg(40)), anchor: new google.maps.Point(20, 20) }} />
      )}
    </GoogleMap>
  )
}

function LeafletFit({ points }: { points: WtPoint[] }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])), { padding: [50, 50] })
  }, [map, points])
  return null
}

function LeafletPan({ focus }: { focus: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (focus) map.panTo(focus)
  }, [map, focus])
  return null
}

const leafletIcon = (svg: string, size: number) =>
  L.divIcon({ html: svg, className: 'wt-divicon', iconSize: [size, size], iconAnchor: [size / 2, size / 2] })

/** Fallback when VITE_GOOGLE_MAPS_API_KEY isn't set: OpenStreetMap tiles + the mock traffic corridors. */
function LeafletTrackingMap({ points, passed, nextPointId, driverPos, passengerPos, showTraffic, focus }: MapProps) {
  return (
    <MapContainer center={[points[1]?.lat ?? 1.33, points[1]?.lng ?? 103.8]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LeafletFit points={points} />
      <LeafletPan focus={focus} />
      {showTraffic &&
        trafficSegments.map((s) => (
          <LPolyline key={s.id} positions={s.path} pathOptions={{ color: TRAFFIC_COLOR[s.level], weight: 5, opacity: 0.9 }} />
        ))}
      <LPolyline positions={points.map((p) => [p.lat, p.lng] as [number, number])} pathOptions={{ color: BLUE, weight: 6, opacity: 0.85 }} />
      {points.map((p, i) => (
        <LMarker key={p.id} position={[p.lat, p.lng]} icon={leafletIcon(pointSvg(i + 1, pointState(p, passed, nextPointId)), 28)} />
      ))}
      {passengerPos && <LMarker position={passengerPos} icon={leafletIcon(passengerSvg, 34)} />}
      {driverPos && <LMarker position={driverPos} icon={leafletIcon(busSvg(40), 40)} zIndexOffset={1000} />}
    </MapContainer>
  )
}

function MapMessage({ text }: { text: string }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREY, background: '#f0f2f5', padding: 16, textAlign: 'center' }}>
      {text}
    </div>
  )
}

/* ─────────────────────────── Panel parts ─────────────────────────── */

function SectionTitle({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: 700, color: GREY, letterSpacing: 0.4, textTransform: 'uppercase' }}>{children}</Text>
      {extra}
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <Text style={{ fontSize: 12, color: GREY, display: 'block' }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{value}</Text>
    </div>
  )
}

/* ───────────────────────────── Page ───────────────────────────── */

export default function WebTrackingPage({ audience, tripId }: { audience: WebTrackingAudience; tripId: string }) {
  const trip = useMemo(() => webTrip(tripId), [tripId])
  const isMobile = useIsMobile()
  const isDriver = audience === 'driver'
  const { token } = theme.useToken()
  // Route List colours = COMPASS design-system tokens, as bound in the PM-approved Figma frame (39443:75528, 26 Oct).
  const RL = {
    passed: token.colorSuccessActive, // passed stops: dot + line
    heading: token.colorPrimary, // "Heading to" block + the line after it
    upcoming: token.colorPrimaryActive, // upcoming dots + stop-count chip
    passedText: token.colorTextSecondary,
    upcomingText: token.colorTextTertiary,
    title: token.colorTextSecondary,
    time: token.colorText,
    border: token.colorBorderSecondary,
  }
  const [messageApi, msgContext] = message.useMessage()

  const [demo, setDemo] = useState<DemoState>('live')
  const [showTraffic, setShowTraffic] = useState(true)
  const [focus, setFocus] = useState<[number, number] | null>(null)
  const [showMe, setShowMe] = useState(!isDriver)
  const [wakeLock, setWakeLock] = useState<'on' | 'unsupported'>('unsupported')

  // Route 1 is in progress: the bus has passed points 1–2 and is heading to 3.
  const activeRoute = trip?.routes[0]
  const [progress, setProgress] = useState(1.35)

  // Demo clock: the bus creeps along the route while the page is live.
  useEffect(() => {
    if (demo === 'expired' || !activeRoute) return
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(activeRoute.points.length - 1.05, p + 0.01))
    }, 1000)
    return () => window.clearInterval(id)
  }, [demo, activeRoute])

  // Driver page: ask for location (MOVE-1685 biz req 3.3) and keep the screen
  // awake (biz req 3.2.1) — tracking stops if the phone locks.
  useEffect(() => {
    if (!isDriver || demo === 'expired') return
    let watch: number | undefined
    if ('geolocation' in navigator) {
      watch = navigator.geolocation.watchPosition(
        () => setDemo((d) => (d === 'location-off' ? 'live' : d)),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) setDemo('location-off')
        },
        { enableHighAccuracy: true },
      )
    }
    let lock: { release: () => Promise<void> } | null = null
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }
    nav.wakeLock
      ?.request('screen')
      .then((l) => {
        lock = l
        setWakeLock('on')
      })
      .catch(() => setWakeLock('unsupported'))
    return () => {
      if (watch !== undefined) navigator.geolocation.clearWatch(watch)
      lock?.release().catch(() => undefined)
    }
  }, [isDriver, demo])

  if (!trip || !activeRoute) return <EndedScreen text="This tracking link is invalid." />
  if (demo === 'expired') return <EndedScreen text="Trip has ended, tracking unavailable" demo={<DemoSwitch value={demo} onChange={setDemo} isDriver={isDriver} />} />

  // "Passed" is derived from the bus position now that drivers don't register points.
  const passed: Record<string, string> = Object.fromEntries(activeRoute.points.filter((_, i) => i <= Math.floor(progress)).map((p) => [p.id, '']))
  const nextPoint = activeRoute.points.find((p) => !(p.id in passed)) ?? null
  const driverVisible = isDriver ? demo !== 'location-off' : demo !== 'driver-offline'
  const driverPos = driverVisible ? positionAlong(activeRoute.points, progress) : null
  // Demo: the passenger stands a short walk from point 3.
  const passengerPos: [number, number] | null = showMe ? [activeRoute.points[2].lat + 0.0025, activeRoute.points[2].lng - 0.002] : null
  const nowHHmm = addMinutes(activeRoute.start, Math.round(progress * MIN_PER_LEG))
  const etaFor = (p: WtPoint) => {
    const idx = activeRoute.points.findIndex((x) => x.id === p.id)
    const mins = Math.max(1, Math.round((idx - progress) * MIN_PER_LEG))
    return { mins, at: formatAmPm(addMinutes(nowHHmm, mins)) }
  }

  const copyBusLabel = async (label: string) => {
    try {
      await navigator.clipboard.writeText(label)
    } catch {
      // Clipboard API can be blocked (non-secure context); the label is still on screen.
    }
    // Copy master list key TBC; placeholder copy.
    messageApi.success('Bus label copied to clipboard.')
  }

  const statusChip = isDriver ? (
    demo === 'location-off' ? (
      <Tag icon={<DisconnectOutlined />} color="error" style={{ margin: 0 }}>Not sharing location</Tag>
    ) : (
      <Tag color="success" style={{ margin: 0 }}><span className="wt-pulse" /> Sharing live location</Tag>
    )
  ) : demo === 'driver-offline' ? (
    <Tag icon={<DisconnectOutlined />} color="error" style={{ margin: 0 }}>Driver location unavailable</Tag>
  ) : (
    <Tag color="success" style={{ margin: 0 }}><span className="wt-pulse" /> Live</Tag>
  )

  const banner = isDriver ? (
    demo === 'location-off' ? (
      <Banner tone="error" icon={<EnvironmentOutlined />}>
        Location access is off, so ops can't see where you are. Allow location for this site in your browser settings, then reload.
      </Banner>
    ) : (
      <Banner tone="info" icon={<MobileOutlined />}>
        Keep this page open until the trip ends. {wakeLock === 'on' ? 'Your screen will stay on.' : "Don't let your screen turn off — tracking stops when it does."}
      </Banner>
    )
  ) : demo === 'driver-offline' ? (
    <Banner tone="warning" icon={<DisconnectOutlined />}>
      The driver's location is currently unavailable. This page updates when it's back.
    </Banner>
  ) : null

  const etaCard = !isDriver && (
    <div style={{ background: demo === 'driver-offline' ? '#fafafa' : '#e6f4ff', border: `1px solid ${demo === 'driver-offline' ? '#f0f0f0' : '#91caff'}`, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
      {nextPoint && demo !== 'driver-offline' ? (
        <>
          <Text style={{ fontSize: 12, color: '#595959', display: 'block' }}>Arriving at {nextPoint.name}</Text>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: 700, color: BLUE, lineHeight: 1.2 }}>{etaFor(nextPoint).mins} min</Text>
            <Text style={{ fontSize: 13, color: '#595959' }}>ETA {etaFor(nextPoint).at}</Text>
          </div>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 12, color: '#595959', display: 'block' }}>ETA</Text>
          <Text style={{ fontSize: 20, fontWeight: 700, color: GREY }}>Unavailable</Text>
        </>
      )}
    </div>
  )

  const panel = (
    <div style={{ padding: isMobile ? '12px 16px 24px' : 20 }}>
      {/* Driver */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Avatar size={44} style={{ background: BLUE, flexShrink: 0 }}>{trip.driver.charAt(0)}</Avatar>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 700, display: 'block' }} ellipsis>{trip.driver}</Text>
          <Text style={{ fontSize: 13, color: GREY }}>{trip.plate} · {trip.fleetOwner}</Text>
        </div>
        {!isDriver && <Button shape="circle" icon={<PhoneOutlined />} href={`tel:${trip.driverPhone.replace(/\s/g, '')}`} aria-label="Call driver" />}
      </div>

      {etaCard}

      {/* Schedule details */}
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Trip Details</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Product review 25 Oct (#data): the bus label was missing and needs a copy button. */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}><Field label="Bus Label" value={trip.busLabel} /></div>
            <Button size="small" icon={<CopyOutlined />} onClick={() => copyBusLabel(trip.busLabel)}>Copy</Button>
          </div>
          {/* Review 25 Oct (#data): trip remarks were missing; the driver app shows them on its Trip Details screen. */}
          <div style={{ gridColumn: '1 / -1' }}><Field label="Trip Remarks" value={trip.remarks} /></div>
          <Field label="Date" value={trip.date} />
          <Field label="Time" value={`${formatAmPm(trip.routes[0].start)} - ${formatAmPm(trip.routes[trip.routes.length - 1].end)}`} />
          <div style={{ gridColumn: '1 / -1' }}><Field label="Customer" value={trip.customer} /></div>
        </div>
      </div>

      {/* Route list — restyled 26 Oct to match the driver app's Trip Details
          (Figma 39511:68160): stop-count chip, bordered card, passed stops in
          green, the stop being headed to highlighted in navy. */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 500, color: RL.title }}>Route List</Text>
          <span style={{ background: RL.upcoming, color: token.colorWhite, fontSize: 12, fontWeight: 600, borderRadius: 14, padding: '4px 10px' }}>
            {activeRoute.points.length} Stops
          </span>
        </div>
        <div style={{ border: `1px solid ${RL.border}`, borderRadius: 12, overflow: 'hidden', padding: '12px 0' }}>
          {activeRoute.points.map((p, i) => {
            const done = p.id in passed
            const heading = nextPoint?.id === p.id
            const last = i === activeRoute.points.length - 1
            const lineColor = done ? RL.passed : RL.upcoming
            const afterHeading = i > 0 && activeRoute.points[i - 1].id === nextPoint?.id
            return (
              <div
                key={p.id}
                style={{ display: 'flex', cursor: 'pointer', background: heading ? RL.heading : undefined, padding: heading ? '12px 0' : 0 }}
                onClick={() => setFocus([p.lat, p.lng])}
              >
                <div style={{ width: 48, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {afterHeading && <div style={{ width: 4, height: 16, borderRadius: 2, background: RL.heading, marginBottom: 4 }} />}
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: 12, fontSize: 12, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: heading ? token.colorWhite : done ? RL.passed : RL.upcoming,
                      color: heading ? RL.heading : token.colorWhite,
                    }}
                  >
                    {i + 1}
                  </div>
                  {!last && !heading && <div style={{ flex: 1, width: 4, borderRadius: 2, background: lineColor, minHeight: 24, margin: '4px 0' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 12, paddingTop: afterHeading ? 20 : 0, paddingBottom: last || heading ? 0 : 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      {heading && <Text style={{ fontSize: 12, color: token.colorWhite, display: 'block' }}>Heading to</Text>}
                      <Text style={{ fontSize: 14, fontWeight: heading ? 600 : 400, color: heading ? token.colorWhite : done ? RL.passedText : RL.upcomingText }}>{p.name}</Text>
                    </div>
                    <Text style={{ fontSize: 12, color: heading ? token.colorWhite : RL.time, whiteSpace: 'nowrap' }}>{formatAmPm(p.scheduled)}</Text>
                  </div>
                  {/* "Stop photo" state (Figma 2.4 / 3.4 / 4.4 / 5.4, from the app's 39536:14618):
                      wait time, a photo of the stop, and Navigate here. */}
                  {heading && demo === 'stop-photo' && (
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: token.colorWhite }}>Wait time {STOP_WAIT_MIN} min</Text>
                      <img src={stopPhoto} alt={`Photo of ${p.name}`} style={{ width: '100%', height: 102, objectFit: 'cover', borderRadius: 8 }} />
                      <Button
                        block
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Navigate here
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const map = (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {GOOGLE_MAPS_API_KEY ? (
        <GoogleTrackingMap points={activeRoute.points} passed={passed} nextPointId={nextPoint?.id ?? null} driverPos={driverPos} passengerPos={passengerPos} showTraffic={showTraffic} focus={focus} />
      ) : (
        <LeafletTrackingMap points={activeRoute.points} passed={passed} nextPointId={nextPoint?.id ?? null} driverPos={driverPos} passengerPos={passengerPos} showTraffic={showTraffic} focus={focus} />
      )}
      {/* Traffic toggle — same control as the Live Tracking map card */}
      <div style={{ position: 'absolute', left: 12, bottom: 12, zIndex: 500, background: '#fff', borderRadius: 8, padding: '6px 10px', boxShadow: '0 2px 8px rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch size="small" checked={showTraffic} onChange={setShowTraffic} />
        <Text style={{ fontSize: 13 }}>Traffic</Text>
      </div>
      <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 500, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {driverPos && <Button shape="circle" icon={<img src={dataUrl(busSvg(18))} alt="" style={{ width: 18 }} />} onClick={() => setFocus([...driverPos])} aria-label="Centre on driver" />}
        {!isDriver && (
          <Button
            shape="circle"
            type={showMe ? 'primary' : 'default'}
            icon={<AimOutlined />}
            onClick={() => {
              setShowMe(true)
              setFocus([activeRoute.points[2].lat + 0.0025, activeRoute.points[2].lng - 0.002])
            }}
            aria-label="Show my location"
          />
        )}
      </div>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {msgContext}
      <style>{`.wt-divicon{background:none;border:none}.wt-pulse{display:inline-block;width:7px;height:7px;border-radius:4px;background:${GREEN};margin-right:4px;animation:wtp 1.4s infinite}@keyframes wtp{50%{opacity:.25}}`}</style>
      {/* Header */}
      <div style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Text style={{ fontWeight: 800, letterSpacing: 2, fontSize: isMobile ? 14 : 16 }}>WESTPOINT</Text>
        {!isMobile && <Text style={{ color: GREY }}>{isDriver ? 'Driver Tracking' : 'Trip Tracking'}</Text>}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {statusChip}
          <DemoSwitch value={demo} onChange={setDemo} isDriver={isDriver} />
        </div>
      </div>
      {banner}

      {isMobile ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ height: '46vh' }}>{map}</div>
          <div style={{ borderTop: '1px solid #f0f0f0', borderRadius: '14px 14px 0 0', marginTop: -12, position: 'relative', zIndex: 600, background: '#fff' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#d9d9d9', margin: '8px auto 0' }} />
            {panel}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{map}</div>
          <div style={{ width: 400, borderLeft: '1px solid #f0f0f0', overflowY: 'auto' }}>{panel}</div>
        </div>
      )}
    </div>
  )
}

function addMinutes(hhmm: string, min: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const t = h * 60 + m + min
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

function Banner({ tone, icon, children }: { tone: 'info' | 'warning' | 'error'; icon: React.ReactNode; children: React.ReactNode }) {
  const c = { info: ['#e6f4ff', '#91caff', BLUE], warning: ['#fffbe6', '#ffe58f', '#d48806'], error: ['#fff2f0', '#ffccc7', '#cf1322'] }[tone]
  return (
    <div style={{ flexShrink: 0, display: 'flex', gap: 8, alignItems: 'flex-start', background: c[0], borderBottom: `1px solid ${c[1]}`, padding: '8px 16px', fontSize: 13, color: '#1a1a1a' }}>
      <span style={{ color: c[2], marginTop: 1 }}>{icon}</span>
      <span>{children}</span>
    </div>
  )
}

function EndedScreen({ text, demo }: { text: string; demo?: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, background: '#f5f5f5', textAlign: 'center' }}>
      <Text style={{ fontWeight: 800, letterSpacing: 2, fontSize: 16 }}>WESTPOINT</Text>
      <ClockCircleOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
      <Text style={{ fontSize: 16, fontWeight: 600 }}>{text}</Text>
      {demo}
    </div>
  )
}

/** Prototype-only: flips the page between the states a real link can be in. */
function DemoSwitch({ value, onChange, isDriver }: { value: DemoState; onChange: (v: DemoState) => void; isDriver: boolean }) {
  const options = isDriver
    ? [{ label: 'Live', value: 'live' }, { label: 'Stop photo', value: 'stop-photo' }, { label: 'Location off', value: 'location-off' }, { label: 'Expired', value: 'expired' }]
    : [{ label: 'Live', value: 'live' }, { label: 'Stop photo', value: 'stop-photo' }, { label: 'Driver offline', value: 'driver-offline' }, { label: 'Expired', value: 'expired' }]
  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      title="Demo state (prototype only)"
      content={<Segmented size="small" options={options} value={value} onChange={(v) => onChange(v as DemoState)} />}
    >
      <Button size="small" type="dashed" icon={<ExperimentOutlined />}>Demo</Button>
    </Popover>
  )
}

