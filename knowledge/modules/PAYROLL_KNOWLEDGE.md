# Payroll (HR module) knowledge base

- Epic: **MOVE-3411** "WLA: HR - Payroll".
- Figma working file: `BVlJMgTBbvNEKEuL4krzv5` "👩🏻‍🚀 Payroll (HR Module)". The user calls it "your working file"; the page link is node `23691:148675`.
- Tickets read on 19 Nov 2026 (all updated that morning):
  - MOVE-4479 Payroll Listing
  - MOVE-4481 Pay Slip Details
  - MOVE-4482 Edit Pay Slip
- Money is always shown as `$` with 2 decimals.

## MOVE-4479 Payroll Listing
The PM says the ticket is still thin, but the key info is there.

**Month toggle.** It changes the viewing month and defaults to the latest pay slip **period**. The month is the period, not the generation date: Oct 2026 shows the slips generated on 5 Nov. If no slips exist for the month, show the empty state (copy master).

**Columns:**
- Employee
- Employment Eligibility
- Basic Salary
- Gross Salary
- Deductions
- Net Salary
- Status (Pending Confirmation / Confirmed)
- Last Updated On (date and time)

**Sort.** Default is Last Updated On, newest first. Users can also sort by Employee, Employment Eligibility, Status (A–Z) and Last Updated On (chronological).

**Search.** "Search Payroll" placeholder; searches Employee.

**Filters:**
- Employment Eligibility, multi-select: Citizen / Permanent Resident / Work Pass Holder / Work Pass Not Required.
- Hiring Company, single-select: Westpoint Transit / Coach / Tours.
- Department, single-select with search: Digital, Driver, Facilities, Finance, Human Resources, Operations, Sales, Workshop, Not applicable.
- Status, single-select.
- Last Updated On, date range picker.

**Navigation.** Clicking a row opens the details page.

**Permissions.** Master & Junior System Admin, plus staff with the "view & edit pay slip" permission.

## MOVE-4481 Pay Slip Details
**Header.** Employee full name plus the status tag.

**Basic info:**
- Hiring Company.
- Pay Slip Period: the first to last day of the month. Non-drivers get Nov slips generated on 26 Nov; drivers get Oct slips generated on 5 Nov.
- Date of Payment: defaults to the 28th, or the 10th for drivers.
- Mode of Payment: defaults to "Bank Transfer".

**Summary card on the side** (like sub-con payment / invoices): Gross Salary, Deductions, Net Salary = Gross − Deductions.

**Gross Salary section.** The total is shown in line with the sub-header. Gross = Basic − Unpaid Leave + Allowances.
- Basic Salary: the probation basic during probation.
- Allowances: shows "-" if none.
- Unpaid Leave: shows "-" if none.

**Allowances table.** Expandable, collapsed by default.
- Columns: Item / Allowance Type / Amount.
- Sort fixed before unfixed, then A–Z.
- Empty state if there are no items.
- Fixed: Monthly performance incentive, Standby allowance, Overtime pay (shown as "$100.00 (5 hrs)"), Rest day pay, other contract fixed allowances.
- Unfixed: Cash incentive, plus HR-added items.

**Deductions section.** The total is shown in line with the sub-header. Each field shows "-" when not eligible or none:
- Employee's CPF
- SHG
- Group Medical Insurance ($70 / $100)
- Other Deductions (the sum of the table)
- Advance Salary Payment ($600 / $800 / $1000, drivers)
- Incident Penalties

**Other deductions table.** Expandable, collapsed by default. Columns Item / Amount, sorted A–Z, with an empty state.

**CPF section.** Only for citizen / PR. Employee's CPF, Employer's CPF, Total.

**Audit fields.** Last Updated On / By, Created On, and Created By = System.

**Actions:**
- **Edit** (primary). Only when the status is Pending Confirmation; otherwise disabled with a tooltip (MOVE-4482).
- Actions dropdown:
  - **Confirm Pay Slip** (modal; only when Pending)
  - **Download**
  - **View Change History** (drawer)
