import { Search, MessageSquare, Archive, Bell, Pin, Check, CheckCheck, MoreVertical, Lock, AlertCircle, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, colorFromString, fmtRelativeDay, initials } from "@/lib/utils";
import { dataset } from "@/data/dataset";
import type { AckStatus, Conversation } from "@/types/chat";

const TYPE_ICONS: Record<string, string> = {
    text: "",
    image: "📷",
    video: "🎥",
    audio: "🎤",
    document: "📄",
    sticker: "🎟️",
    location: "📍",
    contacts: "👤",
    order: "🛒",
    call: "☎️",
    internal_note: "📝",
};

export function ConversationListShell({
    onOpenChat,
    activeId,
    onNewChat,
}: {
    onOpenChat?: (id: string) => void;
    activeId?: string;
    onNewChat?: () => void;
}) {
    const totalUnread = dataset.conversations.reduce((sum, c) => sum + c.unread, 0);
    const myAssigned = dataset.conversations.filter((c) => c.assignedUserId === "u_laura").length;
    const unassigned = dataset.conversations.filter((c) => c.unassigned).length;
    const groups = dataset.conversations.filter((c) => c.type === "group").length;
    const closed = dataset.conversations.filter((c) => c.state === "done").length;

    const FILTERS = [
        { label: "Tutte", count: dataset.conversations.length, active: true },
        { label: "Non lette", count: totalUnread },
        { label: "Mie", count: myAssigned },
        { label: "Non assegnate", count: unassigned },
        { label: "Gruppi", count: groups },
        { label: "Chiuse", count: closed },
    ];

    return (
        <div className="flex h-full flex-col">
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback style={{ backgroundColor: colorFromString(dataset.account.name) }}>
                            {initials(dataset.account.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                        <div className="text-xs font-semibold">{dataset.account.name}</div>
                        <div className="text-[10px] text-[var(--fg-tertiary)]">
                            {dataset.account.phoneNumbers[0].display} · {dataset.account.phoneNumbers.length} numeri
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={onNewChat} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-header)] active:scale-95" aria-label="Nuova chat">
                        <MessageSquare className="h-4 w-4" />
                    </button>
                    <button type="button" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-header)] active:scale-95" aria-label="Menu">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </header>

            <div className="shrink-0 px-3 py-2">
                <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-panel-2)] px-3 py-1.5 transition-colors duration-200 focus-within:bg-[var(--bg-panel)] focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-panel-2)]">
                    <Search className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />
                    <input
                        type="text"
                        placeholder="Cerca o inizia una nuova chat"
                        className="flex-1 bg-transparent text-xs text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 pb-2">
                {FILTERS.map((f, i) => (
                    <button
                        type="button"
                        key={f.label}
                        className={cn(
                            "flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95",
                            i === 0
                                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                                : "border-[var(--border-strong)] text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]"
                        )}
                    >
                        {f.label}
                        {f.count > 0 && <span className="text-[10px] opacity-70 tabular-nums">({f.count})</span>}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {dataset.conversations.map((conv) => (
                        <ConversationRow key={conv.id} conv={conv} active={conv.id === activeId} onClick={() => onOpenChat?.(conv.id)} />
                    ))}
                    <button type="button" className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-xs text-[var(--fg-secondary)] transition-colors duration-200 hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]">
                        <Archive className="h-4 w-4" />
                        Archiviate (12)
                    </button>
                </div>
            </ScrollArea>
        </div>
    );
}

