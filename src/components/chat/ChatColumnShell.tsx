import {
    ArrowLeft,
    Phone,
    Video,
    Search,
    MoreVertical,
    Smile,
    Plus,
    Camera,
    Send,
    FileText,
    Check,
    CheckCheck,
    Clock,
    Bot,
    X,
    Pin,
    ChevronUp,
    Info,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, colorFromString, initials } from "@/lib/utils";
import { ChatEntryRenderer } from "@/components/bubbles/MessageRenderer";
import { conversationById, messagesFor } from "@/data/dataset";
import { useState, useRef, useEffect } from "react";

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]";
const iconBtn = `cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${focusRing}`;
const actionBtn = `cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${focusRing}`;

interface Props {
    conversationId?: string;
    readonly?: boolean;
    onBack?: () => void;
    onOpenContext?: () => void;
    contextCollapsed?: boolean;
}

const DEFAULT_CONV = "c1";

export function ChatColumnShell({ conversationId = DEFAULT_CONV, readonly = false, onBack, onOpenContext, contextCollapsed }: Props) {
    const conv = conversationById(conversationId);
    const messages = messagesFor(conversationId);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showFab, setShowFab] = useState(false);

    useEffect(() => {
        void conversationId;
        const viewport = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
            setShowFab(false);
        }
    }, [conversationId]);

    const handleScroll = () => {
        const viewport = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
        if (!viewport) return;
        const atBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 60;
        setShowFab(!atBottom);
    };

    const scrollToBottom = () => {
        const viewport = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
            setShowFab(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <ChatHeader conv={conv} onBack={onBack} onOpenContext={onOpenContext} showContextBtn={contextCollapsed} />
            <WindowBadgeBar conv={conv} />
            {conv?.isBotActive && <BotBanner agentName={conv.botAgentName ?? "Agente"} />}
            <PinnedMessagesBar />
            {conv?.linkedRecords && conv.linkedRecords.length > 0 && <RecordChipsBar conv={conv} />}
            <TeamPresenceBar />

            <div className="chat-doodle-bg relative flex-1 overflow-hidden" ref={scrollRef} onScroll={handleScroll}>
                <ScrollArea className="relative h-full">
                    <div className="flex w-full min-w-0 flex-col gap-1 px-4 py-4">
                        {messages.map((entry, idx) => (
                            <ChatEntryRenderer
                                key={"id" in entry ? entry.id : `pill-${idx}-${entry.variant}`}
                                entry={entry}
                            />
                        ))}
                    </div>
                </ScrollArea>
                {showFab && <ScrollToBottomFab onClick={scrollToBottom} />}
            </div>

            {!readonly && <ComposerShell conv={conv} />}
            {readonly && <ReadonlyComposerHint />}
        </div>
    );
}

/* ---------------- HEADER (A/R3) ---------------- */
function ChatHeader({
    conv,
    onBack,
    onOpenContext,
    showContextBtn,
}: {
    conv: ReturnType<typeof conversationById>;
    onBack?: () => void;
    onOpenContext?: () => void;
    showContextBtn?: boolean;
}) {
    const name = conv?.name ?? "—";
    const phone = conv?.phone ?? "";
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]",
                        iconBtn
                    )}
                    aria-label="Indietro"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
            )}
            <button
                type="button"
                onClick={onOpenContext}
                className={cn(
                    "flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-lg text-left",
                    actionBtn
                )}
                aria-label={`Apri contesto di ${name}`}
            >
                <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback style={{ backgroundColor: conv?.avatarColor ?? colorFromString(name) }}>
                        {initials(name)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 overflow-hidden">
                    <div className="truncate text-sm font-semibold">
                        {name}
                        {conv?.type === "group" && (
                            <span className="ml-1 text-[11px] font-normal text-[var(--fg-tertiary)]">
                                · {conv.groupParticipants} part.
                            </span>
                        )}
                    </div>
                    <div className="truncate text-[11px] text-[var(--fg-tertiary)]">
                        {conv?.typing === "text"
                            ? "sta scrivendo…"
                            : conv?.typing === "audio"
                              ? "sta registrando un audio…"
                              : `online · ${phone}`}
                    </div>
                </div>
            </button>
            <div className="flex shrink-0 items-center gap-0.5">
                <HeaderIcon label="Videochiamata"><Video className="h-4 w-4" /></HeaderIcon>
                <HeaderIcon label="Chiamata"><Phone className="h-4 w-4" /></HeaderIcon>
                <HeaderIcon label="Cerca nella chat"><Search className="h-4 w-4" /></HeaderIcon>
                <HeaderIcon label="Altre opzioni"><MoreVertical className="h-4 w-4" /></HeaderIcon>
                {showContextBtn && (
                    <button
                        type="button"
                        onClick={onOpenContext}
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-[var(--accent)] hover:bg-[var(--bg-hover)]",
                            iconBtn
                        )}
                        aria-label="Mostra pannello contesto"
                    >
                        <Info className="h-4 w-4" />
                    </button>
                )}
            </div>
        </header>
    );
}