- **Return to Pay Slip Listing.**

## MOVE-4482 Edit Pay Slip
- **CTAs:** Save (primary), Cancel (secondary).
- **Basic info:**
  - Editable: Date of Payment and Mode of Payment, both required.
  - Disabled: Hiring Company and Period.
  - Gross / Deductions / Net are disabled and auto-update.
- **Gross:**
  - Basic and Allowances are disabled; Allowances auto-updates.
  - Unpaid Leave is optional and editable. 0 or blank shows "-" after save; "-" opens as blank.
  - **Existing allowance rows:** only the amount is editable, and they cannot be removed.
  - **New rows** can be added and removed:
    - Item is a dropdown: Sales commission / Performance bonus / Leave encashment / Others, where Others adds a required text and is saved as "others (text)".
    - Type is fixed to Unfixed (disabled).
    - Amount is required.
- **Deductions:**
  - Employee's CPF, SHG, GMI and Advance Salary are editable (required) unless the value is "-", in which case they are disabled. $0 is allowed.
  - Other Deductions is disabled and auto-updates.
  - Incident Penalties is optional, with the same blank/"-" rule.
  - **New rows:** Item is a dropdown (Loan repayment / Others + text), Amount is required.
- **CPF:**
  - Employee's CPF is disabled here (it is edited in Deductions).
  - Employer's CPF is required and editable.
  - Total is disabled and auto-updates.
- **Save:**
  - Shows a success toast and returns to the details page.
  - The status does not change. The ticket says "remains as 'confirmed'", which conflicts with Edit only being allowed while Pending; ask the PM.
- **Missing required fields:** error toast plus field errors.
- **Cancel, or browser back/refresh:** nothing is saved; return to details.
- **Copy** comes from the copy master list (Lark), which we cannot open, so use `{{Refer to copy master}}` placeholders the way the file already does.

## Figma build, round 1 (19 Nov 2026)
Section `43004:150983` "🔵 Payroll — Listing · Pay Slip Details · Edit (MOVE-3411: 4479 / 4481 / 4482)" is on 🏭 Production at x=48637, to the right of the Personal Dashboard section. Restore point: `Before Payroll section build (19 Nov 2026)`.

| Row | Frame | Node | What it shows |
|---|---|---|---|
| 1 Listing | 1.1 Default | `43004:150984` | Oct 2026, 8 columns, status tags, sorted by Last Updated On |
| | 1.2 Filter open | `43004:154957` | Eligibility (multi), Hiring Company, Department (search), Status |
| | 1.3 Empty | `43004:169677` | Nov 2026 toggled, slips not generated |
| 2 Details | 2.1 Pending | `43004:172381` | Edit + Actions, breakdowns collapsed, summary card |
| | 2.2 Actions + expanded | `43004:181900` | Confirm Pay Slip / Download / View Change History; allowances table; other deductions empty state |
| | 2.3 Confirmed | `43004:186111` | Edit disabled + tooltip; Work Pass Holder, so no CPF card |
| 3 Edit | 3.1 Default | `43004:194711` | Editable vs disabled fields, new allowance (Sales commission $300) + deduction (Loan repayment $50) rows, totals auto-updated |
| | 3.2 Errors | `43004:199476` | Error toast plus field errors (Date of Payment, Employer CPF, "Others" item name) |
| | 3.3 Saved | `43004:203877` | Back on details, totals updated, success toast |

