# Specifica funzionale UI — Chat WhatsApp Business Cloud API (copertura 100%)

**Versione:** 1.2 · 13 luglio 2026 — v1.1: sezioni Q (Team Inbox) e R (inventario mockup) dal modulo `evolution_odoo`. **v1.2 (finale per mockup):** sezione S (stack di stile Tailwind/shadcn), sezione T (dataset demo payload-driven), gap-check di completezza sull'intera conversazione — aggiunte le bolle mancanti alla matrice R4 (richiesta posizione, address, call permission, referral CTWA, LTO, OTP, prodotti/catalogo, echo, opt-out) e le schermate secondarie R8/R9 (chiamate, ricerca, nuova chat, multi-selezione, importanti, gruppo, impostazioni). **v1.3:** Q11-bis — pannello contesto cliente a comparsa (colonna destra: profilo, numeri multipli, campi personalizzati schema-driven, ultime automazioni, conversazioni precedenti) + fixtures e contratto eventi relativi.
**Ambito:** SOLO interfaccia utente (`chat-ui` + superficie eventi verso `chat-core`). Nessun backend.
**Target di rendering:** Desktop web (Next.js App Router) · SPA pura senza SSR (Vite) · Estensione Chrome MV3 (side panel / popup / tab / content script) · **Mobile** (browser mobile + PWA installabile).
**Principio architetturale:** la UI è alimentata esclusivamente da eventi (`message`, `status`, `typing`, `presence`, `window`) forniti dall'host tramite un trasporto iniettato. Nessun fetch proprio, nessuno storage proprio non configurabile.

> Fonte di verità dei tipi: webhook field `messages` della Cloud API. Tipi ricevibili documentati da Meta: _text, audio, button, contacts, document, edit, errors, group, image, interactive, location, order, reaction, revoke, status, sticker, system, unsupported, video_. La UI DEVE avere un rendering per ognuno (anche solo fallback).

---

## 0. Contesti di rendering e layout responsivi

| Contesto                     | Larghezza                   | Layout                                                                                 |
| ---------------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| Desktop ≥1200px              | 3 pannelli                  | Lista conversazioni · Chat attiva · Drawer info (aperto a richiesta)                   |
| Desktop 900–1200px           | 2 pannelli                  | Lista · Chat (drawer in overlay)                                                       |
| Tablet 600–900px             | 2 pannelli comprimibili     | Lista collassabile a icone                                                             |
| **Mobile <600px**            | **Stack a colonna singola** | Lista → (push) → Chat → (push) → Drawer; navigazione a stack con back gesture/pulsante |
| Extension side panel         | ~360–400px                  | Colonna singola identica al mobile                                                     |
| Extension popup              | ~380×580px                  | Colonna singola, altezza vincolata                                                     |
| Content script (shadow root) | variabile                   | Widget flottante espandibile, stili isolati in Shadow DOM                              |

Requisiti trasversali di layout:

- Breakpoint fluidi, nessuna assunzione su viewport fisso; container queries (non media queries globali) per l'embed.
- Modalità "colonna singola" completa al 100% delle funzioni: NIENTE feature disponibili solo su desktop.
- Split-view ridimensionabile su desktop (drag del divisore, persistenza della larghezza via storage adapter).
- Supporto densità: comoda / compatta.

---

## A. Lista conversazioni (sidebar)

### A1. Item conversazione

- Avatar (immagine, fallback iniziali colorate deterministiche, badge canale opzionale multi-numero).
- Nome contatto (o numero formattato E.164 → locale), verifica business (spunta) se disponibile.
- Anteprima ultimo messaggio con **icona per tipo**: 📷 foto, 🎥 video, 🎤 vocale (con durata), 📄 documento (nome file), 📍 posizione, 👤 contatto, 🛒 ordine, 🎟️ sticker, 📋 template, ☎️ chiamata, ⚠️ non supportato; prefisso "Tu:" per outbound; ✓/✓✓/✓✓blu inline per l'ultimo outbound.
- Anteprima bozza: prefisso "Bozza:" in rosso quando esiste un draft non inviato (persistito per conversazione).
- Timestamp adattivo: ora (oggi), "Ieri", giorno settimana (<7gg), data breve.
- Badge non letti (contatore, max "99+"), badge @menzione nei gruppi, icona silenziato, icona fissata, icona "in attesa di risposta" (finestra 24h in scadenza — vedi D5).
- Indicatore live nell'item: "sta scrivendo…" / "sta registrando un audio…" (sostituisce l'anteprima, colore accent).
- Stato errore: icona rossa se l'ultimo invio è `failed`.

### A2. Azioni sull'item (menu contestuale desktop / long-press mobile / swipe mobile)

