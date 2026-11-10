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
- **Every status in the data needs its detail state.** If the listing shows a status (e.g. Deactivated), the drawer for that status must exist, with the ticket's allowed / disabled actions and tooltips (AM audit, 9 Nov).
- **"Same as module X" means clone X, not redraw it.** When a ticket says "exact same details and format as" another module, clone that module's real frame or drawer, then remove the actions this context doesn't allow and re-sync the data (PD balance drawer, 10 Nov).
- **Standardise a component across every frame that uses it**, not only the commented one: here, upload helpers were missing in 3 of 5 Apply Leave frames.
- **A page-level CTA sits outside the tabs, in the page header** (as on the Leave page). Don't put it in one tab's filter bar (Daniel, 10 Nov).
- **Drop low-value columns before a table gets squeezy.** Long free text (Remarks) belongs in the details drawer, not the listing (Daniel, 10 Nov).
- **Every table with a filter icon needs a "filter open" frame.** That means own vs. approvals tables (Leave History, My Claims), not just the first table on the page. The filter sets differ per table, so read each table's own query table in the ticket (Daniel, 10 Nov).
- **Sticky step headers** on long multi-step forms are expected. Draw the scrolled state (Bus Booking 2.8).

## Working with the user

- **Comments can be stale or made on the wrong file.** Never apply a comment blind: check the current frame and the current ticket first, and report the ones that were already done (user, 9 Nov).
- **Updates are marked green for product (user, 10 Nov):** a 🟢 prefix on every updated frame name plus a green note under it.
- **Change notes are the default on every revision round (user, 9 Nov, repeated 10 Nov).** Put a yellow `📝 Change note` frame under each changed frame with the date, ticket, what changed and why, and update the frame's flow label. The user should never have to diff frames by eye.

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
| 11 Nov 2026 | AM V1 tabs | Moving a CTA breaks every flow connector that starts at it. List the section's connectors by name ("Create Account button → …") and re-anchor their first vertices in the same round. When a comment in one file says "apply the same to module X", X can be a different Figma file. Say so plainly when asking the user to switch the plugin to another file, so they don't think the current file is being closed. |
| 11 Nov 2026 | Canvas labels on annotation frames | A frame placed directly on a page or in a section shows its **name on the canvas**. Small annotation frames (pills, badges) then carry grey "Link 6 · goes to" captions that confuse readers. Wrap annotations in a group: group names are not drawn. Also, confirm which file the bridge is on with `figma.root.name` before you start; the user said "connected" while the bridge was still on the previous file. |
| 11 Nov 2026 | PD V1 tabs + arrow cleanup | Flow arrows exist for developers. Long gutter arrows that cross each other defeat the purpose, so link distant screens with numbered badges and pills and keep arrows short. Moving a CTA also moves the arrow start points, so do the layout change first, then the arrows. A bulk change can expose an older duplicate (two cloned headers); sweep every frame for it afterwards. A frame screenshot hides section-level overlays; a temporary slice shows the area as it really looks. |
| 10 Nov 2026 | Restore point names | The user does not want the AI's name in anything the team sees in Figma, version history included. Saved versions cannot be renamed through the API, so naming mistakes are permanent unless the user fixes them by hand. Format: `Before <change> (<date>)`. |
| 10 Nov 2026 | BB round 4 + PD mobile content | Equal spacing in a stepper comes from **equal-width step columns** with absolutely placed connectors, not from HUG steps with FILL connectors (label width changes the line length). Some frames were already fixed by the designer ("missing from my end"), so check each frame before changing it. "Use the left design, align the content with the right" means keeping the layout and copying the data fields, wording and status colours. A per-node `loadFontAsync(t.fontName)` inside a loop timed out again; preload `{family, style}` once. |
| 10 Nov 2026 | Bus Booking PM round 3 | A PM comment can contradict the ticket (add-ons per point vs one field). Follow the newest instruction, and flag the ticket so it gets updated. Always diff the tickets in the same round: three edits from that very day (Contact Number, Copy Template, PRICE) were not in any comment. On `Docs/Flow Label`, the visible text is `Current Flow#44:4`, not `States Name#59:0`; check with a screenshot. |
| 10 Nov 2026 | HR Claims comment + re-check | A ticket edit can **remove** a rule; the diff shows it as `-` lines only. Removed rules leave stale copy in every frame, so search the texts for the old pattern (e.g. "Vehicle Licence Plate:"). A field's error look can be a direct stroke override, not a variant; reset strokes too when you make an empty state from an error frame. The quickest empty state is a clone of the "missing fields" frame with the errors reset. Apply ticket edits to the code as well, and verify them in the browser. |
| 10 Nov 2026 | PD audit fixes, green marker | The user wants updates marked for product: a 🟢 prefix on the frame name and a green note (`HANDOFF.md` §8 rule 4). Team members delete notes after reading, so check what is still on the canvas before appending. To add a row to a table inside a shared component instance, detach it **in the PD frames only**; editing the main component (52 instances, incl. Old Leave) would change other modules. After a detach, read the texts only after a screenshot has forced them to load. When fixing a data inconsistency, prefer pointing the odd frame at data that already exists (the approved leave in the table) over adding new data that ripples through every frame. |
| 10 Nov 2026 | PD full audit + HANDOFF.md | Re-read every ticket with a changelog diff. A memory or KB note can be **overturned by a later ticket edit**: Remarks on Approvals was "kept" on 16 Oct and removed on 6 Nov. Sprint moves make tickets look edited when they aren't. Text dumps can return hidden instance layers (a leave filter showed "Client Code"), so screenshot before reporting. Frames can disappear between sessions, and `getNodeByIdAsync` on a deleted id hung the bridge; list the section children by name to find what is missing. Check data consistency across frames, including your own new frames (my Medical Leave preview contradicted the balances table). |
| 10 Nov 2026 | Study legacy WLA Fleet file | Ticket-named pages in old files can be copy-paste placeholders (here every page showed Sub-contractors). Check what is on each page before trusting the page name. Compare the old screens with the **latest** CR tickets: the Figma is often older than them. In a big legacy file, `figma_execute` that touches `children` on unloaded pages times out; read pages with the official MCP `get_metadata` instead, and call `loadAsync()` per page in the plugin. |
| 10 Nov 2026 | PD round 2: CTA out of tabs, Remarks, upload | A page-level CTA lives in the page header, so swap in the sibling module's header component rather than restyling the old one. Do it on the page **behind** every drawer and modal too (20 frames, not 4). Hiding a column changes nothing in the filter popovers, but moving a filter-bar button does: absolute popovers anchored to the old position must be re-placed. Before creating a change note, look for an older note without plugin data, or the two will overlap. |
| 10 Nov 2026 | PD comment round | Cloned instance sub-layers keep the source state: the Upload button came over Disabled from the Empty frame. Reset states after cloning. Per-node `loadFontAsync(t.fontName)` timed out again; preload `{family, style}` once (SF Pro Bold / Semibold, Inter Regular in this file). |
| 9 Nov 2026 | AM full audit | Check frames programmatically: dump the table header texts, drawer cell label=value pairs and disabled states for every frame, then compare them with the ticket tables. This found the missing Deactivated state and a data mismatch that screenshots alone had missed. |
| 9 Nov 2026 | AM "pls check updated requirements MOVE-4458" on the old 'spec pending' frame | That comment was on a frame from the very first build. On Production 3.1 the Activity tab was already rebuilt to the 6 Nov ticket in the same session, so the answer is "already done", with a pointer to the frames. No rework. |
| 9 Nov 2026 | AM comments made on the wrong file + ticket edits | Triage each comment against the **current** ticket: already done → ignore and report; new ticket edit → build; valid miss → fix. Then diff **all** epic tickets edited since the last round: the 6 Nov edits (stay on drawer after suspend, Activity rework) were bigger than the comments. Leave a visible change note under every touched frame when the user asks for traceability. |
| 8 Nov 2026 | Reorganise the knowledge base | Docs refer to each other by bare, unique file names, so folders can move freely. A checker script (`tools/check-knowledge.py`) proves nothing broke and no secrets slipped in. One component lookup (`COMPONENT_MAP.md`) replaces hunting through five docs. |
| 6 Nov 2026 | AM: is "access roles hidden by default" new? | No. MOVE-4450 had it since 15 Oct. We drew the empty state with the conditional fields visible. When a ticket says "shown if", apply it to the empty state as well. |
| 5 Nov 2026 | PD Claims Style 2: remove row icons | Identical icons on every row add nothing. The older "no need this" pin had already been fixed (tab counters), so it was reported, not re-done. |
| 4 Nov 2026 | Bus Booking CR round | Longer step labels broke the side-by-side stepper; labels under the dots fit 3 long steps in 358 px. The user's own deletions are intentional. |
| 3 Nov 2026 | PD Leave / Claims Style 2, Account quick actions | Labels wrapped because the columns hugged a 48 px icon. Make the columns equal-width (FILL) and the labels one line (HUG). Watch for typos in hand-made screens ("Contract Us"). |
| 3 Nov 2026 | Bus Booking build | When tickets contradict each other (sales address, button label), build one reading, record the conflict in CHANGELOG Open items, and ask the PM. |
