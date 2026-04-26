# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is the special GitHub "profile README" repository (`carlos3g/carlos3g`) — its sole job is to render `README.md` on https://github.com/carlos3g. There is no code, build system, or test suite.

## Contents

- `README.md` — the rendered profile page. Written in HTML-flavored Markdown (uses `<img>`, `<details>`, `<a>` tags) in English. Contact badges use `img.shields.io`; stats cards use `github-readme-stats.vercel.app`.
- `.github/assets/images/` — image assets referenced from the README.
- `LICENSE` — MIT.

## Editing notes

- Preview rendering by viewing the file on github.com/carlos3g (the profile page) or with a Markdown previewer that supports embedded HTML — local plain-Markdown previewers will not render the `<details>` / inline-styled badges correctly.
- The README mixes HTML and Markdown intentionally; preserve the existing tag style when adding sections rather than converting to pure Markdown.
- Content is in English — match the existing language unless the user asks otherwise.