**How it was built:**
- **Listing.** A clone of Old Leave "Leave Listing" `33037:30187`. The `Leave Employee` instance was detached, and 2 columns were added by cloning cells. Status uses the cell's `Tag / Status` (Warning = Pending Confirmation, Success = Confirmed).
- **Month toggle.** A clone of the Leave Profile year bar (`Frame 194`).
- **Filter.** A clone of the Leave Listing filter dropdown, detached, with the group duplicated to 2×2 fields.
- **Details.** Built on a clone of "Profile Detail Pages" `39049:74913`, with `HR General Screen` detached.
  - Cards are hand-built auto-layout frames styled like the profile cards.
  - Fields are **`Content Cell` (31014:46623)** instances, the same component the PD claim drawer uses.
  - Header: status tag `Tag / Status` (Warning / Success); `RT-Details Action Button 2.0` for Actions; `Buttons` (Primary) for Edit, set to `State=Disabled` on Confirmed.
  - The tooltip is cloned from the PD Cancel-disabled tooltip.
- **Edit.** Fields use `_Form / Form Item / Vertical` (InputNumber / Select / DatePicker), cloned from the PD Submit Claim drawer.
  - Disabled fields use `State=Disabled` with the steppers hidden. Required fields use `Mark=Required`; optional ones use `Mark=Optional`.
  - Error toast: swap `Toaster Pop-up Message` to a `Status=Error` variant, because the plain Status prop has no Error variant for this Type.
- **Sample data (Ahmad Fauzi, Citizen):**
  - Basic $3,200 + allowances $450 (Monthly performance incentive $200 F, Standby $150 F, Cash incentive $100 U) = Gross $3,650.
  - Deductions: CPF $730 + GMI $70 = $800, so Net $2,850. Employer CPF $620.50; total CPF $1,350.50.
  - After the edit: allowances $750, Gross $3,950, Deductions $850, Net $3,100.

**Open items:**
- **Ask the PM:** MOVE-4482 says the status "remains 'confirmed'" after Save, but Edit is only allowed while Pending Confirmation. Figma keeps Pending Confirmation.
- **Copy master (Lark):** the toast, tooltip and empty-state copy uses `{{Refer to copy master}}` placeholders.
- **Not built yet:** the Confirm Pay Slip modal and the View Change History drawer (other tickets); the Download result; the "Others" option shown with its saved name.
- **CPF in edit:** CPF is not recalculated when allowances change, because it is its own editable field per the ticket.

### PM questions, full list (19 Nov 2026)
1. **Status after Save.** MOVE-4482 §3 says "remains as 'confirmed'", but §1 allows Edit only while Pending Confirmation.
2. **Copy master entries needed:**
   - Listing empty month.
   - Allowances empty.
   - Other deductions empty.
   - Edit-disabled tooltip.
   - Save success toast.
   - Missing-fields toast.
   - Field error text.
3. **Mode of Payment options.** Only the default "Bank Transfer" is given.
4. **Gross / Deductions / Net placement on Edit.** 4482 lists them in the basic info table, while 4481 puts them in a side summary card; Figma uses the summary card on both.
5. **Employee CPF on Edit.** Is it recalculated when gross changes, or manual only? The ticket implies manual only.
6. **Default month when drivers and non-drivers are generated on different dates.** From 26 Nov the latest period holds non-drivers only until 5 Dec.
7. **Date of Payment validation.** Can it be in the past or before the period? Any limit?
8. **Saved "Others" name.** The ticket writes "others (text)" in lowercase; confirm the display casing.
9. **Typo in 4482 §2.3.** It says "table of allowances breakdown" in the Deductions section.
10. **Permission names.** The permission is still "xx", and 4481 biz req 3/4 are empty.
11. **Return to Listing.** Should it keep the selected month, filters and search?

## MOVE-4486 Confirm Pay Slip (ticket updated 19 Nov 2026 15:48; built the same day)
**Ticket:**
- The action lives under Actions on the details page and is enabled only while Pending Confirmation. Otherwise it is disabled with a tooltip.
- Opens a confirm modal (copy master).
- **Confirm:** the modal closes, the user stays on details, the status becomes Confirmed, a success toast shows, and Confirmed On / By appear in Additional Information. The employee can then see the slip on their personal dashboard (MOVE-3953).
- **Cancel / X / click outside:** the modal closes and nothing changes.
- **Permissions:** the same as viewing details.
- **This answers PM question 1:** the status changes only through Confirm, so an edit keeps Pending Confirmation.

