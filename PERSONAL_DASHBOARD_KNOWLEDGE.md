# Personal Dashboard (epic MOVE-3412): knowledge base

Read this before any Personal Dashboard work, in code or in Figma.

- **Business rules after the 12–13 Oct 2026 rewrite:** `CLAUDE_SESSION_CONTEXT.md` §10.
- **Code:** `src/components/employeeportal/`.
- **Figma:** "👩🏻‍🚀 Personal Dashboard (HR Module)" (`1FCRdGhHru6czP5P6h06kH`), page `🏭 Production`, `Section 7` (`41091:22331`).
  - It's a web (WP ATOMS / COMPASS) file, so use the Desktop Bridge. See `CLAUDE.md`.

## 1. Tickets (checked 19 Oct 2026)

| Ticket | Title | Last edit | Notes |
|---|---|---|---|
| MOVE-3949 | Personal Dashboard Homepage | 13 Oct | Home = default view: Apply Leave + Submit Claim CTAs, Recent Activity (last 7 days), annual + medical balances with "View more". Side nav: Home / Leave / Claims / Pay Slip. |
| MOVE-3948 | Leave Details Page | 13 Oct | Year toggle. My Leave / Approvals tabs only for approvers. **Every table max 5 per page.** Empty states: "There are currently no leave applications pending your approval" / "You have not rejected or approved any leave applications". |
| MOVE-4351 | Leave Balance Details Drawer | 13 Oct | Same as the Leave module drawer (MOVE-4137); View change history. |
| MOVE-3946 | Apply Leave | 13 Oct | Header "Apply Leave"; CTAs "Send for Approval" / "Cancel"; same as MOVE-3777. |
| MOVE-3965 | Leave Application Details Drawer | 13 Oct | Header = leave type + status tag. Own: Cancel (secondary). Approver: Actions → Approve / Reject plus an Employee field. No primary CTA. |
| MOVE-3950 | Cancel Leave Application | 13 Oct | Enabled only for pending/approved leave **whose dates have not started**; otherwise disabled + tooltip. Reason optional, max 120. |
| MOVE-3952 | Approve/Reject Leave Application | 13 Oct | Enabled only while pending approval; otherwise disabled + tooltip. Same modals as MOVE-3893. |
| MOVE-3943 | Claims Details Page | **16 Oct** | **16 Oct edit: Remarks column removed from the own-claims ("My Claims") table only.** The Approvals table keeps Remarks. Search still covers Remarks. |
| MOVE-3776 / 3964 / 3958 / 3945 | Submit / details / cancel / approve-reject claim | 13 Oct | Same as the HR Claims module. |
| MOVE-3953 / 3954 | Pay Slip details / download | 13 Oct | **Description empty.** Nothing to build yet (open item). |
| MOVE-3947 | [KIV] Leave Entitlement Change History | 15 Oct | KIV. |
| MOVE-3959–3963 | [MVP2] notifications | 13 Oct | MVP2, out of scope. |

## 2. Figma audit of Section 7 (19 Oct 2026)

The user said Section 7 "doesn't match the tickets yet, and has no notes". They asked to match the other sections, with information and documentation.

What was wrong, and what was done:

| # | Gap | Fix |
|---|---|---|
| 1 | Approve / Reject **Leave** modals still had the placeholder "{See copy master list}" as title and body. The Actions menu was still open behind the modal. | Titles are now "Approve leave?" / "Reject leave?" and bodies `{{copy to master}}` (house rule, `FIGMA_DESIGN_SYSTEM.md` §4.8). Menu closed with `BusCom-Details Action Button 2.0` → `Property 1=Normal`. |
| 2 | Leave approver row had no outcome frames. | Added: Approved result (`41099:154273`); Rejected result with Reason for Rejection (`41099:161302`); not-pending Approve/Reject disabled + tooltip (`41099:169816`). |
| 3 | Leave tables had no pagination (ticket: max 5 per page). | Added a `Table Footer` with "5 / page" to Leave Applications, Pending Approval and History in the full-page frames (`357820`, `364801`, `374451`, `396180`, `399456`, `421184`). The frames now hug their content. |
| 4 | Balance numbers didn't agree. Apply Leave showed Available 8 / Deduct 8 / Balance 0 while the balance table said Annual 15.5. | Apply Leave box is now Available 15.5 / To Deduct 8 / Balance 7.5. On the "Sent for approval" frame: the new row is 8 days, Annual Pending Approval 8.5, Balance 7.5, and the table has 5 rows. |
| 5 | Leftover "1 month ago" under Reason for Rejection in the claim disabled frame (`41092:330231`). | Hidden. |
| 6 | No Home (MOVE-3949) row. | To do. |
| 7 | No Approvals empty states. | To do. |
| 8 | No docs layer: row titles, notes, captions, arrows. | To do, with this file's own `Docs/Big Title` (pink) + `Docs/Notes` (blue, ⚡ title + bullets), the same as the Production section `29013:27819`. |

