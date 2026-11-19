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
