# Passenger app: Bus Booking (enquiry) knowledge base

Read this before any Bus Booking work. Written 3 Nov 2026 from the tickets (epic **MOVE-1963 "WL Mobile Apps: Passenger - Trips"**). All three were last edited on 2 Nov 2026.

- **Figma file:** 🛞📱 Mobile Apps Design (`IICHGFDHLhKCvE5vMzFokS`), page `🧔 Production - Passenger`.
  - Reference module (the whole passenger app): node `1643:2000`.
  - Work sheet: node `8763:16472`.
- **Design system:** Integral mobile DS only (`FIGMA_MOBILE_DESIGN_SYSTEM.md`). Never COMPASS.

## MOVE-4569 [P] Bus Booking Enquiry

- **Access:** from the dashboard bus booking card.
- **Page title:** "Bus Booking".
- **Info message:**
  - "This form is for point-to-point enquiries only, Bookings are only confirmed once the sales team replies by email and payment is arranged."
  - "For any other booking (multiple buses or multiple stops) must be emailed to the sales team."

**Actions**

| Label | Type | Rule |
|---|---|---|
| Submit Booking Form | Primary button | Goes to the booking form (MOVE-4581). Single point-to-point. |
| Email Sales Team | Secondary button | Opens the device mail app to sales@westpointbus.com, with the template prefilled. For multiple buses / stops. |
| Helper text | Text | "Need multiple buses or multiple stops? Email us using the template." |
| Copy Template | Secondary button | Copies the template and shows a "Copied" toast. |

**Template:**
- CUSTOMER: Name, Email, Contact.
- TRIP 1: Date, Pick-up time, Passenger size, Pick up point, Drop off point, Remarks.

## MOVE-4581 [P] Bus Booking Form

Header "Bus Booking Form". The form has 4 parts.

### 1. Trip details

| Field | Type | Required | Rule |
|---|---|---|---|
| Date | Date picker | Yes | From tomorrow (SGT); today and past disabled |
| Pick-up Time | Dropdown | Yes | Affects pricing |
| No. of Passengers | Number | Yes | Whole number, 1–49 (configurable). Above max: "For more than 49 passengers, please email our sales team." |
| Pick up point | Text, auto-complete (Google Maps) | Yes | Address name first, postal code second, SG first |
| Pick up point Remarks | Textarea | Optional | Max 240 |
| Drop off point | Text | Yes | |
| Drop off point Remarks | Textarea | Optional | Max 240 |
| Add-Ons | Button | Optional | Meet and Greet S$40 · Luggage Truck S$150 · Drinking Water S$15/carton (quantity stepper) · WiFi Connection S$50. Multiple allowed |
| 2 way | Toggle | Optional | Default off. On → return-trip fields |
| Return Date | Date picker | If 2 way | ≥ outbound date |
| Return Pick-up Time | Dropdown | If 2 way | If same day, later than the outbound time |
| Return No. of Passengers | Number | If 2 way | Same rule |
| Return Pick up point | Text | If 2 way | Auto-filled from the outbound Drop off |
| Return Drop off point | Text | If 2 way | Auto-filled from the outbound Pick up |
| Return remarks ×2, Add-Ons | | Optional | Same as outbound |

Totals: **Total** (trips + add-ons), **GST (9%)**, **Grand Total**. Then the **Confirm** button.

### 2. Review

Per trip: date, time, passengers, pick-up and drop-off, each with its own remarks and add-ons. **Price Breakdown** (marked as an estimate): base rate, peak / midnight surcharge, add-ons, Total, GST 9%, Grand Total. Buttons **Back** (secondary) and **Next** (primary).

### 3. About You

- **Name:** required, prefilled from the account.
- **Email:** required, prefilled. Format validated. It is the Reply-To on the sales email and the recipient of the acknowledgement.
- **Contact Number:** country code (+65 default) + number. Prefilled, format validated.
- Editing these does **not** change the account.
- Buttons **Back** and **Submit Enquiry**. Submit Enquiry is disabled until every required field is valid.

### 4. Result

- **Success:** "Enquiry sent! Our sales team will contact you via email to confirm your booking and arrange payment.", the trip summary, and a **Back to Home** button.
- **Error:** "Something went wrong. Please try again." and a **Retry** button. The entered data is kept.

### Pricing rules (per trip)

| Passengers | Bus | Rate |
|---|---|---|
| 1–13 | 13 seater | $110 |
| 14–20 | 20 seater | $150 |
| 21–23 | 23 seater | $160 |
| 24–40 | 40 seater | $200 |
| 41–45 | 45 seater | $220 |
| 46–49 | 49 seater | $240 |

