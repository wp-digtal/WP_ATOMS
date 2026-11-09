# Fleet (WLA: Operations - Fleet) knowledge base

Studied 10 Nov 2026, read-only. The user said: "pelajari file ini … tidak akan meminta kamu edit apapun … nanti saya akan minta kamu buat page di file ini yang menggunakan design system kita yang baru". Nothing was changed in Figma.

## 1. Where things are

- **Figma file:** "🚍 WLA: Operations - Fleet" `0wGJrFQ9M5p24utxxvlMY5`. It is a legacy file on the **old design system**: `Page Wireframes` instances, old side nav with Notifications, Operations > Fleet Owners / Fleets / Drivers.
- **Epic:** MOVE-125 "WLA: Operations - Fleet", Jira site `westpoint` (cloudId `e42e860c-a0bf-47e3-8f55-c39fb332b7c5`). Thumbnail: created 20 Jan 2025 by Daniel Roy, owner Brice Tan.
- **Later change requests:** epic MOVE-2543 "WLA: Change Requests". Mobile responsive: MOVE-2673 (under MOVE-2664, To Define Tasks).

## 2. Pages in the file

One page per ticket.

| Page id | Page | What is really on it |
|---|---|---|
| `0:1` | Thumbnail | Cover. Its quick links still point to Sub-contractor tickets (MOVE-562/577/578/579/580/583), a copy leftover. |
| `6002:10` | Project Info | Feature notes for approve / reject / suspend rules and the full create-field list (text `10024:135777`), plus a draft field grid `10036:57721`. |
| `10017:157404` | MOVE-600 Create Vehicle | **The only page with real Fleet work.** The template section `10017:157405` sits at the top. The real flows are below it, outside the section: Basic Information, Vehicle Equipment, Certificates & Permits, Specification, Financial Data, Document, Submit & Confirm, then listing / drawer frames (around y 25 000–38 000), then section `🧩 Component States` `10055:206705`. |
| `10030:135781` … `10021:345652` | MOVE-602/603/604/605/606/607/649/665–669/670/780/781/782 | **Placeholders.** Each has the same `User Flow` section, copied from the **Sub-contractor listing** flow (filter open/close steps). The screens show Sub-contractors, not vehicles. A stray "MOVE-604 Deactivate Vehicle" text sits on most pages. |
| `4001:8`, `4001:9`, `6002:30191` | Prototype page, Feedback, Research | Empty. |

**Reference frames that are real Fleet UI** (MOVE-600 page):
- Listing with highlights: `10046:148008`, `10091:254251`, `10099:370528`.
- Details drawer over the listing: `10092:261076`, e.g. "WES153R-PC1234X-SG" with Pending Information tags, Actions + Edit, sections Basic Information / In-Vehicle Equipment.

## 3. What the old design shows vs what the tickets say now

| Area | Old Figma | Current ticket | Use |
|---|---|---|---|
| Listing columns | Vehicle Code, Vehicle License Plate, Fleet Owner, Vehicle Type, Passenger Capacity, … | **MOVE-797:** drop Vehicle Code and Vehicle Type. Order: Vehicle Licence Plate (frozen left), Fleet Owner (+ number below), Driver (+ number; name links to driver details in a new tab), Passenger Capacity, Remarks ("-" if empty), Vehicle Status, Approval Status, Last Updated (default sort, newest first), Updated By | Ticket |
| Search / filter | Search "Search for Fleets…", date range, filter icon | **MOVE-797:** search by Licence Plate and Fleet Owner. Filters: Fleet Owner (multi + search), Driver (multi + search), Passenger Capacity (number range), Vehicle Status (multi), Approval Status (multi). Date range: Last Updated On | Ticket |
| Highlights | 5 cards: Pending information, Pending approval, Rejected, Unassigned, Certificate/Permit expiring ≤ 30 days | MOVE-607, plus MOVE-789 (Expiring Road Tax highlight) | Ticket + house rule: highlight cards → quick filters / tab counts (see `LESSONS_LEARNED.md`) |
| Create / Edit form | Multi-step tabs per section | **MOVE-2554 (CR, Done):** one page with sections and tab-like quick-access buttons that auto-scroll, like the Incidents module. Own vehicle: Basic Information, In-vehicle Equipment, Certificates & Permits, Specifications, Financial Data, Documents. Sub-con vehicle: Basic Information, In-vehicle Equipment, Documents. Edit uses the same layout. | Ticket |
| Fire extinguisher / road tax | Old fields | MOVE-2547, MOVE-782, MOVE-780 | Read the tickets before building |
| Statuses | Vehicle status: Active, Suspended (+ Deactivated); Approval: Pending Information, Pending Approval, Approved, Rejected | MOVE-602/603/604/670/792 | Ticket |

## 4. Ticket map (MOVE-125 children)

- **Done:**
  - 600 Create, 601 Edit, 602 Suspend, 603 Unsuspend, 604 Deactivate;
  - 605 Listing, 606 Details, 607 Highlights;
  - 665–669 field groups (667/668/669 shown only if Fleet Owner = tenant);
  - 670 Approve / Reject;
  - 780 Road Tax Expiry, 781 Bus Check Completion, 782 Fire Extinguisher, 783 First Aid Kit;
  - 789 Expiring Road Tax highlight, 790 Status tags for expiry fields, 792 Vehicle status logic from expiry fields;
  - 797 Listing columns / filters, 799 Field changes, 800 One view permission;
  - 828 More than one Fleet Owner per sub-con vehicle, 978 In-flow assign sub-con driver;
  - 1700 Change History (BE 2420), 1146 UAT bugs.
- **To Define Tasks / Icebox:**
  - 649 Vehicle Change History (old story);
  - 726 Custom listing view, 727 Type-to-search, 750 Customise highlight cards;
  - 751 Currency dropdown, 779 Diesel tag vs fuel type, 784, 786 (KIV), 787, 788;
  - 798 (to remove).
- **Rules from Project Info and the tickets:**
  - **Approve / reject:**
    - Only when approval status = Pending Approval and the vehicle is Active or Suspended.
    - Can be done from the details drawer or the details page.
    - Reject needs a reason.
    - Master and Junior System Admin can approve; staff cannot approve their own vehicle without a special permission.
  - **Suspend:**
    - Allowed when the sub-contractor and the vehicle are Active.
    - If the vehicle has active trips, the user must reassign them first.
    - A reason is required.
    - The change shows in Change History.

## 5. Plan agreed for the rebuild

Waiting for the user's go-ahead; see `CHANGELOG.md` Open items.
- Build in **this file**, on a new page, with COMPASS + ATOM business components (`COMPONENT_MAP.md` §A). Never with the old `Page Wireframes`.
- Follow the `code-to-figma` / Production documentation standard: rows per flow, flow labels, notes, and every state.
- **Open question:** does this file have the COMPASS and ATOM Business Component libraries enabled? Library imports timed out in the PD file. If they time out here, a starter frame must be pasted in from a Production file (the bridge sees one file per pairing).
