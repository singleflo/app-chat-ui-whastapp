import { Search, ArrowLeft, MessageSquare, User, Filter } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, fmtRelativeDay, initials } from "@/lib/utils";
import { useAllMessages, useContactProfiles, useConversations } from "@/data/chat-data";
import { isMessage } from "@/types/chat";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SearchScreen() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("ordine");
    const { items: conversations } = useConversations();
    const allMessages = useAllMessages();
    const contactsProfiles = useContactProfiles();
    const highlight = (text: string) => {
        if (!query) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark className="rounded bg-(--accent-soft) px-0.5 text-(--accent)">
                    {text.slice(idx, idx + query.length)}
                </mark>
                {text.slice(idx + query.length)}
            </>
        );
    };

    const matchedConvs = conversations.filter(
        (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.lastMessagePreview.toLowerCase().includes(query.toLowerCase())
    );
    const matchedMsgs = allMessages
        .filter(isMessage)
        .filter(
            (m) =>
                m.content.kind === "text" &&
                m.content.body.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
    const matchedContacts = contactsProfiles.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex h-full flex-col bg-(--bg-panel)">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-(--border-strong) bg-(--bg-header) px-3">
                <button
                    type="button"
                    aria-label={t("search.back")}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-(--bg-panel-2) px-3 py-1.5">
                    <Search className="h-3.5 w-3.5 text-(--fg-tertiary)" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("search.placeholder")}
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                </div>
            </header>
            <div className="flex shrink-0 items-center gap-1.5 px-3 py-2">
                {(["all", "media", "documents", "links", "audio"] as const).map((f, i) => (
                    <button
                        key={f}
                        type="button"
                        aria-pressed={i === 0}
                        className={cn(
                            "shrink-0 cursor-pointer rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95",
                            i === 0
                                ? "border-(--accent) bg-(--accent-soft) text-(--accent)"
                                : "border-(--border-strong) text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                        )}
                    >
                        {t(`search.filters.${f}`)}
                    </button>
                ))}
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {matchedConvs.length > 0 && (
                        <ResultGroup
                            icon={MessageSquare}
                            title={t("search.conversations", { count: matchedConvs.length })}
                        >
                            {matchedConvs.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-200 ease-out hover:bg-(--bg-hover)"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback style={{ backgroundColor: c.avatarColor }}>
                                            {initials(c.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-medium">
                                            {highlight(c.name)}
                                        </div>
                                        <div className="truncate text-xs text-(--fg-secondary)">
                                            {highlight(c.lastMessagePreview)}
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-(--fg-tertiary) tabular-nums">
                                        {fmtRelativeDay(c.lastMessageTs)}
                                    </span>
                                </div>
                            ))}
                        </ResultGroup>
                    )}
                    {matchedMsgs.length > 0 && (
                        <ResultGroup
                            icon={Search}
                            title={t("search.messages", { count: matchedMsgs.length })}
                        >
                            {matchedMsgs.map((m) => {
                                const conv = conversations.find(
                                    (c) => c.id === m.conversationId
                                );
                                return (
                                    <div
                                        key={m.id}
                                        className="cursor-pointer px-3 py-2 transition-colors duration-200 ease-out hover:bg-(--bg-hover)"
                                    >
                                        <div className="text-xs font-medium text-(--accent)">
                                            {conv?.name}
                                        </div>
                                        {m.content.kind === "text" && (
                                            <div className="mt-0.5 line-clamp-2 text-xs text-(--fg-secondary)">
                                                {highlight(m.content.body)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </ResultGroup>
                    )}
                    {matchedContacts.length > 0 && (
                        <ResultGroup
                            icon={User}
                            title={t("search.contacts", { count: matchedContacts.length })}
                        >
                            {matchedContacts.map((p) => (
                                <div
                                    key={p.contactId}
                                    className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-200 ease-out hover:bg-(--bg-hover)"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback style={{ backgroundColor: p.avatarColor }}>
                                            {initials(p.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium">
                                            {highlight(p.name)}
                                        </div>
                                        <div className="text-[11px] text-(--fg-tertiary)">
                                            {p.phones[0]?.number}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ResultGroup>
                    )}
                    {matchedConvs.length === 0 &&
                        matchedMsgs.length === 0 &&
                        matchedContacts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-sm text-(--fg-tertiary)">
                                <Filter className="mb-2 h-8 w-8 opacity-40" />
                                {t("search.noResults", { query })}
                            </div>
                        )}
                </div>
            </ScrollArea>
        </div>
    );
}

function ResultGroup({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center gap-1.5 bg-(--bg-panel-2) px-3 py-1.5 text-[11px] font-semibold tracking-wide text-(--fg-secondary) uppercase">
                <Icon className="h-3 w-3" /> {title}
            </div>
            {children}
        </div>
    );
}
