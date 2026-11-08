#!/usr/bin/env python3
"""Safety check for the knowledge base. Run before every commit that touches docs.

    python3 -I tools/check-knowledge.py           # check only (exit 1 on problems)
    python3 -I tools/check-knowledge.py --write   # also regenerate component-map.json

Checks:
1. Every upper-case `*.md` name mentioned in docs, skills or source comments exists
   somewhere in the repo. Docs refer to each other by bare file name (names are
   unique), so moving a file or the whole knowledge/ folder never breaks a link.
2. Every file name is unique (a bare-name reference must be unambiguous).
3. No secrets: tokens, API keys, private keys, passwords.
4. knowledge/design-system/component-map.json matches the tables in COMPONENT_MAP.md.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', 'node_modules', 'dist', 'build'}
TEXT_EXT = {'.md', '.ts', '.tsx', '.js', '.py', '.json'}
MAP_MD = os.path.join(ROOT, 'knowledge', 'design-system', 'COMPONENT_MAP.md')
MAP_JSON = os.path.join(ROOT, 'knowledge', 'design-system', 'component-map.json')

SECRET_PATTERNS = [
    (r'figd_[A-Za-z0-9_-]{20,}', 'Figma personal access token'),
    (r'gh[pousr]_[A-Za-z0-9]{30,}', 'GitHub token'),
    (r'AKIA[0-9A-Z]{16}', 'AWS access key'),
    (r'sk-[A-Za-z0-9]{32,}', 'API secret key'),
    (r'-----BEGIN [A-Z ]*PRIVATE KEY-----', 'private key'),
    (r'(?i)\b(password|passwd|api[_-]?key|secret)\s*[:=]\s*["\'][^"\'\s]{6,}["\']', 'hard-coded credential'),
    (r'(?i)authorization:\s*bearer\s+[A-Za-z0-9._-]{20,}', 'bearer token'),
]
PLACEHOLDERS = {'NAME.md'}  # used in prose as "any NAME.md"
# Chat links like claude.ai/code/session_... are session URLs, not secrets.


def walk():
    for d, dirs, files in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for f in files:
            yield os.path.join(d, f)


def parse_map():
    rows = []
    section = None
    for line in open(MAP_MD, encoding='utf-8'):
        m = re.match(r'^## ([A-C])\. (.*)', line)
        if m:
            section = m.group(2).strip()
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) >= 6 and re.fullmatch(r'[WM]\d{2}', cells[0]):
            rows.append({
                'id': cells[0], 'system': 'web' if cells[0][0] == 'W' else 'mobile',
                'section': section, 'element': cells[1], 'component': cells[2],
                'where': cells[3], 'how': cells[4], 'ref': cells[5],
            })
    return rows


def main():
    write = '--write' in sys.argv
    problems = []
    files = list(walk())
    names = {}
    for p in files:
        names.setdefault(os.path.basename(p), []).append(os.path.relpath(p, ROOT))

    # 1 + 2: references and uniqueness
    for n, paths in names.items():
        if n.endswith('.md') and len(paths) > 1 and n != 'SKILL.md':
            problems.append(f'duplicate file name {n}: {paths}')
    for p in files:
        if os.path.splitext(p)[1] not in TEXT_EXT:
            continue
        rel = os.path.relpath(p, ROOT)
        try:
            text = open(p, encoding='utf-8').read()
        except UnicodeDecodeError:
            continue
        if rel != 'CHANGELOG.md':  # history may name files that no longer exist
            for ref in set(re.findall(r'\b([A-Z][A-Z0-9_]{2,}\.md)\b', text)):
                if ref not in names and ref not in PLACEHOLDERS:
                    problems.append(f'{rel}: references missing file {ref}')
        # 3: secrets
        for pat, label in SECRET_PATTERNS:
            for m in re.finditer(pat, text):
                problems.append(f'{rel}: possible {label}: {m.group(0)[:12]}…')

    # 4: component map
    rows = parse_map()
    ids = [r['id'] for r in rows]
    if len(ids) != len(set(ids)):
        problems.append('COMPONENT_MAP.md has duplicate row ids')
    data = {'generated_from': 'COMPONENT_MAP.md', 'rows': rows}
    if write:
        with open(MAP_JSON, 'w', encoding='utf-8') as fh:
            json.dump(data, fh, indent=2, ensure_ascii=False)
            fh.write('\n')
    elif not os.path.exists(MAP_JSON) or json.load(open(MAP_JSON, encoding='utf-8')) != data:
        problems.append('component-map.json is out of date: run with --write')

    if problems:
        print('\n'.join(problems))
        print(f'\n{len(problems)} problem(s)')
        return 1
    print(f'OK: {len(files)} files, {len(rows)} component rows, no missing refs, no secrets')
    return 0


if __name__ == '__main__':
    sys.exit(main())
