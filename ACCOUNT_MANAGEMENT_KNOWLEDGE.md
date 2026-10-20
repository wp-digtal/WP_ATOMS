# ATOMS Account Management: knowledge base

Written 15 Oct 2026 from Jira epic **MOVE-4449 "ATOMS Account Management"**. The epic description reads "Replace current 'staff' module on ATOMS".

- Figma working area: **Account Management - HR Module** `kI1rSu1FAsPpV5K1EI2HvM`, node `41001:22331`.
- Read this file before any Account Management work, and update it in the same change whenever something new is learned (CLAUDE.md rule).

## 1. Tickets (children of MOVE-4449, as of 15 Oct 2026, all "To Define Tasks")

| Key | Summary | Scope |
|---|---|---|
| MOVE-4452 | ATOMS Account Listing | **Build**: listing, sort, search, filters |
| MOVE-4450 | (Manual) Create ATOMS Account | **Build**: create drawer |
| MOVE-4455 | ATOMS Account Details Drawer | **Build**: details + actions |
| MOVE-4456 | Edit ATOMS Account | **Build**: edit drawer |
| MOVE-4453 | Suspend ATOMS Account | **Build**: suspend modal (manual suspend marked "potentially MVP 2") + auto-suspend |
| MOVE-4457 | Unsuspend ATOMS Account | **Build**: unsuspend modal (manual "potentially MVP 2") + auto-unsuspend |
| MOVE-4451 | Auto-create ATOMS Account | System rule: no screen, but explains "Created By = system" |
| MOVE-4463 | Verify Account & Set Password (Email) | Email with a verify + set-password link; no admin screen |
| MOVE-4458 | ATOMS Account Activity | Only "Similar to current staff activity log" |
| MOVE-4465 | [KIV 2] Account Change History | Empty |
| MOVE-4466 | [KIV 1] Verify & Set Password (SMS) | KIV |
| MOVE-4454 | [KIV 3] Auto-deactivate | KIV: employee/driver becomes inactive → account deactivated |
| MOVE-4459 | [KIV 4] Auto-reactivate | KIV |
| MOVE-4460 | [KIV 5] Reset Password | KIV: same as the current staff module (reset link via email/SMS) |

## 2. Account statuses

- **Active**: on creation, manual or auto.
- **Suspended**: manual suspend (MOVE-4453), or auto when the employee / sub-con driver becomes suspended. A suspended account is logged out and cannot log in.
- **Deactivated**: only via KIV MOVE-4454. Edit / Reset Password are disabled for deactivated accounts (MOVE-4455).
- The details drawer header = full name + **status tag**. The listing has **no status column** in MOVE-4452 (open question).

## 3. Listing (MOVE-4452)

- Module home → tab **"Accounts"**. The module has tabs; another one is probably Activity (MOVE-4458).
- **Columns**:
  - Full Name ("given name + family name").
  - Account Type (Employee / Sub-contractor Driver).
  - Access Roles (comma-separated, wraps to multiple rows; '-' for sub-con drivers).
  - Last Login (date & time).
  - Last Updated (date & time).
- **Sort**: default last updated, newest first. Alphabetical by Full Name and Account Type; chronological by Last Updated.
- **Search** "Search Accounts": Full Name, Access Roles.
- **Filters**: Access Roles (multi-select + search, options = roles from Roles & Permissions), Account Type (single-select), Last Login (date range).
- Toolbar date range: **Last Updated On**.
- **Primary CTA**: "Create Account" → create drawer. A row click opens the details drawer.

## 4. Create drawer (MOVE-4450)

Header "Create ATOMS Account"; CTAs **Cancel / Create**.

