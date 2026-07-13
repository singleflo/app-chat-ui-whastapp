# WhatsApp Business Cloud API — UI Clone (Mockup)

Mockup statico e navigabile di ogni superficie e tipo di messaggio della **WhatsApp Business Cloud API**, costruito seguendo pedissequamente la spec `specifica-ui-whatsapp-clone-100.md` (v1.3). **Non è un'app con backend**: nessuna fetch, nessuno storage proprio, nessuna persistenza — è un catalogo interattivo, guidato da una spec, di tutte le bolle/messaggi/schermate previste dall'API.

## Scope

- Coprire **tutti** i tipi di messaggio della Cloud API (testo, media, audio, location, contatti, interactive, order, template, system, errori, note interne, ecc. — 25+ varianti).
- Coprire **tutte** le superfici di visualizzazione: desktop 3 colonne, mobile (phone frame), side panel, quick popover.
- Coprire le schermate di supporto: composer (tutti gli stati), chiamate (in arrivo/attiva/log), ricerca, nuova chat, messaggi preferiti, impostazioni, RTL (arabo).
- Essere una **catalogazione fedele**, non un prodotto: ogni bolla/schermata è raggiungibile via routing e popolata da dati fixture, non da input utente reale.

## Stack tecnico

| Layer | Scelta |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript strict |
| Stile | Tailwind CSS v4 (CSS-first, nessun `tailwind.config.js`) |
| Componenti base | shadcn/ui (copiati nel repo, non da npm) |
| Routing | React Router (dichiarato manualmente in `App.tsx`, non file-based) |
| Icone | Lucide |
| Package manager | pnpm |

Nessun backend, nessuna fetch, nessuno storage proprio (per scelta di spec).

## Come avviarlo

```bash
pnpm install      # installa le dipendenze
pnpm dev          # avvia il dev server → http://localhost:5173
```

Altri comandi utili:

```bash
pnpm build        # tsc -b && vite build → dist/
pnpm typecheck     # tsc --noEmit, deve dare 0 errori
pnpm lint          # eslint .
pnpm preview       # serve la build di dist/
```

## Come navigarlo

All'avvio si apre la superficie **Desktop** (3 colonne: lista conversazioni, chat, pannello contesto). La barra di navigazione in alto permette di passare tra:

- **Superfici demo** (stesso dataset, resa diversa):
  - **Desktop** — layout 3 colonne ridimensionabile (drag sui separatori).
  - **Mobile** — phone frame, singola colonna con back-navigation.
  - **Side panel** — pannello laterale stretto (380px).
  - **Quick popover** — bottone flottante che apre una chat in overlay.
- **Schermate showcase** (stati e flussi isolati):
  - **Composer** — tutti gli stati dell'input messaggio (vuoto, con testo, con allegato, con quote, ecc.).
  - **Calls** — banner chiamata in arrivo, chiamata attiva, log chiamate.
  - **Search** — ricerca conversazioni/messaggi.
  - **New chat** — creazione nuova conversazione.
  - **Starred** — messaggi preferiti.
  - **Settings** — impostazioni + toggle tema chiaro/scuro.
  - **RTL** — stessa UI in arabo, layout right-to-left.

Nella lista conversazioni a sinistra (superficie Desktop/Mobile) si trovano 8 conversazioni fixture: cliccandole si naviga tra tutti i tipi di bolla (testo, immagini, audio, location, contatti, template, ordini, errori, note interne, messaggi modificati/eliminati, ecc.), tutti raggiungibili scorrendo la chat. Il pannello contesto a destra (Desktop) mostra profilo, attributi e automazioni della conversazione selezionata, ed è collassabile.

Il tema (chiaro/scuro) si cambia dal toggle in alto e persiste in `localStorage`.

## Come è stato fatto

- **Dati**: un'unica fonte di verità, `fixtures/demo-dataset.json`, letta esclusivamente tramite selector tipizzati in `src/data/dataset.ts` (mai import diretto del JSON nei componenti).
- **Tipi**: modello dominio in `src/types/chat.ts`, con `MessageContent` come union discriminata (25+ varianti — una per ogni tipo di messaggio della Cloud API).
- **Rendering bolle**: sistema a dispatch in `src/components/bubbles/MessageRenderer.tsx`, che smista ogni `MessageContent.kind` al renderer dedicato in `content/`. `Bubble.tsx` fornisce il wrapper condiviso (avatar, tag mittente, reazioni, quote).
- **Layout/superfici**: orchestrate da `src/components/chat/ChatApp.tsx` (stato overlay, lightbox, resize drag-and-drop) e dagli shell in `components/chat/` (lista conversazioni, colonna chat, pannello contesto).
- **Routing**: dichiarato manualmente in `src/App.tsx` (niente file-based routing), con superfici in `routes/surfaces.tsx` e schermate showcase in `routes/*.tsx`.
- **Design system**: variabili CSS custom in `src/index.css` (token light/dark), lette dai componenti solo via `var(--token)` — mai colori hardcoded — per garantire white-labeling e coerenza tema.
- **Convenzioni progetto**: documentate in `AGENTS.md` (root) e nei relativi `AGENTS.md` di `bubbles/` e `chat/`, generati per guidare futuri interventi sul codice.

Per il dettaglio strutturale completo (mappa file, convenzioni, anti-pattern) vedi `AGENTS.md` nella root del repo.
