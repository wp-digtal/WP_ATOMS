# ATOM Business Component file audit (24 Nov 2026)

File `ZpEYnJ4POb86CDMAM3BWCG` ("💎 ATOM - Business Component"). Pages:
- Tidy Up On Progress `0:1`
- Table `168:5996`
- Sidebar `215:1085` (empty)
- Guidance `34:12163`

**User rules for this round:**
- Change no component. Only tidy the layout.
- Merge the 4 pages into 1.
- Isolate the components that don't use COMPASS so the user can audit them.
- Call out the atomic ones.

## Inventory (33 components / sets)
**Atomic (small, single purpose):**
- Tab/Tab Item `240:15025` and `424:16514`
- Tab/Tab Group `240:15032` and `424:16506`
- Detail Drawer Status `42:12620`
- Content Type `68:22361`
- Title Detail Pages `31:25533`
- Content Cell `240:14314`
- Group Content Cell `240:14278`
- BusCom-Header Text `1:5560`
- BusCom-Details Button 2.0 `1:5676`
- BusCom-Details Action Button 2.0 `1:5656`
- Filter Selected 3.0 `40:15976`
- Table Header Buttons `44:28754`
- Custom Component `27:99304`

**Composite:**
- BusCom-HeaderWrapper `143:5467`
- BusCom-Detail Header Content `1:5587`
- Filter Bar 3.0 `21:9490`
- Table Filter Dropdown 2.0 `44:15720` and `424:16538`
- Table Filter with Buttons 2.0 `44:15777`
- Content Detail Pages `27:99317`
- Detail Page Template 2.0 `240:14948`
- Detail Pages Template – Old `27:101141`
- Drawers Template `240:14993`
- Sales/Row Content `240:14372`
- Date Selector `293:12713`
- Inspection Item `114:4957`
- Feedback `117:4961`
- GPS Tracking `136:5461`, GPS Tracking/Map `119:5562`, GPS Tracking/Bottom Panel `133:6423`
- Frontend Only App `227:16626`

**Duplicates (same name, two masters):**
- Tab/Tab Item
- Tab/Tab Group
- Table Filter Dropdown 2.0

## Library check (method)
For every top-level library instance inside each component, the component (set) **key** was compared with COMPASS keys returned by `search_design_system` restricted to the COMPASS library (`lk-d71fb0e8…`).
- Names alone are not enough: e.g. "Tag / Status" exists in 5 libraries.
- The file mostly uses same-named components from other libraries: "Components and styles", "ATOMS Design System (DO NOT TOUCH)", "Table Templates", "Details Templates".
- Examples:
  - Tag/Status `f3f4d98…` (not COMPASS `20e2672c…`)
  - Icon/EditOutlined `243ab6b3…` (not `caeae4e1…`)
  - Form Label Vertical `910d6343…` (not `d2001aa9…`)
  - Text, Button `da2f6b04…`, Avatar, Badge, Title, Input, Select Menu, Radio, Checkbox, Switch
- COMPASS keys found in use:
  - Form/Form Item/Vertical `0c33a938…`
  - Breadcrumb `545741c7…`
  - Button `300259f9…`
  - Icon/QuestionCircle `be46587c…`
  - Tag/Status `20e2672c…`
  - BC/Group Content Cell `3ea3fe2e…`

**Result (COMPASS / other-library top-level instances):**
- Mostly COMPASS: only **Frontend Only App** (30/2).
- Partly COMPASS:
  - Content Cell (9/6)
  - Sales/Row Content (30/220)
  - Table Filter Dropdown 2.0 `44:15720` (16/41)
  - BusCom-HeaderWrapper (7/24)
- **No COMPASS at all:** every other component that holds library instances.

## Tidy-up done (24 Nov 2026; user chose "3 zones by status")
Restore point: "Before tidy-up: merge pages + COMPASS zones (24 Nov 2026)". **No component was edited**; nodes were only moved.

**Pages:** one page left, renamed `💎 Business Components` (`0:1`). The Table, Sidebar (empty) and Guidance pages were removed after their content moved.

**Sections, stacked top to bottom with a 600 px gap:**
1. `443:73986` ✅ COMPASS · Composite: Frontend Only App.
2. `443:73987` 🟡 Mixed · Atomic: Content Cell.
3. `443:73988` 🟡 Mixed · Composite: HeaderWrapper, Table Filter Dropdown 2.0 `44:15720`, Sales/Row Content.
4. `443:73989` ⚠️ Non-COMPASS · Atomic. 14 components, including both duplicate Tab sets.
5. `443:73990` ⚠️ Non-COMPASS · Header, Filter & Date. Includes the duplicate Table Filter Dropdown `424:16538`.
6. `443:73991` ⚠️ Non-COMPASS · Detail Pages & Drawers.
7. `443:73992` ⚠️ Non-COMPASS · Operations: Inspection, Feedback, GPS.
8. `443:73993` 📎 Usage examples & working frames. Holds the non-component instances and sample screens from the old sections and from the Table and Guidance pages.

