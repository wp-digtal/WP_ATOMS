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
