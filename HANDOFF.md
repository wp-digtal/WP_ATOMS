# HANDOFF: everything a new AI agent (or person) needs to continue this work

Last full update: **10 Nov 2026**. Update this file at the end of every session in which something below changes: a module's status, a new Figma file, a rule from the user, an open question.

The user said (10 Nov 2026): *"bangun hand off md … kalau nanti saya pindah AI tidak akan ada masalah yang terjadi … semuanya harus detail sangat detail untuk agent bisa memahami"*. This file is the single entry point. It summarises and points to the detailed docs; it does not replace them.

---

## 0. Read this first: the 15-minute start

1. Read this file top to bottom.
2. Read `CLAUDE.md` (repo root). It is the binding working agreement; the tooling and the nightly routine also read it.
3. Read `knowledge/README.md`, then `knowledge/process/LESSONS_LEARNED.md`. The lessons are the reviewer's preferences and every mistake made so far.
4. Before touching a module, read its KB in `knowledge/modules/` (table in §6).
5. Before touching Figma, read:
   - `knowledge/design-system/COMPONENT_MAP.md` for which component to use;
   - `FIGMA_DESIGN_SYSTEM.md` §4 (web) or `FIGMA_MOBILE_DESIGN_SYSTEM.md` §5 (mobile) for how to build without breaking the bridge.
6. Run `python3 -I tools/check-knowledge.py`. It must print `OK`.

**Language:** the user writes in Bahasa Indonesia (often informal, with typos). **Always reply in Bahasa Indonesia.** Repo docs, commit messages and Figma notes are written in English.

---

## 1. Who is who

| Person | Role | How they show up |
|---|---|---|
| **The user** (roy.technubi@gmail.com; works as "Daniel Roy" in Figma / Jira) | Product designer / design ops. Owns this repo and the Figma working files. | Sends Figma links, screenshots of comments, Jira keys, short instructions in Indonesian. |
| **Daniel** (PM / reviewer) | Leaves Figma comments ("#CR", "#Data", "squeezy", "missing filter"…) | Comments arrive as screenshots from the user. They can be stale or made on the wrong file (see §8). |
| **Denise T.** (product) | Sends product notes that can override tickets (e.g. PD notes of 16 Oct 2026). | Forwarded as screenshots. |
| **Westpoint Digital** (Jira account) | Edits the tickets. | Visible in the Jira changelog. |

The product is **ATOMS / WLA** (White-Label App) by Westpoint: bus operations, HR modules (Leave, Claims, Personal Dashboard, Account Management), Live Tracking, and the mobile Driver / Passenger apps.

---

## 2. What this repo is

- **A front-end-only prototype ("vibe coding") of ATOMS screens.** React 18 + TypeScript + Vite + Ant Design 5. There is no backend; data is in-memory mock data. Package name is `customer-contracts`.
- **The knowledge base for the design work.** Most recent work is in **Figma**, not code. The repo holds the docs, the rules and the record of what was done.
- Code layout: `src/components/<module>/`. Structure reference: `DEVELOPER_GUIDE.md`. Business rules per module: `knowledge/modules/CLAUDE_SESSION_CONTEXT.md`.
  - Modules in code include: `leave`, `hrclaims`, `claims`, `employeeportal` (Personal Dashboard), `personaldashboard`, `roster`, `livetracking`, `driverleave`, `invoice`, `contracts`, `notification`, `sales-module`.

### 2.1 Git rules (from `CLAUDE.md`, do not deviate)

- **Default branch:** `claude/magical-hamilton-RrDQJ`. There is no `main` or `master`.
- **Working branch:** `claude/frontend-duplication-export-ltxm0m`.
- After every commit, push to **both**:
  ```
  git push -u origin HEAD:claude/frontend-duplication-export-ltxm0m
  git push origin HEAD:claude/magical-hamilton-RrDQJ
  ```