**Figma, row 4 of section `43004:150983`** (renamed to include 4486). Restore point: `Before Payroll confirm pay slip row (19 Nov 2026)`.
- **4.1 Modal** `43008:191547`. Built from 2.1 with an absolute 45% overlay. The modal is the detached `Edit Leave Entitlement` modal (`39101:60550`) retitled, with Cancel / Confirm.
  - **Gotcha:** the page frame is HORIZONTAL auto-layout, so the overlay and modal need `layoutPositioning='ABSOLUTE'`.
- **4.2 Confirmed** `43008:194762`. Tag Confirmed, Edit disabled, success toast. A "Confirmed On / Confirmed By" row is added at the top of Additional Information.
- **4.3 Already confirmed** `43008:198551`. Actions are open with Confirm Pay Slip greyed out, plus a tooltip.

## MOVE-3953 Personal Dashboard: Pay Slips (ticket updated 19 Nov 2026 16:09) — BUILT 20 Nov 2026 (PD file)
**Ticket:**
- **Navigation:** in the PD side nav, select "Pay Slips". It is a listing page only.
- **Columns:**
  - Pay Slip Period ("1st – last day of month")
  - Basic Salary
  - Gross Salary
  - Deductions
  - Net Salary
  - Confirmed On
  - A download icon (MOVE-3954)
- **Table rules:** 10 per page, sorted by period newest first, no manual sort, no search, no separate date range.
- **Filters:**
  - Month: multi-select Jan–Dec, matching any year.
  - Year: multi-select. The ticket asks the PM "how does a year filter work? indefinite options?"
- **Visibility:** only confirmed slips are shown.
- **Permission:** "manage own dashboard", own slips only.
- **Where to build:** the Personal Dashboard section is no longer in the Payroll file, so it needs the PD file `1FCRdGhHru6czP5P6h06kH` (re-pair).

## Consistency check + 2 exploration options (19 Nov 2026)
The user added reference sections from other modules to the Payroll page:
- `43013:214417` Account Management
- `43013:241094` Employee: listing, details page, contract details, `Modal / Confirmation`
- `43013:407799` Customer Contracts

Their feedback was: "many designs inconsistent, AI made new layouts". Rule: **build detail pages only from the shared components below, never hand-built cards.**

**Reference patterns (shared components):**
| Pattern | Component / node | Where used |
|---|---|---|
| Detail card, 4-col label/value grid | `Content Detail Pages` (Type `Default 2.0` / `Default`), cells `RT-Details Content` / `Detail Label with Body`, value `Text` instance prop `Text#1233:72` | Employee Details, Contract Details |
| Card with summary table on the right (invoice-style) | `Content Detail Pages` Type `Split` (Table Cell prop `Text Content#533:310`) | Contract |
| Additional Information (4 cols, relative "1 month ago") | `Content Detail Pages` Type `Additional Information` | all detail pages |
| Collapsible breakdown | `Collapse` › `_Collapse / Collapse Item` (`Header#13259:590`, `Collapsed=True`) | Contract "Job Scope" |
| KPI tiles | `Highlights Card Grid` › `Highlights Card` | Customer Contracts listing |
| Confirm modal | `Modal / Confirmation` (warning icon, title, text, Cancel / Confirm) | Employee |
| Edit form card | Container with 3-col `_Form / Form Item` inputs (e.g. Payment Details `43013:409846`) | Contract edit |

