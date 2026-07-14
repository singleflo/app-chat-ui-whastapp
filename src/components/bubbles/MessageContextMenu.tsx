import { useState, useRef, useEffect } from "react";
import {
    Reply, Smile, Forward, Copy, Star, Trash2, Info, ChevronDown,
} from "lucide-react";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function MessageContextMenu({ message }: { message: Message }) {
    const [open, setOpen] = useState(false);
    const [showReactionBar, setShowReactionBar] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setShowReactionBar(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    useEffect(() => {
        if (!open && !showReactionBar) return;
        const bubble = ref.current?.closest<HTMLElement>(".group");
        if (!bubble) return;
        bubble.style.zIndex = "50";
        return () => {
            bubble.style.zIndex = "";
        };
    }, [open, showReactionBar]);

    if (!open && !showReactionBar) {
        return (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                }}
                className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-panel)] opacity-0 shadow group-hover:flex group-hover:opacity-100 transition-opacity"
                aria-label="Azioni messaggio"
            >
                <ChevronDown className="h-3 w-3 text-[var(--fg-secondary)]" />
            </button>
        );
    }

    return (
        <div ref={ref} className="absolute right-1 top-1 z-30">
            {showReactionBar ? (
                <div className="flex items-center gap-0.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-panel)] px-1.5 py-1 shadow-[var(--shadow-overlay)]">
                    {QUICK_REACTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                                setShowReactionBar(false);
                                setOpen(false);
                            }}
                            className="rounded-full p-1 text-lg hover:scale-125 hover:bg-[var(--bg-hover)] transition-transform"
                        >
                            {emoji}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setShowReactionBar(false)}
                        className="ml-1 rounded-full p-1 text-[var(--fg-tertiary)] hover:bg-[var(--bg-hover)]"
                    >
                        +
                    </button>
                </div>
            ) : (
                <div className="w-44 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] py-0.5 shadow-[var(--shadow-overlay)]">
                    <MenuItem icon={Reply} label="Rispondi" onClick={() => setOpen(false)} />
                    <MenuItem
                        icon={Smile}
                        label="Reagisci"
                        onClick={() => setShowReactionBar(true)}
                    />
                    <MenuItem icon={Forward} label="Inoltra" onClick={() => setOpen(false)} />
                    <MenuItem icon={Copy} label="Copia" onClick={() => setOpen(false)} />
                    <MenuItem icon={Star} label="Aggiungi a Importanti" onClick={() => setOpen(false)} />
                    {message.direction === "out" && (
                        <MenuItem icon={Info} label="Info messaggio" onClick={() => setOpen(false)} />
                    )}
                    <div className="my-0.5 border-t border-[var(--border-soft)]" />
                    <MenuItem
                        icon={Trash2}
                        label="Elimina"
                        variant="danger"
                        onClick={() => setOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

function MenuItem({
    icon: Icon,
    label,
    onClick,
    variant = "default",
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-xs hover:bg-[var(--bg-hover)]",
                variant === "danger" ? "text-[var(--status-failed)]" : "text-[var(--fg-primary)]"
            )}
        >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
        </button>
    );
}