- No pull requests unless the user asks.
- Commit trailer used in this project:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: <session url>
  ```
- **Every commit that changes something** carries:
  - a `CHANGELOG.md` entry, newest first under `## [Unreleased]`, with the ticket key and the *why*;
  - a dated row in the `LESSONS_LEARNED.md` log (one lesson per task);
  - a module KB update when frame ids or decisions changed.
- After editing docs: `python3 -I tools/check-knowledge.py`. After editing `COMPONENT_MAP.md`, add `--write`.

### 2.2 Code verification (only when code changes)

1. `npx tsc --noEmit` must be clean.
2. Verify in a browser:
   - start `npx vite --port 5199 --strictPort`;
   - drive it with a throwaway Playwright script, using `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`;
   - read the screenshots;
   - delete the script and kill the server.
3. Sweep for dead imports by hand. `noUnusedLocals` is off, so the compiler won't catch them.

---

## 3. Tools and access (what works, what breaks)

### 3.1 Figma: two MCP servers

| Server | Use it for | Notes |
|---|---|---|
| **Figma Desktop Bridge** (`mcp__Figma_Southleft__*`: `figma_execute`, `figma_capture_screenshot`, `figma_diagnose`, `figma_pair_plugin`) | **All writes and all screenshots.** Renders the user's live document. | **Cloud Mode: one file per pairing.** Always run `figma_diagnose` first and check the "Active file". If it's the wrong file or disconnected, call `figma_pair_plugin` and give the user the 6-character code (expires in 5 min). They open the target file in Figma Desktop → MCP Bridge plugin → ▶ Cloud Mode → enter code → Connect. The user often just says "generate pairing code". |
| **Official Figma MCP** (`mcp__Figma__*`: `get_metadata`, `get_screenshot`, `create_session`) | **Read-only** inspection, especially of big legacy files, or when the bridge is busy. | Call `create_session` with the fileKey first. Its screenshots can be stale; trust the bridge for current state. The REST token of the Southleft server is expired (403), so `figma_get_file_data` does not work. |

**Bridge survival rules.** These are learned the hard way; full list in `CLAUDE.md` and `FIGMA_DESIGN_SYSTEM.md` §4.14.
- **One small step per call:** one frame, one component, 2–3 frames for read-only text dumps.
- Never run `findAll` over a big section. In the PD file, Production has 195 children. Use `findAllWithCriteria({types:['TEXT']})` inside one frame, with `figma.skipInvisibleInstanceChildren = true`.
  - That flag is global and persists between calls. Set it to `false` when you need hidden layers.
- **Fonts:** load once as plain `{family, style}`. Never call `loadFontAsync(t.fontName)` per node; variation settings hang the plugin.
  - PD / AM files use: SF Pro (Regular, Semibold), SF Pro Text Regular, Inter (Regular, Semi Bold, Bold) and 42dot Sans Regular.
- `importComponentByKeyAsync` (library import) times out in the PD file. Clone an instance already in the file, or hand-build and name it `(hand-built, no <X> component found)`.
- **After a timeout, inspect before retrying.** The call often half-applied. Send `return 1` to see whether the bridge is alive.
- **`getNodeByIdAsync` on a node that was deleted from the canvas can hang the bridge** (PD file, 10 Nov 2026). If an id from the docs suddenly hangs, list the section's children by name instead.
- Before bulk edits: `figma.saveVersionHistoryAsync(title, description)`, then tell the user the title. Title format `Before <change> (<date>)`; **never the word "Claude"** in the title or the description (user, 10 Nov 2026). Saved versions can't be renamed via the API.
- Frames in HR / PD files are horizontal auto-layout. Overlays, toasts, tooltips and moved buttons need `layoutPositioning = 'ABSOLUTE'`.

### 3.2 Jira (Atlassian Rovo MCP)

- Site **westpoint**, cloudId **`e42e860c-a0bf-47e3-8f55-c39fb332b7c5`**. `technubi.atlassian.net` does **not** resolve. If unsure, call `getAccessibleAtlassianResources`.
- **Read-only. Never edit, comment on or transition tickets.**
- Ticket edits are mostly Jira reflowing its tables. To see real edits:
  - fetch `getJiraIssue` with `expand: changelog` (the result is saved to a file);
  - run `python3 -I tools/jira-desc-diff.py <file> <YYYY-MM-DD>`, which prints only real description edits.
