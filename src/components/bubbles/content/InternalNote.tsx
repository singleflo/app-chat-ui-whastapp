import { StickyNote, AtSign } from "lucide-react";
import type { Message } from "@/types/chat";
import { Markdown } from "../Markdown";
import { SenderTag } from "../Bubble";

export function InternalNoteContent({ message }: { message: Message }) {
    const content = message.content;
    if (content.kind !== "internal_note") return null;
    return (
        <div className="relative">
            <div className="absolute -left-1 top-0 flex h-full w-1 rounded-l bg-[var(--fg-warning)]" />
            <div className="flex items-center gap-1.5 pl-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-warning)]">
                <StickyNote className="h-3.5 w-3.5" /> Nota interna
            </div>
            <SenderTag sender={message.sender} />
            <Markdown text={content.body} />
            {content.mentions && content.mentions.length > 0 && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-[var(--fg-link)]">
                    <AtSign className="h-3 w-3" />
                    {content.mentions.join(", ")}
                </div>
            )}
            <div className="mt-1 text-[10px] italic text-[var(--fg-tertiary)]">
                Visibile solo al team · mai inviata a WhatsApp
            </div>
        </div>
    );
}