The My Claims frame in Figma already had no Remarks column, so it matched the 16 Oct edit before the code did. The code was fixed on 19 Oct.

## 3. Figma techniques for this file

- **Docs components** (local, used in Production `29013:27819`):
  - `Docs/Big Title` (`Size=Small`, title text `Title`, `Brief#4:18` off): pink pill, one per flow.
  - `Docs/Notes` (`Size=Big, Type=Flow`): the ⚡ heading is the nested `Important` text; the bullets are the `Information#22:0` text prop (newline = bullet). Example instance `39324:88813`.
- **PD frames are horizontal auto-layout** (`PD Side Navbar` + `HR General Screen`). An overlay, tooltip or toast added to the frame must be `layoutPositioning='ABSOLUTE'`, or it lands to the right of the page (x=1440+).
- **Growing a page** (e.g. after adding a pagination footer): set `HR General Screen.layoutSizingVertical='HUG'`, the frame's `counterAxisSizingMode='AUTO'`, and the side nav's `layoutAlign='STRETCH'`.
- **Actions dropdown:** the outer `BusCom-Details Button 2.0` has `Show Action#11657:6`. That hides the **whole** button, not the menu, so don't use it to close the menu. Open or close the menu with the inner `BusCom-Details Action Button 2.0` `Property 1` = `Active` / `Normal`. Disable an item with `_Dropdown Menu / Dropdown Menu Item` `State=Disabled`.
- **Tooltip:** there is no Tooltip component in this file. Clone the hand-built `Tooltip - Approve/Reject disabled` (`41092:332706`); it sits directly in the section, not inside a frame.
- **Toast:** clone `Toaster Pop-up Message (success)` (e.g. `41092:472907`); its text is `{{refer to copy}}`.
- Hidden rows in the drawer's `RT-Details Content Sub-Section` are leftovers from the template (Suspension, Approved On …). Unhide and relabel them; don't add new ones.
- **`findAll` over the 174-child Production section times out and hangs the bridge.** Search inside one frame, or use a known id.

## 4. Product-team notes, 16 Oct 2026 (Denise T. → Daniel Roy; screenshot from the user, 19 Oct)

These come from product, not a ticket. Apply them in Figma; the tickets lag behind.

**Home (MOVE-3949)**
- An upcoming-leave card **"My Next Leave"** is optional ("if you want, low effort for devs").
- Pay slips already appear in Recent Activity: a new pay slip generated in the past 7 days.
- Add more sample data to Recent Activity to see how it looks. An ops manager who approves drivers' leave and claims could get a lot of items.
  - Consider a max height / max number of rows, or a collapsible / expandable section.
- Don't add non-essential info just to fill the page: every addition is dev work, and the team deadline is **end Jan 2027** for all HR modules + live tracking.
- Daniel will make a sample first for product to review.

**Leave details page (MOVE-3948)**
- The **year toggle** should look like the one on the Leave module's employee leave profile page, and sit **above the tabs**.
- Align the Leave Applications and Leave Balances tables with the Leave module (check its Figma). The only differences:
  - Leave Applications shows max **5** records per page (Leave module: 10).
  - **Leave Applications table above, Leave Balances below.** The Leave module has them the other way round.