- Many tickets show "updated" because of Sprint field moves (e.g. 6 Nov 2026 09:32–09:37: Sprint 28 ↔ 30). Those aren't requirement changes.
- **Copy master list** (Lark wiki) is not reachable. Copy that a ticket points to is written in Figma as `{{refer to copy}}` / `{{Refer to copy masterlist}}`; that is the house rule, not a gap.
- Jira attachments return 403. Ask the user for screenshots.

### 3.3 Scheduled routine (nightly Leave Jira watch)

- Scheduled task `trig_018QHwpUxTeLJFzyR8Twr95m` "WLA Leave — nightly Jira watch". It runs at 15:00 UTC (23:00 SGT) and starts a fresh session.
  - It reads the Leave epic MOVE-3410 and builds edits into `src/components/leave/`.
  - Watermark: latest `on:` in `src/components/leave/WhatsNew.tsx`.
- **Known problem (found 10 Nov 2026):** the task has **no connectors attached** (`mcp_connections: []`), and its last run finished in 12 seconds. Its preflight stops when Jira tools are missing, so it most likely does nothing every night.
  - Fix, if the user wants: re-create it from the claude.ai Routines UI with the Atlassian connector attached.
  - This is not fixed yet. Tell the user.

### 3.4 GitHub

- Repo `wp-digtal/wp_atoms` (also written `WP_ATOMS`). There is no `gh` CLI; use `mcp__github__*` tools if ever needed. Normally only `git push` is used.

---

## 4. Design systems: never mix them

| Surface | Design system | Docs |
|---|---|---|
| **Web** (HR modules, Ops, Account Management, Personal Dashboard, Live Tracking web, Fleet rebuild) | **COMPASS** (AntD-based, file `gbSCJ7q9FcMZsZ6d5dbrRN`) + **💎 ATOM – Business Component** library (`ZpEYnJ4POb86CDMAM3BWCG`: Side Navbar, Tab/Tab Group, FilterBar 3.0, HeaderWrapper …) | `FIGMA_DESIGN_SYSTEM.md`, `COMPONENT_MAP.md` §A (rows W01…) |
| **Mobile** (Driver app, Passenger app) | **🔥🛞 Integral** (`sTpe9MCcI0HQJMmzJnXKRl`). Roboto, primary `#17334f`, 390-wide frames, bottom tab bar | `FIGMA_MOBILE_DESIGN_SYSTEM.md`, `COMPONENT_MAP.md` §B (rows M…) |
| **Legacy** (e.g. WLA Fleet file) | Old system (`Page Wireframes` instances) | `COMPONENT_MAP.md` legacy → replacement table |

Component priority when building:
1. Clone a finished Production screen in the same file.
2. Use a local or business component in the file.
3. Use the library component.
4. Hand-build only as a last resort, and name it `(hand-built …)`.

---

## 5. Figma file registry