- **Peak surcharge:** +$20 when the pick-up is 07:30–09:00 or 16:30–19:00.
- **Midnight surcharge:** +$30 for 23:15–06:00.
- Each trip is priced by its own start time. Example: a 13-seater with trips at 08:00 and 23:30 = $220 + $20 + $30 = **$270**.

## MOVE-4582 [P] Bus Booking Email (backend, sent on Submit)

**Sales email**
- To: sales@westpointbus.com.sg (configurable).
- From: verification@westpointbus.com.sg.
- Reply-To: the customer's email.
- Subject: `[Bus Enquiry] <Customer Name> <Date of Submission>`.
- Body: "New bus booking enquiry from the app.", then:
  - CUSTOMER block;
  - TRIP 1 table (Date / Pick-up time / No. of Passenger; Pick up point / Remarks / Add-ons; Drop off point / Remarks / Add-ons);
  - TRIP 2 table, only for 2-way;
  - ESTIMATED PRICE (Trip 1, Trip 2, Add-ons, Total, GST (9%), Grand Total);
  - "Submitted via the app on <timestamp>".

**Customer acknowledgement email**
- To: the email entered in the form.
- From: the system address.
- Reply-To: sales.
- Subject: `Westpoint [Bus Enquiry] <Customer Name> <Date of Submission>`.
- HTML body:
  - "Hi <Name>, Thank you for your bus booking enquiry…";
  - "IMPORTANT: Your booking is not confirmed yet… only confirmed once our sales representative responds… and payment… has been made.";
  - the same CUSTOMER / TRIP / ESTIMATED PRICE blocks;
  - "If you have any questions, simply reply to this email. Westpoint Sales Team".

**AC:** each trip shows the bus size. The price must match the preview the customer saw.

## Notes / inconsistencies spotted in the tickets

- **Sales address:** MOVE-4569 says sales@westpointbus.com; MOVE-4582 says sales@westpointbus.com**.sg**.
- **Button label:** MOVE-4569 AC says "Fill in Booking Form → Trip Details page", but the action table says "Submit Booking Form".
- **Pricing example:** the "Case 1/2" examples price a 2-way 13-seater as $220 (2 × $110).
- **Bus size:** the email AC asks for it, but the email table layout has no field for it.

## Figma build (3 Nov 2026)

Section `8763:16472` on page `🧔 Production - Passenger`. Restore point: "Before Bus Booking build (Claude, 3 Nov 2026)". One row per flow, `Docs/Big Title` + white row notes + `Docs/Flow Label` per frame, orange arrows.

| Row | Frames |
|---|---|
| 1 · Enquiry (MOVE-4569) | 1.1 Home `8763:16640` → 1.2 Enquiry page `8763:16719` → 1.3 mail app draft `8763:16910`; 1.2 → 1.4 "Copied" toast `8763:17024` |
| 2 · Trip Details (MOVE-4581) | 2.1 empty `8763:17762`, 2.2 one-way filled `8763:17192`, 2.3 Add-Ons sheet `8763:18025`, 2.4 date picker `8763:18261`, 2.5 2 way on `8763:18518`, 2.6 Confirm with errors `8763:18780`, 2.7 address auto-complete `8763:19018` |
| 3 · Review / About You / Result (MOVE-4581) | 3.1 Review `8763:19215` → 3.2 About You prefilled `8763:19377` → 3.3 invalid email, Submit Enquiry disabled `8763:19510`; 3.2 → 3.4 Success `8763:19630`; 3.2 → 3.5 Submit failed + Retry `8763:19714` |
| 4 · Emails (MOVE-4582) | 4.1 sales email `8763:19826`, 4.2 customer acknowledgement `8763:19952` |

**Demo data:** Marcus Geidt, marcusgeidt@email.com, +65 2421 2412. 20 Nov 2026, 18 passengers (20-seater). Trip 1 08:00 AM Changi Airport T3 → Marina Bay Sands; Trip 2 05:30 PM back. Add-ons Meet and Greet S$40 + Drinking Water ×2 S$30. Each trip S$150 + S$20 peak = S$170; Total S$410, GST S$36.90, Grand Total S$446.90.

**Design calls made (not in the tickets):**
- Confirm on Trip Details stays enabled and validates on tap (2.6). Only Submit Enquiry is disabled until valid, as MOVE-4581 says.
- The submit error (3.5) is shown as a red banner on About You, so the data is visibly kept, with Retry replacing Submit Enquiry.
- Success (3.4) repeats "not confirmed yet" in a warning note, matching the acknowledgement email.
- The emails carry a **Bus size** row per trip (MOVE-4582 AC), although the ticket's table layout has no such row.
- The emails use sales@westpointbus.com**.sg**, as MOVE-4582 says; the Enquiry page's mailto still follows MOVE-4569 (.com). Open question for the PM.
- The acknowledgement "From" is shown as `noreply@westpointbus.com.sg (system address)`. The ticket only says "system address".
