# Live Tracking 2.0: knowledge base

Read this before any Live Tracking work.

- **Business-rule source:** `CLAUDE_SESSION_CONTEXT.md` (the Live Tracking note). Tickets can be stale, and a forwarded product-team chat wins over the ticket.
- **Build recipe:** `FIGMA_DESIGN_SYSTEM.md` §4.9.
- **Node ids:** the `FIGMA_COMPONENT_INDEX.md` Live Tracking row.

## 1. Web Tracking Links (MOVE-3676; FMS spec MOVE-1685)

**Code**
- `src/components/livetracking/WebTrackingLinksModal.tsx`: opened from the trip card's ⋯ menu in `LiveTrackingTesting2Page.tsx`.
- `WebTrackingPage.tsx`: the standalone page at `#/web-tracking/<driver|passenger>/<token>`.

**Figma**
- File: "🗺️ Live Tracking 2.0 (Ops Module)" (`XKD77FPEWx0wfQxxCWelfM`).
- Location: page **Archive** (`39443:75324`) › section **"Web Tracking Links"** (`39443:75325`, 8200×11400).
- It moved there from Production Section 1 on 19 Oct 2026.

| Row | Content | Frames |
|---|---|---|
| 1 · Ops | ⋯ menu → Web Tracking Links modal → link copied toast | `39443:75326`, `75394`, `75461` |
| 2 · Driver (mobile) | live; register confirm; point registered; location off; link expired | `39443:75528`, `75633`, `75750`, `75866`, `75972` |
| 3 · Passenger (mobile) | live + ETA; driver offline; link expired | `39443:75976`, `76088`, `76202` |
| 4 · Driver (web 1440) | live; register confirm; registered; location off; expired | `39464:40767`, `39465:40979`, `41195`, `41400`, `42037` |
| 5 · Passenger (web 1440) | live + ETA; driver offline; expired | `39465:41596`, `41807`, `42041` |

- **Demo data:** trip 146, Wei Liang, JK Attendant 6.
- **Docs:** numbered `Docs/Big Title`s ("1 · Ops …"), `Docs/Flow Label`s 1.1–5.3, and arrows on sequential steps.
  - This predates the 20 Oct rule of no numbers in titles plus trigger arrows (`FIGMA_DESIGN_SYSTEM.md` §4.13).

## 1a. Standing rule (user, 25 Oct 2026)

Every web-tracking change goes to **both** versions:
- in Figma, the mobile rows (2, 3) **and** the web (1440) rows (4, 5), for driver **and** passenger;
- in code, both breakpoints of `WebTrackingPage.tsx` (390 bottom sheet and the 1440 side panel), checked in Playwright at both widths.

## 1b. Glossary (learned from review)

- **Bus label:** the trip card's `label` field in Live Tracking (`dummyLiveData.ts`, e.g. "JK Attendant 6", "Hal 4WP(IN)"). It is shown as the blue tag at the top of each trip card. It is **not** the plate (`plate`, e.g. "PA5993Z") and not the route code. Route names are built as `<bus label> (<start time>)`.
- **Trip remarks:** ops' note for the trip, shown to the driver (app: orange banner on Trip Details). Web page: a "Trip Remarks" field in Trip Details.
- **Trip Details:** the section the user renamed from "Schedule Details" in Figma (by 25 Oct). The code now uses this name too.

## 2. Review comment tags (frame "#tags", `39469:10540`, on the Archive page)

Product reviewers prefix Figma comments with these tags:

| Tag | Meaning |
|---|---|
| #CR | Requirement change |
| #Req | Missing or incorrect requirement, field, screen, functionality or edge case |
| #Logic | Incorrect flow or behavior |
| #Data | Data, calculation, mapping, or display issue |
| #UI/UX | Layout, usability, interaction, or design issue |
| #Copy | Wording or content issue |
| #Std | Inconsistent with existing module standards |

Comments can't be read through the API from this session (Figma REST 401), so ask the user for screenshots.

## 3. Review comments log

(Fill in as the user sends comment screenshots: comment → tag → decision → fix.)

### Round 1: driver page (Westpoint Digital → Daniel, around 19 Oct; applied 22 Oct 2026)