**Gaps in my rows 2–4 against these patterns:**
- They use hand-built cards with radius 24 and a 2-col `Content Cell` grid; the reference uses `Content Detail Pages` with a 4-col grid.
- The side summary card is hand-built; the reference is the `Split` variant.
- The breakdown toggle is a blue text link; the reference uses `Collapse`.
- Additional Information has no relative time.
- The confirm modal is built from the Edit Leave Entitlement modal; the reference is `Modal / Confirmation`.
- The Edit page uses a 2-col form; the reference uses 3-col form containers.

**Options built (row 5 of `43004:150983`).** Restore point: `Before Payroll details consistency options (19 Nov 2026)`.
- **5.A** `43013:541083`: Basic Information as the `Split` card, with Gross / Deductions / Net in the right table. Then Default 2.0 cards for Gross, Deductions and CPF; Collapse for the breakdowns; and the reference Additional Information card.
- **5.B** `43013:546739`: `Highlights Card Grid` (Gross / Deductions / Net tiles) on top. Basic Information as a Default 2.0 card, then the same cards as 5.A.
- **Gotchas:**
  - The `Content Detail Pages` main component is remote, so its variant list can't be read. Clone an instance and `setProperties({Type})` to preview a variant.
  - Its title Style prop only accepts "Only Title".
  - Detaching a card is the only way to append a Collapse inside it.
  - Editing many Table Cell texts by `characters` timed out; set the instance property `Text Content#533:310` instead.
- **Next step:** once the user picks A or B, rebuild rows 2–4 (details, edit, confirm) on that pattern. Also swap the confirm modal to `Modal / Confirmation`, and the edit form to 3-col form containers.

## Full-flow options A and B (19 Nov 2026, user clarification)
The user wanted the **whole flow rebuilt twice**, not just 2 detail frames: "buat lagi sama persis semuanya tapi dengan konsistensi yang lebih terjaga". Restore point: `Before Payroll full-flow options A/B (19 Nov 2026)`. Both options sit at the bottom of section `43004:150983`, each with a Big Title, a caption per frame, and arrows.

| | Option A (summary in Split card) | Option B (summary as Highlights tiles) |
|---|---|---|
| Row 1 Listing | A1.1 `43018:575939`, A1.2 `43018:576096`, A1.3 `43018:576261` (same as rows 1.x) | B1.1 `43018:626162`, B1.2 `43018:626319`, B1.3 `43018:626484` + Highlights tiles (Pending / Confirmed / Total Net) like Employee Listing |
| Row 2 Details | A2.1 `43018:576420`, A2.2 `43018:576683` (Actions + Collapse open + table), A2.3 `43018:576946` (Confirmed, no CPF) | B2.1 `43018:626643`, B2.2 `43018:626836`, B2.3 `43018:627052` |
| Row 3 Edit | A3.1 `43018:591356`, A3.2 `43018:601043` (errors, Others name), A3.3 `43018:607744` (saved) | B3.1 `43018:627247`, B3.2 `43018:627410`, B3.3 `43018:627575` |
| Row 4 Confirm | A4.1 `43018:612934` (`Modal / Confirmation`), A4.2 `43018:613151` (Confirmed On / By row), A4.3 `43018:618314` | B4.1 `43018:627769`, B4.2 `43018:627973`, B4.3 `43018:628167` |

**Edit pattern (both options) = Employee "Compensation & Benefits" edit:**
- Container cards (clone of `I43013:242716;37125:16039`) with a GRID of `_Form / Form Item / Vertical`, 3 columns.
  - `Type=Text` input props: `Text#515:158`, `Prefix#515:58`, `Prefix Text#515:133`, `State`, `Status`.
  - Caption: `_Input / Input Caption` `Text#533:0`.
- Allowance and deduction rows come from `Monthly Fixed Allowance` Variant3, detached: select + amount + red delete, then "+ Add Allowance".
  - Auto-generated rows: select disabled, amount editable, delete hidden.
  - "Others" adds a required name input underneath.
- Option A edit also lists Gross / Deductions / Net as disabled inputs in Basic Information (ticket table). Option B shows them as tiles instead.

