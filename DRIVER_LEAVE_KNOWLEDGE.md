# Driver app (mobile) — Manage Leave: knowledge base

Written 19 Oct 2026 from the Driver Accounts-tab epic **MOVE-4113**. Its leave stories were all edited on 19 Oct 2026:

| Story | Title |
|---|---|
| MOVE-2481 | Manage Leave |
| MOVE-4073 | View Leave Application |
| MOVE-4074 | Apply Leave |
| MOVE-4075 | Cancel Leave |

Read this file before any Driver-app leave work.

**Which design system:** this is the **Mobile Apps Design** file (`IICHGFDHLhKCvE5vMzFokS`). It uses the "🔥🛞 Integral" design system: Roboto, primary `#17334f`, 390-wide frames. That is **not** WP ATOMS / COMPASS / AntD; read `FIGMA_MOBILE_DESIGN_SYSTEM.md`.

**Figma locations:**
- The existing screens are in `🚌 Production - Driver` → section `Leave` (`8515:13884`).
- The update area is section `Fixing` (`8590:7558`).

## 1. Manage Leave page (MOVE-2481)

**Access**
- Account tab → "Manage Leave".
- Own-tenant drivers only. Subcontractor drivers have no access.

**Year dropdown**
- Defaults to this year.
- The first year is when the employee profile was created. The last year is when the profile became inactive; otherwise there is no limit.

**Tab "Leave Applications"**
- 1 card = 1 application, sorted by dates, latest first.
- Empty state text: **"No leave applications."**
- Card fields:
  - Leave Type.
  - Dates, as "start – end". Time off adds a sub-text "start time – end time".
  - Days Used. Time off shows **"-"**.
  - Submitted On.
  - Status: Pending approval / Approved / Rejected / Cancelled.
- Tap a card → View Leave Application.

**Tab "Leave Balances"**
- 1 card = 1 leave type, for the selected year.
- Sort: system leave types first, in the fixed order from MOVE-1977. Then custom leave types, by effective date with the most recent first.
- Card fields:
  - Icon and Leave Type.
  - Validity Period, as "1 Jan 2026 - 31 Dec 2026".
  - Balance = entitlement − used − pending. It shows "-" when the entitlement is not applicable.
- Tap a card → overlay with the balance details (MOVE-3494 biz req 2).
  - Annual Leave and Annual Leave (Drivers) also show Carried Forward, Entitlement This Year and Total Entitlement This Year (MOVE-4137 biz req 1.2).

**Other**
- CTA "Apply New Leave" → Apply Leave.
- Offline handling (every screen):
  - A fixed banner "You are currently offline", hidden again on reconnect.
  - On reconnect, a pop-up "You are back online".
  - Opening another page while offline shows a pop-up "Unable to access due to no internet connection".

## 2. View Leave Application (MOVE-4073)

**Header and basic fields**
- Header: **"Leave Details"**.
- Leave Type and status.
- Dates; time off adds the time sub-text.
- Days Used; time off shows "-".
- Remarks: **hidden if empty**.
- Supporting Document: the file name, tappable to preview and download. **Hidden if there is no file.**

**Additional information**
- Submitted On (date and time), always shown.
- Approved On / Approved By: only when Approved.
- Cancelled On / Cancelled By / Reason for Cancellation: only when Cancelled. The reason shows **"-"** if none was entered.
- Rejected On / Rejected By / Reason for Rejection: only when Rejected.

**Cancel button**
- Shown only when the status is Pending approval or Approved **and the leave dates have not passed**.
- Hidden (not disabled) otherwise.
- Offline banner as in §1.

## 3. Apply Leave (MOVE-4074)

**Page:** header "Apply Leave"; CTAs Cancel / Submit.

**Leave Type**
- Required dropdown.
- Only leave types the employee is eligible for.

**Start Date**
- Required.
- Any date inside the validity period, past dates included.
- **AM/PM selection.**

**End Date**
- Required, ≥ start date, with **AM/PM**.
- Time off: **disabled**, auto-filled = start date.
- Off-in-lieu: **"AM" disabled**.

**Time**
- Required, shown only for time off.
- A start–end time range picker with a max 2 h span.

**Leave Balance box** (Available / Deduction / Balance)
- **Hidden until all required fields are filled.**
- Shows a loading UI while calculating.
- **Not shown** for time off / unpaid / compassionate / NS leave (entitlement not applicable).

**Remarks:** optional, max 120 characters.