function HeaderIcon({ children, label }: { children: React.ReactNode; label?: string }) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]"
        >
            {children}
        </button>
    );
}

/* ---------------- WINDOW BADGE BAR (D5) ---------------- */
function WindowBadgeBar({ conv }: { conv: ReturnType<typeof conversationById> }) {
    return (
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 py-1.5">
            {conv?.windowClosed ? (
                <Badge variant="outline" className="gap-1 border-[var(--window-closed)] text-[var(--window-closed)]">
                    <Clock className="h-3 w-3" /> Finestra chiusa · solo template
                </Badge>
            ) : (
                <Badge variant="outline" className="gap-1 border-[var(--window-open)] text-[var(--window-open)]">
                    <Clock className="h-3 w-3" /> Finestra · 5h 12m
                </Badge>
            )}
            <AssignmentWidget conv={conv} />
            {conv?.officeHours && !conv.officeHours.active && (
                <Badge variant="outline" className="gap-1 border-[var(--window-warning)] text-[var(--window-warning)]">
                    Fuori orario
                </Badge>
            )}
        </div>
    );
}

function AssignmentWidget({ conv }: { conv: ReturnType<typeof conversationById> }) {
    if (!conv) return null;
    if (conv.unassigned) {
        return (
            <Badge variant="outline" className="gap-1 border-[var(--unassigned)] text-[var(--unassigned)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--unassigned)]" /> Non assegnata
            </Badge>
        );
    }
    if (conv.assignedUserId) {
        const user = conv.assignedUserId === "u_laura" ? "Laura B." : conv.assignedUserId === "u_marco" ? "Marco R." : conv.assignedUserId;
        return (
            <Badge variant="outline" className="gap-1 border-[var(--assigned-other)] text-[var(--assigned-other)]">
                <Avatar className="h-4 w-4">
                    <AvatarFallback
                        style={{ backgroundColor: colorFromString(user), fontSize: 8 }}
                    >
                        {initials(user)}
                    </AvatarFallback>
                </Avatar>
                {user}
            </Badge>
        );
    }
    return null;
}

/* ---------------- BOT BANNER (Q5) ---------------- */
function BotBanner({ agentName }: { agentName: string }) {
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 bg-[var(--bg-bubble-bot)] px-3 py-1.5 text-xs text-[var(--fg-primary)]">
            <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-[var(--fg-link)]" />
                <strong>{agentName}</strong> sta gestendo questa conversazione
            </span>
            <button
                type="button"
                className={cn(
                    "rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-fg)]",
                    actionBtn
                )}
            >
                Intervieni
            </button>
        </div>
    );
}

/* ---------------- PINNED BAR (C) ---------------- */
function PinnedMessagesBar() {
    return (
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 py-1.5 text-[11px] text-[var(--fg-secondary)]">
            <Pin className="h-3 w-3 text-[var(--fg-tertiary)]" />
            <span className="truncate">1/2 — Promemoria appuntamento domani 16:00</span>
            <button
                type="button"
                className={cn("ml-auto flex items-center justify-center rounded-full", iconBtn)}
                aria-label="Messaggio fissato successivo"
            >
                <ChevronUp className="h-3 w-3" />
            </button>
        </div>
    );
}

