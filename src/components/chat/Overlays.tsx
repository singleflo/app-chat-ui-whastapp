import { useState } from "react";
import {
    X, Search, UserPlus, Trash2, Forward, Check, AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, colorFromString, initials } from "@/lib/utils";
import { dataset } from "@/data/dataset";

export type OverlayState =
    | { type: "new-chat" }
    | { type: "delete-chat"; convId: string; convName: string }
    | { type: "forward"; messageId: string; excerpt: string }
    | null;

export function ChatOverlays({
    state,
    onClose,
    onConfirmDelete,
    onConfirmNewChat,
    onConfirmForward,
}: {
    state: OverlayState;
    onClose: () => void;
    onConfirmDelete: (convId: string) => void;
    onConfirmNewChat: (phoneOrContactId: string) => void;
    onConfirmForward: (messageId: string, targetIds: string[]) => void;
}) {
    if (!state) return null;
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
            <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi modale"
                className="absolute inset-0 cursor-pointer border-0 bg-[var(--scrim)] p-0"
            />
            <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)]">
                {state.type === "new-chat" && (
                    <NewChatModal onClose={onClose} onConfirm={onConfirmNewChat} />
                )}
                {state.type === "delete-chat" && (
                    <DeleteChatModal
                        convName={state.convName}
                        onClose={onClose}
                        onConfirm={() => {
                            onConfirmDelete(state.convId);
                            onClose();
                        }}
                    />
                )}
                {state.type === "forward" && (
                    <ForwardModal
                        excerpt={state.excerpt}
                        onClose={onClose}
                        onConfirm={(targets) => {
                            onConfirmForward(state.messageId, targets);
                            onClose();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <header className="flex items-center justify-between border-b border-[var(--border-strong)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)]">{title}</h3>
            <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
            >
                <X className="h-4 w-4" />
            </button>
        </header>
    );
}

const MOCK_CONTACTS = [
    { id: "nc1", name: "Anna Conti", phone: "+39 339 1234567" },
    { id: "nc2", name: "Paola Gino", phone: "+39 348 9876543" },
    { id: "nc3", name: "Mario Bossi", phone: "+39 335 1122334" },
    { id: "nc4", name: "Carla Neri", phone: "+39 02 7654321" },
    { id: "nc5", name: "Luca Greco", phone: "+39 320 5558899" },
];

function NewChatModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (id: string) => void }) {
    const [query, setQuery] = useState("");
    const [phone, setPhone] = useState("");
    const [showPhone, setShowPhone] = useState(false);
    const isValid = /^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s-]/g, ""));
    const filtered = MOCK_CONTACTS.filter(
        (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)
    );

    return (
        <>
            <ModalHeader title="Nuova chat" onClose={onClose} />
            <div className="p-4">
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-[var(--bg-panel-2)] px-3 py-2">
                    <Search className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cerca contatto o numero"
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className="mb-2 flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--bg-hover)]"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-[var(--accent)]">Nuovo numero</span>
                </button>

                {showPhone && (
                    <div className="mb-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel-2)] p-3">
                        <label htmlFor="new-chat-phone" className="mb-1 block text-[10px] uppercase tracking-wide text-[var(--fg-tertiary)]">
                            Numero E.164
                        </label>
                        <input
                            id="new-chat-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+39 340 1234567"
                            className="mb-2 w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel)] px-2 py-1.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                        />
                        <div className="flex items-center justify-between">
                            <span className={cn("text-[10px]", isValid ? "text-[var(--accent)]" : phone ? "text-[var(--status-failed)]" : "text-[var(--fg-tertiary)]")}>
                                {isValid ? (
                                    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Valido</span>
                                ) : phone ? "Formato non valido" : "Formato internazionale"}
                            </span>
                            <button
                                type="button"
                                disabled={!isValid}
                                onClick={() => onConfirm(phone)}
                                className={cn(
                                    "rounded-md px-3 py-1 text-xs font-medium",
                                    isValid ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "cursor-not-allowed bg-[var(--bg-panel-2)] text-[var(--fg-tertiary)]"
                                )}
                            >
                                Avvia
                            </button>
                        </div>
                    </div>
                )}

                <div className="max-h-60 overflow-y-auto">
                    {filtered.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => onConfirm(c.id)}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[var(--bg-hover)]"
                        >
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarFallback style={{ backgroundColor: colorFromString(c.name) }}>
                                    {initials(c.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{c.name}</div>
                                <div className="truncate text-[11px] text-[var(--fg-tertiary)]">{c.phone}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

function DeleteChatModal({
    convName,
    onClose,
    onConfirm,
}: {
    convName: string;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <>
            <ModalHeader title="Elimina conversazione" onClose={onClose} />
            <div className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-bubble-error)]">
                    <Trash2 className="h-6 w-6 text-[var(--status-failed)]" />
                </div>
                <p className="mb-1 text-sm font-medium text-[var(--fg-primary)]">
                    Eliminare la chat con {convName}?
                </p>
                <div className="mb-4 flex items-start gap-1.5 rounded-md bg-[var(--bg-bubble-system)] px-3 py-2 text-left text-[11px] text-[var(--fg-secondary)]">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-[var(--fg-warning)]" />
                    <span>Solo eliminazione locale. WhatsApp non supporta la cancellazione remota delle conversazioni.</span>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-[var(--border-strong)] py-2 text-sm font-medium text-[var(--fg-primary)] hover:bg-[var(--bg-hover)]"
                    >
                        Annulla
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-lg bg-[var(--status-failed)] py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </>
    );
}

function ForwardModal({
    excerpt,
    onClose,
    onConfirm,
}: {
    excerpt: string;
    onClose: () => void;
    onConfirm: (targetIds: string[]) => void;
}) {
    const MAX = 5;
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState("");
    const filtered = dataset.conversations.filter(
        (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)
    );

    const toggle = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) {
            next.delete(id);
        } else if (next.size < MAX) {
            next.add(id);
        }
        setSelected(next);
    };

    return (
        <>
            <ModalHeader title={`Inoltra (${selected.size}/${MAX})`} onClose={onClose} />
            <div className="p-4">
                <div className="mb-2 rounded-md bg-[var(--bg-panel-2)] px-2 py-1.5 text-[11px] italic text-[var(--fg-secondary)]">
                    <Forward className="mr-1 inline h-3 w-3" /> "{excerpt.slice(0, 60)}{excerpt.length > 60 ? "…" : ""}"
                </div>
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-[var(--bg-panel-2)] px-3 py-1.5">
                    <Search className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cerca chat o contatto"
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                </div>
                <div className="max-h-52 overflow-y-auto">
                    {filtered.map((c) => {
                        const isSelected = selected.has(c.id);
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => toggle(c.id)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[var(--bg-hover)]",
                                    isSelected && "bg-[var(--accent-soft)]"
                                )}
                            >
                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarFallback style={{ backgroundColor: c.avatarColor, fontSize: 11 }}>
                                        {initials(c.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium">{c.name}</div>
                                    <div className="truncate text-[11px] text-[var(--fg-tertiary)]">{c.phone}</div>
                                </div>
                                <span
                                    className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                                        isSelected
                                            ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                                            : "border-[var(--border-strong)]"
                                    )}
                                >
                                    {isSelected && <Check className="h-3 w-3" />}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    disabled={selected.size === 0}
                    onClick={() => onConfirm(Array.from(selected))}
                    className={cn(
                        "mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium",
                        selected.size > 0
                            ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                            : "cursor-not-allowed bg-[var(--bg-panel-2)] text-[var(--fg-tertiary)]"
                    )}
                >
                    <Forward className="h-4 w-4" />
                    Inoltra a {selected.size > 0 ? selected.size : "…"} {selected.size === 1 ? "chat" : "chat"}
                </button>
            </div>
        </>
    );
}
