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