| Field | Type | Req | Rules |
|---|---|---|---|
| Account Type | Dropdown | Required | Employee / Sub-contractor Driver |
| Given Name | Text | Required | max 50 |
| Family Name | Text | Required | max 50 |
| Username | Text | Required | Auto-filled "given name+family name", editable, max 50. A duplicate puts the field in an error state and shows an error toast |
| Mobile Number | Country code dropdown + number | Required | Default +65 (Singapore) |
| Work Email | Text | Optional | Shown only for Employee |
| Access Roles | Multi-select dropdown with search | Required (if shown) | Shown only for Employee; options = role titles |

- **Create**: the drawer closes, the user stays on the listing, a success toast shows, and status = Active.
- **Missing required fields**: error toast + fields in error state.
- **Cancel**: nothing is saved.

## 5. Details drawer (MOVE-4455)

- **Header**: full name + status tag.
- **Basic**: Username, Access Roles ('-' for sub-con driver), Mobile Number, Work Email ('-' if none).
- **Additional**:
  - Created On / Created By ("system" if auto-created).
  - Last Updated On / By.
  - When suspended: Suspended On, Suspended By, Reason for Suspension.

**Actions**

| Action | Where | Enabled when |
|---|---|---|
| Edit | primary CTA | status ≠ deactivated |
| Reset Password | Actions dropdown | status ≠ deactivated (feature itself KIV 5) |
| Suspend | Actions dropdown | status = active |
| Unsuspend | Actions dropdown | status = suspended |
| View Change History | Actions dropdown | always (feature KIV 2) |

Disabled items show a tooltip (copy master list).

## 6. Edit (MOVE-4456)

- Same fields as Create, but **Account Type is disabled**. Header "Edit [full name]"; CTAs **Cancel / Save**.
- **Save**: the drawer closes, the user returns to the listing (per the ticket), a success toast shows, and the status is unchanged.
- **Data sync**:
  - Account edits don't change the employee / sub-con driver records, except Access Roles, which flow to the employee profile.
  - Given/Family Name, Mobile Number and Work Email edited in Employees / Sub-con modules flow into the account.

## 7. Suspend / Unsuspend (MOVE-4453 / MOVE-4457)

- **Suspend modal**: Reason for Suspension, required, max 120. Confirm → status Suspended, toast, details drawer shows Suspended On/By/Reason. An empty reason gives an error toast + field error, and the modal stays open.
- **Unsuspend modal**: a confirm only. Confirm → Active, and the suspension rows disappear.
- **Auto rules**: suspend/unsuspend follows the employee / sub-con driver status. Auto-suspend copies the reason and actor from that module.
- **Where the user lands**: the ticket says "remain on accounts listing page" after both confirms. Unlike Claims/Leave, where the user stays on the drawer. Open question.

## 8. Account types and auto-create (MOVE-4451)

- **Employee**: created when the employee goes future → active (first contract start). Name / mobile / work email / access roles come from the employee profile (MOVE-3416).
- **Sub-contractor Driver**: created when the sub-con driver is created. Name / mobile come from the sub-con module. No email, no access roles.
- **Verification email** (MOVE-4463): sent on creation if there's a work email. The link lets the user verify the account + set a password.

## 9. Figma build (15 Oct 2026)

Section 7 `41001:22331` now holds the module as 20 frames in 6 rows: Listing, Create, Details, Edit, Suspend, Unsuspend. Each row has a header, rule notes, n.m captions and arrows; node ids are in `FIGMA_COMPONENT_INDEX.md`.

- **Restore point:** "Before Account Management build in Section 7 (Claude, 15 Oct 2026)" (id 2410496742691575608).
- **Not drawn yet:**
  - the module's tabs (Accounts / Activity), because the Activity tab has no spec;
  - Deactivated status (KIV);
  - Reset Password and View Change History results (KIV);
  - the verify / set-password email.
- **Seed data** (made up, consistent across frames):
  - Rudi Hartono, Employee, HR Admin + Leave Approver, created by Heikke Ekkieh. He is the main record through Create → Details → Edit → Suspend → Unsuspend.
  - Yusuf Rahman, Sub-con driver, created by System.
  - The listing reuses the Leave seed names.
