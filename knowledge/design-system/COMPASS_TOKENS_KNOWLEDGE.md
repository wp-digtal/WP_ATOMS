# COMPASS tokens: which variable for which colour, and how to bind them

Written 12 Nov 2026, while binding the PD business components to the design system. The user said: "make sure colours and everything use the existing design system; when you use the design system, write knowledge for it too."

Library: **🧭 COMPASS - Westpoint ATOM Design System 2.0**, libraryKey `lk-d71fb0e8f1777bdaf7149c5afd3f39e4a2ce0cb802bb67b25a0436bd5768213bb0f683a5943600bc0b4ac2c4d73cee3d4fca1a9794be73e4d08c183c64510d1c`. Its collections are `1. Colors`, `2. Dimensions` and `4. Components`. Text styles are in the same library.

**Use COMPASS keys only.** Other libraries in these files ("ATOMS Design System (DO NOT TOUCH)", Ant Design 5.18 Masterfile, WL ATOMS Components Library) have variables with the **same names and the same local suffix** but a different key. Example: `colorTextTertiary` `47775b41…/5006:8501` is not COMPASS; `a522fb6e…/5006:8501` is. Always check the key against the table below, not the name.

## 1. Hex → token (web, light mode)

The value column is what the token resolves to, so binding never changes the look (except the two rows marked).

| Raw colour seen in frames | Where | Token | Resolves to |
|---|---|---|---|
| `#ffffff` | card / cell / container fill | `Colors/Neutral/Bg/colorBgContainer` | #fff |
| `#ffffff` | text on a dark background | `Colors/Neutral/Text/colorTextLightSolid` | #fff |
| `#f0f0f0` | card and cell borders | `Colors/Neutral/Border/colorBorderSecondary` | #f0f0f0 |
| `#d9d9d9` / `#dddddd` | input border, divider lines | `Colors/Neutral/Border/colorBorder` | #d9d9d9 (#ddd moves slightly) |
| `#fafafa`, `#000` @ 2% | table header, alternate fill | `Colors/Neutral/Fill/colorFillAlter` | #000 @ 2% (#fafafa on white) |
| `#000` @ 88% | body text | `Colors/Neutral/Text/colorText` | #000 @ 88% |
| `#000` @ 88%, Semi Bold ≥ 16 | card and section titles | `Colors/Neutral/Text/colorTextHeading` | #000 @ 88% |
| `#000` @ 100% | text | `colorText` / `colorTextHeading` | @ 88% (**slightly lighter**: AntD has no 100% text token) |
| `#8c8c8c` | secondary / meta / empty-state text | `Colors/Neutral/Text/colorTextTertiary` | #000 @ 45% |
| `#1677ff` | link text ("View all", "Show less") | `Colors/Brand/Primary/colorPrimaryText` | #1677ff |
| `#1677ff` | primary fill | `Colors/Brand/Primary/colorPrimary` | #1677ff |
| `#f0f5ff` | highlighted card (My Next Leave) | `Colors/Base/Geekblue/1` | #f0f5ff |
| `#000` @ 85% | tooltip background | `Colors/Neutral/Bg/colorBgSpotlight` | #000 @ 85% |

When binding, set the paint's own opacity to 1 so the token's alpha is the only one applied.

## 2. Variable ids in the Personal Dashboard file (`1FCRdGhHru6czP5P6h06kH`)

`importVariableByKeyAsync` **hangs** in this file (the call never returns and blocks the plugin until the timeout). Remote variables can still be read with `figma.variables.getVariableByIdAsync('VariableID:<key>/<suffix>')`. The suffix is the variable's id in the COMPASS source file, so it is the same in every consumer file. If a suffix is unknown, loop over the range (`5006:6000–10000` for colours, `5026:4300–4800` for radius); each lookup takes under 1 ms.

