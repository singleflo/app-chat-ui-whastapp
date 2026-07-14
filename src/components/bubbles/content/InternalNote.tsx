import { StickyNote, AtSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Message } from "@/types/chat";
import { Markdown } from "../Markdown";
import { SenderTag } from "../Bubble";

export function InternalNoteContent({ message }: { message: Message }) {
    const { t } = useTranslation();
    const content = message.content;
    if (content.kind !== "internal_note") return null;
    return (
        <div className="relative">
            <div className="absolute top-0 -left-1 flex h-full w-1 rounded-l bg-(--fg-warning)" />
            <div className="flex items-center gap-1.5 pl-2 text-[11px] font-semibold tracking-wide text-(--fg-warning) uppercase">
                <StickyNote className="h-3.5 w-3.5" /> {t("bubble.internalNote.title")}
            </div>
            <SenderTag sender={message.sender} />
            <Markdown text={content.body} />
            {content.mentions && content.mentions.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] text-(--fg-link)">
                    <AtSign className="h-3 w-3" />
                    {content.mentions.join(", ")}
                </div>
            )}
            <div className="mt-1 text-[10px] text-(--fg-tertiary) italic">
                {t("bubble.internalNote.hint")}
            </div>
        </div>
    );
}
