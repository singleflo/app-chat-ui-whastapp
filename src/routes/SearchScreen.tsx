import { Search, ArrowLeft, MessageSquare, User, Filter } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, fmtRelativeDay, initials } from "@/lib/utils";
import { dataset } from "@/data/dataset";
import { isMessage } from "@/types/chat";
import { useState } from "react";

export function SearchScreen() {
    const [query, setQuery] = useState("ordine");
    const highlight = (text: string) => {
        if (!query) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark className="rounded bg-[var(--accent-soft)] px-0.5 text-[var(--accent)]">{text.slice(idx, idx + query.length)}</mark>
                {text.slice(idx + query.length)}
            </>
        );
    };

    const matchedConvs = dataset.conversations.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMessagePreview.toLowerCase().includes(query.toLowerCase()));
    const matchedMsgs = Object.values(dataset.messages).flat().filter(isMessage).filter((m) => m.content.kind === "text" && m.content.body.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    const matchedContacts = dataset.contactsProfiles.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="flex h-full flex-col bg-[var(--bg-panel)]">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                <button type="button" aria-label="Indietro" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-[var(--bg-panel-2)] px-3 py-1.5">
                    <Search className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca..." className="flex-1 bg-transparent text-sm focus:outline-none" />
                </div>
            </header>
            <div className="flex shrink-0 items-center gap-1.5 px-3 py-2">
                {["Tutti", "📷 Media", "📄 Documenti", "🔗 Link", "🎤 Audio"].map((f, i) => (
                    <button key={f} type="button" aria-pressed={i === 0} className={cn("shrink-0 cursor-pointer rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-95", i === 0 ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--border-strong)] text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]")}>
                        {f}
                    </button>
                ))}
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {matchedConvs.length > 0 && (
                        <ResultGroup icon={MessageSquare} title={`Conversazioni (${matchedConvs.length})`}>
                            {matchedConvs.map((c) => (
                                <div key={c.id} className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)]">
                                    <Avatar className="h-9 w-9"><AvatarFallback style={{ backgroundColor: c.avatarColor }}>{initials(c.name)}</AvatarFallback></Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-sm font-medium">{highlight(c.name)}</div>
                                        <div className="truncate text-xs text-[var(--fg-secondary)]">{highlight(c.lastMessagePreview)}</div>
                                    </div>
                                    <span className="text-[11px] text-[var(--fg-tertiary)] tabular-nums">{fmtRelativeDay(c.lastMessageTs)}</span>
                                </div>
                            ))}
                        </ResultGroup>
                    )}
                    {matchedMsgs.length > 0 && (
                        <ResultGroup icon={Search} title={`Messaggi (${matchedMsgs.length})`}>
                            {matchedMsgs.map((m) => {
                                const conv = dataset.conversations.find((c) => c.id === m.conversationId);
                                return (
                                    <div key={m.id} className="cursor-pointer px-3 py-2 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)]">
                                        <div className="text-xs font-medium text-[var(--accent)]">{conv?.name}</div>
                                        {m.content.kind === "text" && <div className="mt-0.5 line-clamp-2 text-xs text-[var(--fg-secondary)]">{highlight(m.content.body)}</div>}
                                    </div>
                                );
                            })}
                        </ResultGroup>
                    )}
                    {matchedContacts.length > 0 && (
                        <ResultGroup icon={User} title={`Contatti (${matchedContacts.length})`}>
                            {matchedContacts.map((p) => (
                                <div key={p.contactId} className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)]">
                                    <Avatar className="h-9 w-9"><AvatarFallback style={{ backgroundColor: p.avatarColor }}>{initials(p.name)}</AvatarFallback></Avatar>
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium">{highlight(p.name)}</div>
                                        <div className="text-[11px] text-[var(--fg-tertiary)]">{p.phones[0]?.number}</div>
                                    </div>
                                </div>
                            ))}
                        </ResultGroup>
                    )}
                    {matchedConvs.length === 0 && matchedMsgs.length === 0 && matchedContacts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-sm text-[var(--fg-tertiary)]">
                            <Filter className="mb-2 h-8 w-8 opacity-40" />Nessun risultato per "{query}"
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function ResultGroup({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-1.5 bg-[var(--bg-panel-2)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-secondary)]">
                <Icon className="h-3 w-3" /> {title}
            </div>
            {children}
        </div>
    );
}