- **Copy:**
  - modal bodies are `{{copy to master}}`;
  - field errors, toasts and disabled-action tooltips are `{{refer to copy}}`;
  - modal titles are real ("Suspend Rudi Hartono?").
- **Post-action landing** follows the ticket, so Edit, Suspend and Unsuspend all land on the listing with a toast. This is still open question 2 below.

## 10. Open questions for PM

1. The listing has no Status column; should Active / Suspended show in the listing?
2. After Suspend / Unsuspend / Edit save, does the user really leave the drawer for the listing? Claims and Leave stay on the drawer.
3. The Activity tab (MOVE-4458) has no spec beyond "similar to current staff activity log".
4. Username duplicate check: the ticket ends with "?", so it's unconfirmed.
5. Should Access Roles be read-only in the Employees module once accounts own them? (raised in MOVE-4451)

## 11. Coverage audit of Section 7 against the tickets (20 Oct 2026)

**Re-check of the tickets:** every MOVE-4449 child was last edited on 15 Oct (latest 15:36). Re-reading all of them found no rule beyond §1–8 except these details:
- MOVE-4456: Edit is enabled only for active / suspended accounts. Otherwise it is disabled with a tooltip.
- MOVE-4456: Cancel in Edit → "redirect to listing page".
- MOVE-4456: Save with missing fields or a duplicate username → error toast + field errors, same as Create.

Read-only audit with the official Figma MCP; the bridge was not connected.

**Covered (20 frames)**
- MOVE-4452 Listing: default, filter open, no result.
  - All 5 columns, sort icons only on the sortable columns, "Search Accounts", the 3 filters, Last Updated On range, Create Account CTA.
- MOVE-4450 Create:
  - empty;
  - Employee filled;
  - Sub-con filled (Work Email + Access Roles hidden);
  - missing fields;
  - duplicate username;
  - created → listing + toast, with Rudi on top and 25 records.
- MOVE-4455 Details:
  - Active, with Unsuspend disabled + tooltip;
  - Suspended, with Suspend disabled, Suspended On / By / Reason, and the Suspend row disabled;
  - Sub-con auto-created ("System", Access Roles / Work Email "-").
- MOVE-4456 Edit: Employee (Account Type disabled) and Saved.
- MOVE-4453 Suspend: empty, reason error, filled, back on listing.
- MOVE-4457 Unsuspend: confirm, back on listing.

**Gaps found**
1. **Module tabs missing.** MOVE-4452 says "Account Management home → tab 'Accounts'". The listing has no Accounts / Activity tab bar.
2. **MOVE-4458 Activity tab not drawn.** The only spec is "similar to current staff activity log", which is open with PM.
3. **Sidebar still shows the old menu.** It has "Staff", and Account Management is not in the menu or active, but this module replaces Staff (epic).
4. **Edit flow incomplete** (MOVE-4456): no missing-required / duplicate-username error frames, and no Sub-con edit (no Work Email / Access Roles). "Saved" shows no visible change, so the edit isn't demonstrated.
5. **Data inconsistency.** In every drawer / modal frame (Details, Edit, Suspend, Unsuspend) the listing behind shows "1–10 of 24" without Rudi Hartono, although the Create result already shows him on top and 25 records.
6. **Auto-suspend not shown** (MOVE-4453 biz req 2): a details drawer where Suspended By = the user who suspended the employee in the Employees module, and the reason comes from there.
7. **Auto-created employee not shown** (MOVE-4451): only the sub-con shows Created By "System".
8. **MOVE-4463 verify / set-password email:** no email or set-password screen anywhere. To confirm whether it's in design scope.
9. **Frame size glitch.** The drawer / modal frames are 1476×1096 instead of 1440×1024, leaving dark margins at the top and right.
10. **Documentation:**
    - no `Docs/Notes` at all;
    - titles are numbered ("1 · Accounts Listing") instead of surface names;
    - rows layout instead of a navigation map;
    - frame-to-frame arrows.

    All per `FIGMA_DESIGN_SYSTEM.md` §4.13.
