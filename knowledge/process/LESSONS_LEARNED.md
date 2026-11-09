# Lessons learned (read at the start of every session)

The user, 5 Nov 2026: *"jadikan setiap proses itu sebuah pembelajaran, ambil apa yang kamu bisa pelajari dan selalu simpan dalam sebuah file untuk kamu ingat"* ("treat every process as a lesson; take what you can learn and always save it in a file so you remember").

**Rule:** at the end of every task, add what was learned to this file in the same commit, newest first. A lesson is something that changes how the next session works: a reviewer's preference, a design rule, a tool gotcha, a mistake not to repeat. Topic-specific detail still goes into the topic file (`*_KNOWLEDGE.md`, `FIGMA_*`). Here, keep the one-line takeaway and a pointer to that detail.

## Review preferences (Daniel / PM, from Figma comments)

- **Don't repeat what other UI already says.** Examples:
  - Summary tiles above a list → put the counts on the filter tabs instead (PD Claims, 3 Nov).
  - An icon that is identical on every row → remove it (PD Claims, 5 Nov).
  - "+ Apply" next to an "Apply Leave" button → remove the extra entry (PD Leave, 3 Nov).
- **Cover every status in filters.** A status chip row needs all statuses the module has, including Rejected and Cancelled, each with a count (PD Leave, 3 Nov).
- **Show the example, not just the field.** When a field opens a picker (time, date, address), draw the open state too (Bus Booking 2.9 time picker, 4 Nov).
- **Think about scale.** Ask "what if there are more than 3?" before laying items out side by side; use a carousel or scroll row that visibly peeks (PD Leave balances, 3 Nov).
- **Value + subtext beats a joined string.** "18" with "20-seater bus" under it, not "18 · 20-seater bus" (Bus Booking, 4 Nov).
- **Labels follow the PM's #CR wording**, but fix the grammar ("Contact Informations" → "Contact Information") and say so in the reply.
- **A conditional field ("shown if X = Y") is hidden in the default / empty state too**, not only when another value is picked. Check every state, including "nothing selected yet" (Account Management create drawer, 6 Nov).
- **Fewer, shorter tabs don't stretch.** With 2 short tabs, size the tabs to their labels on the left and put the primary CTA on the tab row (Roles module pattern), not full-width tabs (Daniel, 9 Nov).
- **Sticky step headers** on long multi-step forms are expected. Draw the scrolled state (Bus Booking 2.8).

## Working with the user

- **Comments can be stale or made on the wrong file.** Never apply a comment blind: check the current frame and the current ticket first, and report the ones that were already done (user, 9 Nov).
- **When asked to "give notes" while fixing,** put a yellow `📝 Change note` frame under each changed frame (date, ticket, what changed and why).

- Reply in Bahasa Indonesia.
- "Update related screens too" is the default, even when unstated. Check sibling screens of the same style and flow, but don't touch other pages or styles unless they share the same element.
- **The user edits frames by hand between rounds** (e.g. removed Price Breakdown, the email row and a dropdown caret). Before editing, list the current children and respect what was removed. Never rebuild something the user deleted.
- A comment pin can sit on an area whose original issue was already fixed (it moves with the layout). Check the comment's date against the last round, and say "already done" rather than inventing a new change.
- Give the opinion first when asked ("bagaimana menurutmu?"), then build options on the work sheet, marking one as recommended.

## Figma bridge (Desktop Bridge, cloud mode)

- One file per pairing. Run `figma_diagnose` first: the bridge may still be on the previous file.
- Keep each call to **one frame**. Preload fonts once as plain `{family, style}`. A per-node `loadFontAsync(t.fontName)` hung the plugin three times (4 Nov).
- After a timeout, inspect before retrying: the call often finished anyway.
- Save a restore point (`saveVersionHistoryAsync`) before every round and name it in the reply.
- Details and older gotchas: `FIGMA_MOBILE_DESIGN_SYSTEM.md` §5.2, `FIGMA_DESIGN_SYSTEM.md` §4.

## Log

| Date | Task | Lesson |
|---|---|---|
| 9 Nov 2026 | AM comments made on the wrong file + ticket edits | Triage each comment against the **current** ticket: already done → ignore and report; new ticket edit → build; valid miss → fix. Then diff **all** epic tickets edited since the last round: the 6 Nov edits (stay on drawer after suspend, Activity rework) were bigger than the comments. Leave a visible change note under every touched frame when the user asks for traceability. |
| 8 Nov 2026 | Reorganise the knowledge base | Docs refer to each other by bare, unique file names, so folders can move freely. A checker script (`tools/check-knowledge.py`) proves nothing broke and no secrets slipped in. One component lookup (`COMPONENT_MAP.md`) replaces hunting through five docs. |
| 6 Nov 2026 | AM: is "access roles hidden by default" new? | No. MOVE-4450 had it since 15 Oct. We drew the empty state with the conditional fields visible. When a ticket says "shown if", apply it to the empty state as well. |
| 5 Nov 2026 | PD Claims Style 2: remove row icons | Identical icons on every row add nothing. The older "no need this" pin had already been fixed (tab counters), so it was reported, not re-done. |
| 4 Nov 2026 | Bus Booking CR round | Longer step labels broke the side-by-side stepper; labels under the dots fit 3 long steps in 358 px. The user's own deletions are intentional. |
| 3 Nov 2026 | PD Leave / Claims Style 2, Account quick actions | Labels wrapped because the columns hugged a 48 px icon. Make the columns equal-width (FILL) and the labels one line (HUG). Watch for typos in hand-made screens ("Contract Us"). |
| 3 Nov 2026 | Bus Booking build | When tickets contradict each other (sales address, button label), build one reading, record the conflict in CHANGELOG Open items, and ask the PM. |
