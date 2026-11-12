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

Section `8763:16472` on page `🧔 Production - Passenger`. Restore point: "Before Bus Booking build (3 Nov 2026)". One row per flow, `Docs/Big Title` + white row notes + `Docs/Flow Label` per frame, orange arrows.

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

## CR round, Daniel (4 Nov 2026)

Restore point: "Before Bus Booking CR round (4 Nov 2026)". The user had already removed, by hand, the Price Breakdown card on 3.1, the price preview on 2.x, and row 4 (the emails). These were left removed, not rebuilt.

| Comment | Change |
|---|---|
| "would this be stick to the top?" (Daniel: "i plan yes") | New **2.8** `8802:20731`: the form scrolled, with the stepper pinned under the top bar on a white strip with a soft shadow. |
| "can show an example of the time picker?" | New **2.9** `8802:20902`: a bottom sheet "Select pick-up time" listing 15-minute slots. Peak slots carry a "Peak +S$20" tag, 08:00 AM is selected (blue row and check), and a note states the peak and midnight rules. Hand-built. |
| #CR "Trip Summary" on step 2 | Step 2 is renamed **Trip Summary** in every stepper (2.1–2.9, 3.1–3.3, 3.5). |
| #CR "Contact Informations" on step 3 | Step 3 and the page heading are renamed **Contact Information** (singular, the standard English form). |
| Passengers: "Passenger count, subtext: Bus size assigned" | On 3.1 (both trips) and 3.4, the value is the count "18", with "20-seater bus" as a 12 px subtext under it. |

The stepper now puts each label **under** its dot (12 px), with connectors that grow to fill the width. The longer labels no longer fit side by side in 358 px.

Labels and frame names were updated to match (3.1 Trip Summary, 3.2 / 3.3 Contact Information, Row 3 title).

## PM comment round 3 (10 Nov 2026)

Restore point: "Before Bus Booking round 3: add-ons field, time picker, price on summary, collapsible success (10 Nov 2026)". Every touched frame and its `Docs/Flow Label` carries a **🟢 prefix** (`HANDOFF.md` §8 rule 4). On the Flow Label, set **both** `States Name#59:0` and `Current Flow#44:4`: only `Current Flow` is the visible text.

