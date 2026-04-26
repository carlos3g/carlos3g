# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This repo (`carlos3g/carlos3g`) serves two roles from the same tree:

1. **GitHub profile README** — `README.md` renders on https://github.com/carlos3g.
2. **npm package `carlos3g`** — a zero-dependency CLI that prints a colorful business card. Invoked as `npx carlos3g`.

Both ship from the same `master` branch. The npm release publishes only what's listed in `package.json#files` plus the auto-included `package.json` / `README.md` / `LICENSE`.

## Contents

- `bin/index.js` — the CLI entrypoint (Node, shebang, `chmod +x`). Zero runtime dependencies. Uses raw 24-bit ANSI escapes for colors and OSC 8 for clickable hyperlinks; falls back gracefully when `NO_COLOR` is set or stdout isn't a TTY. Emoji width is hand-counted (treated as 2 columns) so the box border aligns.
- `package.json` — `name: carlos3g`, `bin.carlos3g → bin/index.js`, `files: ["bin"]`, `engines.node >=14`. No deps.
- `README.md` — the rendered profile page. Written in HTML-flavored Markdown (`<img>`, `<details>`, `<a>`) in English. Contact badges use `img.shields.io`; stats cards use `github-readme-stats.vercel.app`. Also doubles as the npm page.
- `.github/assets/images/` — image assets referenced from the README.
- `LICENSE` — MIT.

## Editing notes

- **README:** preview on github.com/carlos3g or with a Markdown previewer that supports embedded HTML — local plain-Markdown previewers will not render the `<details>` / inline-styled badges correctly. Mixes HTML and Markdown intentionally; preserve the existing tag style when adding sections. Content is in English — match the existing language unless the user asks otherwise.
- **CLI:** test with `FORCE_COLOR=1 node bin/index.js` (color path) and `NO_COLOR=1 node bin/index.js` (fallback path). When adding a new emoji icon, verify it lands in one of the ranges checked by `isWide()` in `bin/index.js`; if not, extend that function or alignment will drift on that line.
- **Releasing:** automated via `.github/workflows/release.yml`. On every push to `master` that touches `bin/**` or `package.json`, the workflow checks npm for the current `package.json#version`; if that version isn't published, it runs `npm publish --access public --provenance` and creates a `vX.Y.Z` GitHub release. To ship: bump `version`, commit, push — the workflow handles the rest. Repo secret `NPM_TOKEN` (npm automation token) must be set.