**Claims details page (MOVE-3943)**
- **Remove the Remarks column from the table.** The claims module ticket was updated; product forgot the PD ticket.

**Entry to the dashboard (MOVE-3949 biz req 1 + 4)**
- User profile dropdown in the top header bar → "Personal Dashboard"; the default view is Home.
- Inside the dashboard, the same dropdown has "Work space" → back to the main workspace (ops, sales, HR modules …).
- The main app's header bar (from the user's screenshot, Operations Calendar), left to right:
  - collapse icon;
  - Search…;
  - language select "English";
  - help (?);
  - bell;
  - divider;
  - avatar + chevron.

## 5. Decisions from the user (19 Oct 2026)

- **Personal Dashboard ≠ HR module.** Read only the MOVE-3412 children for PD rules; never the HR Claims / Leave module tickets (user: "jangan baca yang HR lho ya, ini beda ya"). Where a PD ticket says "same as leave/claims module", follow that pointer only as far as the PD ticket says.
  - Example: **Remarks** — the PD ticket MOVE-3943 (16 Oct) removes it from **My Claims only**. The **Approvals** table keeps Remarks, even though product's chat note said "remove remarks column from table".
- **Header bar like the main app (SS1).**
  - Top header bar over the content column: collapse icon, Search…, English, ?, bell, avatar + chevron.
  - The profile dropdown holds "Personal Dashboard" (from the workspace) and "Work space" (from inside PD).
  - The PD sidebar becomes logo + menu only (Home / Leave / Claims / Pay Slip); avatar and notifications move to the header bar.
  - Built as local components `Header Bar` + `Profile Dropdown`.
- **Recent Activity:** max **6 cards** (2 rows of 3) + **"View all (N)"** to expand. Show both the collapsed and the expanded state, with lots of data, including approver-side items.
- **"My Next Leave" card on Home:** yes. Next approved upcoming leave (type, dates, days), with an empty state.
- **When unsure, ask.** The goal is that a Jira → Figma request is understood without hand-holding.

## 6. Build log, 19 Oct 2026 (Section 7)

- **Local components** (in Section 7, top-left):
  - **`Header Bar`** `41104:372264`, 1204×56, white with a bottom stroke. Left: `Sidebar Icon` (collapse). Right: search `Input` "Search…", language select "English", help "?" (hand-built: no QuestionCircle icon in the file and the COMPASS import timed out), `Icon / BellOutlined`, divider, `Avatar` "CD" + `Icon / DownOutlined`.
  - **`Profile Dropdown`** set `41104:372371`, `Context` = `Workspace` (item "Personal Dashboard") / `Personal Dashboard` (item "Work space"), plus "Log out". User block: Avatar + Citra Dewi + email. Items are `_Dropdown Menu / Dropdown Menu Item` (the first one `State=Hover`).
- **Applied to all 39 PD frames:**
  - a `Header Bar` instance as the first child of the content column;
  - `HR General Screen.paddingTop=0` on leave frames; claims frames use `RT-Page Interaction Section`, padding already 0;
  - the sidebar's `Navbar Items` (avatar + Notifications) hidden;
  - the sidebar's `Sidebar Icon` hidden, because it moved to the header.
- **Year toggle moved above the tabs** (product note) on every Leave frame: `Form` children reordered `Frame 194` → `Tab/Tab Group (My Leave / Approvals)`.
  - It is also shown on the Approvals-tab frames; it was hidden there before.
  - Reading: the year toggle is a page-level control above both tabs.
- **Gotcha:** `form.insertChild(1, form.children[0])` is a no-op, because the index is resolved before the node is removed. To move child 0 below child 1, use `insertChild(2, …)`.
- **Approvals empty states** `41107:264186`. Approvals tab with both tables empty:
  - Pending Approval: "There are currently no leave applications pending your approval".
  - History: "You have not rejected or approved any leave applications".
  - The tab badge is hidden.
  - The empty block is hand-built (text only), because the COMPASS `Empty / Image` import times out in this file.