/* ---------------- RECORD CHIPS (Q7) ---------------- */
function RecordChipsBar({ conv }: { conv: NonNullable<ReturnType<typeof conversationById>> }) {
    return (
        <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 text-[10px] text-[var(--fg-secondary)]">
            <span className="opacity-60">Collegata:</span>
            {conv.linkedRecords?.map((r) => (
                <span
                    key={`${r.kind}-${r.id}`}
                    className="rounded-full border border-[var(--border-strong)] px-1.5 py-0.5"
                >
                    {r.kind === "lead" && "🎯"}
                    {r.kind === "order" && "🧾"}
                    {r.kind === "ticket" && "🎫"} {r.kind} #{r.id}
                </span>
            ))}
        </div>
    );
}

/* ---------------- TEAM PRESENCE (Q10) ---------------- */
function TeamPresenceBar() {
    return (
        <div className="flex shrink-0 items-center gap-1.5 px-3 py-0.5 text-[10px] text-[var(--fg-tertiary)]">
            <div className="flex -space-x-1">
                <Avatar className="h-4 w-4 border border-[var(--bg-panel)]">
                    <AvatarFallback style={{ backgroundColor: colorFromString("Laura B"), fontSize: 7 }}>
                        LB
                    </AvatarFallback>
                </Avatar>
                <Avatar className="h-4 w-4 border border-[var(--bg-panel)]">
                    <AvatarFallback style={{ backgroundColor: colorFromString("Marco R"), fontSize: 7 }}>
                        MR
                    </AvatarFallback>
                </Avatar>
            </div>
            Laura sta scrivendo…
        </div>
    );
}

/* ---------------- FAB ---------------- */
function ScrollToBottomFab({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)] hover:bg-[var(--bg-hover)]",
                iconBtn
            )}
            aria-label="Vai in fondo"
        >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--fg-secondary)]" fill="none" role="presentation">
                <title>Vai in fondo</title>
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}

/* ---------------- COMPOSER (R5/E1-E11) ---------------- */
function ComposerShell({ conv }: { conv: ReturnType<typeof conversationById> }) {
    const isWindowClosed = conv?.windowClosed;
    return (
        <div className="shrink-0 bg-[var(--bg-panel-2)] px-3 py-2">
            {isWindowClosed && (
                <div className="mb-1.5 flex items-center justify-between rounded-md bg-[var(--bg-bubble-error)] px-2 py-1 text-[11px] text-[var(--status-failed)]">
                    <span>Finestra 24h chiusa · solo template</span>
                    <button
                        type="button"
                        className={cn(
                            "rounded bg-[var(--accent)] px-2 py-0.5 text-[var(--accent-fg)] hover:opacity-90",
                            actionBtn
                        )}
                    >
                        Invia template
                    </button>
                </div>
            )}
            <div className="flex items-end gap-1.5 rounded-lg bg-[var(--bg-panel)] px-2 py-1.5 shadow-[var(--shadow-bubble)]">
                <ComposerIcon label="Emoji">
                    <Smile className="h-5 w-5" />
                </ComposerIcon>
                <ComposerIcon label="Allegati">
                    <Plus className="h-5 w-5" />
                </ComposerIcon>
                <ComposerIcon label="Template (E8)" highlight>
                    <FileText className="h-5 w-5" />
                </ComposerIcon>
                <textarea
                    rows={1}
                    placeholder="Scrivi un messaggio"
                    className={cn(
                        "max-h-24 min-w-0 flex-1 resize-none rounded-md bg-transparent px-1 py-1 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:outline-none",
                        focusRing
                    )}
                />
                <ComposerIcon label="Fotocamera">
                    <Camera className="h-5 w-5" />
                </ComposerIcon>
                <button
                    type="button"
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] hover:scale-105",
                        actionBtn
                    )}
                    aria-label="Invia messaggio"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function ComposerIcon({ children, label, highlight }: { children: React.ReactNode; label?: string; highlight?: boolean }) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                iconBtn,
                highlight
                    ? "text-[var(--accent)] hover:bg-[var(--accent-soft)]"
                    : "text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
            )}
        >
            {children}
        </button>
    );
}

function ReadonlyComposerHint() {
    return (
        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-[var(--border-strong)] bg-[var(--bg-panel-2)] px-3 py-2 text-xs text-[var(--fg-tertiary)]">
            <X className="h-3 w-3" /> Anteprima sola lettura · Quick Popover readonly
        </div>
    );
}

export { Check, CheckCheck };
