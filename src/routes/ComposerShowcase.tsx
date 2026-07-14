import {
    Smile,
    Plus,
    Camera,
    Mic,
    Send,
    X,
    Lock,
    FileText,
    ChevronDown,
    Trash2,
    Pin,
    Image as ImageIcon,
    MapPin,
    User,
    Slash,
    WifiOff,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WAVEFORM_BARS = [40, 60, 80, 50, 70, 90, 40, 60, 30, 50, 70, 80, 40, 60, 50, 70, 40, 30].map(
    (value, n) => ({ id: `wf${n}`, value })
);
const EMOJI_SET = [
    "😀",
    "😂",
    "🥰",
    "😍",
    "🤔",
    "😎",
    "😢",
    "😡",
    "👍",
    "👎",
    "🙏",
    "👏",
    "🤝",
    "💪",
    "🎉",
    "🔥",
];

const BTN =
    "cursor-pointer transition-all duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel)";
const ICON_BTN =
    "cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel)";

export function ComposerShowcase() {
    return (
        <div className="h-full overflow-y-auto bg-(--bg-app) p-4 sm:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <header>
                    <h1 className="text-2xl font-bold">Composer · tutti gli stati</h1>
                    <p className="mt-1 text-sm text-(--fg-secondary)">
                        Specifica R5 / sezione E (E1–E11). Ogni card mostra uno stato del composer.
                    </p>
                </header>
                <StateCard
                    label="E1 · Default"
                    spec="Textarea auto-espandibile, Invio=invia, Shift+Invio=a capo"
                >
                    <DefaultComposer />
                </StateCard>
                <StateCard label="E6 · Reply banner" spec="Quote preview + X per chiudere">
                    <ReplyComposer />
                </StateCard>
                <StateCard
                    label="E10 · Bloccato finestra 24h"
                    spec="Input disabilitato + CTA Invia template"
                >
                    <BlockedComposer />
                </StateCard>
                <StateCard
                    label="E5 · Registrazione vocale"
                    spec="Timer + waveform live + slide-cancel + lock mani libere"
                >
                    <RecordingComposer />
                </StateCard>
                <StateCard
                    label="E9 · Tab Nota interna (Q9)"
                    spec="Toggle Messaggio/Nota, sfondo giallo"
                >
                    <InternalNoteComposer />
                </StateCard>
                <StateCard
                    label="E3 · Menu allegati aperto"
                    spec="Bottom-sheet griglia: foto/video, fotocamera, documento, contatto, posizione"
                >
                    <AttachmentsComposer />
                </StateCard>
                <StateCard
                    label="E2 · Emoji picker"
                    spec="Ricerca, categorie, skin tone selector, recenti"
                >
                    <EmojiPickerComposer />
                </StateCard>
                <StateCard
                    label="E7 · Risposte rapide (/)"
                    spec="Popover con ricerca fuzzy su titolo/contenuto + variabili"
                >
                    <CannedComposer />
                </StateCard>
                <StateCard
                    label="E10 · Offline"
                    spec="Coda visibile: messaggi in attesa della connessione"
                >
                    <OfflineComposer />
                </StateCard>
                <StateCard label="E10 · Ice breakers" spec="Chip su conversazione nuova/vuota">
                    <IceBreakersComposer />
                </StateCard>
            </div>
        </div>
    );
}

function StateCard({
    label,
    spec,
    children,
}: {
    label: string;
    spec: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-(--border-strong) bg-(--bg-panel) p-4 shadow-(--shadow-panel)">
            <div className="mb-2">
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-[11px] text-(--fg-tertiary)">{spec}</div>
            </div>
            <div className="rounded-lg bg-(--bg-panel-2) p-3">{children}</div>
        </div>
    );
}

function ComposerShell({ children, note }: { children: React.ReactNode; note?: boolean }) {
    return (
        <div
            className={cn(
                "rounded-lg px-2 py-1.5 shadow-(--shadow-bubble)",
                note ? "bg-(--bg-bubble-internal-note)" : "bg-(--bg-panel)"
            )}
        >
            {children}
        </div>
    );
}

function DefaultComposer() {
    return (
        <ComposerShell>
            <div className="flex items-end gap-2">
                <IconBtn aria-label="Emoji">
                    <Smile className="h-5 w-5" />
                </IconBtn>
                <IconBtn aria-label="Allega">
                    <Plus className="h-5 w-5" />
                </IconBtn>
                <textarea
                    rows={1}
                    placeholder="Scrivi un messaggio"
                    defaultValue=""
                    className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm text-(--fg-primary) placeholder:text-(--fg-tertiary) focus:outline-none"
                />
                <IconBtn aria-label="Fotocamera">
                    <Camera className="h-5 w-5" />
                </IconBtn>
                <button
                    type="button"
                    aria-label="Registra audio"
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <Mic className="h-5 w-5" />
                </button>
            </div>
        </ComposerShell>
    );
}

function ReplyComposer() {
    return (
        <ComposerShell>
            <div className="mb-1 flex items-center gap-2 rounded-l border-l-[3px] border-(--accent) bg-(--bg-panel-2) px-2 py-1 text-[12px]">
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-(--accent)">Giulia Romano</div>
                    <div className="truncate text-(--fg-secondary)">
                        Ciao! Volevo confermare l'ordine #S00042…
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="Chiudi risposta"
                    className="cursor-pointer text-(--fg-tertiary) transition-all duration-200 ease-out hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="flex items-end gap-2">
                <IconBtn aria-label="Emoji">
                    <Smile className="h-5 w-5" />
                </IconBtn>
                <IconBtn aria-label="Allega">
                    <Plus className="h-5 w-5" />
                </IconBtn>
                <textarea
                    rows={1}
                    placeholder="Scrivi un messaggio"
                    className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                />
                <button
                    type="button"
                    aria-label="Invia"
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </ComposerShell>
    );
}

function BlockedComposer() {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md bg-(--bg-bubble-error) px-3 py-2 text-xs text-(--status-failed)">
                <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Finestra 24h chiusa · solo template
                </span>
                <button
                    type="button"
                    className={cn(
                        "flex items-center gap-1 rounded bg-(--accent) px-2 py-0.5 text-(--accent-fg) hover:bg-(--accent-hover)",
                        BTN
                    )}
                >
                    <FileText className="h-3 w-3" /> Invia template
                </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-(--bg-panel) px-3 py-2.5 opacity-50">
                <Lock className="h-4 w-4 text-(--fg-tertiary)" />
                <span className="text-sm text-(--fg-tertiary)">Composer bloccato</span>
            </div>
        </div>
    );
}

