# Route Point Manager: knowledge base

The Operations sub-module where staff store reusable route points (pick-up / drop-off points) for routes. Epic **MOVE-131** "WLA: Operations - Route Point Manager". All child tickets were Done when last read on 16 Nov 2026.

- **Figma (old design system):** `🚏 WLA (Operations) - Route Point Manager`, file `qXIP07mlgJiPFHHmfeONIv`.
- **Old pages, one per ticket group:**

  | Page | Id |
  |---|---|
  | `✏️ MOVE-738, 737 View Route Point Detail & Listing` | `10030:135781` |
  | `✏️ MOVE-735 Create Route Point` | `10017:157404` |
  | `✏️ MOVE-736, 745 Edit Route Point & Delete Route Point` | `10017:169957` |
  | `✏️ MOVE-739 Route Point Change History` | `10017:182893` |

  Plus Project Info, Prototype page, Feedback and Research.

## 1. Tickets

| Key | Title | Last updated |
|---|---|---|
| MOVE-737 | View Route Point Listing | 14 Jul 2025 |
| MOVE-738 | View Route Point Details | 13 Jun 2025 |
| MOVE-735 | Create Route Point | 17 Apr 2026 |
| MOVE-736 | Edit Route Point | 1 Apr 2026 |
| MOVE-745 | Delete Route Point | 11 May 2025 |
| MOVE-739 | Route Point Change History | 3 Mar 2026 |

### 1.1 Listing (MOVE-737)
- **Columns:**
  - **Point Description**: full text, wide column, can wrap.
  - **Linked Routes**: the number of routes using the point, whatever their status. Clicking the count shows a sub-table (accordion or modal) with Client Code, Route Code, Bus Label, Route Status and a link to the route. This is called out as a new component.
  - **Last Updated On**.
- **Sort:** by Last Updated On, newest first by default. Every column can be sorted.
- **Row actions, by permission:**
  - View opens the details drawer.
  - Edit opens the edit page.
  - Delete is allowed only when Linked Routes = 0.
- **Search / filter:**
  - Search on Point Description.
  - Filter: Landmark Type (multi-select) and Linked Routes (Yes / No).
  - Date range on Last Updated On.
- **Create** is opened from the listing (needs permission).

### 1.2 Details (MOVE-738)
- Shown as a drawer and as a page. It has the point fields (see Create), a **Linked Routes table** (Client Code, Route Code, Bus Label, Route Status, link) and access to Change History.
- **Actions:** Edit (any point); Delete (only when Linked Routes = 0).

### 1.3 Create (MOVE-735)
All fields are required.

| Field | Type | Notes |
|---|---|---|
| Address | Autocomplete (Google) | Drives Point Coordinates |
| Town | Dropdown | Options shortlisted by the first two postal-code digits; auto-selected if only one option |
| Landmark Type | Dropdown | Bus stop / Taxi stand / Building / Bus bay / Roadside / Others |
| Bus Stop Name | Dropdown (LTA data) | Bus stop only |
| Taxi Stand Name | Dropdown | Taxi stand only |
| Building Name + Additional Details | Input + dropdown | Building only. Details: inside gate / outside gate / drop off point / NA |
| Bus Bay Name | Input | Bus bay only |
| Roadside Details | Prefix dropdown + suffix input | Roadside only. Prefix: behind / in front of / beside / opposite |
| Point Coordinates | Pin on a map | Can be dragged |
| Point Description | Input | Auto-built from the landmark type and address, editable |
| Image of point | Upload | Optional, max 1 image, 2 MB |

- **Point Description formats:**
  - "(Bus stop) 18111 Fairfield Meth Pr Sch, Dover Road, Singapore"
  - "(Outside gate) The Seaview, 41 Amber Rd, …"
  - "Others" uses the address only.
- **Duplicate check:** a point within 5 m of an existing point gives the modal "Unable to save point": "An existing point has similar point coordinates. Please edit the existing point here, or edit this point's coordinates." The word "here" links to the existing point.
- **Save / cancel:** missing required fields show field errors. Creating a point is logged in Change History.

