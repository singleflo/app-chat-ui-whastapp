# Design languages — source of truth

Live white-label demo: 4 switchable design languages, selected via
`data-design` on `<html>`, persisted in `localStorage("wa-design")`.
Switcher: **Settings → Appearance → Design**.

| Design    | Source                  | Light             | Dark              | Font                    |
| --------- | ----------------------- | ----------------- | ----------------- | ----------------------- |
| whatsapp  | original (spec R7)      | native            | native            | system stack            |
| linear    | `linear.DESIGN.md`      | derived (inverse) | native            | Inter Variable          |
| intercom  | `intercom.DESIGN.md`    | native            | derived (warm)    | Inter Variable          |
| slack     | `slack.DESIGN.md`       | native            | derived (auberg.) | system stack (per spec) |

The `*.DESIGN.md` files are verbatim copies from
`awesome-design-md` (kept in-repo because `.external/` is gitignored).
They document the brand systems; the translation into our token layer
lives in `src/index.css`.

## Role → token mapping

| DESIGN.md role             | Our token                          |
| -------------------------- | ---------------------------------- |
| canvas                     | `--bg-app`, `--bg-chat`            |
| surface-1 / elevated       | `--bg-panel`, `--bg-bubble-in`     |
| surface-2                  | `--bg-panel-2`, `--bg-header`      |
| hover / selected           | `--bg-hover`, `--bg-active`, `--bg-selected` |
| ink / on-primary           | `--fg-primary`, `--fg-on-accent`   |
| ink-muted / ink-subtle     | `--fg-secondary`, `--fg-tertiary`  |
| primary / accent           | `--accent`, `--accent-hover`, `--accent-fg` |
| hairline                   | `--border-strong`, `--border-divider`, `--border-bubble` |
| semantic-success/error     | `--fg-success`, `--fg-error`, `--destructive` |
| link                       | `--fg-link`                        |
| AI product color (Fin)     | `--bg-bubble-bot`, `--bg-bubble-automation` |
| radii scale                | `--radius*`, `--radius-bubble*`    |

## Rules

1. Bubble semantic colors stay mutually distinguishable in every
   design × mode (in/out/bot/automation/internal-note/error/system/deleted).
2. Components read `var(--token)` only — never hex.
3. Fonts are self-hosted (`@fontsource-variable/inter`) — no CDN (MV3-safe).
4. Every design ships BOTH light and dark; derived pairs keep the brand
   undertone (Intercom warm, Slack aubergine).