**Gotchas:**
- GRID containers keep each child's cell. After removing items, re-place them with `setGridChildPosition(row, col)`. Moving onto an occupied cell throws, so place into free cells first.
- `gridRowCount` can't be set while auto-tracks = ROWS.
- Form items switched from Radio Group to `Type=Text` don't show their value. Clone a working Text item instead.
- Cloned 5.A frames still carried the hidden old body; delete it so `findOne` doesn't hit old cards.

**Open:** the user picks A or B. The old rows 1–4 and row 5 stay as history until then.

### User feedback on options A/B (19 Nov 2026), in progress
Restore point: `Before Payroll options cleanup (19 Nov 2026)`.
1. **Listing removed from A and B** (A1.x / B1.x frames, labels and arrows deleted). Done.
2. **No Collapse on detail pages.** Reference detail pages (Employee Details "Dependants" / "Vocational Licences", Contract "Trips") show the table directly, under a small grey subtitle inside the card. Replace the Collapse with subtitle + table.
   - This overrides MOVE-4481's "expandable table, default collapsed". Flag it to the PM.
3. **Detail rows are always 4 columns.** When a card has fewer fields, keep the empty cells (opacity 0), never let the cells stretch. Done on all A/B detail frames.
4. **Multi-value allowance / deduction entry.** The closest reference is Employee edit `Monthly Fixed Allowance`: select + amount + red delete + "+ Add Allowance"; "Others" adds a name input.
   - A second reference is Contract "Trips" (`43013:410220`): a table with an editable "$" price column, view / remove actions, and "Sub-total" beside the title.
   - The ticket needs Item / Allowance Type / Amount, so add a disabled Allowance Type column.
   - Contract also has a side summary card next to a form card (`43013:409766`). This is the edit-page twin of the Split summary.

**Pending:** the collapse → table replacement on the 14 detail frames. The bridge dropped mid-task, so it needs a re-pair.
- **Done (19 Nov 2026, after re-pair):**
  - The Collapse was replaced on 11 detail frames: A3.3, A4.1–4.3, B2.1–2.3, B3.3, B4.1–4.3.
  - Each card now has a grey subtitle ("Allowances" / "Other Deductions") and the table shown directly, or the empty state.
  - Data per employee:
    - Ahmad: 3 allowances, no other deductions.
    - Citra: Monthly performance incentive $400 F and Cash incentive $200 U.
    - After the edit: Sales commission $300 added, and Loan repayment $50.
  - Edit allowance rows (A3.1/3.2, B3.1/3.2) now have 3 columns: Item, Allowance Type (disabled Fixed/Unfixed), Amount.
- **A2.1 / A2.2 / A2.3 were not in the file at this point**, together with their labels and arrows. I did not delete them. The user was asked whether to rebuild them.

### Collapse variant row (19 Nov 2026)
User asked for a version with the breakdowns inside a Collapse (MOVE-4481 "expandable, default collapsed"), next to the inline option.
- Big Title `43024:690964`. AC.1 `43024:690968` (A, collapsed) → AC.2 `43024:691562` (A, expanded); BC.1 `43024:692156` → BC.2 `43024:692761`.
- Collapse is the shared `Collapse` cloned from the Employee module (`_Collapse / Collapse Item`, `Header#13259:590`, `Collapsed`). Headers: "Allowances (3)", "Other Deductions (0)".
- Restore point: "Before Payroll collapse variant row (19 Nov 2026)". Inline vs collapse is still a PM decision.

