# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-13 · **Branch:** main · **Commit:** (uncommitted)

## OVERVIEW

Navigable static mockup of a WhatsApp Business Cloud API chat UI (spec `specifica-ui-whatsapp-clone-100.md`, v1.3). NOT an app with a backend — it is a spec-driven catalog of every WhatsApp surface and message type. React 18 + Vite 5 + TypeScript strict + Tailwind v4 (CSS-first) + shadcn/ui (copied, not npm) + React Router + Lucide.

## STRUCTURE

```
fixtures/demo-dataset.json     # single source of truth for demo data (T1-T3 spec)
src/
├── main.tsx                   # bootstrap → BrowserRouter
├── App.tsx                    # MANUAL router + surface/screen nav + theme toggle
├── index.css                  # design system: CSS-var tokens + Tailwind v4 @theme + doodle bg
├── types/chat.ts              # domain model: MessageContent discriminated union (25+ kinds)
├── data/dataset.ts            # fixture adapter: JSON import + typed cast + selector helpers
├── lib/utils.ts               # cn(), fmtTime, colorFromString, initials, fmtDuration/Bytes
├── components/
│   ├── bubbles/               # message rendering system (see its AGENTS.md)
│   ├── chat/                  # layout shells + overlays (see its AGENTS.md)
│   └── ui/                    # shadcn primitives (avatar, badge, button, input, scroll-area)
└── routes/                    # demo surfaces + showcase screens (NOT business pages)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add a message content type | `types/chat.ts` (union) → `bubbles/MessageRenderer.tsx` (dispatch) → `bubbles/content/X.tsx` (renderer) | 3-step, all required |
| Change theme colors / white-label | `index.css` `:root` + `[data-theme="dark"]` tokens | components read `var(--…)` only |
| Add demo data | `fixtures/demo-dataset.json` | consume via `data/dataset.ts` helpers, never import JSON directly |
| Add a surface (desktop/mobile/…) | `components/chat/types.ts` (`SURFACE_CAPS`) + `routes/surfaces.tsx` | |
| Add a showcase screen | `routes/*.tsx` + register route+nav in `App.tsx` | |
| Layout / drag-resize / overlays | `components/chat/ChatApp.tsx` | |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `MessageContent` | union (25+ kinds) | `types/chat.ts#L51` | discriminant for every bubble variant |
| `ChatEntry` = `Message \| SystemPill` | union | `types/chat.ts#L448` | stream item; narrow with `isMessage()` |
| `DemoDataset` | interface | `types/chat.ts#L410` | shape of `demo-dataset.json` |
| `dataset` + selectors | const/fn | `data/dataset.ts` | `conversationById`, `messagesFor`, `profileFor`, `activityFor`, `automationRunsFor` |
| `MessageRenderer` / `renderContent` | dispatch | `bubbles/MessageRenderer.tsx` | switch on `content.kind` |
| `ChatApp` / `DesktopChatApp` | component | `chat/ChatApp.tsx` | surface orchestration + overlay/lightbox state |

## CONVENTIONS (deviations from standard)

- **Tailwind v4 CSS-first**: no `tailwind.config.js`. Tokens in `index.css` via `@theme` + CSS custom properties. `@tailwindcss/vite` plugin.
- **Manual routing**: routes declared inline in `App.tsx`, NOT file-based.
- **Theme**: `data-theme` attribute on `<html>` + `localStorage("wa-theme")`. Never `dark:` variants — override CSS vars instead.
- **Colors**: always `bg-[var(--token)]` / `text-[var(--token)]`. Never raw hex/tailwind color classes in components.
- **Fixture-driven**: components never import JSON; always go through `data/dataset.ts` selectors (safe fallbacks).
- **Lightbox trigger**: `window.dispatchEvent(new CustomEvent("wa-lightbox-open", {detail:{url,caption}}))` — event-based, not prop drilling. Listener in `ChatApp`.
- **Media**: `MediaPlaceholder` renders CSS gradients (deterministic hue from URL). No real image assets (MV3-safe, zero CDN).

## ANTI-PATTERNS (THIS PROJECT)

- **Array index in React `key`**: a lint hook REJECTS it. Use stable ids or precompute a keyed array at module scope.
- **`overflow-hidden` on message bubbles**: removed on purpose — it clips the hover context-menu dropdown. Rounded corners work without it.
- **`type` on `<button>`**: lint requires explicit `type="button"` on every button.
- **`title`/`aria-label` on lucide `<svg>`**: not allowed on the icon; wrap in a `<span title>` instead.
- **shadcn rules** (`.claude/skills/shadcn/`): no `space-x/y-*`, no manual `z-index` juggling on overlays, use `cn()`, reuse existing primitives before custom markup.
- No backend / fetch / own storage — spec forbids it (event-driven UI only).

## COMMANDS

```bash
pnpm dev          # vite dev server → http://localhost:5173
pnpm build        # tsc -b && vite build
pnpm typecheck    # tsc --noEmit  (run after every edit; must be 0 errors)
pnpm preview      # serve dist/
pnpm lint         # eslint .
```

## NOTES

- No CI (`.github/workflows` absent). No git commits yet.
- LSP shows a persistent `index.css` warning "Tailwind-specific syntax is disabled" for `@theme`/`@import "tailwindcss"` — Tailwind v4 syntax the editor doesn't recognize. Not a real error; ignore.
- Outbound bubbles: sender avatar sits to the RIGHT of the bubble (for Team Inbox visibility).
- `edited` messages: use `edited: true` prop on the message (renders "modificato" inline), not a separate `edited_marker` entry.