| Token | Key | Id suffix |
|---|---|---|
| colorBgContainer | `1e05ea6a87222da108ca9c70d94b3bcc4d9762a1` | `5006:7841` |
| colorBgSpotlight | `3cc756047538f819540695a3f5144f004732cf47` | `5006:7640` |
| colorBorderSecondary | `3ec8e8282c53d2e78c11b0eb17745b3f1a627b2f` | `5006:7620` |
| colorBorder | `4086455e867e3f26b7cf1e92166581eee15498fb` | `5006:8657` |
| colorSplit | `cec768024f0142e766bf49ef59a4e54aeb6a127f` | `5006:7443` |
| colorFillAlter | `b83bc62e395b78796e4666efdca31bc529510c78` | `5006:8518` |
| colorText | `766d1f8e0fff8e1249049d07b9ae74bf8fc39532` | `5006:8040` |
| colorTextHeading | `5f310ae6a85b90a1afa5736b3660d683ffa75352` | `5006:7766` |
| colorTextSecondary | `3b99e875e6e94c0668e5b1b222b30309cd0d21ef` | `5006:7935` |
| colorTextTertiary | `a522fb6e12783d5e808806e50d691e45a18fa756` | `5006:8501` |
| colorTextPlaceholder | `3bb6b2ad794feb61c6d34a3a0d39de7b6d06dd0b` | `5006:7913` |
| colorTextDescription | `e56edae566febebf437632ce05af98cc6da2e36f` | `5006:7994` |
| colorTextLightSolid | `76036add40a1c9a4bd3d0544dcb95fb57af9bdfc` | `5006:7685` |
| colorPrimary | `ebfacb1f1ab69ecdaebb7bdcb9537ec15d363a96` | `5006:7792` |
| colorPrimaryText | `87346869ee8ba455a6e15c56ccb4f9242b144162` | `5006:8430` |
| Geekblue/1 | `baba6c1dbbc9e0f0f653c4c01ac8dc3e9063652b` | `5006:8284` |
| Blue/1 | `2446a90a1b65bea7f44453861ee98381ff65ca5e` | `5006:7350` |
| borderRadiusLG (8) | `e7448120e5008c5a762f5747320c9f502ca59e6f` | `5026:4455` |
| borderRadius (6) | `a4eab0cd5004dab1adf74f066c0052a92b4477e1` | `5026:4517` |
| borderRadiusSM (4) | `c7e7623d959347746923dd6544e0a3e6d91a1ef0` | `5026:4495` |

Not reachable in this file: `colorFillAlterSolid` (`af38d2cc…`) is not under `5006`/`13100`/`703`, so `colorFillAlter` is used instead (it is also what COMPASS's own `Table/headerBg` points to).

Finding a token through a component token works too. `Components/Modal/Global/colorText` → alias → `colorText`. Read `valuesByMode[mode]`, and if it is a `VARIABLE_ALIAS`, fetch that id.

## 3. Radius

COMPASS radius tokens: XS 2, SM 4, base 6, LG 8. **PD cards use 24 and drawer preview boxes use 12.** Neither has a token, so they stay raw until the user decides.

## 4. Text styles (open question)

COMPASS text styles (e.g. `Text Base/Normal` `S:69f4e565…,13340:935`, `Text SM/Normal` `…,13340:862`, `Text LG/Normal` `…,13340:856`) use **SF Pro Text**, while the PD and AM production frames are drawn in **Inter** (a few in 42dot Sans). Applying the styles would change the font on every node. So they were **not applied** to the PD business components. Waiting for the user to choose: apply COMPASS styles (SF Pro), or keep Inter.

## 5. Procedure (one component per call)

1. Restore point: `Before <change> (<date>)`.
2. Resolve the token ids above with `getVariableByIdAsync` and check each one's resolved value with `resolveForConsumer(node)`.
3. Walk the component and **skip instances**. Library instances own their colours; a raw fill inside a COMPASS table cell is the library's, not ours.
4. For each SOLID paint not already bound, map it with the table in §1: `setBoundVariableForPaint({...paint, opacity: 1}, 'color', variable)`.
5. Radius: `setBoundVariable('topLeftRadius', …)` for each corner whose value matches a token (mixed corners too).
6. Report any colours the mapping could not place, and ask before inventing a mapping.
