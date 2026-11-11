# Component map: one table for every Figma component we use

**Purpose:** the single lookup to use before building or **tidying up an old design**. For any element on a screen it answers:
- which real component it should be;
- where that component lives;
- how to set it;
- what it replaces.

The machine-readable twin is `component-map.json` (same rows). Keep both in step; `tools/check-knowledge.py` checks that they have the same row ids.

Sources: the details behind each row are in `FIGMA_DESIGN_SYSTEM.md` (web, §3–§4), `FIGMA_MOBILE_DESIGN_SYSTEM.md` (mobile, §4–§5), `FIGMA_COMPONENT_INDEX.md` (code → Figma per screen) and `PERSONAL_DASHBOARD_KNOWLEDGE.md` §9 (PD business components). Section numbers are given in the **Ref** column.

**Rules that apply to every row**
1. **Never mix systems.** Web (HR modules, Ops, Live Tracking web) uses **COMPASS** (AntD-based) and the file's own business components. Mobile (Driver / Passenger apps, file `IICHGFDHLhKCvE5vMzFokS`) uses **Integral**. A web tracking page viewed on a phone is still **web → COMPASS**.
2. **Priority order when picking:**
   1. a finished Production screen in the same file (clone it);
   2. a local / business component in the file;
   3. the library component (COMPASS or Integral);
   4. hand-built, named `(hand-built, no <X> component)`.
3. **Ids are per file.** A node id (`1234:5678`) is valid only in the file named in the row. A **key** (40-hex) works across files with `importComponentByKeyAsync` / `importComponentSetByKeyAsync`, but imports often time out. Prefer copying an instance that's already in the file.
4. Change **variants and properties**, never raw colours. Bind colours to the DS variables (COMPASS "1. Colors", Integral "Colors").

---

## A. Web: COMPASS + ATOM business components

