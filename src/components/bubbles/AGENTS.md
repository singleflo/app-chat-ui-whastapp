# bubbles/ — Message Rendering System

The heart of the mockup. Turns a `ChatEntry` (from fixtures) into a rendered WhatsApp bubble. Parent: [root AGENTS.md](../../../AGENTS.md).

## DISPATCH FLOW (3 layers)

```
ChatEntryRenderer(entry)              # MessageRenderer.tsx#L28
  ├─ !isMessage → SystemPillRow       # inline date/unread/event pills
  └─ MessageRenderer(message)         # #L35
       ├─ special kinds early-return  # deleted/error/fallback/internal_note (each wrapped in Bubble + avatar)
       ├─ system kind → SystemPillRow
       └─ renderContent(content)      # #L159 switch on content.kind → content/*.tsx
```

## FILES

| File | Renders |
|------|---------|
| `MessageRenderer.tsx` | dispatcher + outbound avatar-wrap logic + special-kind handling |
| `Bubble.tsx` | `Bubble` shell, `BubbleMeta` (ts+ACK), `SenderTag`, `SenderAvatar`, `Reactions`, `QuotedBlock`, `ForwardedLabel` |
| `Markdown.tsx` | inline WhatsApp markdown (`*bold*` `_it_` `~s~` `` `code` ``) |
| `MessageContextMenu.tsx` | hover chevron → dropdown (reply/react/forward/copy/star/delete) + quick-reaction bar |
| `content/Text.tsx` | text + link-preview card |
| `content/Media.tsx` | image/video/document/sticker + `MediaPlaceholder` (CSS-gradient stand-in) |
| `content/Audio.tsx` | voice/audio + waveform + transcript |
| `content/Location.tsx` | location + location_request + address_request |
| `content/Contacts.tsx` | single/multi vCard |
| `content/Interactive.tsx` | buttons/list/cta_url/flow/call_permission/carousel/product/catalog |
| `content/Order.tsx` · `Template.tsx` | order cart · template (+ LTO countdown + OTP) |
| `content/System.tsx` · `Special.tsx` · `InternalNote.tsx` · `Error.tsx` | pills · deleted/fallback · team note · error+actions |

## ADD A NEW CONTENT TYPE (all 3 required)

1. `types/chat.ts`: add `{ kind: "x"; … }` to the `MessageContent` union.
2. `content/X.tsx`: write the renderer (pure, props-driven, reads `var(--…)` tokens).
3. `MessageRenderer.tsx` `renderContent()`: add `case "x": return <XContent … />`.

## CONVENTIONS (local)

- **`Bubble` bakes in `max-w-[78%]` + `self-start/end`**. When wrapping an outbound bubble with an avatar row, pass `className="max-w-full min-w-0"` to the Bubble and put `max-w-[78%]` on the flex wrapper (avoids a circular max-width bug).
- **Outbound avatar → RIGHT** of bubble: `<div className="flex max-w-[78%] items-end justify-end gap-1.5 self-end"><Bubble …/>‹avatar›</div>`.
- **Bot bubbles**: `tone="bot"` → blue bg + `bot-bubble-pattern` (diagonal stripes) + `SenderAvatar` shows Bot icon.
- **`hasReactions` prop** adds `mb-3` so the reaction pill doesn't overlap the next bubble.
- Special kinds (deleted/error/fallback/internal_note) build their own `inner` fragment then reuse the same outbound-avatar wrapper — keep that pattern when adding one.

## ANTI-PATTERNS

- Do NOT add `overflow-hidden` to `Bubble` — clips the context-menu dropdown.
- Do NOT use array index as React `key` in content maps — lint rejects it; precompute a keyed array at module scope (see `Audio.tsx` waveform, `ComposerShowcase` emoji).