- **Home** (MOVE-3949), default frame `41107:267249`, built from the Leave page clone:
  - Nav "Home" active; breadcrumb Personal Dashboard / Home; title "Home".
  - CTAs Apply Leave + Submit Claim, both primary (ticket: both "Primary CTA").
  - **Recent Activity** card: "Last 7 days" sub-header, "View all (12)" link, and a grid of 6 local `Activity Card` component instances (`41107:271227`, props Card Title / Line 1 / Line 2 / Show status).
    - Includes approver items "Leave pending your approval" / "Claim pending your approval". These come from product's 16 Oct comment (ops managers will receive all drivers' leave and claims).
    - **The ticket's activity table has no approver-side card titles yet. Those card titles are our wording, to confirm with product.**
  - **Leave Balances:** Annual + Medical only (detached table, columns refit), with "View more" (→ Leave page, scrolled to Leave Balances).
  - **My Next Leave:** next upcoming leave (type, dates · days, "Starts in N days", status tag).
    - Pending is shown because Citra has no approved upcoming leave in the data.
    - Whether pending leave counts as "next leave" is to confirm with product.
- Home expanded frame `41107:271607`: clone of default; "View all" → "Show less" and 12 cards. Interrupted by a bridge drop; finish it on reconnect.

## 7. Section 7 layout + documentation (finished 19 Oct 2026)

Restore point before the relayout: "Before PD Section 7 relayout + docs layer (Claude, 19 Oct 2026)". The section is 11700×23700.

Every group has:
- a pink `Docs/Big Title` (clone of `39082:10687`) at x=1755, above the frames;
- blue `Docs/Notes` (clone of `39324:88813`) in the left column, x=100, w=1550. After setting `Information#22:0`, re-apply `setRangeListOptions(…,{type:'UNORDERED'})` on the `Description` text, or the bullets are lost.

Frames sit at x = 1755 + i·1640.
- Red 4px arrows join consecutive states.
- In the approver rows, an elbow arrow under the frames shows the Reject branch.
- Grey dashed connectors at x=1700 lead from one group to the next.

| Row y | Big Title | Frames, left → right |
|---|---|---|
| 500 | Personal Dashboard — Local Components | `Header Bar` 41104:372264 · `Profile Dropdown` 41104:372371 · `Activity Card` 41107:271227, with their notes underneath |
| 1400 | Entry – Profile Dropdown | 41108:278794 workspace → "Personal Dashboard" · 41108:283731 inside PD → "Work space" |
| 3200 | Personal Dashboard Homepage | 41107:267249 default · 41107:271607 View all expanded · 41108:274758 empty |
| 5150 | Leave Details Page | 41092:364801 non-approver · 357820 approver My Leave · 374451 filter · 385461 balance drawer |
| 7650 | Leave Details Page – Approvals Tab | 396180 · 399456 filter · 41107:264186 empty |
| 9950 | Apply Leave Drawer | 414340 empty · 414579 filled · 421184 sent · 414815 time off · 415054 insufficient |
| 12450 | Leave Application Details Drawer (Own) + Cancel | 450009 · 464616 modal · 465601 cancelled · 457308 started → Cancel disabled |
| 14350 | … (Approver) + Approve / Reject | 475837 · 485616 approve · 41099:154273 approved · 489811 reject · 41099:161302 rejected · 41099:169816 disabled |
| 16250 | Claims Details Page | 111950 non-approver · 109304 My Claims · 113871 Approvals · 116474 filter |
| 18150 | Submit Claim Drawer | 300597 missing fields · 299784 filled · 303206 sent |
| 20050 | Claim Details Drawer (Own) + Cancel | 305164 · 307743 · 307953 · 309614 · 312075 |
| 21950 | Claim Details Drawer (Approver) + Approve / Reject | 314570 · 316841 · 324952 · 319302 · 327572 · 330231 |

(Bare numbers are `41092:` ids.)

**Open with product:**
1. Approver-side Recent Activity card wording.
2. Whether pending leave counts as "My Next Leave".
3. Home empty-state copy (`{{refer to copy}}`).
4. Pay Slip tickets (MOVE-3953/3954) are still empty.