| Id | Element | Component | Where (file · node / key) | How to set | Ref |
|---|---|---|---|---|---|
| W01 | Side navigation | `Side Navbar` | ATOM Business Component `ZpEYnJ4POb86CDMAM3BWCG` · `425:16539` | Clone from a Production frame | DS §3, Index |
| W02 | Page tab bar | `Tab/Tab Group` | ATOM Business Component · `424:16506` | Equal-width items; code `PageTabs` | DS §3 |
| W03 | Table toolbar (search, filters, date) | `FilterBar 3.0` (composable row) | ATOM Business Component · `21:9490` | Compose the slots, see §3.2 | DS §3.2, §4.5 |
| W04 | Data table | `Table` → `Header Row` + `Row n`, cells `Table / Table cell` | Leave HR file `VYGulw8yaudo3FRAWh4sEh` · `41042:54541`; also in every Production listing | Widths must sum to the table width; the table repeats behind every drawer, so edit all copies | DS §3.3, §4.10 |
| W05 | Status tag | `Tag / Status` | Instances in Production frames | `Status` variant (Default = grey "Cancelled"); for Active / Suspended swap to the drawer tag's main component, `Select#…` off | DS §4.10, §4.17 |
| W06 | Form field (text, select, date, phone, textarea) | `_Form / Form Item / Vertical` | COMPASS `gbSCJ7q9FcMZsZ6d5dbrRN` · page `388:11438` | `Type` variant; `State: Filled` for values in black; phone = `Type=Phone`, inner `Input / Pre Post Tab` `Size: Default`, `Post Tab: No`, `Pre Tab Text` "+65"; full width 620 / half 302 | DS §4.4, §4.11 |
| W07 | Multi-select | `_Select / Select Input` | in Form Item | `Type: 'Multiple'`, rename tag texts, hide spare tags | DS §4.11 |
| W08 | Field label | `_Form / Form Label Vertical` | in Form Item | `Mark=Required` for `*` | DS §4.8 |
| W09 | Field error | `_Input / Input Caption` | in Form Item | `Caption#515:251=true`, `Status: Error`, text `{{refer to copy}}` | DS §4.11 |
| W10 | Textarea | `Input / Textarea` | in Form Item | `Show Count#5012:0` on; max = the ticket's max length; no error variant, so use a red stroke `#ff4d4f` + caption | DS §4.8, §4.11 |
| W11 | Upload | `Upload / Button` + file row + 2-line helper | Claim HR file `Gp7MfEP0XEv8YqZ9q474sj` | Not `Upload / Drag and Drop`; size and types from the ticket | DS §4.8 |
| W12 | Time / date picker open | `TimePicker Menu` (hidden inside the picker) | in Form Item | Clone to the frame top level, 4 px under the input, `State=Focused` | DS §4.8 |
| W13 | Drawer (create / edit) | `Drawers Template` (via `Create Leave Type`) | Account Mgmt `kI1rSu1FAsPpV5K1EI2HvM` · overlay `39283:130365` | Detach, empty `Frame 2608909` (WRAP, gap 16), add Form Items | DS §3.4, §4.11 |
| W14 | Drawer (details) | `Drawers Template` → `RT-Details Content Sub-Section`, `Content Cell` / `Group Content Cell` | Account Mgmt · overlay `39283:110677` | `Label#15150:33` / `Value#15150:39`, `Line '2'`; full width = `Item '1', Column '1'` | DS §3.4, §4.3, §4.11 |
| W15 | Drawer header + actions menu | `BusCom-Header Text`, `BusCom-Details Button 2.0`, `BusCom-Details Action Button 2.0` | Account Mgmt Production | `First Status#9045:7`; `Show Action#11657:6`; menu items `State` Disabled / Hover | DS §4.11 |
| W16 | Confirm / reason modal | Reject Leave overlay | Account Mgmt · `39312:45655` | Body copy `{{copy to master}}`, real title | DS §4.8, §4.11 |
| W17 | Toast | `Toaster Pop-up Message` | Production instances | Variants `Module=Staff` (Create / Edited / Deleted / …); set `children[0].visible = true`, centre at y 24 | DS §4.9, §4.11 |
| W18 | Empty state | `Empty / Image` | COMPASS set key `ac29cc9196a4854e88f97e0fb812a26009c5a6c3`; variant key `a03cfe16d7afb97975743504256e318ba445c2d5`; Claim HR main `43115:433553` | `Image=1`, `rescale(67/184)` → 67×43, grey 14 px text under it | DS §4.10, §4.11 |
| W19 | Tooltip | `Tooltip` | COMPASS set key `f5c249bb07d798357029189e660d54f795b5759c`; local copy in Account Mgmt `29009:28743` | Import times out; use the local copy | DS §4.11 |
| W20 | Highlight / KPI card | `Highlights Card` | Claim HR · `43114:431210` | `Title` `Level=2` count; active = blue stroke + label | DS §4.10 |
| W21 | Filter popover | `Table Filter Dropdown 2.0` / `Table Filter with Buttons` | Production | Overlay a detached copy (don't detach the toolbar); **no placeholders** inside | DS §4.8, §4.11 |
| W22 | Select menu / ⋯ menu | `_Select Menu / Select Menu Item` | Live Tracking `XKD77FPEWx0wfQxxCWelfM` · `39156:37134` | Item `State=Hover` for the click | DS §4.9 |
| W23 | Switch | `Switch / Basic` | Live Tracking Production | — | DS §4.9 |
| W24 | Button (web) | COMPASS `Button` | Production instances | `Type` Primary / Default / Danger; `Size=Small` for inline actions (e.g. Copy, Navigate here) | DS §3, Live Tracking KB Round 5 |
| W25 | Map | `Map` | Live Tracking · `39048:40152` | `Property 1` Default / Zoomed; bus layer `;39048:39923` | DS §4.9 |
| W26 | Canvas docs | `Docs/Big Title`, `Docs/Flow Label`, `Docs/Notes` | in each file | Flow Label `Parent Flow#44:0` → `Current Flow#44:4`; 900 px column pitch for 390 frames | DS §4.9, §4.12–4.13 |
| W27 | PD business components | `PD/Recent Activity Card`, `PD/My Next Leave Card`, `PD/Home Leave Balances Card`, `PD/Leave Balance Preview`, `PD/Confirm Modal`, `PD/Empty State (text)`, `PD/Tooltip (hand-built)`, `PD/Leave Date Range + Half Day` | Personal Dashboard `1FCRdGhHru6czP5P6h06kH` · page `41116:149163` (draft, not swapped yet) | See the variants in the PD KB | PD KB §9 |

## B. Mobile: Integral (Driver / Passenger apps)

All rows: file `IICHGFDHLhKCvE5vMzFokS` unless stated. Library: Integral `sTpe9MCcI0HQJMmzJnXKRl`.

| Id | Element | Component | Where (node / key) | How to set | Ref |
|---|---|---|---|---|---|
| M01 | Button | `Button` | key `e23481ef886cdb5784d2b9c331b6033ad06e1f29`; in-file `8524:13715` | `Type` Primary / Outline Brand / Outline Neutral / Danger …; `Size` (Passenger uses Small); `State=Disable`; text `Input text#2053:13` | Mobile §4.1, §5.2 |
| M02 | Input (text / select / date / password) | `Input/Input Border Style` | key `a8cb449ec465144fc3fb88a553f505b163cc6297`; in-file `1643:12963` | `Variant` Icon / Password / Country Code …; `State` Default / Filled / Error / Typing; label = `Label#8293:122` (set it once: it's bound); hint `Hint#8293:244` | Mobile §4.1, §5.2 |
| M03 | Phone input | `Input/Input Border Style` `Variant=Country Code` | `5869:5843` | Label prop is `Label‎ #8293:183` | Mobile §5.2 |
| M04 | Chip / status pill | `Chips/Normal` | key `e5bd12e21ff41a0bd19c67a09e3142aed6062c6e`; in-file `8524:13657` | `Variant` Neutral_1/2, Success, Warning, Danger, Info; `Size`; `States` (Cancelled = `Neutral_2` + `Default`); text `Text#10472:0`; then `layoutSizingHorizontal='HUG'` | Mobile §4.1, §5.2 |
| M05 | Leave status badge | local `Status` set | `8197:21408` | `Property 1` Rejected / Cancelled / Pending / Approved | Mobile §4.2 |
| M06 | Icon | `Icon Wrapper` / Tabler glyph components | glyph ids: `map-pin` 233:2403, `chevron-down` 857:6904, `chevron-right` 857:9410, `mail` 857:6902, `phone` 1261:5122, `user` 210:2942, `check` 857:22463, `calendar-stats` 2589:8943, `clock` 829:6105, `receipt` 8523:13310, `note` 203:2096, `book` 1316:9395, `arrow-left` 1213:1297 | `createInstance()`; recolour the strokes with a bound paint | Mobile §4.1, §5.2 |
| M07 | Upload | `Upload File` | key `86e1c0b18c62e0e552c4ba4c0e6751f6464d6a34` | `State` Default → Uploading → Success / Failed | Mobile §4.1 |
| M08 | Toast | `ToastContainer` | set key `6de3b77adddf7d0f9bddac1d5ab6a6ce281b97bb` | Import **times out** here → hand-built Success toast; one-line: `Subtitle#12467:30=false`, `Call to Action Box#12493:0=false`, 358 wide, x 16 y 52 | Mobile §4.1, §5.2 |
| M09 | Empty state | `Empty State` | set key `8f7e8d9772a307e793c18109f0bc3d3d4c7b34dc` | `Variant=Vertical`, `Show buttons#12148:6=false` | Mobile §4.1 |
| M10 | Radio / checkbox / toggle | `RadioButton Atom` (key `35ad146310d1343bcbdfc50e18479009bee255cf`), `Checkbox Atom`, `◈ Toggle / Base` | — | Radio: `Type=Radiobox` = selected. Checkbox: `Checked=True` needs `Type=Checked` | Mobile §4.1 |
| M11 | Modal | `Modal Basic` / `Modal Pre Build` | library | Body `{{copy to master}}` | Mobile §4.3 |
| M12 | Status bar / top bar / home indicator | Production shell parts | status bar `5455:10243` / `8524:13533`; top bar `5455:10256` (hide `Frame 1410126690`) or `8524:13632`; home indicator `8524:13554` | Pushed pages: white, back arrow + SemiBold 16 title, no tab bar | Mobile §2, §5.2 |
| M13 | Bottom tab bar | hand-built gradient bar | `8524:13556` | Only on top-level screens; never on pushed pages (PD, Bus Booking) | Mobile §2, PD KB §11.2 |
| M14 | Text styles | clone a styled text node | `8524:13462` h16, `8524:13471` l12, `8524:13472` b14, `8524:13514` m14, `8524:13549` t16, `8524:13553` n18, `8524:13560` / `8524:13563` white | Set `textAlignHorizontal` explicitly; `HUG` before `WIDTH_AND_HEIGHT` | Mobile §5.2 |
| M15 | Colour variables | Integral "Colors" | name → id map in plugin data `vars` on sections `8725:7951`, `8763:16472` | `setBoundVariableForPaint`; `border4` not imported | Mobile §3.1, §5.2 |
| M16 | Local cards | `Leave Card` `8197:21416`, `Trip Details` `5149:9376`, `Component 21` `2786:16994`, sidebar menus `8188:15259` / `8188:6586` | — | — | Mobile §4.2 |
| M17 | Stepper (multi-step form) | hand-built `Stepper (hand-built)` | Bus Booking frames, section `8763:16472` | Dot above, label below (12 px), connector frames `layoutGrow=1`; done = success dot ✓, active = brand | Bus Booking KB |
| M18 | Bottom sheet (picker / add-ons) | hand-built `Bottom sheet · …` | Bus Booking 2.3 / 2.4 / 2.9 | Overlay rect + sheet pinned to the bottom (`y = 844 − h`) | Bus Booking KB |
| M19 | Textarea + character counter | hand-built `Textarea (hand-built; no Integral textarea)`. The counter sits **outside**, as a separate text under the box | Bus Booking 2.x; reference Driver Claims Remarks `8545:15290` (`Input/Input Border Style`, hint "26 / 240") | Counter: Roboto Regular 14, line-height 20, fill #A7AAAC, left-aligned, format `n / max` with spaces | Bus Booking KB round 5 |
| M20 | Toggle / quantity stepper | Integral `◈ Toggle / Base` (set key `d0845d17456eaac3dad7ef42ac210c7bbe75e774`), `Quantity Field / Normal` (set key `3d604d0166d2a51d0436edb08bb4c98e900d5235`) | not used in the file yet; Bus Booking still uses `Toggle off (hand-built)` / `Quantity stepper (hand-built)` | `importComponentSetByKeyAsync` **timed out** (60 s, 11 Nov). Copy-paste an instance from the Integral file into Mobile Apps Design first, then swap the hand-built ones | Bus Booking KB round 5 |

---

## C. Legacy → replacement (use when tidying old designs)

When asked to tidy up an old design, every element found in the left column gets swapped for the right column. Record each swap in the topic KB.

| Legacy pattern seen in old frames | Replace with | Notes |
|---|---|---|
| Hand-drawn rectangles posing as buttons | W24 (web) / M01 (mobile) | Keep the label; choose `Type` by role (primary action = Primary) |
| Text + rectangle "input" | W06 / M02 | `State=Filled` for sample values |
| Raw hex fills (`#17334f`, `#1677ff`, greys) | Bound DS variables | COMPASS "1. Colors" on web, Integral "Colors" on mobile |
| Integral parts inside a **web** page (e.g. web tracking) | COMPASS equivalents (`FIGMA_MOBILE_DESIGN_SYSTEM.md` §4.3 in reverse) | Live Tracking web pages are the open case |
| Coloured rounded label as status | W05 / M04–M05 | Status colours from the module KB |
| Grey tray drawn by hand for "no data" | W18 / M09 | — |
| Toast drawn as a card | W17 / M08 (or the hand-built toast where the import times out) | Bring to front |
| Filter dropdown with placeholders | W21 without placeholders | Toolbar search keeps its placeholder |
| `Upload / Drag and Drop` on HR forms | W11 house pattern | — |
| Summary tiles repeating list counts | Counters on the filter chips | Reviewer rule, `LESSONS_LEARNED.md` |
| Identical icon on every list row | Remove | Reviewer rule |
| Repeated near-identical plain frames | A business component with variants (DS §4.15) | Build on a review page first, don't swap until approved |

### Tidy-up procedure (one module at a time)

1. **Restore point** (`saveVersionHistoryAsync`), and tell the user the title.
2. **Audit one frame per call.** List each top-level element: is it an instance? Of what (`getMainComponentAsync`)? Are its fills bound? Write the result as a table in the module KB: element → current → target row id.
3. **Agree the plan** with the user if anything changes layout or meaning.
4. **Swap one frame per call:**
   - `swapComponent` / a clone of the target instance in the same position;
   - copy over the text;
   - rebind the colours.
5. **Screenshot and compare** before and after.
6. **Log it:** the module KB (what moved), `CHANGELOG.md`, and `LESSONS_LEARNED.md` (anything new).
