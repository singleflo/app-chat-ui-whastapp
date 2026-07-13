# chat/ — Layout Shells & Orchestration

Assembles the surfaces (desktop 3-pane / mobile stack / side-panel / quick-popover) from the list, chat, and context columns. Parent: [root AGENTS.md](../../../AGENTS.md).

## FILES

| File | Role |
|------|------|
| `types.ts` | `SurfaceVariant` + `SURFACE_CAPS` (panels count, showInput, contextPanelCollapsible per variant) |
| `ChatApp.tsx` | top orchestrator. `ChatApp` routes by variant; `DesktopChatApp` = 3-pane + drag-resize + overlay/lightbox state |
| `ConversationListShell.tsx` | left column: header, filter chips, 13 conversation-item states, `onNewChat` trigger |
| `ChatColumnShell.tsx` | center: `ChatHeader`, window/bot/pinned/record/team bars, message list, smart scroll-FAB, `ComposerShell` |
| `ContextPanelShell.tsx` | right CRM panel: profile / custom fields / automations / records / activity / gallery accordions |
| `Overlays.tsx` | transient modals: new-chat, delete-chat confirm, forward (multi-select ≤5) |
| `Lightbox.tsx` | fullscreen media viewer: zoom/prev/next/download/share, keyboard nav |

## STATE OWNERSHIP

- `ChatApp` owns `selectedConvId`, `overlay` (`OverlayState`), `lightbox` (`LightboxState`), and the `wa-lightbox-open` window-event listener.
- `DesktopChatApp` owns `listWidth`/`contextWidth` (drag-resize, `useResizable`) + `contextOpen` (collapse).
- Mobile/side-panel/popover use a `stack` state (`"list"|"chat"|"context"`) to simulate push navigation.

## CONVENTIONS (local)

- Every shell takes `conversationId` and reads data via `data/dataset.ts` selectors — never touches the JSON.
- Panels are `overflow-hidden` + inner `ScrollArea`; headers use `truncate` + `shrink-0` icons for responsive squeeze.
- Scroll-to-bottom FAB: auto-scrolls on `conversationId` change, shows only when >60px from bottom (`handleScroll`), smooth-scrolls on click.
- Drag handles are `<button type="button" onMouseDown={resize}>` (not a div — lint requires interactive elements be buttons).
- Context panel collapse: `PanelRightClose` in panel header ↔ floating `PanelRightOpen` + `Info` btn in chat header.

## ADD A SURFACE VARIANT

1. `types.ts`: add to `SurfaceVariant` + an entry in `SURFACE_CAPS`.
2. `ChatApp.tsx`: handle the variant (reuse `DesktopChatApp` or the single-column stack).
3. `routes/surfaces.tsx`: wrap `<ChatApp variant="…">` in the device frame.
