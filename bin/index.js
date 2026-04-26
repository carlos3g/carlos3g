#!/usr/bin/env node

'use strict';

const supportsColor = (() => {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean(process.stdout.isTTY);
})();

const ESC = '\x1b[';
const RESET = supportsColor ? `${ESC}0m` : '';
const BOLD = supportsColor ? `${ESC}1m` : '';
const ITALIC = supportsColor ? `${ESC}3m` : '';

const rgb = (r, g, b) => (supportsColor ? `${ESC}38;2;${r};${g};${b}m` : '');

// Mid-tone palette: every accent has lightness ~40-55% so it stays readable on
// both white and dark backgrounds. Body text intentionally uses no color
// (the empty string) so the terminal's own foreground takes over and
// auto-adapts to the user's theme.
const C = {
  purple: rgb(150, 60, 220),
  pink: rgb(220, 60, 170),
  magenta: rgb(170, 50, 200),
  teal: rgb(0, 150, 170),
  green: rgb(0, 160, 90),
  gray: rgb(130, 130, 140),
  fg: '',
};

const link = (url, text) => {
  const label = text || url;
  if (!supportsColor) return `${label} (${url})`;
  return `\x1b]8;;${url}\x1b\\${label}\x1b]8;;\x1b\\`;
};

const gradient = (text, from, to) => {
  if (!supportsColor) return text;
  const chars = [...text];
  const n = chars.length;
  let out = '';
  for (let i = 0; i < n; i += 1) {
    const t = n === 1 ? 0 : i / (n - 1);
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    out += `${rgb(r, g, b)}${chars[i]}`;
  }
  return out + RESET;
};

const isWide = (cp) => {
  if (cp === 0xfe0f || cp === 0x200d) return null; // invisible: variation selector / ZWJ
  if (cp >= 0x1f000 && cp <= 0x1faff) return true;
  if (cp >= 0x2600 && cp <= 0x27bf) return true;
  if (cp >= 0x2300 && cp <= 0x23ff) return true;
  return false;
};

const visibleLength = (str) => {
  const stripped = str
    .replace(/\x1b\]8;;.*?\x1b\\/g, '')
    .replace(/\x1b\[[0-9;]*m/g, '');
  let width = 0;
  for (const ch of stripped) {
    const w = isWide(ch.codePointAt(0));
    if (w === null) continue;
    width += w ? 2 : 1;
  }
  return width;
};

const pad = (str, width) => {
  const diff = width - visibleLength(str);
  return diff > 0 ? str + ' '.repeat(diff) : str;
};

const data = {
  name: 'Carlos Mesquita',
  handle: '@carlos3g',
  role: 'Software Engineer',
  focus: 'Web · Mobile · Open Source',
  location: 'Piauí, Brazil',
  rows: [
    { icon: '🌐', label: 'Portfolio', value: 'carlos3g.dev',                            url: 'https://carlos3g.dev' },
    { icon: '💼', label: 'LinkedIn',  value: 'linkedin.com/in/carlos3g',                url: 'https://www.linkedin.com/in/carlos3g' },
    { icon: '🐙', label: 'GitHub',    value: 'github.com/carlos3g',                     url: 'https://github.com/carlos3g' },
    { icon: '🐦', label: 'Twitter',   value: '@c4rlos3g',                               url: 'https://twitter.com/c4rlos3g' },
    { icon: '📷', label: 'Instagram', value: '@c4rlos3g',                               url: 'https://www.instagram.com/c4rlos3g' },
    { icon: '✉️', label: 'Email',    value: 'carlosmesquita156@gmail.com',             url: 'mailto:carlosmesquita156@gmail.com' },
  ],
  tip: 'npx carlos3g',
};

const gradStart = [150, 60, 220];
const gradEnd = [220, 60, 170];

const nameLine = `${BOLD}${gradient(data.name, gradStart, gradEnd)}${RESET}  ${C.gray}${data.handle}${RESET}`;
const roleLine = `${C.teal}${data.role}${RESET}  ${C.gray}·${RESET}  ${ITALIC}${C.fg}${data.focus}${RESET}`;
const locationLine = `📍  ${C.fg}${data.location}${RESET}`;

const linkLines = data.rows.map((r) => {
  const label = `${C.magenta}${pad(r.label, 9)}${RESET}`;
  const value = `${C.fg}${link(r.url, r.value)}${RESET}`;
  return `${r.icon}  ${label} ${value}`;
});

const tipLine = `${C.gray}Run${RESET} ${BOLD}${C.green}${data.tip}${RESET} ${C.gray}anywhere to see this card${RESET}`;

const contentLines = [
  nameLine,
  roleLine,
  '',
  locationLine,
  '',
  ...linkLines,
  '',
  tipLine,
];

const innerWidth = Math.max(...contentLines.map(visibleLength));
const PAD_X = 3;
const totalInner = innerWidth + PAD_X * 2;

const border = (left, mid, right) =>
  `${C.purple}${left}${mid.repeat(totalInner)}${right}${RESET}`;

const top = border('╭', '─', '╮');
const bottom = border('╰', '─', '╯');
const empty = `${C.purple}│${RESET}${' '.repeat(totalInner)}${C.purple}│${RESET}`;

const wrap = (line) =>
  `${C.purple}│${RESET}${' '.repeat(PAD_X)}${pad(line, innerWidth)}${' '.repeat(PAD_X)}${C.purple}│${RESET}`;

const card = [
  '',
  top,
  empty,
  ...contentLines.map(wrap),
  empty,
  bottom,
  '',
].join('\n');

process.stdout.write(card + '\n');
