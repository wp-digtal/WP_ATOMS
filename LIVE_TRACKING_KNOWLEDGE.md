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

Restore point: "Before driver web-tracking review fixes (Claude, 22 Oct 2026)".

| # | Where | Comment | Tag | Decision / fix |
|---|---|---|---|---|
| 1 | Driver 2.1, Route List cards | "no need" | #Req | Route List hidden on every driver frame, mobile and web |
| 2 | Driver 2.1, "JK Attendant 6 (7:50 AM)" beside ROUTE POINTS | "is this the bus label? If yes pls allow user to copy the label" | #Req | **Not a bus label.** It is the route name (schedule route + start time); the bus plate is "PA5993Z" under the driver's name. Answered, no change. If product wants the plate copyable, add a copy icon next to the plate (open). |
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