**Supporting Document**
- **Required** for Medical / Hospitalisation / Maternity / Paternity / NS leave; optional otherwise.
- PDF/JPG/PNG, max 5 MB, **one file only**.

**Submit**
- Creates the application as Pending approval.
- Success toaster "Leave submitted successfully." → back to Manage Leave.

**Missing required fields**
- Error toaster "Some required fields are missing. Please check and try again."
- Each field shows the error "[Field label] is required."

**Cancel:** nothing saved, back to Manage Leave.

## 4. Cancel Leave (MOVE-4075)

**Confirmation overlay**
- Text: "Are you sure you want to cancel this leave? You will not be able to revert this action."
- Buttons: Cancel / Confirm.

**Confirm**
- The user stays on Leave Details.
- Status becomes **Cancelled**.
- Cancelled On / By are added, and Reason for Cancellation shows **"-"**.

**Balance:** the days come off Pending Approval or Used.

## 5. Audit of the existing `Leave` section (`8515:13884`) against the 19 Oct tickets

Apply Leave, Time off frame (`8484:6623`):
- End Date is editable and set to a different date. The ticket says it must be disabled and equal to the start date.
- The leave balance box shows for time off. The ticket says it must not.
- There is no AM/PM control on Start/End Date.

Apply Leave, empty form:
- The balance box is visible before the required fields are filled. The ticket says it should be hidden.

Missing states:
- Apply Leave error state (field errors + error toaster).
- Success toaster back on Manage Leave.
- "No leave applications." empty state.
- The time-off card or detail with Days Used "-".
- An approved leave whose dates have passed (Cancel hidden).
- The cancelled result screen (status Cancelled, reason "-").
- The offline banner and pop-ups.

To check, not yet verified:
- Cancelled detail shows "Not inputted"; the ticket says **"-"**.

Figma comments on this section could not be read: the REST API returns 401, the same as before. Ask the user for the comment text instead of guessing.

## 6. User comments on the Leave section (read from the user's screenshots, 19 Oct 2026)

1. Leave Details, Time-off frame (`8484:6706`), from Westpoint Digital: "Daniel can show a example if there is time? so leave type is time off".
   - The time-off detail needs a time-range example: Dates sub-text "10:00 AM - 12:00 PM".
   - Days Used should be **"-"** (MOVE-4073), not "1 Days".
2. Apply Leave, Annual frame (`8484:6541`), from Westpoint Digital: "Daniel missing AM/PM option".

## 7. Fixes built in `Fixing` (`8590:7558`)

Restore point: "Before Driver Leave fixes in Fixing section (Claude, 19 Oct 2026)".

| Frame | What changed |
|---|---|
| `8600:143870` Apply Leave – Annual | AM/PM under Start and End Date (24 Jan AM – 25 Jan PM). To Deduct 2 days, Balance 6 days. |
| `8600:144068` Apply Leave – Time Off | End Date `State=Disable` and equal to Start Date, with AM/PM disabled. Time "10:00 AM - 12:00 PM". Balance box hidden. |

**Technique:**
- AM/PM is built from Integral **`RadioButton Atom`**, imported with `importComponentSetByKeyAsync('35ad146310d1343bcbdfc50e18479009bee255cf')`.
  - Selected = `Size=Medium, Type=Radiobox`; unselected = `Type=Default`; locked = `State=Disabled`.
  - `Type=Checked` is a checkmark, not a radio dot, so don't use it here.
  - Each date `Input` is wrapped in a vertical frame (gap 10) with an AM/PM row underneath (gap 24; option gap 8).
  - The labels use the form's own label font, 14 px.
- `ToastContainer` (`6de3b77adddf7d0f9bddac1d5ab6a6ce281b97bb`) also imports fine here. It has `State` Danger / Brand / Info / Success / Warning; use it for the success and error toasters.

## 8. Still to do

- Time-off text colour: "10:00 AM - 12:00 PM" still renders in the placeholder grey. Copy the fills from the Start Date value.
- Apply Leave:
  - Empty form with the balance box hidden.
  - Error state: field errors "[Field label] is required." + Danger toaster "Some required fields are missing. Please check and try again."
- Manage Leave:
  - Success toaster "Leave submitted successfully."
  - Empty state "No leave applications."
- Leave Details:
  - Time-off detail: Dates + time sub-text, Days Used "-".
  - Approved leave whose dates have passed: no Cancel button.
  - Cancelled result: Reason "-".
- Offline banner.
- Docs: titles, captions and notes.
