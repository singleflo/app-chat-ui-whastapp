import { Star, ArrowLeft, Filter } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, colorFromString, fmtTime, initials } from "@/lib/utils";
import { dataset } from "@/data/dataset";

export function StarredScreen() {
    const starredMsgs = Object.values(dataset.messages)
        .flat()
        .filter((m) => "id" in m && (m as { starred?: boolean }).starred)
        .slice(0, 8);

    const demoStarred = Object.values(dataset.messages)
        .flat()
        .filter((m) => "id" in m && "body" in (m.content ?? {}))
        .slice(0, 6);

    const items = starredMsgs.length > 0 ? starredMsgs : demoStarred;

    return (
        <div className="flex h-full flex-col bg-(--bg-panel)">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-(--border-strong) bg-(--bg-header) px-3">
                <button
                    type="button"
                    aria-label="Indietro"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold">Messaggi importanti</h2>
                    <div className="text-[11px] text-(--fg-tertiary) tabular-nums">
                        {items.length} messaggi
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="Filtra"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <Filter className="h-4 w-4" />
                </button>
            </header>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-3">
                    {items.map((m) => {
                        const msg = m as {
                            id: string;
                            conversationId: string;
                            ts: string;
                            direction: string;
                            content: { kind: string; body?: string };
                        };
                        const conv = dataset.conversations.find((c) => c.id === msg.conversationId);
                        return (
                            <div
                                key={msg.id}
                                className="flex flex-col gap-1.5 rounded-lg border border-(--border-strong) bg-(--bg-panel-2) p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback
                                            style={{
                                                backgroundColor:
                                                    conv?.avatarColor ??
                                                    colorFromString(conv?.name ?? "?"),
                                                fontSize: 9,
                                            }}
                                        >
                                            {initials(conv?.name ?? "?")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 truncate text-xs font-medium text-(--accent)">
                                        {conv?.name}
                                    </span>
                                    <Star className="h-3.5 w-3.5 fill-(--fg-warning) text-(--fg-warning)" />
                                    <span className="text-[11px] text-(--fg-tertiary) tabular-nums">
                                        {fmtTime(msg.ts)}
                                    </span>
                                </div>
                                {msg.content.body && (
                                    <div
                                        className={cn(
                                            "text-xs",
                                            msg.direction === "out"
                                                ? "text-(--fg-primary)"
                                                : "text-(--fg-secondary)"
                                        )}
                                    >
                                        {msg.content.body}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