11. **Access role names are invented** (HR Admin, Leave Approver, Dispatcher …). The ticket says the options = role titles from the Roles & Permissions module, so real titles are needed.

KIV items (Reset Password, Change History, Deactivate / Reactivate, SMS verify) are correctly not drawn. Their menu entries exist.

## 12. Fixes applied in Section 7 (20 Oct 2026)

Restore point: "Before Account Mgmt Section 7 audit fixes (Claude, 20 Oct 2026)".

- **Module tabs.** The user's Tab component `41017:45839` (a `Container` with 6 `Tab/Tab Item`; props `Text#11488:0`, `State` Active / Default, `Counter#11488:3`) is cloned into every frame's `RT-Page Interaction Section`, between `BusCom-HeaderWrapper` and `Content Wrapper`.
  - It sits in a wrapper `Tabs — Accounts / Activity`, padded 0/24/8.
  - Item 1 is "Accounts" (Active), item 2 "Activity"; items 3–6 are hidden.
- **Sidebar.** The epic replaces Staff, so in every `Side Navbar` instance:
  - the "Staff" `_Menu / Menu / Submenu` is hidden;
  - the hidden second `Menu Items` block is shown, with its first item set to "Account Management", `State=Active`, user icon `3004:4487`; the other items are hidden.
  - Gotcha: setting the Staff submenu `Active=True` expands it with placeholder "Navigation Item" children and truncates the label, so don't.
- **"1476×1096" frames:** the frames were actually 1440×1024 with `clipsContent=false`, so the drawer and overlay shadows spilled out. Fixed with `clipsContent=true` on all 20 frames.
- **Data consistency:** the listing behind each drawer / modal now matches the timeline. The `Content Wrapper` was swapped for a clone of the right stage:
  - after Create (`41003:169536`: Rudi on top, 25 records) for Details Active, Sub-con Details, Edit, and the Suspend modal frames;
  - after Suspend (`41003:222244`) for Details Suspended and the Unsuspend modal.
  - The frames before Create correctly keep 24.
- **New frames (20 Oct):**
  - Edit row (y=6950):
    - `41018:67243` Edit – missing required: Given Name + Mobile in error, error toast.
    - `41018:69631` Edit – duplicate username: "ahmadfauzi", error toast.
    - `41018:71993` Edit – Sub-contractor Driver: Account Type disabled, no Work Email / Access Roles.
  - Details row: `41018:76639` Details – auto-suspended via the Employees module. Reason text from the employee profile; **Suspended By "Diana Han" / Last Updated By "System" may not have applied — the bridge dropped mid-call. Verify on reconnect.**
- **Done after reconnect:**
  - **Auto-suspend frame** (`41018:76639`): Suspended By "Diana Han", Last Updated By "System".
  - **New frames:**
    - `41019:84413`: employee auto-created (Ahmad Fauzi; Created On 01 Mar 2026, 12:00am, By "System").
    - `41019:89165`: Activity tab active, with a dashed placeholder "spec pending (MOVE-4458)".
  - **Docs:**
    - Big Titles without numbers: "Accounts Listing", "Create Account (Drawer)", "Account Details (Drawer)", "Edit Account (Drawer)", "Suspend Account (Modal)", "Unsuspend Account (Modal)".
    - Flow Labels 1.4, 3.4, 3.5, 4.3–4.5 for the new frames.
    - `Docs/Notes` beside each row: blue = rules, orange = open questions. The orange ones cover: Activity spec pending, placeholder role names, MOVE-4463 email scope, and where the user lands after an action.
    - 5 red elbow connectors that start at the triggering element: Create Account button → Create; listing row → Details; Edit button → Edit; Actions → Suspend; Actions on the suspended drawer → Unsuspend.
- **Still open (PM / user):**
  - real role names;
  - MOVE-4463 email scope;
  - the Activity tab spec;
  - the landing after Suspend / Unsuspend / Edit.