### 1.4 Edit (MOVE-736)
- **Linked Routes = 0:** every field can be edited, with the duplicate check.
- **Linked Routes > 0, bus stop or taxi stand:** only Town, Point Description and Image of Point can be edited.
- **Linked Routes > 0, building / bus bay / roadside / others:** Town, Landmark Type and its extra fields, Point Description and Image can be edited. Address and Coordinates are locked.
- **Clicking a locked field** shows the error "Not allowed to change coordinates of point currently in use by route(s)".
- Saved edits reflect in every route that uses the point, and are logged in Change History.

### 1.5 Delete (MOVE-745)
- Available from the details drawer and the details page.
- **In use by routes:** modal "Unable to delete point": "[Point description] is currently in use by existing routes. Only points not in use by any routes can be deleted." It shows a link to the route, and only Cancel.
- **Not in use:** modal "Delete point": "There are currently no routes using [point description]. Once deleted, this point will no longer be available for use in any route. To proceed, please select [action]." Buttons: Cancel / Delete.

### 1.6 Change History (MOVE-739)
- **Columns:** Updated On, Updated By, Edit type (Create / Edit [field label]), Field edited, Previous input, New input.
- **Search** on Previous / New input.
- **Filters:** User, Edit type and Field edited (each multi-select with search), plus a date range.

## 2. Redesign to COMPASS (16 Nov 2026), in progress

The user asked for one new page that holds every flow from every old page, rebuilt with the new design system: **COMPASS** plus the **💎 ATOM – Business Component** library. It must be **side by side** (old next to new), worked slowly and carefully, and re-checked at the end. Frame ids and decisions go below as the work proceeds.

### 2.1 Setup and findings (16 Nov 2026)

**Old file inventory, about 300 frames:**

| Page | Frames | Content |
|---|---|---|
| Listing | ~70 | Search keyword / multi-landmark / linked-routes / combined; filter tags; not found; detail drawer per landmark type; detail page |
| Create | ~128 | 1-column and 2-column page with map; per landmark type; confirmation; finish; empty |
| Update | ~88 | Per landmark type |
| Delete | 9 | Point used / not used |
| Negative case | 8 | Building → bus stop, nearest bus stop not found |
| Change History | — | Only a section header, no frames |

- **The user's scope decision:** do one flow at a time, starting with Listing. They review it before the next flow.
- **Create / Edit pattern:** a full page with a map, like the old design but with COMPASS components. A drawer would be too narrow for the map.
- **Library imports time out in this file,** COMPASS Side Navbar included. The user pasted the Account Management Production 3.1 frames into page `New Design` (`14708:451945`), section `Production` `14708:458707`. **Build new screens by cloning those frames** (Side Navbar, HeaderWrapper, filter bar, COMPASS table cells, drawer template, modals) and re-texting them.

**New page** `🧭 Route Point Manager — COMPASS side by side` (`14708:496103`). Restore point: "Before Route Point Manager COMPASS side-by-side page (16 Nov 2026)". Each row puts the OLD frame on the left (x 100) and the NEW frame on the right (x 1740).

**Section `1 · Listing (MOVE-737)`** `14708:496104`:

| Row | Old | New |
|---|---|---|
| 1.1 Default | `14708:498546` (search-first empty page) | `14708:496105`: table shown straight away, sorted by Last Updated |
| 1.2 Filter | `14708:503650` (results + filter tags) | `14708:501886`: filter popover with Landmark Type + Linked Routes |
| 1.3 Not found | `14708:507282` | `14708:505393`: table "No data" empty state |

**How the new listing was made from the AM listing:**
- Kept 4 of the 6 cell columns: Point Description (FILL), Linked Routes (140), Last Updated By (180), Last Updated On (180).
- Set the cell text through `setProperties` on `Text Content#…` / `Text 2 Content#…`, and the headers through `Text#…`.
- Hid the AM tabs container and right-aligned the CTA "Create Route Point".
- Renamed the side-nav item, breadcrumb and title.
- The Linked Routes count is a link (colorPrimaryText + underline); 0 stays plain.

**Gotcha:** an 8-row loop that loads a font and sets fills on instance text timed out. Load the font once, build one paint, then loop.

**Open questions for the user:**
- The Linked Routes sub-table (ticket: accordion or modal) has no COMPASS component yet. Which form should it take?
- The old table has "Last Updated by + Last Updated at"; the ticket only lists "Last Updated On". The new design kept both columns.
- The old default page is search-first with no table; the new default shows the table, as the ticket asks.