| File | Key | Where the work is | Status (10 Nov 2026) |
|---|---|---|---|
| 👩🏻‍🚀 Personal Dashboard (HR Module) | `1FCRdGhHru6czP5P6h06kH` | Page `🏭 Production` `23691:148675`. Section **Personal Dashboard** `41091:22331` (the PD build, 51 frames). Section `Old Leave` `29013:27819` holds the Leave-module reference drawers. **Exploration** section `41195:245231` (tab layout V1/V2/V3). | Comment rounds 1 + 2 done 10 Nov; full audit 10 Nov (§7.1). **V1 tabs applied 11 Nov** (46 frames); long arrows replaced by 15 numbered links (§13.5). |
| Account Management – HR Module | `kI1rSu1FAsPpV5K1EI2HvM` | Production 3.1 section `41137:17061`; exploration section `41137:62068`; 3.6 Deactivated drawer `41138:99426` | Full audit done 9 Nov. **V1 tabs applied 11 Nov** (31 frames, §16.1.1). PM questions open (MOVE-4458 / 4451). |
| 👩🏻‍🚀 Claim (HR Module) | `Gp7MfEP0XEv8YqZ9q474sj` | `🏭 Production` section `29013:27819` | Built and reviewed (Oct). |
| 👩🏻‍🚀 Leave – HR Module | `VYGulw8yaudo3FRAWh4sEh` | Real Leave epic screens | Reference. |
| 🛞📱 Mobile Apps Design | `IICHGFDHLhKCvE5vMzFokS` | Driver app (Leave, Claims, Account/Profile); Passenger app (Bus Booking `8763:16472`, reference `1643:2000`) | Bus Booking PM rounds 3–5 done (11 Nov: counter outside, Submit, alignment, label consistency; 10 Nov: Next button, no price on step 1, even stepper, Add-ons field, time picker, price on 3.1, collapsed 3.4 + 3.4b, ticket edits); Driver profile ideation done. |
| Live Tracking 2.0 – Ops Module | `XKD77FPEWx0wfQxxCWelfM` | Section `39646:74664` (web tracking links) | **Not started:** convert from mobile DS to COMPASS (asked 9 Nov). Needs pairing on that file. |
| 🚍 WLA: Operations – Fleet | `0wGJrFQ9M5p24utxxvlMY5` | Legacy. Only page `✏️ MOVE-600 Create Vehicle` has real UI; the other ticket pages are copied Sub-contractor placeholders. | Studied read-only 10 Nov. **Rebuild plan sent; waiting for the user's go-ahead and three answers** (`FLEET_KNOWLEDGE.md` §5). |
| 🧭 COMPASS DS 2.0 | `gbSCJ7q9FcMZsZ6d5dbrRN` | Library | Read-only reference. |
| 💎 ATOM – Business Component | `ZpEYnJ4POb86CDMAM3BWCG` | Library | Read-only reference. |
| 🔥🛞 Integral (mobile DS) | `sTpe9MCcI0HQJMmzJnXKRl` | Library | Read-only reference. |

Node ids go stale when people move or delete frames. **Resolve the user's link and list children before trusting an id from the docs.**

---

## 6. Module status board

| Module | Epic | KB file | Where | State and next step |
|---|---|---|---|---|
| **Personal Dashboard (web)** | MOVE-3412 | `PERSONAL_DASHBOARD_KNOWLEDGE.md` (§10 playbook, §13 comment rounds, §13.3 audit) | PD Figma section `41091:22331`; code `src/components/employeeportal/` | Audit 10 Nov found the items in §7.1. V1 tabs + numbered flow links done 11 Nov (§13.5). **Next:** the user decides which remaining audit findings to fix. Pay Slip tickets (3953/3954) are empty, so there is nothing to design. |
| Personal Dashboard (mobile ideation) | — | same KB §11 | Mobile Apps Design | Style 2 chosen; review rounds done. |
| **Account Management** | MOVE-4449 | `ACCOUNT_MANAGEMENT_KNOWLEDGE.md` §15–16 | AM file | Audited 9 Nov. Open PM questions: MOVE-4458 (tab label, sort, Before/After format) and MOVE-4451. |
| **HR Claims (web)** | MOVE-4021 | `CLAIMS_KNOWLEDGE.md` (**§6 = current file layout + fast path**), `CLAUDE_SESSION_CONTEXT.md` §9 | Claim file + `src/components/hrclaims/` | 10 Nov: empty-state comment solved, Remarks / Others ticket edits applied in Figma and code. Open: submit-success frame, disabled + tooltip example, highlight-active (ask first; the user removed some by hand). **Different module from PD Claims, never mix them.** |
| **HR Leave (web)** | MOVE-3410 | `CLAUDE_SESSION_CONTEXT.md`, `src/components/leave/WhatsNew.tsx` | Code + Leave file | Maintained by the nightly routine (see §3.3 problem). |
| Driver app Leave / Claims / Profile | MOVE-4113 | `DRIVER_LEAVE_KNOWLEDGE.md`, `CLAIMS_KNOWLEDGE.md` | Mobile Apps Design | Built. |
| Passenger app Bus Booking | MOVE-1963 (4569/4581/4582) | `BUS_BOOKING_KNOWLEDGE.md` | Mobile Apps Design `8763:16472` | Round 3 done 10 Nov (🟢 frames). Open: add-ons ticket conflict, Refund Policy + offline banner not designed. |
| Live Tracking 2.0 | MOVE-3676 (FMS MOVE-1685) | `LIVE_TRACKING_KNOWLEDGE.md` | Live Tracking file + `src/components/livetracking/` | Code done; Figma COMPASS conversion pending. |
| **Fleet** | MOVE-125 (+ CR MOVE-2543) | `FLEET_KNOWLEDGE.md` | Fleet file | Plan only. Old Figma predates MOVE-797 (listing) and MOVE-2554 (one-page form). |
| Roster | MOVE-3608 | `CLAUDE.md` Roster section | Code: `Roster4Page.tsx` is the PRD one | Stable. |

