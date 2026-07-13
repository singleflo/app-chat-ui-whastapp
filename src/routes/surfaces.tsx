import { ChatApp } from "@/components/chat/ChatApp";
import type { SurfaceVariant } from "@/components/chat/types";
import { MessageSquare, RefreshCw, CheckCheck, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, fmtRelativeDay, initials } from "@/lib/utils";
import { dataset } from "@/data/dataset";
import { useState } from "react";

export function DesktopSurface() {
    return (
        <div className="flex h-full w-full items-stretch justify-center bg-[var(--bg-app)] p-4">
            <div className="flex h-full w-full max-w-[1600px] overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)]">
                <ChatApp variant="desktop" />
            </div>
        </div>
    );
}

export function MobileSurface() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--bg-app)] p-4">
            <PhoneFrame>
                <ChatApp variant="mobile" />
            </PhoneFrame>
        </div>
    );
}

export function SidePanelSurface() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--bg-app)] p-4">
            <div className="flex h-[700px] w-[400px] flex-col overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)]">
                <ChatApp variant="side-panel" />
            </div>
        </div>
    );
}

export function QuickPopoverSurface() {
    return (
        <div className="flex h-full w-full items-center justify-center gap-8 bg-[var(--bg-app)] p-4">
            <div className="flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase tracking-wide text-[var(--fg-tertiary)]">QuickChatTrigger</div>
                <QuickChatTrigger />
            </div>
            <div className="flex h-[580px] w-[380px] flex-col overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)]">
                <QuickChatPanel />
            </div>
        </div>
    );
}

function QuickChatTrigger() {
    return (
        <button type="button" className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow-overlay)] hover:scale-105 transition-transform" aria-label="Quick chat">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent-fg)] border-2 border-[var(--bg-panel)]">3</span>
            <span className="absolute -bottom-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--unassigned)] px-1 text-[9px] font-bold text-white border-2 border-[var(--bg-panel)]">2</span>
        </button>
    );
}

function QuickChatPanel() {
    const [tab, setTab] = useState<"assigned" | "unassigned">("assigned");
    const assigned = dataset.conversations.filter((c) => c.assignedUserId);
    const unassigned = dataset.conversations.filter((c) => c.unassigned);

    return (
        <div className="flex h-full flex-col">
            <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                <div className="flex gap-1">
                    <button type="button" onClick={() => setTab("assigned")}
                        className={cn("rounded-md px-2 py-1 text-xs font-medium", tab === "assigned" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--fg-secondary)]")}>
                        Assegnate ({assigned.length})
                    </button>
                    <button type="button" onClick={() => setTab("unassigned")}
                        className={cn("rounded-md px-2 py-1 text-xs font-medium", tab === "unassigned" ? "bg-[var(--unassigned)] text-white" : "text-[var(--fg-secondary)]")}>
                        Non assegnate ({unassigned.length})
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"><RefreshCw className="h-3.5 w-3.5" /></button>
                </div>
            </header>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {(tab === "assigned" ? assigned : unassigned).slice(0, 5).map((conv) => (
                        <button key={conv.id} type="button" className="flex w-full items-start gap-2 border-b border-[var(--border-soft)] px-3 py-2 text-left hover:bg-[var(--bg-hover)]">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback style={{ backgroundColor: conv.avatarColor, fontSize: 10 }}>{initials(conv.name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="truncate text-xs font-medium">{conv.name}</span>
                                    <span className="shrink-0 text-[9px] text-[var(--fg-tertiary)]">{fmtRelativeDay(conv.lastMessageTs)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-[var(--fg-tertiary)]">
                                    <span className="rounded bg-[var(--bg-panel-2)] px-1">+39 02</span>
                                    {conv.windowClosed && <Lock className="h-2.5 w-2.5 text-[var(--fg-warning)]" />}
                                    <span className="truncate">{conv.lastMessagePreview}</span>
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    {conv.lastMessageDirection === "out" && conv.lastAck === "read" && <CheckCheck className="h-2.5 w-2.5" style={{ color: "var(--color-ack-blue)" }} />}
                                    {conv.lastMessageDirection === "out" && conv.lastAck === "delivered" && <CheckCheck className="h-2.5 w-2.5 text-[var(--fg-tertiary)]" />}
                                    {conv.unread > 0 && <span className="rounded-full bg-[var(--accent)] px-1 text-[8px] font-bold text-[var(--accent-fg)]">{conv.unread}</span>}
                                </div>
                            </div>
                        </button>
                    ))}
                    <button type="button" className="px-3 py-2 text-center text-[10px] text-[var(--fg-link)] hover:bg-[var(--bg-hover)]">
                        Mostra altre ({(tab === "assigned" ? assigned : unassigned).length - 5 > 0 ? (tab === "assigned" ? assigned : unassigned).length - 5 : 0})
                    </button>
                </div>
            </ScrollArea>
            <footer className="shrink-0 border-t border-[var(--border-strong)] bg-[var(--bg-panel-2)] px-3 py-1.5 text-center text-[10px] text-[var(--fg-link)]">
                Vedi tutte le conversazioni →
            </footer>
        </div>
    );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-[760px] w-[380px] flex-col overflow-hidden rounded-[44px] border-[10px] border-[#111b21] bg-[var(--bg-panel)] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            {/* notch */}
            <div className="absolute left-1/2 top-0 z-50 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#111b21]" />
            <div className="flex-1 overflow-hidden">{children}</div>
        </div>
    );
}

export type { SurfaceVariant };