### 2.2 All flows built (16 Nov 2026)

The user said "do all the rest". Every section has OLD at x 100 and NEW at x 1740 on page `14708:496103`.

| Section | Rows (OLD / NEW ids) |
|---|---|
| `2 · Details (MOVE-738)` `14714:509225` | 2.1 Bus stop with linked routes: `14714:514366` / `14714:509226`. 2.2 Building with no linked routes, Delete enabled: `14714:515322` / `14714:515160` |
| `3 · Create (MOVE-735)` `14714:516657` | 3.1 Others `14714:517143` / `14714:516658`. 3.2 Bus stop `14714:517816` / `14714:517371`. 3.3 Building `14714:518053` / `14714:518936`. 3.4 Confirm save modal `14714:518302` / `14714:519395`. 3.5 Created: drawer + success toast `14714:518540` / `14714:519866`. 3.6 Duplicate point "Unable to save point": NEW only, `14714:520564` |
| `4 · Edit (MOVE-736)` `14714:521035` | 4.1 Bus stop, linked: Address / Landmark / Bus Stop Name disabled + error caption. `14714:521520` / `14714:521036`. 4.2 Building, linked: only Address locked. `14714:522499` / `14714:521777`. 4.3 Negative case "Unable to update … incomplete data": `14714:522750` / `14714:523012` |
| `5 · Delete (MOVE-745)` `14714:523128`-ish | 5.1 "Delete point" Cancel / Delete (danger): `14714:523129` / `14714:524775`. 5.2 "Unable to delete point" + "View linked routes" link, Cancel only: `14714:523952` / `14714:525313` |
| `6 · Change History (MOVE-739)` | NEW only, because the old page is empty: `14714:526020`. Columns Edit Type / Field Edited / Previous Input / New Input / Updated On (+ "by user" sub-line) |

**How the NEW screens were made:**
- **Details drawer:** the AM `Overlay + Drawer` on the NEW listing. Header buttons stacked above a wrapping title. The old map image is cloned from the old detail instance. `Group Content Cell` instances are re-texted. A Linked Routes sub-section uses `RT-Section Header` (that library set already has the variants "Route Point Detail", "Route Linked List" and "Route Detail") plus 4 COMPASS table rows.
- **Create / Edit page:** the NEW listing frame with its content hidden, plus a white "Form card". The fields are AM form items cloned and re-texted (Address input, Landmark Type / Town / Bus Stop Name / Additional Details selects, Building Name / Point Description inputs), plus the map and an "Upload" button with helper text. The header has Cancel + Create / Save.
- **Locked fields:** `Input`/select instance `State=Disabled`. The error is the form item's `Caption` property set to true, with the text "Not allowed to change coordinates of point currently in use by route(s)" and `Status=Error`.
- **Modals:** the AM Unsuspend `Overlay + Modal`, re-texted. To hide a button, hide its parent instance. Danger buttons use `Danger=True`. Links inside the body use `setRangeFills` (colorPrimaryText) + underline.
- **Dropdown menu items:** change them through `setProperties({Text…, State, Danger})`. Their text is a component property.

**Deviations and open points, to confirm with the user:**
- Change History has a filter button only. The ticket also asks for a search on Previous / New input and a date range, and the AM Activity filter bar it was cloned from doesn't show them.
- 3.6 Duplicate point and 6.1 Change History have no old frame.
- The Create success destination follows the old Finish (the new point opens in the details drawer, with a toast). The ticket doesn't specify it.
- The Linked Routes sub-table in the **listing** (accordion / modal) is still not designed. It is shown inside the details drawer instead.

### 2.3 Flow tidy-up: NEW above OLD, one frame per state (24 Nov 2026)

The user asked to tidy the flows, keep COMPASS, re-check the tickets, and put the old frames **directly below** the new ones. The new layout must match the old one; only the components change. Restore point: "Before Route Point Manager COMPASS flow tidy-up (24 Nov 2026)".

**Agreed with the user:**
- One new frame per unique state. Duplicate old frames that differ only in data are not rebuilt.
- Each flow is one row: NEW (🟢, COMPASS) on top, steps left → right with arrows, and the OLD clone directly below its pair.
- Each row has a title, notes and per-frame captions.

