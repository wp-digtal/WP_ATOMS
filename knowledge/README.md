# Knowledge base: start here

Everything a session (or a person) needs to work on this product fast. Session memory is lost between sessions; this folder is the memory.

## Folders

| Folder | What's in it | Read it when |
|---|---|---|
| `process/` | `LESSONS_LEARNED.md`: reviewer preferences, working rules, tool gotchas, a dated log | **At the start of every session**, and append to it after every task |
| `design-system/` | `COMPONENT_MAP.md` + `component-map.json` (**the lookup**: element → real component → where → how → legacy replacement)<br>`FIGMA_DESIGN_SYSTEM.md` (web / COMPASS: files, tokens, house patterns, bridge techniques §4)<br>`FIGMA_MOBILE_DESIGN_SYSTEM.md` (mobile / Integral: anatomy, tokens, components, fast-build tips §5.2)<br>`FIGMA_COMPONENT_INDEX.md` (code → Figma: which frames and components each screen of the app was pushed to) | Before building, editing or tidying **any** Figma screen |
| `modules/` | One file per module: `ACCOUNT_MANAGEMENT_`, `BUS_BOOKING_`, `CLAIMS_`, `DRIVER_LEAVE_`, `LIVE_TRACKING_`, `PERSONAL_DASHBOARD_KNOWLEDGE.md`, plus `CLAUDE_SESSION_CONTEXT.md` (web app business rules) | Before touching that module: ticket rules, frame ids per state, decisions, open questions |

Kept at the repo root on purpose (tooling and the nightly routine read them there): `CLAUDE.md` (working agreement), `CHANGELOG.md` (what changed and why, plus Open items), `DEVELOPER_GUIDE.md` (code structure), `tools/` (scripts).

## Read order for a Figma task

1. `LESSONS_LEARNED.md`
2. `COMPONENT_MAP.md`: which component for each element
3. The module KB: rules and the existing frame ids
4. `FIGMA_DESIGN_SYSTEM.md` §4 or `FIGMA_MOBILE_DESIGN_SYSTEM.md` §5: how to build without breaking the bridge
5. The skill: `.claude/skills/code-to-figma` (push to Figma) or `figma-fidelity` (match Figma)

## Moving this folder safely

- **Links are by file name, not path.** Docs mention each other as `NAME.md`, and every name is unique, so you can move a file between sub-folders, or move the whole `knowledge/` folder, without breaking anything.
- After any move or edit, run:

  ```
  python3 -I tools/check-knowledge.py           # missing references, duplicate names, secrets, map in sync
  python3 -I tools/check-knowledge.py --write   # after editing COMPONENT_MAP.md, regenerates component-map.json
  ```

- **No secrets live here.** The checker scans for tokens, keys and passwords. Figma / Jira access comes from the session's connectors, never from these files. Demo data (names, emails like marcusgeidt@email.com) is fictional.
- **Taking it to another project:** copy `knowledge/`, `tools/check-knowledge.py`, `tools/jira-desc-diff.py` and `.claude/skills/`. Then take the working rules (bridge, branches, changelog) out of `CLAUDE.md` into the new project's own `CLAUDE.md`.
- **Node ids are per Figma file and can go stale** when someone moves or deletes frames. Before editing, resolve the user's link and list the children; don't trust a stored id blindly.

## Keeping it alive

- After every task:
  - add a lesson to `LESSONS_LEARNED.md`;
  - update the module KB (frame ids, decisions);
  - when a new component is used, add a row to `COMPONENT_MAP.md`, then run the checker with `--write`.
- `CHANGELOG.md` gets an entry in the same commit.
