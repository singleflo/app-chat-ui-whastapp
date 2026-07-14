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
        <div className="flex h-full w-full items-stretch justify-center bg-(--bg-app) p-4">
            <div className="flex h-full w-full max-w-[1600px] overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel) shadow-(--shadow-overlay)">
                <ChatApp variant="desktop" />
            </div>
        </div>
    );
}

export function MobileSurface() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-(--bg-app) p-4">
            <PhoneFrame>
                <ChatApp variant="mobile" />
            </PhoneFrame>
        </div>
    );
}

export function SidePanelSurface() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-(--bg-app) p-4">
            <div className="flex h-[700px] w-[400px] flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel) shadow-(--shadow-overlay)">
                <ChatApp variant="side-panel" />
            </div>
        </div>
    );
}

export function QuickPopoverSurface() {
    return (
        <div className="flex h-full w-full items-center justify-center gap-8 bg-(--bg-app) p-4">
            <div className="flex flex-col items-center gap-3">
                <div className="text-[11px] tracking-wide text-(--fg-tertiary) uppercase">
                    QuickChatTrigger
                </div>
                <QuickChatTrigger />
            </div>
            <div className="flex h-[580px] w-[380px] flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel) shadow-(--shadow-overlay)">
                <QuickChatPanel />
            </div>
        </div>
    );
}

function QuickChatTrigger() {
    return (
        <button
            type="button"
            className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) shadow-(--shadow-overlay) transition-all duration-200 ease-out hover:scale-105 hover:bg-(--accent-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-app) focus-visible:outline-none active:scale-[0.97]"
            aria-label="Quick chat"
        >
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-(--bg-panel) bg-(--accent) px-1 text-[11px] font-bold text-(--accent-fg) tabular-nums">
                3
            </span>
            <span className="absolute -right-1 -bottom-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-(--bg-panel) bg-(--unassigned) px-1 text-[11px] font-bold text-(--fg-on-accent) tabular-nums">
                2
            </span>
        </button>
    );
}

function QuickChatPanel() {
    const [tab, setTab] = useState<"assigned" | "unassigned">("assigned");
    const assigned = dataset.conversations.filter((c) => c.assignedUserId);
    const unassigned = dataset.conversations.filter((c) => c.unassigned);

    return (
        <div className="flex h-full flex-col">
            <header className="flex h-12 shrink-0 items-center justify-between border-b border-(--border-strong) bg-(--bg-header) px-3">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setTab("assigned")}
                        aria-pressed={tab === "assigned"}
                        className={cn(
                            "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-header) focus-visible:outline-none active:scale-95",
                            tab === "assigned"
                                ? "bg-(--accent) text-(--accent-fg)"
                                : "text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                        )}
                    >
                        Assegnate ({assigned.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("unassigned")}
                        aria-pressed={tab === "unassigned"}
                        className={cn(
                            "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-header) focus-visible:outline-none active:scale-95",
                            tab === "unassigned"
                                ? "bg-(--unassigned) text-(--fg-on-accent)"
                                : "text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                        )}
                    >
                        Non assegnate ({unassigned.length})
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Aggiorna"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-header) focus-visible:outline-none active:scale-[0.97]"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </header>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {(tab === "assigned" ? assigned : unassigned).slice(0, 5).map((conv) => (
                        <button
                            key={conv.id}
                            type="button"
                            className="flex w-full cursor-pointer items-start gap-2 border-b border-(--border-soft) px-3 py-2 text-left transition-colors duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none focus-visible:ring-inset"
                        >
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback
                                    style={{ backgroundColor: conv.avatarColor, fontSize: 10 }}
                                >
                                    {initials(conv.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="truncate text-xs font-medium">
                                        {conv.name}
                                    </span>
                                    <span className="shrink-0 text-[11px] text-(--fg-tertiary) tabular-nums">
                                        {fmtRelativeDay(conv.lastMessageTs)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-(--fg-tertiary)">
                                    <span className="rounded bg-(--bg-panel-2) px-1">+39 02</span>
                                    {conv.windowClosed && (
                                        <Lock className="h-2.5 w-2.5 text-(--fg-warning)" />
                                    )}
                                    <span className="truncate">{conv.lastMessagePreview}</span>
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    {conv.lastMessageDirection === "out" &&
                                        conv.lastAck === "read" && (
                                            <CheckCheck
                                                className="h-2.5 w-2.5"
                                                style={{ color: "var(--color-ack-blue)" }}
                                            />
                                        )}
                                    {conv.lastMessageDirection === "out" &&
                                        conv.lastAck === "delivered" && (
                                            <CheckCheck className="h-2.5 w-2.5 text-(--fg-tertiary)" />
                                        )}
                                    {conv.unread > 0 && (
                                        <span className="rounded-full bg-(--accent) px-1 text-[11px] font-bold text-(--accent-fg) tabular-nums">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                    <button
                        type="button"
                        className="cursor-pointer px-3 py-2 text-center text-[11px] text-(--fg-link) transition-colors duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none focus-visible:ring-inset"
                    >
                        Mostra altre (
                        {(tab === "assigned" ? assigned : unassigned).length - 5 > 0
                            ? (tab === "assigned" ? assigned : unassigned).length - 5
                            : 0}
                        )
                    </button>
                </div>
            </ScrollArea>
            <footer className="shrink-0 border-t border-(--border-strong) bg-(--bg-panel-2) px-3 py-1.5 text-center text-[11px] text-(--fg-link)">
                Vedi tutte le conversazioni →
            </footer>
        </div>
    );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-[760px] w-[380px] flex-col overflow-hidden rounded-[44px] border-[10px] border-(--device-frame) bg-(--bg-panel) shadow-(--shadow-overlay)">
            {/* notch */}
            <div className="absolute top-0 left-1/2 z-50 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-(--device-frame)" />
            <div className="flex-1 overflow-hidden">{children}</div>
        </div>
    );
}

export type { SurfaceVariant };