**Ticket re-check:** the MOVE-131 children now also include:
- **MOVE-967 "Landing Page":** the listing shows 0 results until the user searches or filters, with the prompt "Use the search bar or filters to view results". This confirms the old search-first landing page. The earlier NEW 1.1 (table shown straight away) was wrong and has been removed.
- MOVE-936: bus stop / taxi stand list changes. Still "To Define Tasks", so nothing to design yet.
- MOVE-2135 QA and MOVE-2311 UAT: empty templates.

**Section `1 · Listing (MOVE-737, MOVE-967)` `14720:518806`, at x 0 / y 0.** It replaces the old side-by-side section 1. Rows are 2800 apart; NEW is at row y + 260 and OLD at y + 1454.

| Row | NEW steps |
|---|---|
| 1.1 Keyword | Landing focused `14719:478095` → typing + suggestions `14720:478428` → keyword selected `14720:491820` → result + tags + Clear All `14720:493130` |
| 1.2 Multi landmark | Dropdown open `14720:495417` → Bus Stop + Roadside `14720:497391` → result `14720:499453` |
| 1.3 Linked routes | Open `14720:500745` → Yes `14720:502704` → result `14720:504676` |
| 1.4 Combined | Filled card `14720:508701` → result `14720:510611` (the old 9-step row repeats the earlier states) |
| 1.5 No result | Landing inline error `14720:511903`; listing "No data" `14708:505393` |
| 1.6 Filter on the listing | Popover, All Landmark `14720:513756` → Bus Stop only `14720:515716` → result `14720:517530` |

**How the screens were built:**
- **Landing search card:** a hand-made container frame (fill #fafafa, stroke, shadow) holding COMPASS `Input`, `Button` (Primary) and 2 × `Select`. It sits inside the table's `Empty state` frame, with the "No data" image hidden.
- **Suggestions / landmark / linked menus:** a clone of the COMPASS `Dropdown Menu` instance found inside the Date Selector (path `…2301:16742`). Items are set through `Text#507:55` and `State` (Hover / Selected).
- **Result layout, to match the old one:**
  - `Leave/Filter` is detached into "Filter row" so the CTA "Create new Route Point" sits on the same row as Filter Bar 3.0.
  - Below it is a tags row with `Tag / Basic` (Variant=Closeable) on the left and Clear All on the right.
- **Popover multi-select:** set the COMPASS `Select` to `Active=Yes, Placement=Bottom`, the inner `_Select / Select Input` to `Type=Multiple, State=Filled`, and the menu items to `State=Selected Multiple`.

**Gotchas:**
- On the COMPASS `Input`, `setProperties({State})` reports the new value but can leave the old variant in place: Focused stayed blue. Use `swapComponent(sibling variant)` and then re-set the text.
- A cloned header CTA keeps `layoutPositioning = ABSOLUTE`. Set it to `AUTO` after moving it into an auto-layout row.
- `getNodeByIdAsync` on a library icon and `createInstance` from a remote component timed out ("Unable to establish connection"). Clone an existing instance instead.

**Deviations:**
- The search input has no left search icon. No COMPASS SearchOutlined swap was available without a library import.
- The no-result copy is corrected: "can't found" → "can't find".

**Still to do:** Details, Create, Edit, Delete and Change History need the same NEW-above-OLD treatment.

### 2.4 Worksheet built (26 Nov 2026)
The COMPASS frames were cloned into the worksheet **Section 7** `14724:113616`, on the side-by-side page. The format copies the PD worksheet `14724:32844`; the standard is in the `code-to-figma` skill §4b. Restore point: "Before RPM worksheet build in Section 7 (26 Nov 2026)".

**Groups:**

| Column | Group | Content |
|---|---|---|
| 1 (x 357) | Listing (MOVE-967 / 737) | 6 flow rows, 17 frames |
| 2 (x 7417) | Details Drawer (738) | 2 states |
| 2 | Create (735) | 3 landmark variants; confirm → created flow; duplicate modal |
| 3 (x 12837) | Edit (736) | 2 locked-field states + incomplete data |
| 3 | Delete (745) | not in use / in use |
| 3 | Change History (739) | 1 frame |

- Cross-group arrows: Listing result → Details drawer, and Details → Edit.
- Frames are named `🟢 RPM - <Screen> - <State> (MOVE-xxx)`.
- The side-by-side sections are left intact.