- Fissa/rilascia (max 3 fissate in alto, riordinabili).
- Archivia/ripristina (sezione "Archiviate" collassata in testa alla lista).
- Silenzia (8h / 1 settimana / sempre) con icona persistente.
- Segna come letta / **non letta** (dot manuale).
- Etichette: assegna/rimuovi etichette colorate (CRUD etichette in impostazioni).
- Blocca contatto / segnala (hook verso l'host).
- Elimina conversazione (con conferma; solo locale — non esiste delete remoto lato WhatsApp).
- **Mobile swipe actions:** swipe destro = archivia (configurabile), swipe sinistro = altro/pin/mute (pattern WhatsApp iOS/Android).

### A3. Filtri, ordinamento, ricerca

- Tab/chip filtri: **Tutte · Non lette · Preferiti · Gruppi · Etichette (una per chip) · Archiviate**; contatori per tab.
- Ricerca globale con debounce: risultati raggruppati per **Conversazioni / Messaggi / Contatti**; highlight dei match; tap su messaggio → apre la chat scrollata e evidenziata su quel messaggio.
- Filtri di ricerca avanzati per tipo: solo media / documenti / link / audio (chip nella barra di ricerca).
- Ordinamento: default per attività; secondario per non letti.
- Multi-numero (multi-tenant): switcher account/numero in header lista con badge non-letti aggregati per numero; filtro "tutti i numeri".

### A4. Header lista e varie

- Header: avatar profilo business, nome numero attivo, menu (impostazioni, tema, stato connessione), pulsante nuova chat.
- **Nuova chat:** picker contatto esistente + inserimento numero libero con validazione E.164 e anteprima formattata; avvio con template se fuori finestra.
- Stato connessione trasporto: banner "In connessione… / Offline / Riconnesso" (event-driven dall'host).
- Skeleton loading; empty state illustrato; paginazione/scroll infinito della lista stessa (virtualizzata oltre ~200 item).
- Pull-to-refresh su mobile.

---

## B. Bolle messaggio — rendering di TUTTI i tipi

Regole generali bolla: raggio asimmetrico stile WhatsApp, coda (tail) solo sul primo messaggio del gruppo, raggruppamento per mittente entro 2 minuti, max-width 65% (desktop) / 85% (mobile/side panel), timestamp+ACK in basso a destra dentro la bolla, sfondo differenziato inbound/outbound (token temizzabili), ancoraggio `data-message-id` per scroll/highlight.

### B1. Testo

- Parser formattazione WhatsApp: `*grassetto*`, `_corsivo_`, `~barrato~`, `` `monospace` ``, ` `blocco codice` `, elenchi puntati (`- `/`* `) e numerati (`1. `), citazione (`> `); combinazioni annidate.
- Auto-linkify URL/email/telefono (tap: apri/chiama/scrivi); numeri di telefono cliccabili → nuova chat.
- **Card anteprima link** (og:image + titolo + descrizione + dominio) sopra il testo; i dati arrivano dall'host via evento (la UI non fetcha); layout grande/compatto a seconda dell'immagine.
- Emoji: rendering nativo con dimensione scalata (1–3 emoji sole → grandi); "Leggi tutto" oltre ~3000 caratteri con espansione inline.
- Selezione e copia parziale del testo abilitate.

### B2. Immagine

- Thumbnail con blur-up placeholder (LQIP/blurhash se fornito), dimensioni intrinseche per evitare layout shift, max-height 320px.
- Caption sotto (stesso parser del testo). Multi-immagine ravvicinate → griglia album 2×2 con "+N".
- Tap → **lightbox/galleria**: zoom pinch/wheel, pan, swipe tra media della conversazione, download, condividi (Web Share API su mobile), didascalia, contatore "n di N", chiusura swipe-down su mobile.
- Stato: spinner con percentuale upload (outbound) / download-on-tap per file grandi; retry su errore; icona "visualizza una volta" se flag presente (rendering placeholder dopo apertura).

### B3. Video

- Poster + durata + pulsante play; player inline (tap) con controlli, fullscreen, PiP dove supportato, mute di default nell'anteprima autoplay (configurabile off).
- Caption, download, avanzamento streaming progressivo. GIF/mp4 loop taggati "GIF" con autoplay muto.

### B4. Audio / Nota vocale

- Due varianti: **audio file** (icona nota) e **nota vocale** (avatar mittente + icona mic).
- Waveform statica (peaks forniti o generati client-side), scrubbing sul waveform, play/pausa, velocità **1x/1.5x/2x**, durata/refresh tempo residuo.
- Mic **blu** quando la vocale inbound è stata ascoltata localmente; per outbound: ACK standard (la Cloud API non emette `played` — la UI però prevede lo stato per compatibilità futura).
- Riproduzione continua: a fine vocale parte la successiva; persistenza posizione di ascolto; controllo unico globale (una sola traccia in play).
- Trascrizione opzionale (se fornita dall'host): toggle "mostra testo".

### B5. Documento

- Icona per MIME (PDF, DOC/X, XLS/X, PPT/X, ZIP, TXT, generico), nome file troncato al centro, dimensione, numero pagine se noto, thumbnail prima pagina per PDF se fornita.
- Tap → download / apri in nuova tab; caption supportata.

### B6. Sticker

- WebP statici e **animati** (riproduzione in loop), 190×190, senza bolla di sfondo, reaction agganciabili.

### B7. Posizione

- Thumbnail mappa statica (immagine fornita dall'host o tile generator configurabile — MAI CDN hardcoded per vincolo MV3), nome luogo + indirizzo, tap → apre provider mappe (configurabile: Google/Apple/OSM).
- **Richiesta posizione** (`location_request_message`): bolla con testo + pulsante "Invia posizione" (inbound la mostriamo come conferma inviata; outbound: composer la invia).
- Risposta posizione dell'utente renderizzata come B7 standard. (Live location: fuori scope Cloud API — fallback B18.)

### B8. Contatti (vCard)

- Card con avatar/iniziali, nome formattato, organizzazione; multipli contatti → card impilate "N contatti" espandibile.
- Dettaglio: telefoni (tipo), email, url, indirizzi, compleanno; azioni: "Avvia chat" (se numero WhatsApp), "Salva" (hook host), copia campo.

### B9. Reaction

- Pill emoji agganciata all'angolo inferiore della bolla; aggregazione per emoji con contatore; tap → sheet "chi ha reagito" (nei gruppi) con rimozione della propria.
- Aggiunta: hover (desktop) / long-press (mobile) → barra rapida 6 emoji + "+" per picker completo; doppio-tap opzionale = ❤️ (configurabile).
- Update in tempo reale via evento `reaction` (aggiunta/sostituzione/rimozione — payload con emoji vuota = rimozione).

### B10. Messaggi interattivi Cloud API — INBOUND (risposte dell'utente)

- **`button_reply`** (risposta a reply button): bolla testo con etichetta "Risposta" + titolo bottone premuto + riferimento quotato al messaggio originale.
- **`list_reply`**: bolla con titolo riga scelta + descrizione, quote dell'originale.
- **`nfm_reply` (Flow response):** card "Modulo completato ✓" con nome flow, riepilogo campi chiave (response_json rendering a coppie label/valore, collassabile), CTA "Vedi dettagli" → drawer JSON formattato.
- **Risposta a richiesta indirizzo (`address_message` reply):** card indirizzo strutturato (nome, via, città, CAP, telefono…).
- **Risposta permesso chiamata:** pill di sistema "Ha accettato/rifiutato la richiesta di chiamata".
- **`order`** (carrello dal catalogo): card riepilogo ordine — thumbnail prodotti, quantità × prezzo, totale, valuta, note; CTA "Vedi ordine" → drawer dettaglio con lista completa item.

### B11. Messaggi interattivi Cloud API — OUTBOUND (inviati dal business)

- **Reply buttons** (max 3, 20 char): bolla con header (testo/immagine/video/documento), body, footer, bottoni full-width impilati; stato "premuto" evidenziato quando arriva la reply.
- **List message**: bolla con body + bottone menu (icona ☰); tap → **bottom-sheet (mobile) / modale (desktop)** con sezioni (titolo max 24), fino a 10 righe (titolo 24 + descrizione 72), radio select + conferma.
- **CTA URL** (`cta_url`): bottone singolo con icona link esterno.
- **`address_message`**: bolla con CTA "Fornisci indirizzo" (mercati supportati; fallback B18 altrove).
- **Flow message**: bolla con CTA che apre webview/iframe del Flow (mobile: sheet fullscreen; desktop: modale); stati bozza/pubblicato.
- **`call_permission_request`**: bolla richiesta permesso di chiamata con stato (in attesa/accettata/rifiutata) e vincoli visivi (1/24h, 2/7gg).
- **Carousel media/prodotti** (2–10 card): scroll orizzontale con snap, card = media header + body (160 char) + max 2 bottoni coerenti; indicatori pagina; su mobile swipe nativo; frecce su desktop.
- **Single product / Multi product / Catalog message**: card prodotto (immagine, nome, prezzo, descrizione) / lista sezioni prodotti (max 30 item) / card catalogo con CTA "Vedi catalogo"; drawer prodotto al tap.

### B12. Template messages — rendering completo

- **Header:** testo (con variabile), immagine, video, documento, **posizione**.
- **Body:** testo con variabili posizionali `{{1}}` o nominali `{{nome}}` risolte; formattazione WhatsApp.
- **Footer:** testo statico attenuato.
- **Bottoni (tutti):** quick reply (fino a 10, con paginazione "Vedi tutte le opzioni" oltre 3), URL (max 2, con variabile), telefono, **copy code/coupon** (tap = copia negli appunti + toast), **Flow**, **OTP**: one-tap autofill / copy code / zero-tap (rendering con codice evidenziato monospace), catalogo, MPM.
- **Template carousel** (marketing, 1–10 card image/video + 2 bottoni): come B11 carousel.
- **Limited-Time Offer:** banner offerta con icona 🎁, testo offerta, **countdown alla scadenza** (timer live), codice copiabile; stato "scaduto" attenuato.
- Badge distintivo "Template · nome_template · lingua" (visibile in modalità business/debug, nascondibile).
- Stato template inviato fuori finestra con pill "Inviato come template".

### B13. Messaggi di sistema (pill centrate)

- Separatori data sticky ("OGGI", "IERI", data completa).
- Pill non letti: "N MESSAGGI NON LETTI" al primo ingresso.
- Eventi `system`: cambio numero utente, aggiornamenti identità/sicurezza ("Il codice di sicurezza è cambiato"), eventi gruppo (creato, nome cambiato, utente aggiunto/uscito/rimosso, promozione admin), inizio conversazione da annuncio (referral Click-to-WhatsApp: card con anteprima annuncio sorgente), avviso crittografia/informativa canale business.
- Pill finestra di servizio (vedi D5) e pill "Conversazione avviata da template".

### B14. Messaggio eliminato / modificato (webhook `revoke` / `edit`)

- `revoke` → placeholder "🚫 Questo messaggio è stato eliminato" (stile attenuato corsivo, niente contenuto residuo, reaction rimosse).
- `edit` → contenuto aggiornato + etichetta "modificato" accanto al timestamp; storico versioni NON mostrato (parity WhatsApp).

### B15. Reply/quote dentro la bolla

- Blocco quote in testa alla bolla: barra colorata mittente + nome + estratto (testo o icona+tipo per media, thumbnail per immagini/video); tap → scroll animato + flash highlight sull'originale (`context.message_id`); gestione originale non più in memoria (fetch range dall'host) o eliminato ("Messaggio originale eliminato").

### B16. Inoltrato

- Etichetta "↪ Inoltrato" / "Inoltrato molte volte" sopra il contenuto (da `context.forwarded` / `frequently_forwarded`).

### B17. Errori per-messaggio (webhook `errors`)

- Bolla/annotazione con icona ⚠️, titolo errore umano (mappa codici → messaggi it/en: 131047 finestra chiusa, 131026 destinatario non valido/non su WhatsApp, 130472 utente non ha accettato nuovi termini, 131048 rate limit spam, 100 parametro invalido…), dettaglio tecnico collassato, azioni contestuali (es. "Invia come template" per 131047, "Riprova" per transitori).

### B18. Fallback "non supportato" (`unsupported` + qualsiasi tipo ignoto)

- Bolla generica: "⚠️ Questo tipo di messaggio non è supportato" + tipo raw + pulsante "Copia payload" (modalità debug). **Nessun tipo sconosciuto deve mai essere scartato silenziosamente.**

---

## C. Azioni sul messaggio

Attivazione: hover → chevron menu (desktop) · **long-press → context menu + barra reaction** (mobile) · **swipe destro sulla bolla = rispondi** (mobile, con feedback haptic e icona che segue il drag).

- **Rispondi** (quote, B15) — anche da swipe mobile.
- **Rispondi in privato** (da gruppo → apre/crea 1:1 con quote cross-chat).
- **Inoltra:** picker multi-selezione destinatari (ricerca, recenti, max 5 per invio), anteprima, applicazione etichetta "Inoltrato".
- **Reagisci** (barra rapida + picker completo).
- **Copia** (testo/caption; per media: copia negli appunti dove supportato).
- **Aggiungi a Importanti** (star) + vista globale "Messaggi importanti" filtrabile per chat.
- **Fissa messaggio** (24h/7gg/30gg): banner in testa alla chat con gli ultimi fissati (max 3, ciclabili al tap), scroll-to al tap, gestione lista completa.
- **Elimina:** "per me" (locale) / "per tutti" (se il canale lo consente → placeholder B14); conferma con countdown implicito.
- **Info messaggio** (solo outbound): drawer con timeline Consegnato/Letto (+ per destinatario nei gruppi), dettaglio errori, conversation category/pricing se disponibile.
- **Download / Salva media**; **Condividi** via Web Share API (mobile).
- **Seleziona** → **modalità multi-selezione**: checkbox su ogni bolla, contatore in header, azioni batch (inoltra, elimina, copia, star), esci con X/back.
- **Segnala / Blocca** (hook host).
- Copia link al messaggio (deep-link interno `#msg-id`) per uso in note interne.

---

## D. Stati di consegna / ACK e indicatori

### D1. Pipeline stati per message_id (webhook-driven, async)

`composing (locale)` → `pending ⏱ (orologio, in coda/offline)` → `sent ✓` → `delivered ✓✓` → `read ✓✓ blu` → (`played` predisposto per vocali).

- API dello store: `applyStatus(message_id, status, timestamp, recipient_id?, errors?)` — idempotente, tollera out-of-order (non regredisce mai lo stato: read dopo delivered in ritardo viene ignorato), tollera status per messaggi non ancora in memoria (buffer di riconciliazione).
- `failed` ✗ rosso: tooltip/riga errore (mappa B17), pulsante **Riprova** (re-emit verso host) e "Elimina".
- Dedup per `message_id` su ogni ingresso (inbound e status).

### D2. Typing / Recording

- Outbound: la UI emette `typing_start/stop` (throttled 3s) e invia read receipt + typing indicator via host (la Cloud API supporta l'invio dell'indicatore di digitazione alla ricezione).
- Inbound: rendering "sta scrivendo… / sta registrando…" in header chat e item lista (dato fornito dall'host se disponibile — la Cloud API non lo espone via webhook: predisporre comunque l'evento `presence`).

### D3. Read receipts della UI

- Emissione `mark_as_read(message_ids)` quando i messaggi entrano nel viewport con chat attiva e finestra a fuoco (IntersectionObserver); batch e debounce; rispetto di impostazione privacy "non inviare conferme di lettura" (toggle).

### D4. Presenza

- "Online / Ultimo accesso" in header chat SOLO se l'host fornisce il dato (non nativo Cloud API) — componente predisposto e nascondibile.

### D5. Finestra di servizio 24h (regola di business critica)

- Calcolo dal timestamp ultimo messaggio inbound; **badge in header chat**: "Finestra aperta · si chiude tra 5h 12m" (countdown live, colore verde→ambra <4h→rosso <1h).
- Finestra chiusa → **composer bloccato** (E10) con banner esplicativo + CTA "Invia template".
- Free entry point (Click-to-WhatsApp / CTWA 72h): badge dedicato "Finestra estesa fino a …".
- Pill in-conversation quando lo stato cambia ("La finestra si è chiusa — solo template").
- Timeline visuale opzionale nel drawer info: ultimi inbound/outbound e scadenze.

---

## E. Composer

### E1. Input testo

- Textarea auto-espandibile (1→6 righe poi scroll), placeholder "Scrivi un messaggio", Invio=invia / Shift+Invio=a capo (desktop; su mobile il tasto invio del keyboard fa newline e si invia col pulsante), contatore oltre 3500 char con hard-stop a 4096.
- **Formattazione:** shortcut (Ctrl/Cmd+B/I/S/M), toolbar contestuale su selezione (mobile: bubble sopra la selezione), anteprima WYSIWYG dei marker.
- Persistenza **bozza per conversazione** (storage adapter) con ripristino.

### E2. Emoji picker

- Ricerca, categorie, **skin tone selector**, recenti/frequenti, dimensioni MV3-safe (asset locali, NIENTE CDN), portal container configurabile (Shadow-DOM-safe), su mobile a bottom-sheet, navigabile da tastiera, `:shortcode` autocomplete inline nel testo.

### E3. Menu allegati (＋ / graffetta)

- **Foto & Video** (picker file multiplo con anteprima grid), **editor media pre-invio:** caption per singolo media, crop, rotazione, ordinamento della sequenza, rimozione singola; invio come album.
- **Fotocamera** (getUserMedia: scatto foto + registrazione clip; su mobile `capture` nativo).
- **Documento** (qualsiasi MIME, anteprima nome+dimensione, limite dimensione configurabile con messaggio d'errore chiaro).
- **Contatto** (picker dai contatti dell'host, multi-selezione, anteprima vCard).
- **Posizione** (mappa con pin trascinabile fornita via adapter + ricerca luogo + "posizione attuale" da geolocation; fallback inserimento manuale lat/lng).
- **Richiesta posizione** (invia `location_request_message`).
- Su mobile il menu è un bottom-sheet a griglia; su desktop popover.

### E4. Drag & drop + clipboard

- Drop di file/immagini sull'intera area chat con overlay "Rilascia per inviare" (distinzione "invia come foto" vs "come documento"); incolla immagini/screenshot da clipboard → apre editor media; incolla testo lungo >4096 → proposta "Invia come documento .txt".

### E5. Registratore note vocali

- Tieni premuto per registrare (mic), **slide-left per annullare**, **swipe-up / lucchetto per bloccare** in modalità mani libere; poi pausa/riprendi, waveform live, timer, anteprima riascolto, invio o cestino.
- Permessi microfono gestiti con stato UI dedicato (negato → istruzioni); in extension: nota su permesso `audioCapture`/pagina dedicata. Componente **disaccoppiabile** (interfaccia recorder iniettabile).

### E6. Banner sopra il composer

- Reply (quote con anteprima, X per chiudere), Modifica messaggio (se abilitato dall'host), "Stai inviando come template", errore invio con retry.

### E7. Risposte rapide / canned responses

- Trigger `/` → popover con ricerca fuzzy su titolo/contenuto, categorie, variabili ({{nome}}), inserimento con tab; CRUD in impostazioni; scorciatoie per media predefiniti.

### E8. Picker template

- Pulsante dedicato (sempre visibile lato business): lista template approvati con ricerca, filtro categoria/lingua, **anteprima renderizzata live** (B12), form parametri con validazione per header/body/bottoni (incl. upload media header), invio; stato sync template (approved/pending/rejected/paused) come badge.

### E9. Composer interattivi (builder)

- Costruttore rapido reply-buttons (max 3) e list message (sezioni/righe con limiti live), CTA URL, invio Flow (picker flow pubblicati), carousel builder (opzionale, fase 2) — con anteprima WYSIWYG della bolla.

### E10. Stati del composer

- **Bloccato finestra chiusa:** input disabilitato, CTA "Invia template" + spiegazione.
- **Solo-lettura** (ruolo osservatore), **contatto bloccato**, **offline** (input attivo, messaggi in coda con ⏱), **rate-limited** (banner con countdown se l'host lo segnala).
- Chip **ice-breaker** configurabili su conversazione nuova/vuota.

### E11. Menzioni (gruppi)

- `@` → autocomplete membri (avatar+nome), chip evidenziata nel testo, rendering bold+colore nella bolla, notifica menzione nell'item lista (badge @).

---

## F. UI Gruppi (Cloud API Groups)

- Modello `chat_type: individual | group` ovunque dal giorno uno (lista, store, bolle).
- **Bolle:** nome mittente colorato deterministico sopra la prima bolla del gruppo di messaggi + avatar mini a lato (mobile: solo colore); "Tu" per outbound.
- **Header gruppo:** icona, nome, "N partecipanti", subject tap → drawer.
- **Drawer info gruppo:** foto (upload/crop), nome e descrizione editabili (con permessi), lista membri virtualizzata con ricerca (ruolo admin badge), azioni per membro (messaggio 1:1, promuovi/rimuovi admin, rimuovi dal gruppo), **aggiungi partecipanti** (picker), **link di invito con QR code** (genera/revoca/condividi), **richieste di ingresso** (approva/rifiuta con lista), impostazioni permessi (chi scrive: tutti/solo admin; chi modifica info), silenzia gruppo, abbandona/elimina.
- Messaggi di sistema gruppo (B13): "Sei stato aggiunto", "X ha aggiunto Y", "X è uscito", "X ora è admin", cambio nome/icona.
- "Info messaggio" nei gruppi: consegnato/letto **per destinatario** (D1 con `recipient_id`).
- Menzioni (E11) e "Rispondi in privato" (C).

---

## G. Chiamate (Calling API)

- **Bolla richiesta permesso chiamata** (B11) con stati.
- **Pulsante chiamata** in header chat (voce; video se/quando supportato) — abilitato solo con permesso accordato; tooltip vincoli.
- **Banner chiamata in arrivo** (overlay top, ovunque nella app): avatar, nome, Accetta/Rifiuta (+ "Rifiuta con messaggio" quick replies); suoneria con rispetto di mute/DND; su extension → `chrome.notifications`.
- **Schermata chiamata attiva:** timer, mute/unmute, vivavoce/selezione output audio, tastierino DTMF opzionale, minimizza a pill flottante (persistente durante la navigazione tra chat), riaggancia; stati qualità connessione; su mobile fullscreen con proximity handling delegato al browser.
- **Registro chiamate:** tab/sezione con filtri (tutte/perse), direzione+esito+durata, richiama, pill in-chat "Chiamata vocale · 12:34 · 5 min" per ogni chiamata conclusa/persa.
- Nice-to-have: indicatore registrazione/trascrizione della chiamata (se l'host la fornisce).
- Tutto il layer media (WebRTC/SDP) è dell'host: la UI espone solo componenti e eventi (`call_incoming`, `call_state`, `call_action`).

---

## H. UX trasversale della chat

### H1. Scroll e cronologia

- **Lista messaggi virtualizzata** (10k+ messaggi, altezze variabili, ancoraggio stabile senza jump): requisito hard.
- Scroll infinito verso l'alto con paginazione dall'host (`loadOlder(before_id)`), spinner in testa, preservazione della posizione.
- **FAB scroll-to-bottom** con contatore nuovi messaggi + badge @menzione; auto-scroll SOLO se l'utente è già al fondo; pill "Nuovi messaggi" come separatore.
- Separatori giorno sticky durante lo scroll.
- Apertura chat: posizionamento al primo non letto (o al fondo); deep-link a message_id.

### H2. Drawer info contatto/gruppo con galleria

- Info contatto: avatar (tap → fullscreen), numero, business info, etichette, mute, blocco.
- **Galleria condivisa a tab: Media / Link / Documenti** (griglia virtualizzata per mese, tap → lightbox B2), contatori.
- Sezione impostazioni conversazione: sfondo per-chat, mute, segnala, elimina.

### H3. Temi e sfondi

- **Light/Dark** (token CSS custom properties su tutto), auto da `prefers-color-scheme`, override manuale persistito.
- Sfondi chat stile WhatsApp: pattern doodle di default (asset locale), tinta unita da palette, immagine custom upload, opacità/dimming separato per dark; per-chat override.
- Interfaccia di theming pubblica: mappa completa di design token (colori bolle, accent, ACK blu, pill, ecc.) per rebranding white-label.

### H4. Affidabilità percepita (optimistic UI)

- Invio ottimistico: bolla immediata con ⏱ + client_id temporaneo → riconciliazione con message_id reale alla conferma (senza re-render visibile).
- **Coda offline:** messaggi composti offline restano in coda visibile ("In attesa della connessione"), invio automatico al reconnect, annullabili.
- Dedup per message_id su tutto lo stream; riconciliazione ACK tardivi (D1).
- Banner di riconnessione con re-sync ("Aggiornamento in corso…") delegato all'host.

### H5. Notifiche

- Adapter notifiche: browser Notification API (web/SPA), **`chrome.notifications`** (extension), badge titolo/tab con contatore non letti, favicon badge, suono nuovo messaggio (asset locale, toggle), vibrazione su mobile, rispetto mute per-chat e DND globale; click sulla notifica → focus app + apertura chat.
- Anteprima contenuto nelle notifiche disattivabile (privacy).

### H6. Scorciatoie tastiera (desktop)

- Ctrl/Cmd+K nuova chat/ricerca, ↑/↓ navigazione lista, Esc chiudi/annulla, Ctrl+F ricerca in chat, frecce nel lightbox, ecc. Cheat-sheet richiamabile con `?`.

---

## Q. Team Inbox — multi-operatore, assegnazione, bot

> Derivata dall'analisi del modulo `evolution_odoo` (evolution_chatter + evolution_automation_bot + evolution_smart_chatter). Non ne replichiamo l'implementazione: ne estraiamo i concetti operativi validati e li ridefiniamo come componenti del nostro `chat-ui`. Questo layer è ciò che distingue "clone WhatsApp" da "inbox di team su WhatsApp".

### Q1. Modello conversazione esteso (campi che la UI deve rappresentare)

- `assigned_user_id` + `assigned_at` (assegnatario corrente), `previous_assigned_user_id` (continuità: se il cliente riscrive dopo pausa, la UI suggerisce il vecchio assegnatario), `assignment_failed` (flag audit: nessun candidato trovato — icona ⚠️ per i manager).
- `state: open | done` + `closed_at` (lifecycle conversazione, distinto dall'archiviazione).
- `is_bot` (sessione bot attiva sulla chat) + riferimento all'agente/run.
- Presenza contatto: `is_online`, `is_typing`, `presence` (predisposti, data-source dipendente).
- Record collegati per numero di telefono (`phone_match`: lead, ordini, partner…).

### Q2. Attribuzione autore nella bolla (requisito chiave)

Su WhatsApp il cliente vede un solo numero; nell'inbox il team DEVE vedere chi ha scritto cosa. Ogni bolla **outbound** porta l'attribuzione:

- **Riga autore** sopra il contenuto (prima bolla del gruppo): avatar mini (20px) + nome operatore, colore deterministico per utente (stessa palette dei gruppi F).
- Varianti di autore: **operatore corrente** ("Tu"), **altro operatore** (nome+avatar), **bot** (badge 🤖 + nome agente, stile bordo dedicato), **automazione/campagna** (badge ⚡ + nome regola/campagna), **echo da altro dispositivo/API** (badge dispositivo da `source`: Android/iOS/Web/API — messaggio inviato fuori dalla nostra UI).
- Il **raggruppamento bolle si interrompe al cambio di autore** anche entro i 2 minuti.
- Inbound nei 1:1: `push_name` (nome WhatsApp del cliente) mostrato nel drawer, non sulla bolla.
- Tooltip/dettaglio: "Inviato da Laura Bianchi · 14:32 · da Web".

### Q3. Assegnazione e trasferimento chat

- **Widget assegnatario in header chat:** avatar+nome dell'assegnatario o pill "Non assegnata" (ambra); click → menu: "Assegna a me", "Assegna a…" (dialog con ricerca utenti, avatar, stato online, carico chat aperte), "Rilascia".
- **Trasferimento** con nota/motivo opzionale (visibile nella timeline e come pill).
- **Pill di sistema in-chat** per ogni transizione: "Laura ha assegnato la chat a Marco · 14:32", "Chat rilasciata", "Riassegnata automaticamente (timeout)", "Auto-assegnata (regola: responsabile del record)".
- **Lista conversazioni:** mini-avatar assegnatario sull'item; filtri **Mie / Non assegnate / Tutte / Per utente**; contatore coda non assegnate (badge ambra) separato dal contatore personali (badge verde) — pattern a doppio badge del systray Odoo.
- Vista manager opzionale: raggruppamento per assegnatario + chat `assignment_failed` in evidenza.

### Q4. Stato conversazione (open/done)

- Pulsante **Chiudi conversazione** (✓) in header → pill "Chiusa da Laura"; **Riapri** manuale; **riapertura automatica** su nuovo inbound → pill "Riaperta automaticamente".
- Filtro Aperte/Chiuse/Tutte nella lista; le chiuse escono dalla coda operativa senza sparire dallo storico.

### Q5. Bot / AI agent sulla conversazione

- **Banner automazione** sotto l'header quando il bot è attivo: "🤖 [Nome agente] sta gestendo questa conversazione" + stato (attivo/in pausa) + pulsante **"Intervieni"** (takeover esplicito).
- **Takeover implicito:** se l'operatore scrive mentre il bot è attivo, il bot va in pausa → pill "Laura è subentrata all'agente"; il banner scompare/cambia stato in tempo reale (event-driven).
- **Bolle del bot:** attribuzione Q2 con badge 🤖, typing indicator "[Agente] sta scrivendo…" con icona bot; supporto risposta multi-messaggio (split) con delay naturale.
- **Handoff dal bot:** pill "L'agente ha trasferito la conversazione a un operatore" (+ motivo da exit-preset) e auto-assegnazione conseguente (pill Q3).
- **Trascrizione/estrazione AI dei media** (se fornita dall'host): blocco collassabile "✨ Trascrizione" sotto le bolle audio/vocale, "✨ Testo estratto" per immagini/documenti; stati: elaborazione (shimmer) / pronta / errore.
- **Riepilogo conversazione AI:** pulsante "✨ Riepilogo" nel drawer → card riassunto generato con timestamp e refresh.
- Toggle bot per-conversazione (attiva/disattiva l'agente su questa chat) con permessi.

### Q6. Timeline attività (audit)

- Tab "Attività" nel drawer: cronologia eventi con icona, utente, timestamp, motivo — tipi: assegnata / rilasciata / auto-assegnata / auto-rilasciata / riassegnata per timeout / chiusa / riaperta / riaperta auto / risposta fuori orario inviata / messaggio in coda inviato / outbound inviato.
- Le stesse voci principali compaiono come pill in-chat (Q3/Q4); la timeline è la vista completa filtrabile.

### Q7. Contesto record collegati (concetto "smart chatter")

- **Chip contesto in header/drawer:** "Collegata a: 🎯 Lead #123 · 🧾 Ordine S00042" (match per telefono) con navigazione verso il record (hook host) e selettore quando i match sono multipli.
- **Apertura inversa** (da record esterno → chat): la UI è invocabile con deep-link `(numero, istanza)`; se esistono più istanze/numeri business → **dialog selettore istanza**; se il numero non è su WhatsApp → stato "verifica fallita" con retry.
- Composer contestuale: invio template pre-compilato con variabili dal record (nome cliente, numero ordine…).

### Q8. Fuori orario (office hours) e preferenze utente

- Badge "Fuori orario" in header quando la casella è fuori dall'orario configurato; pill in-chat "Risposta automatica fuori orario inviata" (con cooldown giornaliero gestito dall'host); hint nel composer.
- **Opt-out marketing** (webhook `user_preferences`): pill in-chat "L'utente ha disattivato i messaggi promozionali" + hint nel composer/template picker (template marketing bloccati per questo contatto); pill inversa su resume.

### Q9. Note interne

- Tab/toggle nel composer: **Messaggio | Nota interna** (stile chatter Odoo); la nota si renderizza come bolla gialla con icona 📝 e autore, visibile solo al team, MAI inviata a WhatsApp; menzioni @collega nelle note (notifica interna via hook).

### Q10. Presenza operatori e anti-collisione

- Avatar-stack "chi sta guardando questa chat" in header (bus/presence dell'host); indicatore "Laura sta scrivendo…" (lato team) nel composer per evitare doppie risposte; lock morbido opzionale ("Laura sta rispondendo — vuoi comunque scrivere?").

### Q11-bis. Pannello contesto cliente (colonna destra a comparsa)

Pannello a comparsa all'**estrema destra** (desktop: colonna 340px toggle dall'header o da tasto ⓘ; mobile/side panel: schermata push o bottom-sheet full-height). Struttura ad **accordion di sezioni collassabili, ordinabili e configurabili dall'host** — è la superficie CRM della chat:

- **Profilo cliente:** avatar grande, nome (+ `push_name` WhatsApp se diverso), **numeri di telefono multipli** (badge canale/verificato WhatsApp, azione "chatta su questo numero"), email, azienda, lingua, fuso orario, etichette (chip editabili inline).
- **Attributi personalizzati / campi custom:** lista key-value **schema-driven** (lo schema arriva dall'host: tipi testo, numero, data, select, multi-select, checkbox, URL); editing inline con validazione per tipo e salvataggio via evento; sezione "aggiungi attributo"; campi vuoti collassati sotto "Mostra altri (N)".
- **Ultime automazioni:** timeline delle automation/campagne eseguite sulla conversazione (icona ⚡/🤖, nome regola o campagna, esito ✓/✗/in corso, timestamp, "vedi dettagli" → hook host); stato bot corrente (agente, sessione, ultima attività).
- **Record collegati** (Q7): lead/ordini/ticket con navigazione.
- **Conversazioni precedenti:** elenco altre chat dello stesso contatto (altri numeri/istanze) con stato e data.
- **Attività** (Q6) e **Galleria media** (H2) come sezioni/tab dello stesso pannello.
- Header pannello: titolo + matita "modifica contatto" + X chiudi; stato loading skeleton per sezione; empty state per sezione; larghezza persistita.
- Tutto il contenuto è fornito via eventi/adapter (`contact.profile`, `attributes.schema`, `automation.history`): la UI non conosce il CRM sottostante.

### Q11. Quick Chat Popover (mini-chat — riferimento diretto per l'estensione Chrome)

Pattern validato dal systray di `evolution_odoo`: **la stessa finestra chat completa, incapsulata in un contenitore compatto ancorato** (popover/panel ~380×580px). È il blueprint del popup/side panel MV3 e del widget embeddable:

- **Trigger con doppio badge:** icona canale + badge verde (mie assegnate) sovrapposto a badge ambra (non assegnate, se permesso) — aggiornati in tempo reale via eventi, senza re-render della lista aperta.
- **Pannello:** header a tab **Assegnate | Non assegnate** (con contatori) + azioni (refresh, apri app completa); lista compatta di conversazioni — ogni item su 3 righe: (1) nome + orario, (2) badge istanza/numero + canale + numero partecipante, (3) ACK ultimo outbound (✓/✓✓/✓✓blu/✗) + 🔒 lucchetto finestra 24h chiusa + icona/label tipo media + preview + badge non letti; "Mostra altre (N)" oltre le prime 5; empty state e loading state; footer "Vedi tutte".
- **Hover/click su item → mini-chat completa in popover:** `ChatWindow` intero (header ridotto, message list virtualizzata, composer) con prop di configurazione `showInputArea` (true = risposta rapida inline, false = sola anteprima) e `readonly` — la risposta veloce avviene SENZA lasciare il contesto in cui ci si trova.
- Regola architetturale che ne deriva per il nostro package: **`ChatWindow` deve essere un componente auto-contenuto e parametrizzabile** (dimensioni imposte dal contenitore, input opzionale, readonly, anchor/portal configurabile) montabile in: colonna principale, popover, side panel MV3, popup MV3, widget in pagina terza.
- Nel mockup: questa superficie va rappresentata come schermata separata (vedi R).

---

## M. MOBILE USE — requisiti dedicati

### M1. Navigazione e layout

- Stack navigation a colonna singola: Lista → Chat → Drawer; **back gesture** (swipe-from-edge) e pulsante back hardware/browser gestiti correttamente (History API: ogni livello è una entry — il back chiude prima lightbox/sheet/drawer, poi la chat, mai esce dall'app a sorpresa).
- Header compatti (56px), FAB "nuova chat" nella lista, bottom-safe spacing.
- **Safe areas** iOS/Android (`env(safe-area-inset-*)`) su header, composer, sheet.
- Orientamento portrait ottimizzato; landscape supportato (composer e lightbox adattivi).

### M2. Gesture (parity WhatsApp mobile)

- **Swipe destro su bolla = rispondi** (con haptic).
- **Long-press su bolla = context menu + barra reaction**; long-press su item lista = multi-selezione conversazioni.
- **Swipe su item lista** = archivia / altro (A2).
- **Pinch-to-zoom** in lightbox e sulle immagini; **swipe-down per chiudere** il lightbox; swipe orizzontale tra media.
- **Pull-to-refresh** nella lista conversazioni.
- Registratore vocale: hold / slide-cancel / swipe-up-lock (E5).
- Tap su header chat = drawer info; doppio-tap opzionale reaction (B9).

### M3. Tastiera virtuale e viewport

- Gestione `visualViewport` / `interactive-widget=resizes-content`: il composer resta sopra la tastiera, la lista messaggi mantiene l'ancoraggio al fondo all'apertura tastiera (no salti).
- Passaggio fluido tastiera ↔ emoji picker (stessa altezza, senza collasso del layout).
- `enterkeyhint="send"` configurabile; font-size input ≥16px (no zoom forzato iOS); autocapitalize/autocorrect abilitati.

### M4. Touch e ergonomia

- Target minimi 44×44px; spaziatura anti-fat-finger su azioni distruttive; bottom-sheet al posto di popover/dropdown per: allegati, emoji, list message, reaction detail, menu contestuali; scrim + drag-handle + snap points (mezza/piena altezza).
- Haptic feedback (Vibration API) su: long-press, swipe-reply aggancio, invio vocale, errori.

### M5. Performance mobile

- 60fps sullo scroll virtualizzato anche su device mid-range (test su CPU throttled 4×); immagini responsive (`srcset`) e lazy; decoding async; limiti memoria per media in cache; animazioni GPU-only (transform/opacity) con `prefers-reduced-motion` rispettato.
- Bundle: core chat < 500KB gzip (budget dal brief), code-splitting per lightbox/recorder/mappe/flow-webview.

### M6. PWA (browser mobile → app installabile)

- Manifest (icone maskable, `display: standalone`, theme-color per light/dark), splash.
- **Push notifications** via Push API/service worker (adapter — l'host fornisce il canale), badge API per contatore non letti.
- Offline shell: apertura istantanea con cache locale conversazioni recenti (storage adapter → IndexedDB configurabile), coda invii offline (H4).
- **Share Target** (ricevere condivisioni di file/testo da altre app verso una chat) e Web Share (inviare fuori).
- File System Access/download fallback per salvataggio media; permessi camera/mic con flussi di richiesta contestuali.

### M7. Capacità native via adapter (progressive enhancement)

- Contact Picker API (Android) per E3-contatto; Geolocation per posizione; Screen Wake Lock durante chiamate; Picture-in-Picture per video; Clipboard API asincrona; tutte dietro feature-detection con fallback UI.

---

## I. Accessibilità (WCAG 2.2 AA)

- Lista messaggi con ruolo `log`/`feed`, annunci SR per nuovi messaggi (aria-live polite, "Mario: testo, 14:02, consegnato"), navigazione bolla-per-bolla da tastiera (frecce), azioni raggiungibili senza hover.
- Focus management rigoroso su modali/sheet/lightbox (trap + restore), skip-link tra pannelli.
- Contrasto AA su entrambe i temi (incl. testo su sfondi chat custom: scrim automatico), stati focus visibili, no informazione affidata al solo colore (ACK: forma + colore).
- Screen reader label complete per ogni icona/ACK/tipo messaggio; waveform e countdown con equivalente testuale; supporto font scaling 200% senza rotture; `prefers-reduced-motion`; input vocale non richiesto per nessuna funzione.

## J. i18n / l10n

- Tutte le stringhe esternalizzate (ICU MessageFormat, plurali), lingue illimitate, fallback chain.
- **RTL completo**: mirroring layout (bolle, ACK, swipe direction invertite), `dir="auto"` sul testo messaggi (bidi corretto in chat miste), numerali localizzati.
- Date/ore localizzate (Intl), formattazione numeri/valute negli ordini, nomi template multilingua (E8).

## K. Impostazioni UI (pannello)

- Tema, sfondi, densità, dimensione font messaggi, suoni/notifiche/anteprime, conferme di lettura, invio con Invio, lingua, media auto-download (per tipo/rete), etichette CRUD, risposte rapide CRUD, scorciatoie, privacy (blocco lista), esportazione conversazione (se host abilita), debug mode (payload raw, badge template).

## L. Stati vuoti, caricamento, errore (ogni superficie)

- Skeleton per: lista, chat, drawer, galleria, template picker.
- Empty state per: nessuna conversazione, nessun risultato ricerca, chat nuova (ice-breakers), galleria vuota, nessun template.
- Error state con retry per: caricamento cronologia, media, template, connessione (banner globale), pagina di crash con reload (error boundary per pannello — un crash nella chat non butta giù la lista).

---

## N. Contratto UI ↔ host (superficie eventi, riepilogo)

**Ingresso (host → UI):** `message.new`, `message.updated (edit)`, `message.deleted (revoke)`, `message.reaction`, `status.update (message_id, sent|delivered|read|failed, recipient_id?, errors?)`, `presence.typing/recording/online`, `window.state (open|closed|ctwa, expires_at)`, `conversation.updated`, `templates.list`, `call.incoming/state`, `media.ready (url firmato)`, `history.page`, `assignment.changed (user, by, reason)`, `conversation.state (open|done, by, auto?)`, `bot.status (agent, running|paused|stopped)`, `bot.handoff (reason)`, `media.ai (transcript|extract, state)`, `activity.logged`, `team.presence (viewers, composing)`, `badge.counts (assigned, unassigned)`, `records.matched (refs)`, `contact.profile`, `attributes.schema` + `attributes.values`, `automation.history (runs)`, `contact.conversations (altre chat)`.
**Uscita (UI → host):** `send.text/media/location/contacts/interactive/template/reaction`, `send.note (interna)`, `message.retry/delete/forward/star/pin`, `chat.open/read (mark_as_read)`, `typing.start/stop`, `history.load (before_id)`, `media.request (media_id)`, `call.accept/reject/hangup/action`, `search.query`, `draft.save`, `assignment.claim/set/release (user_id?, note?)`, `conversation.close/reopen`, `bot.interrupt/toggle`, `summary.request`, `record.open (ref)`, `attribute.update (key, value)`, `contact.update (campo profilo)`, `label.add/remove`.
**Adapter iniettabili:** storage (localStorage/IndexedDB/`chrome.storage`), notifiche, mappe statiche, link-preview, contatti, recorder, telemetria. Tutti con default web e override extension.

## O. Vincoli non funzionali (riepilogo dal brief, invariati)

- React 18/19; nessun import `next/*` nel package UI; SSR-safe ma non SSR-dipendente; TypeScript strict; styling a CSS variables + Tailwind (MV3/Shadow-DOM-safe, portal container configurabile ovunque); zero codice remoto/CDN a runtime; asset (emoji, suoni, pattern sfondo, font) bundle-local; virtualizzazione nativa; licenze MIT/Apache-2.0 per tutte le dipendenze; i18n/RTL/a11y come sopra; bundle core < 500KB gzip.

## P. Fuori scope UI v1 (esplicito)

Stati/Stories, Canali, Community, sondaggi in invio, messaggi effimeri/view-once in invio, live location, pagamenti in-chat (order_details/order_status India/Brasile — predisposto solo il rendering fallback B18), multi-device/companion, crittografia client-side.

---

## R. Inventario componenti per il mockup statico

Scopo: questa sezione è il **distinto base per generare il mockup statico HTML** della chat. Ogni componente elenca gli stati/varianti da rappresentare visivamente. Il mockup deve mostrare dati realistici finti (nomi, orari, contenuti it-IT) e coprire le 4 superfici: **Desktop 3-pannelli · Mobile stack · Side panel 380px · Quick Popover**.

### R1. Shell e superfici

| Componente               | Varianti/stati da disegnare                                                                                                                                                                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`               | desktop 3-pane (lista 380px + chat + **pannello contesto 340px a comparsa**) · mobile single-column · side panel 380px                                                                                                                                                                                      |
| `ContextPanel` (Q11-bis) | aperto con: profilo (2 numeri, email, 3 etichette) · accordion **Campi personalizzati** (5 campi tipizzati, 1 in editing inline) · **Ultime automazioni** (3 run: campagna ✓, bot in corso 🤖, regola ✗) · record collegati · conversazioni precedenti (2) · variante chiusa (solo chat espansa) · skeleton |
| `QuickChatTrigger` (Q11) | icona + doppio badge (verde 3 / ambra 2)                                                                                                                                                                                                                                                                    |
| `QuickChatPanel` (Q11)   | tab Assegnate/Non assegnate, 5 item + "Mostra altre (4)", footer                                                                                                                                                                                                                                            |
| `MiniChatWindow` (Q11)   | popover 380×580 con composer · variante readonly                                                                                                                                                                                                                                                            |

### R2. Lista conversazioni

| Componente               | Varianti/stati                                                                                                                                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ConversationListHeader` | avatar business, switcher numero (2 numeri), ricerca, ⊕ nuova chat                                                                                                                                                                                                                                             |
| `FilterChips`            | Tutte · Non lette(4) · **Mie(3) · Non assegnate(2)** · Gruppi · Etichette · Chiuse                                                                                                                                                                                                                             |
| `ConversationItem`       | ① non letta (badge 2, preview testo) ② outbound read (✓✓ blu + "Tu:") ③ con 🎤 vocale 0:42 ④ con 📷+caption ⑤ "sta scrivendo…" ⑥ fissata+silenziata ⑦ **assegnata ad altro (mini-avatar)** ⑧ **non assegnata (pill ambra)** ⑨ failed ✗ ⑩ 🔒 finestra chiusa ⑪ gruppo con @menzione ⑫ bozza ⑬ **bot attivo 🤖** |
| `SectionArchived`        | riga collassata "Archiviate (12)"                                                                                                                                                                                                                                                                              |
| Stati globali            | skeleton ×6 · empty state · banner offline                                                                                                                                                                                                                                                                     |

### R3. Header chat e banner

| Componente              | Varianti/stati                                                                   |
| ----------------------- | -------------------------------------------------------------------------------- |
| `ChatHeader`            | avatar, nome, "online/ultimo accesso", 📞, 🔍, ⋮                                 |
| `AssignmentWidget` (Q3) | assegnata a me · ad altro · non assegnata (ambra) · menu aperto con lista utenti |
| `WindowBadge` (D5)      | verde "5h 12m" · ambra "1h 03m" · rosso chiusa · CTWA estesa                     |
| `BotBanner` (Q5)        | attivo con "Intervieni" · in pausa post-takeover                                 |
| `PinnedBar`             | 2 messaggi fissati ciclabili                                                     |
| `OfficeHoursBadge` (Q8) | fuori orario                                                                     |
| `RecordChips` (Q7)      | "🎯 Lead #123 · 🧾 S00042"                                                       |
| `TeamPresence` (Q10)    | avatar-stack 2 viewer + "Laura sta scrivendo…"                                   |

### R4. Message list — matrice bolle (il cuore del mockup)

Rappresentare TUTTE in un'unica conversazione demo scrollabile:

1. Pill data "OGGI" + pill "2 MESSAGGI NON LETTI"
2. Testo inbound con _formattazione_ completa + link preview card
3. Testo outbound `read` con **attribuzione "Tu"** (Q2)
4. Testo outbound di **altro operatore** (avatar+nome "Marco R.") `delivered`
5. Bolla **bot** 🤖 "Agente Aria" con risposta split in 2 bolle
6. Immagine con caption + album 2×2 "+3"
7. Video con poster/durata · Documento PDF 2,4 MB
8. **Vocale** con waveform, 1.5×, mic blu (ascoltata) + blocco "✨ Trascrizione" espanso
9. Sticker + reaction ❤️👍 (contatore 2)
10. Posizione con mappa · vCard contatto ("Avvia chat")
11. **Reply buttons** outbound (3 bottoni) → **button_reply** inbound quotata
12. **List message** (bottone ☰) + bottom-sheet aperto (screenshot separato)
13. **Template** completo: header immagine, body variabili, footer, quick reply + URL + **copy code** · badge "Template · promo_luglio · it"
14. **Carousel** 3 card visibili con snap
15. **Flow completato** ✓ (nfm_reply riepilogo campi) · **Ordine** 🛒 2 item + totale
16. Pill sistema: "Riaperta automaticamente" · "Laura ha assegnato a Marco" · "Laura è subentrata all'agente" (Q3-Q5)
17. **Nota interna** gialla 📝 (Q9)
18. Eliminato 🚫 · "modificato" · Inoltrato ↪ · `failed` ✗ con Riprova · `pending` ⏱ · fallback "non supportato" ⚠️
19. FAB scroll-to-bottom con badge 3 · separatore "IERI"
20. **Richiesta posizione** outbound (CTA "Invia posizione") → risposta posizione inbound
21. **Address message** outbound (CTA "Fornisci indirizzo") → card indirizzo strutturato inbound
22. **Richiesta permesso chiamata** (in attesa) + pill "Ha accettato la richiesta di chiamata" + **pill chiamata conclusa** "📞 Chiamata vocale · 5 min"
23. **Card referral CTWA**: "Conversazione avviata dall'annuncio [anteprima ad]" + badge finestra 72h
24. **Template Limited-Time Offer** con countdown live "Scade tra 23:59:12" + copy code · variante scaduta
25. **Template Authentication/OTP**: codice `483-291` monospace + bottone one-tap autofill
26. **Single product** (immagine+nome+prezzo) · **Multi-product** (sezione 3 item) · **Card catalogo** con CTA
27. Bolla **echo da altro dispositivo** (badge 📱 "da Android/API" — Q2) · pill **opt-out marketing** "L'utente ha disattivato i messaggi promozionali" (webhook `user_preferences`) con hint nel composer

### R5. Composer

| Stato                     | Contenuto                            |
| ------------------------- | ------------------------------------ |
| Default                   | textarea, 😀, 📎, 🎤, template btn   |
| Reply banner aperto       | quote + X                            |
| **Bloccato 24h**          | lock + CTA "Invia template"          |
| Registrazione vocale      | timer, slide-cancel, lucchetto       |
| **Tab Nota interna** (Q9) | toggle Messaggio/Nota, sfondo giallo |
| Menu allegati aperto      | griglia 6 voci (mobile bottom-sheet) |
| Emoji picker aperto       | con skin tone selector               |
| Slash `/` risposte rapide | popover 3 voci                       |
| Offline                   | coda "1 in attesa ⏱"                 |

### R6. Drawer/pannelli/dialog

Info contatto (+galleria Media/Link/Doc a tab) · **Tab Attività** con 6 voci timeline (Q6) · **Riepilogo ✨** (Q5) · Info messaggio (consegnato 14:32 / letto 14:35; nei gruppi per-destinatario) · Picker template con anteprima live e badge stato (approved/pending/rejected/paused) · Dialog "Assegna a…" con ricerca utenti · Dialog inoltra multi-select (max 5) · Lightbox immagine (zoom, contatore "3 di 12") · Selettore istanza (Q7) · **Sheet "chi ha reagito"** (B9) · Bottom-sheet list message aperto (B11)

### R7. Tema

Ogni schermata del mockup in **light E dark**; sfondo chat doodle WhatsApp; palette token (verde #00a884 accent, bolla out #d9fdd3/#005c4b, ACK blu #53bdeb) come default sostituibile.

### R8. Chiamate (sezione G — schermate dedicate)

| Componente           | Stati                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `IncomingCallBanner` | overlay top: avatar, nome, Accetta/Rifiuta                                                           |
| `ActiveCallScreen`   | timer 02:34, mute attivo, vivavoce, riaggancia · variante minimizzata (pill flottante sopra la chat) |
| `CallLog`            | lista: in arrivo ✓ / persa (rossa) / in uscita, durata, richiama                                     |
| `CallButton` header  | abilitato · disabilitato con tooltip "Permesso non accordato"                                        |

### R9. Schermate secondarie (completezza mockup)

1. **Ricerca globale** attiva: risultati raggruppati Conversazioni/Messaggi/Contatti con highlight del termine.
2. **Ricerca in-chat**: barra sopra la lista messaggi, contatore "2 di 8", frecce su/giù, messaggio evidenziato.
3. **Nuova chat**: picker contatti + input numero E.164 con validazione + variante "fuori finestra → parti da template".
4. **Modalità multi-selezione**: header trasformato (× · "3 selezionati" · inoltra/elimina/star/copia), checkbox sulle bolle.
5. **Vista Messaggi importanti** (starred) cross-chat.
6. **Chat vuota** con chip ice-breaker (E10).
7. **Conversazione di gruppo demo**: nomi membri colorati, @menzione evidenziata, pill "Sei stato aggiunto", info messaggio per-destinatario.
8. **Impostazioni** (una schermata: tema, sfondi, notifiche, conferme lettura, risposte rapide, etichette).
9. Una schermata **RTL** (arabo demo) a prova del mirroring (J).

---

## S. Stack di stile e framework (decisione)

**Tailwind CSS v4** come sistema di stile unico, con queste 4 regole vincolanti (derivate dai target standalone / estensione MV3 / widget iniettato / mobile futuro):

1. **Token prima di Tailwind:** tutti i colori/spaziature/raggi del tema sono CSS custom properties dichiarate su `:host`/`.chat-root`; Tailwind è mappato sui token (utility semantiche tipo `bg-bubble-out`). Light/dark/white-label cambiano SOLO i token, mai le classi.
2. **Preflight scoped:** il reset Tailwind confinato al root del package (`@layer` dentro `.chat-root`/shadow root). Il widget iniettato non deve toccare il CSS della pagina ospite.
3. **Shadow DOM-ready:** CSS compilato iniettato via `adoptedStyleSheets` (constructable stylesheet) nel shadow root del content script; **build con conversione rem→px** (o `font-size` fissato su `:host`) perché nel shadow DOM i rem ereditano il root della pagina ospite.
4. **Portal container configurabile ovunque:** ogni overlay (modali, emoji picker, menu, tooltip, sheet) accetta `portalContainer` — mai `document.body` hardcoded.

| Layer            | Scelta                                                                                                                 | Motivo                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Stile            | **Tailwind v4** + design token CSS vars                                                                                | CSS statico, zero runtime/eval/CDN → MV3-safe; theming via token |
| Primitive UI     | **shadcn/ui** (Radix) — **copiato nel repo**, non dipendenza npm                                                       | ownership del codice, portal configurabile, a11y inclusa         |
| Virtualizzazione | TanStack Virtual (o react-virtuoso)                                                                                    | 10k+ messaggi, altezze variabili                                 |
| Emoji            | emoji-mart, asset locali, lazy                                                                                         | MV3, shadow-DOM-safe                                             |
| Waveform         | wavesurfer.js, lazy                                                                                                    | note vocali                                                      |
| Build            | Vite lib-mode; monorepo `packages/chat-core` (headless TS) + `packages/chat-ui` (React) + `apps/web · spa · extension` | un sorgente, N superfici                                         |

**Widget iniettato (estensione):** il content script monta la variante compatta di `ChatWindow` (Q11) in shadow root; l'azione "Espandi" apre la **full UI nel side panel** via messaggio al service worker — mai un secondo mount pesante nella pagina ospite.
**Mobile futuro:** la PWA (M) copre il telefono con la stessa base; eventuale nativo → React Native + NativeWind riusa le classi Tailwind, `chat-core` resta invariato.

---

## T. Dataset demo payload-driven (fixtures per il mockup)

Il mockup statico NON va hardcodato: va **generato da un file di fixtures** che replica i payload webhook reali. Così il mockup valida anche il modello dati e diventa il seme dei test. File: `fixtures/demo-dataset.json`.

### T1. Struttura

```
{ account: {...}, users: [operatori], agents: [bot],
  conversations: [ ~8 conversazioni che coprono R2 ①–⑬ ],
  messages: { <conv_id>: [ ...bolle R4 1–27, in forma payload Cloud API ] },
  statuses: [ sequenze sent→delivered→read + failed con error object ],
  events: [ assignment.changed, bot.status, conversation.state, activity.logged ],
  templates: [ marketing+utility+auth, incl. carousel e LTO ],
  calls: [ log R8 ],
  contacts_profiles: [ profilo completo: numeri multipli, email, etichette ],
  attributes_schema: [ 5+ campi custom tipizzati (testo, numero, data, select, checkbox) ],
  attributes_values: { <contact_id>: {...} },
  automation_runs: [ campagna ✓ · bot in corso · regola fallita ✗, con timestamp ] }
```

### T2. Copertura payload obbligatoria (1 fixture per ciascuno)

- **Inbound `messages`** (forma webhook Meta): `text` (con context/reply, con referral CTWA), `image`, `video`, `audio` (voice: true), `document`, `sticker` (animated), `location`, `contacts` (×2), `reaction`, `button` (template reply), `interactive.button_reply`, `interactive.list_reply`, `interactive.nfm_reply` (flow), `order`, `system`, `edit`, `revoke` (deleted), `errors`, `unsupported`, messaggio gruppo (con `participant`), echo (`smb_message_echoes`), `user_preferences` (opt-out).
- **Outbound** (forma richiesta API): text formattato, media con caption, template (tutti i tipi bottone B12, LTO con `expiration_time`, OTP), interactive `button`/`list`/`cta_url`/`location_request_message`/`address_message`/`flow`/`call_permission_request`, product/product_list/catalog, reaction, nota interna (tipo proprietario `internal_note`), messaggi bot (`is_bot: true`, split ×2).
- **`statuses`**: oggetto conforme (id, status, timestamp, recipient_id, conversation{origin.type: service|marketing|utility|referral_conversion}, pricing, errors[{code, title, error_data.details}] con i codici mappati B17).
- Campi di attribuzione su ogni outbound: `sender: {kind: user|bot|automation|api, id, name, source}` (Q2).

### T3. Regola di mapping

Ogni fixture passa dal **normalizzatore `chat-core`** (payload Cloud API → modello messaggio interno → props componente). Il mockup statico consuma le props: se una fixture non è renderizzabile, manca un componente — il dataset è quindi anche il **test di completezza** della UI. Nessun dato inventato fuori dal dataset.

---

### Checklist di completezza vs webhook `messages` (verifica finale)

| Tipo webhook | Sezione |     | Tipo webhook            | Sezione |
| ------------ | ------- | --- | ----------------------- | ------- |
| text         | B1      |     | interactive (replies)   | B10     |
| image        | B2      |     | order                   | B10     |
| video        | B3      |     | button (template reply) | B10     |
| audio/voice  | B4      |     | edit                    | B14     |
| document     | B5      |     | revoke                  | B14     |
| sticker      | B6      |     | system                  | B13     |
| location     | B7      |     | errors                  | B17     |
| contacts     | B8      |     | unsupported             | B18     |
| reaction     | B9      |     | group events            | B13/F   |
| statuses     | D1      |     | referral/CTWA           | B13/D5  |

**Fonti:** [Meta — Send messages (tipi completi)](https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages) · [Meta — Interactive CTA URL](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-cta-url-messages/) · [CM.com — Interactive types & limiti](https://developers.cm.com/messaging/docs/whatsapp-interactive-messages) · [8x8 — Template components reference](https://developer.8x8.com/connect/docs/whatsapp/template-components-reference/) · [Meta — Authentication templates](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/authentication-templates/authentication-templates) · [YCloud — Limited-Time Offer](https://helpdocs.ycloud.com/help-center/whatsapp-basics/message-templates/limited-time-offer-template) · [Meta — Webhook fields reference (sessione precedente)](https://dualhook.com/docs/webhooks)