function ConversationRow({ conv, active, onClick }: { conv: Conversation; active?: boolean; onClick?: () => void }) {
    const isTyping = conv.typing === "text" || conv.typing === "audio";
    const typeIcon = TYPE_ICONS[conv.lastMessageType] ?? "";
    const isOutbound = conv.lastMessageDirection === "out";

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] focus-visible:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)] border-b border-[var(--border-soft)]",
                active && "bg-[var(--bg-active)]"
            )}
        >
            <div className="relative shrink-0">
                <Avatar className="h-11 w-11">
                    <AvatarFallback style={{ backgroundColor: conv.avatarColor }}>
                        {initials(conv.name)}
                    </AvatarFallback>
                </Avatar>
                {conv.isBotActive && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--fg-link)] text-[8px]" title="Bot attivo">
                        <Bot className="h-2.5 w-2.5 text-white" />
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-[var(--fg-primary)]">
                        {conv.name}
                        {conv.businessVerified && <span className="ml-1 text-[var(--accent)]" title="Business verificato">✓</span>}
                    </span>
                    <span className={cn("shrink-0 text-[11px]", conv.unread ? "text-[var(--accent)]" : "text-[var(--fg-tertiary)]")}>
                        {fmtRelativeDay(conv.lastMessageTs)}
                    </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className={cn("truncate text-xs", isTyping ? "text-[var(--accent)]" : "text-[var(--fg-secondary)]")}>
                        {isOutbound && !isTyping && <OutboundAck ack={conv.lastAck} />}
                        {isTyping ? (
                            conv.typing === "audio" ? "sta registrando un audio…" : "sta scrivendo…"
                        ) : (
                            <>
                                {isOutbound && <span className="text-[var(--fg-tertiary)]">Tu: </span>}
                                {typeIcon && <span className="mr-0.5">{typeIcon}</span>}
                                {conv.draft ? <span className="text-[var(--status-failed)]">Bozza: {conv.draft}</span> : conv.lastMessagePreview}
                            </>
                        )}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                        {conv.silenced && <Bell className="h-3 w-3 text-[var(--fg-tertiary)]" />}
                        {conv.pinned && <Pin className="h-3 w-3 text-[var(--fg-tertiary)]" />}
                        {conv.windowClosed && <Lock className="h-3 w-3 text-[var(--fg-warning)]" />}
                        {conv.failed && <AlertCircle className="h-3 w-3 text-[var(--status-failed)]" />}
                        {conv.unassigned && !conv.assignmentFailed && (
                            <span className="h-2 w-2 rounded-full bg-[var(--unassigned)]" title="Non assegnata" />
                        )}
                        {conv.assignmentFailed && (
                            <span title="Assegnazione fallita">
                                <AlertCircle className="h-3 w-3 text-[var(--fg-warning)]" />
                            </span>
                        )}
                        {conv.mentionCount && conv.mentionCount > 0 && (
                            <span className="rounded-full bg-[var(--accent)] px-1 text-[9px] font-bold text-[var(--accent-fg)]" title="@menzione">
                                @{conv.mentionCount}
                            </span>
                        )}
                        {conv.unread > 0 && (
                            <Badge variant="unread" className="h-4 min-w-4 px-1 text-[10px]">
                                {conv.unread > 99 ? "99+" : conv.unread}
                            </Badge>
                        )}
                    </div>
                </div>
                {conv.assignedUserId && (
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--fg-tertiary)]">
                        <Avatar className="h-3 w-3">
                            <AvatarFallback
                                style={{
                                    backgroundColor: colorFromString(conv.assignedUserId === "u_laura" ? "Laura" : conv.assignedUserId === "u_marco" ? "Marco" : "?"),
                                    fontSize: 6,
                                }}
                            >
                                {conv.assignedUserId === "u_laura" ? "L" : conv.assignedUserId === "u_marco" ? "M" : "?"}
                            </AvatarFallback>
                        </Avatar>
                        {conv.assignedUserId === "u_laura" ? "Laura B." : conv.assignedUserId === "u_marco" ? "Marco R." : conv.assignedUserId}
                    </div>
                )}
            </div>
        </button>
    );
}

function OutboundAck({ ack }: { ack?: AckStatus }) {
    if (!ack || ack === "composing" || ack === "pending" || ack === "failed" || ack === "played") return null;
    if (ack === "read") return <CheckCheck className="mr-1 inline h-3 w-3" style={{ color: "var(--color-ack-blue)" }} />;
    if (ack === "delivered") return <CheckCheck className="mr-1 inline h-3 w-3 text-[var(--fg-tertiary)]" />;
    return <Check className="mr-1 inline h-3 w-3 text-[var(--fg-tertiary)]" />;
}