---

## 7. Open items (keep this list honest)

### 7.1 Personal Dashboard audit, 10 Nov 2026

**Fixed on 10 Nov (user picked #4, #5, #7, #9, #10, the ones that could mislead devs about logic):** see `PERSONAL_DASHBOARD_KNOWLEDGE.md` §13.4. Fixing #10 also fixed #1 ("31 Sep"). **Still open:** #2, #3, #6, #8, #11, #12, #13.

The user asked to re-check every screen against the tickets. Details are in `PERSONAL_DASHBOARD_KNOWLEDGE.md` §13.3. Short list:

**Bugs on the canvas**
1. Leave Balances shows "1 Sep 2026 – **31 Sep** 2026" (Custom Leave Type). The date is invalid, and it appears on every Leave page frame.
2. Cancelled leave drawer `41092:465601` has a leftover "1 month ago" under Reason for Cancellation.
3. Reject Leave, reason filled `41114:124024`: the label reads "Days Used"; everywhere else it is "Used".
4. Apply Leave Medical Leave `41195:181488` (made 10 Nov) shows Available **14** / Balance 12. The balances table says Medical has 9 left, so it should be 9 / 2 / 7.
5. Approved leave 18–22 Oct (`41092:457308`) is not in the Leave Applications table, and Annual "Used 3" doesn't include it.
6. Submit Claim filled (Toll 3 Oct, $3.50, SBS9012C, WP 7) doesn't match the resulting claim CL20260016 (19 Oct, $2.60, SBS5678B, WP 3).
7. Docs notes still say "Approvals keeps Remarks" (`41108:314352`). MOVE-3943's 6 Nov edit removed Remarks from both tables.
8. 18 `Docs/Notes` instances still carry the component's default date "24/04/2024".

**Missing coverage**
9. **"Claim Details (own) – Pending Payment, Cancel disabled + tooltip" (`41092:312075`) is gone from the canvas**, together with its flow label and change note. It existed on 10 Nov morning. Was it deleted on purpose? MOVE-3958 requires the disabled + tooltip state.
10. No example of a leave type with more than one validity period in the year (MOVE-3948 3.3: "1 validity period = 1 sub-row").
11. No empty state for the own Leave Applications table, nor for the My Claims / Claims Approvals tables. The tickets give no copy; it's a house-standard gap.

**Style inconsistencies**
12. The claim drawer's Cancel is red / danger; the leave drawer's Cancel is a grey secondary. Both tickets say "secondary CTA".
13. Claims tables write dates with a leading zero ("05 Oct 2026"); Leave and drawers write "5 Oct 2026".

**Decisions pending (from the user / product)**
- Tab layout: V1, V2 or V3 (exploration section `41195:245231`). Production currently has the CTA in the page header (V2 style) but the tabs still stretch.
- Orange notes `41116:147347` and `41116:147362`:
  - approver cards on Home;
  - whether a pending leave counts as My Next Leave;
  - empty-state copy;
  - the pay slip "Generated on" line;
  - the Time Off End Date lock.

**Confirmed OK in the audit:**
- Remarks removed from Approvals (MOVE-3943 6 Nov edit).
- Submit Claim CTA in the page header.
- Upload standard on Apply Leave and Submit Claim.
- Every filter popover has the ticket's fields.
- Leave Approvals empty-state copy matches MOVE-3948 exactly.
- Balance drawer has View Change History and no Edit.
- Approve / Reject disabled + tooltip states.
- Confirm stays disabled until a required reason is entered.
- 5 / page (Leave) and 10 / page (Claims).
- Tabs only for approvers.

### 7.2 Other modules

- **Fleet:** waiting for the go-ahead plus the answers to:
  1. Are the COMPASS / ATOM libraries enabled in the Fleet file?
  2. Highlight cards or quick-filter counts?
  3. Which flow comes first?
- **Live Tracking:** COMPASS conversion of section `39646:74664` not started.
- **AM:** PM questions on MOVE-4458 and MOVE-4451 (`CHANGELOG.md` Open items).
- **Nightly routine:** no Jira connector (§3.3).
- `CHANGELOG.md` has further "Open items" sections per module. Search for "Open item".

---

## 8. How the user wants work done (consolidated standing rules)

All of these come from the user and are binding. Sources: `CLAUDE.md` and `LESSONS_LEARNED.md`.

1. **Figma work means Figma deliverables.**
   - When the user gives a Figma link or says "kerjakan di figma", do the work in Figma, with no code substitute.
   - If the bridge isn't on that file, give a pairing code first and wait.
2. **Learn = write it down.** "pelajari / simpan / ingat" means write it into a repo `.md` in the same turn, then commit and push. Session memory doesn't count.
3. **Every task ends with a lesson** in `LESSONS_LEARNED.md` (dated log row, newest first).
4. **Change notes on every revision round.** **Since 10 Nov 2026 (user): mark every updated frame with a 🟢 prefix in its name, and use a GREEN note** (fill rgb(.9,.97,.92), stroke rgb(.13,.64,.35), plugin data `note=green`), so product can spot updates. The team deleted the earlier yellow notes after reading them, so don't recreate old notes. Yellow-note spec, kept for reference: Put a yellow `📝 Change note` frame directly under every changed or added frame, at y = frame bottom + 24.
   - Style: fill rgb(1, .957, .8), stroke rgb(.98, .68, .08), 2px, radius 10, padding 14/18, width 1440.
   - Text: Inter Semi Bold 20 title, Inter Regular 18 body.
   - Set plugin data `note=1`.
   - If a note already exists, append a dated block to it instead of stacking a second one. Also check for older notes that have no plugin data.
5. **Update flow labels and frame names** to match any change.
6. **End every round with a table** in Indonesian: what was updated, which frame, what changed. Also list comments that were already done and so ignored.
7. **Comments can be stale or on the wrong file.**
   - Check each comment against the current ticket and the current frame.
   - Done already → ignore it and report it.
   - New ticket edit → build it.
   - Valid miss → fix it.
8. **Re-read the tickets every time** (changelog diff, §3.2). Check related screens: a text or field change usually touches the page behind every drawer and modal too (e.g. 20 frames, not 4).
9. **Know what is standard.** House patterns:
   - upload stack = label + `Upload / Button` + "Maximum file size / Accepted file types" + uploaded-file card;
   - filter popovers;
   - page-level CTA in the page header;
   - drawers on a 40% overlay;
   - `{{refer to copy}}` for copy;
   - every filtered table gets a "filter open" frame;
   - every status gets its drawer state.
   If unsure, ask.
10. **"Same as module X" means clone X**, then remove what this context doesn't allow.
11. **Exploration goes in its own section**, with 2–3 variations, a pro/con note on each, and production left unchanged until the user picks.
12. **Save a restore point before bulk edits** and tell the user its title.
13. **Don't build a substitute and offer the real thing "next".** Ask instead.
14. **Every revision is standardised across all frames** that use the element, not just the one commented on.

Reviewer (Daniel) preferences are in `LESSONS_LEARNED.md` → "Review preferences". Examples:
- don't repeat information;
- drop squeezy columns;
- tabs hug their labels when there are only two short tabs;
- CTA outside the tabs;
- show the example state, not just the field.

---

## 9. Playbooks

### 9.1 Figma comment round (most common request)
1. `figma_diagnose`. If needed, `figma_pair_plugin` and give the code.
2. Read the module KB plus the latest tickets (diff since the last round).
3. Triage each comment: done / new edit / valid miss / unclear → ask.
4. Save a restore point.
5. Edit one frame per call, then screenshot and verify.
6. Apply the same change to every related frame.
7. Add change notes; update labels and names.
8. Update the KB section, `CHANGELOG.md` and the lesson; run the checker; commit; push both branches.
9. Report to the user in Indonesian with a table.

### 9.2 Ticket-vs-Figma audit
1. JQL `parent = <EPIC>`. For every ticket updated since the last audit, run the changelog diff.
2. Save the current descriptions (`getJiraIssue`, markdown) and make a requirement checklist.
3. List the section's frames by name (no deep `findAll`).
4. Dump the visible texts per frame, 2–3 frames per call, and check data consistency across frames.
5. Screenshot anything doubtful. Hidden layers inside instances can show up in text dumps (false positives).
6. Report findings grouped as bugs / missing / inconsistent / pending decisions. Fix only after the user agrees, unless the error is your own.

### 9.3 New module from a legacy file (e.g. Fleet)
- Study read-only first and write the KB.
- Send a plan.
- Build on a new page with COMPASS + ATOM components, one flow row at a time, following the `code-to-figma` skill's coverage checklist.

### 9.4 Code change
- Apply ticket edits to code first, then to Figma.
- Follow `CLAUDE.md` verification (§2.2).

---

## 10. Skills in this repo

- `.claude/skills/code-to-figma/SKILL.md`: the user's standard for pushing code or HTML into Figma. Covers:
  - coverage checklist;
  - layout as rows per flow, with captions and arrows;
  - docs and the report.
- `.claude/skills/figma-fidelity/SKILL.md`: checklist for building, editing or auditing against Figma. "Apply pattern X" means a full structural match, not a spacing tweak.

---

## 11. Glossary

| Term | Meaning |
|---|---|
| PD | Personal Dashboard: the employee's own Leave, Claims and Pay Slip area (MOVE-3412). |
| AM | Account Management (MOVE-4449). Replaces the old "staff" module. |
| HR module | The HR-side Leave / Claims modules (HR staff act on employees). Not PD. |
| Approver | An employee listed as someone's leave or claims approver. Only approvers see the "Approvals" tabs in PD. |
| COMPASS | Westpoint's AntD-based web design system. |
| ATOM Business Component | Shared web business components (nav, header, filter bar, tabs). |
| Integral | The mobile apps' design system. |
| Bridge / pairing | The Figma Desktop Bridge plugin connection (§3.1). |
| Restore point | A named Figma version made via `saveVersionHistoryAsync`. |
| `{{refer to copy}}` | Placeholder for copy owned by the Lark copy master list. |
| CR | Change request (ticket prefix, or a "#CR" comment). |
| KIV | "Keep in view": deferred, not to build. |
| MVP2 | Out of current scope. |

---

## 12. End-of-session checklist

- [ ] Figma changes verified by screenshot; change notes added; labels and names updated.
- [ ] Module KB updated (frame ids, decisions, open questions).
- [ ] `CHANGELOG.md` entry (ticket key + why).
- [ ] `LESSONS_LEARNED.md` log row.
- [ ] **This file updated** (status board §6, open items §7, file registry §5).
- [ ] `python3 -I tools/check-knowledge.py` → OK.
- [ ] Commit, then push to both branches.
- [ ] Reply in Indonesian with a summary table.
