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