function RecordingComposer() {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-(--bg-panel) px-3 py-2.5">
            <span className="text-(--status-failed)">●</span>
            <span className="font-mono text-sm tabular-nums">0:08</span>
            <div className="flex h-6 flex-1 items-center gap-0.5">
                {WAVEFORM_BARS.map((bar) => (
                    <span
                        key={bar.id}
                        className="w-0.5 rounded-full bg-(--accent)"
                        style={{ height: `${bar.value}%` }}
                    />
                ))}
            </div>
            <span className="text-[11px] text-(--fg-tertiary)">← slide per annullare</span>
            <button
                type="button"
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-(--status-failed)/10 text-(--status-failed) hover:bg-(--status-failed)/20",
                    ICON_BTN
                )}
                aria-label="Annulla"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button
                type="button"
                className={cn(
                    "flex items-center gap-1 rounded bg-(--bg-panel-2) px-2 py-1 text-[11px] text-(--fg-secondary) hover:bg-(--bg-hover)",
                    BTN
                )}
            >
                <Pin className="h-3 w-3" /> Lock
            </button>
            <button
                type="button"
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                    ICON_BTN
                )}
                aria-label="Invia"
            >
                <Send className="h-4 w-4" />
            </button>
        </div>
    );
}

function InternalNoteComposer() {
    const [tab, setTab] = useState<"message" | "note">("note");
    return (
        <ComposerShell note={tab === "note"}>
            <div className="mb-1 flex gap-1 border-b border-(--border-soft) pb-1">
                <button
                    type="button"
                    onClick={() => setTab("message")}
                    aria-pressed={tab === "message"}
                    className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium",
                        BTN,
                        tab === "message"
                            ? "bg-(--bg-panel) text-(--fg-primary)"
                            : "text-(--fg-tertiary) hover:bg-(--bg-hover)"
                    )}
                >
                    Messaggio
                </button>
                <button
                    type="button"
                    onClick={() => setTab("note")}
                    aria-pressed={tab === "note"}
                    className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium",
                        BTN,
                        tab === "note"
                            ? "bg-(--fg-warning)/20 text-(--fg-warning)"
                            : "text-(--fg-tertiary) hover:bg-(--bg-hover)"
                    )}
                >
                    📝 Nota interna
                </button>
            </div>
            <div className="flex items-end gap-2">
                <IconBtn>
                    <Smile className="h-5 w-5" />
                </IconBtn>
                <textarea
                    rows={1}
                    placeholder={
                        tab === "note"
                            ? "Scrivi una nota interna (visibile solo al team)…"
                            : "Scrivi un messaggio"
                    }
                    className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                />
                <button
                    type="button"
                    aria-label="Invia"
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                        ICON_BTN
                    )}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
            {tab === "note" && (
                <div className="mt-1 text-[11px] text-(--fg-warning) italic">
                    Mai inviata a WhatsApp · visibile solo al team
                </div>
            )}
        </ComposerShell>
    );
}