| PM comment (Westpoint Digital) | Change | Frames |
|---|---|---|
| 2.9 "pls have a normal time picker … not limited to 15 min intervals" | The slot list is hidden. Instead there is a wheel picker (hour / minute / AM-PM) `8880:17837` showing 08:07 AM, with a helper line for the peak surcharge. | 2.9 `8802:20902` |
| "remove 'add-ons' from pick up point and drop off point … separate 'add-ons' field on its own" | Add-ons is now **one trip-level field** under the points, not one per point. The 2.3 sheet is titled "Add-ons" and includes WiFi Connection. | 2.1 `8763:17762`, 2.2 `8763:17192` (card `8880:8223`), 2.3 `8763:18025`, 2.5 `8763:18518`, 2.6 `8763:18780`, 2.8 `8802:20731`, 2.9 |
| 3.1 "price should be on this page" | The point-level add-ons lines are hidden, and trip-level Add-ons rows are added. A price card `8880:17880` (cloned from 2.5's) sits on the summary. | 3.1 `8763:19215` |
| 3.4 "trip card like before, but collapsed by default. Collapsed: Date, Time, Pick-up Point, Bus Size" | The trip cards are collapsible (wrap `8880:17922`, cards `8880:17924` / `8880:17941`). Under them: Grand Total and the "copy sent to email" note. A new frame shows the expanded state. | 3.4 `8763:19630`, **new 3.4b** `8880:17962` (Trip 1 expanded) + label `8880:18272` |

**Ticket edits applied in the same round** (diffed with `jira-desc-diff.py`):
- **MOVE-4581, 10 Nov:** the Contact Number field is removed from Contact Information. The input is hidden on 3.2 `8763:19377`, 3.3 `8763:19510` and 3.5 `8763:19714`.
- **MOVE-4569, 10 Nov:** the Copy Template button is removed, because "Email Sales Team" now opens the mail app with the template prefilled. Button `8763:16833` is hidden on 1.2 `8763:16719`. Frame 1.4 (the "Copied" toast) had already been removed by the user.
- **MOVE-4582, 10 Nov:** "ESTIMATED PRICE" becomes "PRICE". This affects the emails only, and those frames (row 4) were removed by the user on 4 Nov, so there was nothing to change.

**Conflict, ask the PM:** MOVE-4581's Trip Summary table and AC still say pick-up and drop-off "each have their own remarks and add-ons". The PM comment overrides that, so Figma follows the comment; the ticket should be updated to match.

**Not built yet** (from the 3 Nov edits to MOVE-4569 / 4581):
- the Refund Policy link and its overlay;
- the offline banner.

Frame 2.7 (address auto-complete) is gone too; the user removed it.

**Demo data is unchanged** (Changi T3 → Marina Bay Sands, 18 pax, 20-seater, Grand Total S$446.90). The 2.9 example time is now 08:07 AM, which shows that any minute can be picked.

## PM comment round 4 (10 Nov 2026, same day)

Restore point: "Before Bus Booking round 4 + PD mobile Claims/Leave content (10 Nov 2026)". Each changed frame has a green `🟢 Change note` under it, with plugin data `note=green`.

| Comment | Change |
|---|---|
| "pls standardise buttons. this button should be 'next' not 'confirm'" (step 1) | The primary button reads **Next** on every step-1 frame. Change it with the Button property `Input text#2053:13`. Frames 2.1, 2.2 and 2.8 already said Next. Changed: 2.3, 2.4, 2.5, 2.6 and 2.9. Frame 2.6 is renamed "Next with missing / invalid fields". |
| "pls remove estimated price from step 1 screen" | The `Price preview` card is hidden on 2.3, 2.4, 2.5, 2.6 and 2.9. Price now appears **only** on 3.1 Trip Summary. |
| User: stepper lines were uneven ("panjang line tidak sama") | Fixed on all 12 steppers: 2.1–2.6, 2.8 (×2), 2.9, 3.1, 3.2, 3.3 and 3.5. See the stepper rule below. |

**Stepper rule (hand-built `Stepper (hand-built)`):**
- Each `Step n` column is FILL width (358 / 3 ≈ 119 px) and centres its dot and label. Labels are centred, with an 18 px line height, so an active Bold label sits on the same baseline as the others.
- Each `Connector` is ABSOLUTE at y = 10. It runs from 19 px right of one dot's centre to 19 px left of the next dot's centre, so every line is 81 px.
- With HUG step columns, the line lengths depend on label width. Never go back to that.

## PM comment round 5 + consistency pass (11 Nov 2026)

Restore point: "Before Bus Booking round 5: counter, add-ons chips, alignment, Submit (11 Nov 2026)". Each changed frame's green note got an "11 Nov" line.

| Comment | Finding | Change |
|---|---|---|
| "character counter … faded grey? … in ATOMS the counter is outside of text area … mobile?" | Mobile already has the pattern: Driver Claims Remarks (`Input/Input Border Style`, hint) shows "26 / 240" **below** the input, left-aligned, faded grey #A7AAAC, Roboto 14. Bus Booking had "51/240" inside the box, dark grey, Roboto Medium 12. | All 18 counters (2.1–2.6, 2.8, 2.9) moved out of the textarea into the field group, styled like Driver: "51 / 240". |
| Add-ons as its own field | Already done in round 3. The chips are Integral `Chips/Normal` (Medium, Active, Info), the sheet uses `Checkbox Atom` + `Button`. | Nothing new. The labels are unified: **Add-Ons** / **+ Add-Ons** / **Total Add-Ons** (ticket casing). |
| 3.1 "alignment is off" (Pick-up Time) | The text was " Pick-up Time", with a **leading space**. The same stray space was on 21 "Pick-up …" labels across 2.x / 3.1. | The spaces were removed with `deleteCharacters(0,1)`, which keeps the red `*` styling. |
| 3.2 "should be 'Submit'" | — | The button on 3.2 / 3.3 / 3.5 now reads **Submit**. Frame 3.3's name and arrow names were updated too. |

**Consistency fixes in the same pass:**
- Labels are now "Pick-up Point Remarks" and "Drop-off Point Remarks" everywhere (2.1 had "Pick Up Remarks"; 2.2 / 2.8 had just "Remarks").
- "Return Trip" / "2 way" → **Return trip**, and the "Add a return trip" subline is hidden.
- 2.8's scrolled content moved up, so Cancel / Next clear the home indicator.

**Reported to the user, not changed (needs a decision):**
1. **Fonts.** Bus Booking headings and labels use **Inter** ("Trip 1", "Contact Information", "Enquiry sent!", textarea text). Driver Leave Apply Leave's balance card uses **42dot Sans** (5 frames, 15 texts each). Driver Claims has a few Inter texts. Integral is Roboto.
2. **Hand-built controls** where Integral has components: the Return-trip toggle and the quantity stepper (`◈ Toggle / Base`, `Quantity Field / Normal`; import timed out). The textarea has no Integral component. Driver uses the single-line `Input/Input Border Style` for Remarks, so passenger and driver Remarks look different.
3. 2.1 "Trip 1" heading is hidden (`8763:17800`), while every other 2.x frame shows it.
4. 3.1 still says "Estimated price" with an "Estimate" tag. MOVE-4582's 10 Nov rename to "PRICE" was for the emails.

Screenshots sent to the user: `scratchpad/audit/1…4-*.png`. The scratchpad is not in the repo; it is a session-only copy.

## Round 6: expand example + trip-card exploration (11 Nov 2026)

- **Comments could not be read through the API.** The Figma REST token fails (401 on `figma_get_comments`), so this round worked from the user's screenshots. Ask the user for screenshots, or a fresh token, whenever comments must be read.
- **PM: "display and example for expand"** (on 3.4).
  - 3.4b (`8880:17962`, Trip 1 expanded) already existed, but it sat after 3.5 with no arrow. It now sits **directly right of 3.4** (3700,4500), and 3.5 moved to 4600,4500.
  - The 3.2 → 3.5 elbow arrow `8763:20218` was extended (+900). The new arrow `8915:20260` 3.4 → 3.4b has the orange label "Tap a trip card to expand" (`8915:20261`).
  - The 3.5 note moved to y 5620, so the arrow no longer cuts through it. 3.4b has a green note `8915:20263`.
- **PM: "collapsed by default … messy and v hard to read".** At the user's request, this went into a separate area: section **`8915:20266`** "🧪 Exploration — Bus Booking success: trip card layout", at 26022,13403, right of the Bus Booking section. Each row is collapsed → expanded, with a note.
  - **V1, icon list (recommended)** `8915:20269` / `8915:20662`. The collapsed card shows only the 4 asked-for fields, one per line with an icon (calendar-stats, clock, map-pin, user glyphs). Expanded adds a divider plus label-above-value details.
  - **V2, 2×2 grid** `8915:20363` / `8915:20878`. Labels sit above values in two columns.
  - **V3, route style** `8915:20457` / `8915:21103`. Date · time on one line, a bus-size `Chips/Normal` (Neutral_1, Default, Small), and a pick-up ● → drop-off ● route when expanded.
  - Production 3.4 / 3.4b are unchanged until the PM picks one.
- **Why the current card reads badly:** label left / value right with long values. Right-aligned addresses wrap into ragged blocks, and the eye zig-zags. All 3 variants keep long text left-aligned.

## Round 7: Trip Summary per ticket + stepper exploration (12 Nov 2026)

**MOVE-4581 Part 2 (Trip Summary) table, as updated 11 Nov 14:30:**
- Date and No. of Passengers [bus size], both "per trip".
- Trip 1 card: Pick-up Time, Pick-up point, Drop-off point, Remarks, Add-ons, **Sub-total = rate (biz req #4) + add-ons**.
- Trip 2 (Return) card: the same, shown only when Return Trip is on, with the points reversed.
- Price card: **Total** = sum of the trip sub-totals, **GST (9%)**, **Grand Total**.
- Back / Next.

**PM: "can help me update the format based on the ticket?"** This was built in a new section **`8926:21322`** "🧪 Bus Booking · Trip Summary per ticket format" at 28382,13403. Production 3.1 is unchanged.
- **Frames:** return trip on `8926:21325`; one way `8926:21631`; mapping note `8926:21797`.
- **What changed from 3.1:**
  - Passengers now sits directly under Date.
  - Add-ons are listed as "item · price".
  - Each card has a divider plus a **Sub-total** row with a grey breakdown line, e.g. "S$150 (20-seater) + S$20 peak + S$70 add-ons".
  - The Price card is titled "Price" (the "Estimate" tag is hidden) and shows only Total (Trip 1 + Trip 2), GST and Grand Total.
  - Inter text was switched to Roboto in these cards.
- **Numbers:**
  - Return: Trip 1 S$240, Trip 2 S$170, Total S$410, GST S$36.90, Grand S$446.90.
  - One way: S$240 / S$21.60 / S$261.60.
- **Open for PM:** should Date / Passengers sit above the cards, as in the table's row order? They are inside each card here because the return date can differ.

**PM on the stepper:**
- "the '2' is not centered … 'contact information' is longer".
- "add some sort of differentiator for this form progress section (e.g. section bg colour) and/or more spacing … currently looks a bit cluttered".
- **Centring:** already solved on 10 Nov in Production. With 3 equal columns, step 2 sits at the exact centre.
- **Exploration section `8926:21800`** at 30342,13403, built from copies of 2.2:
  - **V1** `8926:21803`: a full-width band (#F3F5F7) under the top bar with a 1 px bottom border, like the sticky stepper in 2.8, and 24 px before the form.
  - **V2** `8926:21881`: a tinted rounded card (#ECF1F6, radius 12) inside the content, with extra spacing below.
  - **V3**: a compact version ("Step 1 of 3 · Trip Details · Next: Trip Summary" plus a 3-segment bar). Not built yet: the bridge dropped. `8926:21959` is still a plain copy of 2.2.