Restore point: "Before driver web-tracking review fixes (22 Oct 2026)".

| # | Where | Comment | Tag | Decision / fix |
|---|---|---|---|---|
| 1 | Driver 2.1, Route List cards | "no need" | #Req | Route List hidden on every driver frame, mobile and web |
| 2 | Driver 2.1, "JK Attendant 6 (7:50 AM)" beside ROUTE POINTS | "is this the bus label? If yes pls allow user to copy the label" | #Req | **Answered wrongly on 22 Oct.** I called it "the route name, not the bus label". In this module the **bus label is the trip card's `label`** ("JK Attendant 6", the blue tag on the Live Tracking trip card), so the text *was* derived from the bus label. Product followed up on 25 Oct (see round 2). |
| 3 | Driver, "Next · ETA" + Register button | "no need" | #Req | Hidden on every driver frame |
| 4 | Driver, "✓ Registered at 7:51 AM" | "no need" | #Req | All per-point status lines hidden (Registered at / Next · ETA / Not registered). Points now show name + scheduled time only. |
| 5 | Driver 2.2 "Register → confirm" | "no need" | #Req | Deleted 2.2 Register confirm and 2.3 Point registered (mobile `75633`, `75750`; web `39465:40979`, `41195`) with their labels and arrows. Remaining frames shifted left and renumbered: mobile 2.1 Live, 2.2 Location off, 2.3 Expired; web 4.1 / 4.2 / 4.3. |

**Net effect:** the driver page is view-only: map + traffic, the driver's location, driver / vehicle, schedule details, and the route points with times. No registration.

**Follow-up (user, 22 Oct):** "Passenger page needs updating too", plus the go-ahead to update the code.

- **Figma:** on every passenger frame (mobile `75976`, `76088`; web `39465:41596`, `41807`), the Route List and the per-point status lines are hidden. The ETA card, passenger location and call-driver button stay, since they were never questioned.
- **Code:** `WebTrackingPage.tsx`:
  - The Route List section, `RouteCard` and `routeStatus` are removed.
  - The Register action (confirm modal and toast) is removed.
  - The per-point status lines are removed.
  - `registered` state is replaced by a `passed` set derived from the bus position. Green rail dots now mean "the bus has passed this point", not "registered".
  - The page always shows the active route.
- **Checked** with Playwright: driver 390 / 1440 and passenger 390 show no Route List, Register or status text, and there are no page errors.

### Round 2 (25 Oct 2026)

| Where | Comment | Tag | Fix |
|---|---|---|---|
| Driver 2.1 › Trip Details | "missing bus label + copy button" | #data | Added a **Bus Label** field ("JK Attendant 6") with a **Copy** button as the first row of Trip Details. |

**Code (`WebTrackingPage.tsx`):**
- Section renamed to "Trip Details".
- Bus Label field + `Copy` button (`CopyOutlined`). It copies the label to the clipboard and shows the toast "Bus label copied to clipboard." (placeholder until the copy key is known).
- `WtTrip.busLabel` added in `webTrackingData.ts`.
- Checked in Playwright: the clipboard holds "JK Attendant 6" after Copy, and the toast shows.

**Figma (25 Oct):** restore point "Before bus label + copy (25 Oct 2026)".
- Row `Bus Label + Copy (review 25 Oct)` (template `39535:14282` in driver mobile 2.1): the Customer field is cloned and relabelled "Bus Label: JK Attendant 6", next to a COMPASS `Button` (Type=Default, Size=Small, "Copy") cloned from the Ops modal's Copy button.
- It is inserted as the first row of Trip Details on driver mobile `75528`, `75866`; passenger mobile `75976`, `76088`; driver web `39464:40767`, `39465:41400`; and passenger web `41596`, `41807`.
- Section titles are now "TRIP DETAILS" everywhere. The expired frames have no details panel.
- No "copied" toast frame was drawn; the code shows "Bus label copied to clipboard.".

### Round 3 (25 Oct 2026): the reviewer refers to the driver mobile app