The 4 old sections (Business Component, Sales, Individual Component, Header Set Component) were emptied and removed.

## Additional-info frame (24 Nov 2026)

At the user's request, a reading frame `445:73994` ("🟢 ℹ️ Additional info — Components not using COMPASS") sits on page `0:1`, 400 px to the right of the zone sections. It is a plain frame, not a component.
- It lists the 33 components that are not fully COMPASS: ⚠️ 22 with no COMPASS, 🟡 5 mixed, ℹ️ 6 built only from local BCs or by hand.
- Each entry gives the non-COMPASS sub-components with instance counts, the COMPASS instance count, and the local BCs it is built from.
- It was generated from the key-based check (`mainComponent.parent.key` against COMPASS keys). Re-run that check before you trust it after library changes.
- Note: by key, Frontend Only App is mixed (it uses Anchor and Trip Form from another library), not fully COMPASS.

## Per-component info boxes (24 Nov 2026)

The user asked for a note next to every component that still uses an old library, so they don't have to inspect each one by hand. Restore point: "Before info boxes next to non-COMPASS components (24 Nov 2026)".

- **28 boxes**, each a frame named `ℹ️ Info — <component>`. Each box sits 40 px to the right of its component, inside the same section.
  - Red ⚠️: the component uses no COMPASS at all.
  - Yellow 🟡: the component mixes COMPASS with other libraries. Frontend Only App is one of these, even though it sits in the ✅ zone.
  - Blue ℹ️: the component is built only from local business components, or drawn by hand. It inherits the status of its parts.
- **What each box lists:**
  - the non-COMPASS sub-components, with instance counts;
  - the number of COMPASS instances;
  - the local business components it is built from;
  - a "Fix:" hint.
- **Layout changes:**
  - Each zone section was re-flowed into rows: component, box, then a 200 px gap. Rows wrap at 9200 px.
  - The sections were re-stacked with a 600 px gap.
  - The summary frame `445:73994` was moved to the right of the widest section.
- The boxes are a snapshot. After swapping a sub-component, re-run the key-based check and update or delete the box.

## COMPASS variants: ⚠️ Atomic section `443:73989` (24–25 Nov 2026)

The user asked for a new variant on each component, with the old sub-components swapped for COMPASS. They also wanted the old version kept.

**The pattern:**
- Every set gets a new variant property, `Library`.
- Each existing variant is renamed to `…, Library=Old` and left unchanged, so existing instances keep working.
- Each variant is cloned below as `…, Library=COMPASS`. Its sub-instances are swapped with `swapComponent`, matching by variant name first, then by the best-matching property set. Overrides survive the swap.

**Importing COMPASS sets:**
- `importComponentSetByKeyAsync` takes about 50 s the first time. Once one set is cached, the others take about 1 s.
- Set ids are saved in `figma.root` plugin data `compassSets`:

  | Set | Id |
  |---|---|
  | Button | `225:6126` |
  | Badge / Basic | `240:13049` |
  | Tag / Basic | `448:74203` |
  | Tag / Status | `240:10366` |
  | Avatar | `240:13061` |
  | Title | `225:5999` |
  | Dropdown Menu | `448:74230` |
  | Dropdown Menu Item | `240:11377` |
  | Dropdown Divider | `448:74222` |
  | Select Input | `227:12640` |

**Done:**
- Table Header Buttons
- Tab/Tab Item ×2
- Tab/Tab Group ×2: uses the local Tab Item with `Library=COMPASS`
- Detail Drawer Status
- Content Type
- Title Detail Pages
- Group Content Cell
- BusCom-Header Text
- BusCom-Details Action Button 2.0
- BusCom-Details Button 2.0
- Filter Selected 3.0

Custom Component is hand-built and has nothing to swap.

**Rules decided along the way:**
- The old `Text` and `Sub-header` components have no COMPASS equivalent. When they are top-level they are detached to plain text. Nested ones are left alone.
- The `Buttons` and `Table Header Button` wrappers are replaced by their inner Button, swapped to COMPASS Button.
- COMPASS `Tag / Status` only has Success / Processing / Error / Warning / Default. The mapping used is:

  | Old status | COMPASS status |
  |---|---|
  | Active | Success |
  | Suspended | Warning |
  | Pending Approval | Processing |
  | Pending Information | Default |
  | Deactivated | Error |

  The tag text is kept. Pair Old and COMPASS layers by **layer path**, not by list order: hidden tags shift the order, and the first attempt mislabelled the tags and an avatar.

**Open:** Group Content Cell still uses the local Content Cell from the 🟡 zone. Convert Content Cell next, then set it to `Library=COMPASS` here.

The info boxes in this section are now green ("✅ Library=COMPASS variant added"). Each box sits next to its set, and the section has been re-flowed.
