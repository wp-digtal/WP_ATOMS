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