Reference: the driver app's **Trip Details** screen in this file (`39536:14618`, "iPhone 16 Pro - 59"). It shows:
- the trip remarks as an orange banner at the top ("Please be aware …");
- the stop list with times, pax counts, wait time and "Navigate here".

| Comment | Tag | Fix |
|---|---|---|
| "missing trip remarks" (pinned under Bus Label) | #data | **Trip Remarks** field (full width) added below Bus Label in Trip Details, on all 8 live frames + code (`WtTrip.remarks`; the demo text is "Children are escorted by a teacher at each pickup…"). |
| "Route List" (#Copy, pinned on the Customer / Route Points area) | #Copy | Read as: rename the section title **"ROUTE POINTS" → "ROUTE LIST"**. Done on all frames + code. **To confirm** with the reviewer, because the pin sits near "Customer". |

Restore point: "Before trip remarks + Route List rename (25 Oct 2026)". Checked in Playwright: passenger 390 shows Trip Remarks + "Route List", no errors.

**Lesson:** when a reviewer uses a domain term ("bus label"), grep the module's data and UI for it before answering. The term existed in the code all along.

### Round 4 (26 Oct 2026): Route List restyle + stop-photo state (user request)

Restore point: "Before route list v2 + photo state (26 Oct 2026)".

**Route List**
- Restyled like the driver app's Trip Details (`39511:68160`, frame "CR"): the title "Route List" plus an Integral `Chips/Normal` chip "4 Stops", and a bordered card (radius 12, `#e0e1e1`) holding the timeline.
  - Passed stops: green dots `#2b9d72`, line `#258863`.
  - The stop being headed to: a full-width navy block `#193c60` with "Heading to" (`#30b080`), the name and time in white.
  - Upcoming stops: navy dots `#00366b`.
- **Figma:**
  - Cloned the app's `Frame 43241` (template `39547:14851` in driver mobile 2.1) and trimmed it from 6 to 4 stops.
  - The dot column and the text column are separate auto-layouts, so alignment comes from fixed heights: text itemSpacing 30, rows 32 / 42 / 88; dot-column lines 30 / 40 / 22. **Recompute these if the stop count or name lengths change.**
  - It replaces the old "Route Points" frame (now hidden) on all 8 live frames.

**Stop-photo state**
- Copied from the app's `39536:14618`. The heading-to stop also shows "Wait time N min" (`#ff9e99` on navy), a stop photo (image rect, radius 8) and an Integral `Button` "Navigate here" (Type = Outline Neutral, which reads as white on navy).
- **New frames:** 2.4 driver mobile `39547:15215`, 3.4 passenger mobile `39547:15501`, 4.4 driver web `39547:15767`, 5.4 passenger web `39547:16122` (made 1150 tall with a taller details panel so the whole list shows; the map card stays 920, because stretching the map card distorts the Map instance). All have Flow Labels.
- **Navigate here** is on both driver and passenger pages. The user was told and can say if it should be driver-only.

**Code (`WebTrackingPage.tsx`)**
- Route List is rebuilt to the same spec (`RL` colour constants).
- The new demo state **"Stop photo"** shows wait time (`STOP_WAIT_MIN`), the photo (`src/assets/stop-photo-joo-koon.jpg`, exported from the Figma image) and Navigate here, which opens Google Maps directions.
- Checked in Playwright: driver 390 live (no photo) / stop photo, and passenger 1440 stop photo. No errors.

### Round 5 (26 Oct 2026): PM approved driver mobile 2.1 (`39443:75528`), propagated everywhere

- **Approved design:** the user re-coloured the Route List with **our COMPASS variables** (collection "1. Colors"). **Rule: use these DS variables, never hand-picked or app (Integral) hex values.**

| Element | Token |
|---|---|
| Passed dot + line | `Colors/Brand/Success/colorSuccessActive` (#389e0d) |
| "Heading to" block + the line after it | `Colors/Brand/Primary/colorPrimary` (#1677ff); text `colorWhite` |
| Upcoming dot + "N Stops" chip | `Colors/Brand/Primary/colorPrimaryActive` (#0958d9) |
| Passed / upcoming stop text | `Colors/Neutral/Text/colorTextSecondary` / `colorTextTertiary` |
| Time | `Semantic/Text/Body-1` |
| Title | `Semantic/Text/Body-3` |

- **Approved stop names:**
  1. (Office) 32 Pioneer Crescent @west park biz central - blk 30
  2. (Bus stop) 15061 Pasir Ris MRT Station…
  3. **Heading to:** (Bus stop) 18041 Bukit Panjang Plaza, Jelebu Rd, Singapore
  4. (Bus stop) 15061 Pasir Ris MRT Station…
- **Figma:** restore point "Before propagating PM-approved route list (26 Oct 2026)".
  - The approved card `39547:14851` was cloned to all 7 other live frames.
  - The photo variant (template `39556:18336`) went to 2.4 / 3.4 / 4.4 / 5.4: wait time in white (cloned from "Heading to", so it keeps the variable), the photo, and a COMPASS `Button` Type=Default "Navigate here" (same component as the Copy button).
  - The passenger ETA text now reads "Arriving at (Bus stop) 18041 Bukit Panjang Plaza".
- **Code:** `WebTrackingPage.tsx` Route List colours come from `theme.useToken()`: colorSuccessActive, colorPrimary, colorPrimaryActive, colorTextSecondary / Tertiary, colorBorderSecondary, colorWhite. There are no hex values.
  - The stop names in code come from the demo trip data, not the Figma mock text.
  - Checked in Playwright at 390 (stop photo) and 1440 (live). No errors.

### Round 6 (28 Oct 2026): pax count, a photo per stop, wait time example (#data, Daniel)

- **Reference:** feedback frame `39605:66633`, the driver app's Trip Details. Each stop has its time and a pax chip (user icon + "10"). The stop with a wait shows "Wait time 10 min", then the photo and Navigate here.
- **Comments and decision:**
  - "missing pax count and also point image for each point" (Daniel: "it should be there"). The user decided on **a photo under every stop**, not only on the active one as in the app.
  - "pls show example if there is a wait time". The heading-to stop shows "Wait time 10 min" in every live state.
- **Code:** `WtPoint.pax`, a pax chip under the time, `stopPhoto` on every stop, and the wait time on the heading-to stop. Navigate here stays in the "Stop photo" demo only.
- **Figma (28 Oct, partial):**
  - Restore point "Before pax + photo per stop + wait time (28 Oct 2026)".
  - In driver mobile 2.1 (`39443:75528`), a new Route List body `39610:67003` ("Route List body v3 …") replaces the old body `39547:14855`, which is now hidden. Each stop is an auto-layout row: rail + header (name, time + pax chip) + photo. The heading-to stop has "Wait time 10 min".
  - The template was **not screenshot-verified** (the bridge dropped), and it is **not yet propagated** to the other live and photo frames.
  - Next session: verify it, then clone it to the driver/passenger mobile and web frames, and grow the frame heights.

## Move-off time (checked 17 Nov 2026; source: mobile driver tickets)

The user found the requirement in the mobile tickets:
- **MOVE-4222** "[D] CR: Active Trip - Routelist" (Ready For QA): "Replace the displayed wait time with a 'Move-off At' time.
  - **Formula: Move-off At = Point Scheduled Time + Wait Time.**
  - It updates when the scheduled time or wait time changes.
  - Reason: so the driver knows when to leave without calculating."
- **MOVE-4358** "[D] CR: Upcoming Trip - Routelist" (UAT, last touched 17 Nov 2026):
  - Each route-list point shows point no., address, arrival time and pax.
  - "Move-off time: show the move-off time on the points where there is wait time."

**Impact on Live Tracking web tracking.** It still shows the old wording:
- Code: `WebTrackingPage.tsx` line ~448, `Wait time {STOP_WAIT_MIN} min`.
- Figma: the Route List body `39610:67003` and the photo variants show "Wait time 10 min".

To align with the driver app, show "Move-off at HH:MM" (scheduled + wait) only on points that have a wait time. Per §1a, apply it to both mobile and web, and to both driver and passenger.

Status: reported to the user, waiting for go-ahead.

### Round 7 (17 Nov 2026): driver Route List propagated from the user's reference

The user's own updated frame **`39443:75528`** (Driver mobile, Live) is the correct structure:
1. A copy icon on Bus Label (inside `Schedule Details`).
2. A Route List accordion with **only one point open** (the heading-to stop: photo, pax chip, "Move-off At : 10 mins").
3. A **"Move-off At"** pill on stops that have a wait time (replaces "Wait time N min"; MOVE-4222 / MOVE-4358).
4. Updated colours.

Restore point: "Before driver route list propagation (17 Nov 2026)".

`Schedule Details` and `Route List (v2 …)` were cloned from the reference Sheet `39443:75552` into the Sheet of every other driver frame that has one:

| Frame | Id |
|---|---|
| Mobile, Location off | `39443:75866` |
| Mobile, Heading to stop with photo | `39547:15215` |
| Web, Live | `39464:40767` |
| Web, Location off | `39465:41400` |
| Web, Heading to stop with photo | `39547:15767` |

- The Link expired frames (`39443:75972`, `39465:42037`) have no Sheet, so nothing changed there.
- Note: several older frame ids (`75633`, `75750`, web `40979`, `41195`) no longer exist. The current driver frames are the ones listed above.
- Passenger frames: **deferred** (the user said "update nanti saja").
- **Code** (`WebTrackingPage.tsx` still shows "Wait time N min"): **not updated yet**. Per §1a it should follow, so ask before changing it.

Gotcha: the user labels the pill "Move-off At : 10 mins" (a duration). The ticket formula gives a clock time (scheduled + wait, e.g. 08:16 AM). Raise this with the user/PM before coding.

### Round 8 (17 Nov 2026): layout exploration for driver web tracking (mobile)

**Feedback:** the map is too tall, so the info under it is hidden. The user also suggested putting the route points in a bottom sheet, or using tabs (Information | Route List).

They asked for **a new page** "so it doesn't mess things up":
- Page `🧪 Exploration — Driver web tracking layout (map / tabs / bottom sheet)` (`39822:21991`)
- Section `39822:21992`
- Restore point: "Before driver web tracking layout exploration (17 Nov 2026)"

All variants are clones of the reference `39443:75528`:

| Frame | Id | Layout |
|---|---|---|
| Current | `39822:21993` | Map 400 |
| V1 · Short map | `39822:22220` | Map 240 (children shifted −95, Traffic toggle moved to the bottom), single scroll |
| V2 · Short map + tabs | `39822:22447` | Hand-built underline tabs "Information \| Route List · 4 stops" under Driver; Route List active, Schedule Details hidden |
| V3 · Full map + bottom sheet | `39822:22674` | 844 viewport, Sheet absolute at y430 with radius 16 and a shadow; Route List moved above Schedule Details |
| V4 · Bottom sheet + tabs | `39822:22901` | V3 sheet + tabs; Information active, Route List hidden |

- Tab blue is #1677ff. Read from the "4 Stops" chip's parent, it came out empty, so it is set explicitly.
- Waiting for the user to pick a variant.

**Round 8b (17 Nov 2026): more states and 2 senior-PD options.** Added to section `39822:21992`, now titled "6 options, with states".

| State | Id | Notes |
|---|---|---|
| V2b · Information tab | `39823:23542` | |
| V3b · Sheet collapsed (peek, y660) | `39823:24005` | |
| V3c · Sheet expanded (y96) | `39823:24299` | Also the target of V5 "View all 4 stops" |
| V4b · Route List tab | `39823:23773` | |
| **V5 · Floating "Next stop" card** | `39823:24775` | Full map; a white card holding a clone of visible Stop 3 (`39610:67038`) plus a "View all 4 stops" outline button; a driver pill with "Trip info" at the top. Rationale: while driving, the driver needs the next stop, not the full list |
| **V6a / V6b · Collapsing map** | `39823:25108` / `39823:25334` | V6a = top of the page (current layout). V6b = scrolled: a 140 px sticky mini-map, an "Expand map" chip, and the Route List right under it. No new components needed (CSS sticky plus a height transition) |

Map technique for the full-map variants:
- Every map child (map instance, route vector, markers) is scaled ×1.5 about the origin, then shifted x −97.
- The Map frame is resized to 739.
- Content is shifted up per sheet position so the bus and the next stops stay visible above the sheet: −230 for half, −60 for peek, −170 for the V5 card.
- The Traffic toggle sits 12 px above the sheet or card.

**Round 8c (17 Nov 2026): V7, long scroll with accordions.**

The user asked where Trip Information goes in the bottom-sheet options. In V3 it is below the Route List and only reachable via V3c; in V4 it sits behind the Information tab. Routes can reach **20 points**, which buries it further.

The user's idea, built as V7 (map 240):

| Frame | Id | Content |
|---|---|---|
| V7a · default | `39825:25728` | Trip Details accordion card (radius 12, border) collapsed to "Trip Details / JK Attendant 6 · 13 Oct · 7:50 – 9:14 AM" plus a chevron. Route List header "Route List [20 Stops]" plus a chevron. Body: "● 2 stops completed · Show", then Stop 3 (open, heading-to), then Stop 4, then "Show 16 more stops ⌄" |
| V7b · Trip Details expanded | `39825:26049` | |
| V7c · Route List collapsed | `39825:26290` | The header keeps "Next: Stop 3 · Bukit Panjang Plaza · 8:06 AM · Move-off At : 10 mins" |

Rules for long routes:
- Fold completed stops.
- Always show the next stop open, plus 1 more.
- Fold the rest with a count.

Gotcha: rows created inside a vertical auto-layout default to 100 px tall. Set them to HUG.
- **V7 consistency fix (17 Nov 2026, user feedback "why does the bottom one have no container").** The Route List is now a card like Trip Details (same border, radius 12, padding 12, fill) in V7a/b/c. The inner body's border was removed to avoid a double border. Rule: sibling accordions use the same container style.

### Round 9 (18 Nov 2026): revision section from the product decision

**Decision** (product chat, Daniel Roy):
- Top: use **V7b**, the Trip Details accordion card, **expanded by default**.
- Route List: keep the **V6a design**: full list, "4 Stops" chip, the heading-to stop open with photo, pax and Move-off At.

**Location:** the user asked for a new section, so the existing ones are untouched.
- Section `🔵 Driver web tracking — revision (Trip Details expanded card + V6a Route List)` is `39830:26698`.
- Page "Web Tracking Links" (`39443:75324`), at x=16300 (right of "Web Tracking Links - Master" `39797:10669`).
- Restore point: "Before driver web tracking revision section (18 Nov 2026)".

**Frames.** Each is a clone of the current driver frame, with `Schedule Details` replaced by the V7b card from `39825:26049`:

| Frame | Id |
|---|---|
| Mobile Live | `39830:26699` |
| Mobile Location off | `39830:26926` |
| Mobile Photo | `39830:27151` |
| Web Live | `39830:27376` |
| Web Location off | `39830:27632` |
| Web Photo | `39830:27880` |

- The Link expired frames have no panel, so they were not cloned.
- **Code not updated yet:** `WebTrackingPage.tsx` still uses the old Trip Details and "Wait time" text.
- **Passenger:** still deferred.
- **Round 9 correction (18 Nov 2026, user: "you are still wrong").**
  - The base is the **whole V7b frame `39825:26049`**, including the **240 px map**. Only the Route List comes from **V6a `39823:25108`**.
  - Fix: on the 3 revised mobile frames, the Map was replaced by a clone of the **current** original frame's Map (the user had since updated the originals, e.g. the `bi:cursor-fill` bus marker), then shortened to 240 (children y −95, Traffic toggle at the bottom), and the frame height re-fit.
  - Lesson: when the user says "use frame X but section Y from frame Z", take **everything else** from X, including the map height. When re-cloning, copy from the latest originals, not from older clones.
- **Round 9 correction 2 (18 Nov 2026).**
  - **Map:** every revised mobile frame uses the map of `39830:26699` (the Live revised frame), cloned into Location off `39830:26926` and Photo `39830:27151`.
  - **Structure:** like V7b there are **2 accordions**. The Route List is now an accordion card too: the V7b card style (border, radius, padding), a chevron in the header, and "Route List" plus the chip grouped on the left. The content is still the V6a full 4-stop list, and the inner body border is removed.
  - Applied to all 6 revised frames (mobile and web).

### Round 10 (18 Nov 2026, in progress): roll the approved revision into `39443:75325`, add the status requirements, remove the yellow bus

The user approved the style of `39830:26698`. Target: section `39443:75325` › `Section 1` (`39646:74664`), which holds 16 frames. Restore point: "Before web tracking update from revision + req statuses (18 Nov 2026)".

**Requirement statuses (user's "Req" notes):**
- **Driver:**
  - Before trip (more than 1 hr away): **Not active yet**.
  - Trip starting (within 1 hr): driver, vehicle and trip info, including point, arrival time, remarks, pax count, the copy-bus-label icon and the move-off time.
  - Trip ended: **Ended**.
- **Passenger:**
  - Before trip: **Not active yet**.
  - Trip starting: driver, vehicle and trip info, including point, arrival time, remarks and bus label.
  - **Driver online:** locations shown. **Driver offline:** locations hidden.
  - Trip ended: **Ended**.

**Existing frames:**
- Driver: Live, Location off, Photo, and Link expired ("Trip has ended, tracking unavailable" = Ended). Mobile `75528`, `75866`, `15215`, `75972`; web `40767`, `41400`, `15767`, `42037`.
- Passenger: Live with ETA, Driver offline, Photo, and Link expired. Mobile `75976`, `76088`, `15501`, `76202`; web `41596`, `41807`, `16122`, `42041`.
- **Missing:** "Not active yet" for both driver and passenger, mobile and web. The passenger trip-info / route list (points + arrival time) was hidden by an earlier review and must come back per this requirement.

**Yellow bus:** the user says there is no yellow-bus condition, so remove it.
- Done on web: the `Bus (unscaled, from Map component)` frames are removed from web driver Live/Photo and passenger Live/Photo.
- Mobile check is pending (the bridge dropped).
- **Round 10 done (18 Nov 2026).** The user rightly pointed out the first pass had not updated the frames (only the web bus icons). Applied in `Section 1` `39646:74664`:
  - **Driver mobile** (`75528`, `75866`, `15215`): Map and Sheet replaced by clones from the revision frames `39830:26699/26926/27151`, so each has the 240 map and 2 accordions.
  - **Driver web** (`40767`, `41400`, `15767`): Sheet replaced by clones from `39830:27376/27632/27880`. The web map is kept, minus the bus.
  - **Passenger** (mobile `75976`, `76088`, `15501`; web `41596`, `41807`, `16122`):
    - Trip Details is the V7b card (copy icon hidden, since copy is driver-only).
    - The Route List is a card with a chevron and `clipsContent`, and keeps the passenger content (no pax or Move-off).
    - Mobile map is 240.
    - Driver offline keeps the location hidden and "ETA Unavailable".
  - **Yellow bus removed:** the `Bus (unscaled, from Map component)` frames on 4 web frames.
    - **Mistake + fix:** a colour-based search deleted the *map image instances* on the 3 passenger mobile frames, because the map raster contains orange. They were restored from `39822:21993`'s map instance at (0, −110).
    - Lesson: never delete by colour inside a map; match by name.
    - The small orange glyph left on the map is a bus-stop POI baked into the map image, not our marker.
  - **New "Not active yet" frames**, cloned from the Ended frames, text "Not active yet. Tracking starts 1 hour before the trip (from 6:50 AM).":
    - 2.5 driver mobile `39847:31652`
    - 3.5 passenger mobile `39847:31656`
    - 4.5 driver web `39847:31660`
    - 5.5 passenger web `39847:31664`
  - "Link expired" frames and flow labels are renamed **"Ended"** to match the requirement.

### Round 11: blue location arrow on the passenger map (18 Nov 2026)
- The user asked for the passenger map to show the same blue arrow as the driver map.
- Cloned the driver's `bi:cursor-fill` (`39847:29655`, 73×73 at 177,112, with its accuracy circle) into the Map of passenger mobile Live `39443:75976` and Photo `39547:15501`.
- It sits under the Traffic toggle, so the toggle stays on top.
- Driver-offline and "not active yet" frames get no arrow.