### Multi-value reference patterns found (19 Nov 2026)
User asked to look for "dynamic, multiple data" patterns in other modules (Jira + the Production sections dropped into the Payroll file).
- **Customer Contract → `Other Charges Form 2.0`** (`43013:409765`, section `43013:407799`, Edit Price flow). A table-style form: header row (Item Description / Quantity / Unit Price / Amount / Item Remarks), one input row per item, a computed Amount column, a section total on the title line ("Other Charges … $0"), and a full-width "+ Add other charges" button under the last row. Closest match for the allowance / other-deduction breakdowns.
- Jira hits: MOVE-4581 Bus Booking "+ Add-Ons" (multiple add-ons); MOVE-3610 Add Shift Pattern (row sets driven by "Repeat every x weeks", not free add); MOVE-3930 Customer Contract "add more active date".
- Current Payroll edit (A3/B3) uses a plain form-item grid with a small "+ Add Allowance" button and row delete icons. Pending user decision: switch to the Other Charges table pattern.

### Summary layout from Daniel's comment on 2.1 (23 Nov 2026)
Comment: keep the Gross / Deductions / Net summary format, but the sections below should not be narrowed to line up with it. Take the Subcon Payment / Invoices module as the reference (Invoice Detail `43080:10042`).
- New section `43080:32650`. Frame S1 `43080:32651` is cloned from B2.1 and keeps all Payroll data.
- Top row: Basic Information card on the left, set to fill height. On the right, the summary card is a clone of the Invoice `Invoice/Content Detail` instance. It lists Basic Salary, Allowances and Unpaid Leave, then **Gross Salary**, then Deductions, then **Net Salary**.
- Every section below is full width. The Highlights card row is hidden.
- Section header comes from the Invoice "Adjustment Details" header frame: title on the left, "Sub-total: $ x" on the right.
- Table label comes from the Invoice "Trips" header frame: "Allowances" with "Allowances Sub-total: $ 450.00" on the right. The same is done for Other Deductions.
- Restore point: "Before Payroll details summary layout (23 Nov 2026)".
- Not done yet: the other states (Actions open, Confirmed) and the edit page in this layout. The Basic Information card has spare height next to the taller summary card.

### Edit page: totals right-aligned (Daniel comment, 23 Nov 2026)
Comment on the edit page: "can the amount for gross salary and deductions align right, take ref from invoice module".
- New section `43080:38802`, frame E1 `43080:38803`. It is cloned from A3.1, because the B3.x frames are no longer in the file.
- The title now reads only "Gross Salary" / "Deductions". A separate text "Sub-total: $ 3,950.00" / "Sub-total: $ 850.00" sits on the right, in the Invoice sub-total text style. Its right edge lines up with the input column.
- The title container is not auto-layout, so the sub-total is placed by x. Re-place it if the card width changes.

### Chosen layout: S1 summary layout, related states updated (23 Nov 2026)
The user picked S1 `43080:32651` as the details layout. Before the round they had tidied it by hand: Basic Information is now a 2×2 grid, and the summary shows only Gross / Deductions / Net. The related states were rebuilt from S1 in section `43080:32650`. Each one takes the header and overlays from its old frame:
- S2 `43084:13147`: Actions open. Taken from 2.2.
- S3 `43084:21679`: Confirm modal and overlay, with the overlay resized to the frame. Taken from 4.1.
- S4 `43084:25789`: Confirmed. Status tag, Edit disabled, success toast. Additional Information row 2 (hidden in the Content Detail card) now shows Confirmed On / Confirmed By, and Last Updated On is the confirm time. Taken from 4.2.
- S5 `43084:29893`: Already confirmed. Confirm Pay Slip disabled with tooltip. Same slip (Ahmad Fauzi). Taken from 4.3.
- S6 `43084:34127`: Confirmed Work Pass Holder (Citra Dewi). The CPF card is hidden and Employee's CPF shows "-". Values: Gross 2,880, Deductions 100, Net 2,780, allowances 300 + 180. There is a tooltip on the disabled Edit button. Taken from 2.3.
- Gotchas:
  - Editing Detail Body text inside the Content Detail card can change its font weight, so copy `fontName` from a sibling body.
  - A fixed-width body wraps; set it to HUG.
- The old frames 2.x / 4.x in `43004:150983` are now superseded (kept as history).