function AttachmentsComposer() {
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-(--bg-panel) p-3">
                {[
                    { icon: ImageIcon, label: "Foto & Video", color: "var(--accent)" },
                    { icon: Camera, label: "Fotocamera", color: "var(--fg-link)" },
                    { icon: FileText, label: "Documento", color: "var(--fg-warning)" },
                    { icon: User, label: "Contatto", color: "var(--accent)" },
                    { icon: MapPin, label: "Posizione", color: "var(--fg-link)" },
                    { icon: Pin, label: "Richiesta posizione", color: "var(--fg-warning)" },
                ].map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className={cn(
                            "flex flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                                color: item.color,
                            }}
                        >
                            <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] text-(--fg-secondary)">{item.label}</span>
                    </button>
                ))}
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn aria-label="Chiudi allegati">
                        <ChevronDown className="h-5 w-5 rotate-45" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        placeholder="Scrivi un messaggio"
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label="Registra audio"
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function EmojiPickerComposer() {
    return (
        <div className="space-y-2">
            <div className="rounded-lg bg-(--bg-panel) p-2 shadow-(--shadow-bubble)">
                <div className="mb-2 flex items-center gap-2 rounded-md bg-(--bg-panel-2) px-2 py-1">
                    <Smile className="h-3.5 w-3.5 text-(--fg-tertiary)" />
                    <input
                        type="text"
                        placeholder="Cerca emoji"
                        className="flex-1 bg-transparent text-xs focus:outline-none"
                    />
                    <span className="text-[11px] text-(--fg-tertiary)">🖐️</span>
                </div>
                <div className="flex gap-1 border-b border-(--border-soft) pb-1 text-[11px]">
                    <button
                        type="button"
                        aria-label="Emoji recenti"
                        className={cn("rounded bg-(--bg-hover) px-1.5 py-0.5 text-(--accent)", BTN)}
                    >
                        😀 Recenti
                    </button>
                    <button
                        type="button"
                        aria-label="Smileys"
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        😎
                    </button>
                    <button
                        type="button"
                        aria-label="Animali"
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        🐻
                    </button>
                    <button
                        type="button"
                        aria-label="Cibo"
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        🍔
                    </button>
                    <button
                        type="button"
                        aria-label="Sport"
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        ⚽
                    </button>
                    <button
                        type="button"
                        aria-label="Oggetti"
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        💡
                    </button>
                </div>
                <div className="grid grid-cols-8 gap-0.5 pt-1.5 text-lg">
                    {EMOJI_SET.map((e) => (
                        <button
                            key={e}
                            type="button"
                            aria-label={`Emoji ${e}`}
                            className={cn("rounded p-1 hover:bg-(--bg-hover)", ICON_BTN)}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn aria-label="Comandi">
                        <Slash className="h-5 w-5" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        placeholder="Scrivi un messaggio"
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label="Registra audio"
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function CannedComposer() {
    return (
        <div className="space-y-2">
            <div className="rounded-lg bg-(--bg-panel) p-2 shadow-(--shadow-bubble)">
                <div className="mb-1.5 text-[11px] tracking-wide text-(--fg-tertiary) uppercase">
                    Risposte rapide
                </div>
                {[
                    { title: "/saluto", body: "Ciao {{nome}}! Come posso aiutarti?" },
                    {
                        title: "/spedizione",
                        body: "Il tuo ordine {{numero}} sarà spedito entro 24h.",
                    },
                    { title: "/orari", body: "Siamo aperti lun–ven 9:00–18:00." },
                ].map((c) => (
                    <button
                        key={c.title}
                        type="button"
                        className={cn(
                            "block w-full rounded-md px-2 py-1.5 text-left hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        <div className="text-xs font-medium text-(--accent)">{c.title}</div>
                        <div className="truncate text-[11px] text-(--fg-secondary)">{c.body}</div>
                    </button>
                ))}
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn aria-label="Comandi">
                        <Slash className="h-5 w-5 text-(--accent)" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        defaultValue="/"
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm text-(--accent) focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label="Registra audio"
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function OfflineComposer() {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md bg-(--bg-bubble-system) px-3 py-1.5 text-xs text-(--fg-secondary)">
                <WifiOff className="h-3.5 w-3.5" /> 1 messaggio in coda · in attesa della
                connessione ⏱
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn>
                        <Smile className="h-5 w-5" />
                    </IconBtn>
                    <IconBtn>
                        <Plus className="h-5 w-5" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        placeholder="Scrivi un messaggio"
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label="Invia"
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function IceBreakersComposer() {
    return (
        <div className="flex flex-wrap gap-2">
            {[
                "🛒 Visualizza catalogo",
                "📅 Prenota un appuntamento",
                "💬 Parla con un operatore",
                "📍 Dove siamo",
                "❓ Domande frequenti",
            ].map((label) => (
                <button
                    key={label}
                    type="button"
                    className={cn(
                        "flex items-center gap-1.5 rounded-full border border-(--accent) bg-(--accent-soft) px-3 py-1.5 text-xs font-medium text-(--accent) hover:bg-(--accent) hover:text-(--accent-fg)",
                        BTN
                    )}
                >
                    <Sparkles className="h-3 w-3" /> {label}
                </button>
            ))}
        </div>
    );
}

function IconBtn({
    children,
    "aria-label": ariaLabel,
}: {
    children: React.ReactNode;
    "aria-label"?: string;
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
        >
            {children}
        </button>
    );
}
