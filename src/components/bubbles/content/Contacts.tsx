import { Phone, Mail, MessageSquare, Building2, Calendar } from "lucide-react";
import type { ContactCard } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { colorFromString, initials } from "@/lib/utils";

export function ContactsContent({ cards }: { cards: ContactCard[] }) {
    if (cards.length === 1) return <ContactCardView card={cards[0]} />;
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            <div className="text-[12px] font-medium text-(--fg-secondary)">
                {cards.length} contatti
            </div>
            {cards.map((c) => (
                <ContactCardView key={c.name.formatted} card={c} compact />
            ))}
        </div>
    );
}

function ContactCardView({ card, compact }: { card: ContactCard; compact?: boolean }) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5 rounded-md bg-(--bg-panel-2) p-2">
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                    <AvatarFallback
                        style={{ backgroundColor: colorFromString(card.name.formatted) }}
                    >
                        {initials(card.name.formatted)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{card.name.formatted}</div>
                    {card.org && (
                        <div className="flex min-w-0 items-center gap-1 text-[11px] text-(--fg-tertiary)">
                            <Building2 className="h-3 w-3 shrink-0" />{" "}
                            <span className="truncate">{card.org}</span>
                        </div>
                    )}
                </div>
            </div>
            {!compact && (
                <div className="space-y-1 text-[11px]">
                    {card.phones?.map((ph) => (
                        <div
                            key={`${ph.type}-${ph.number}`}
                            className="flex min-w-0 items-center gap-1.5"
                        >
                            <Phone className="h-3 w-3 shrink-0 text-(--fg-tertiary)" />
                            <span className="shrink-0 text-(--fg-secondary)">
                                {ph.type.toLowerCase()}:
                            </span>
                            <span className="truncate">{ph.number}</span>
                            {ph.wa && (
                                <span className="shrink-0 rounded bg-(--accent-soft) px-1 text-[9px] text-(--accent)">
                                    WA
                                </span>
                            )}
                        </div>
                    ))}
                    {card.emails?.map((e) => (
                        <div
                            key={`${e.type}-${e.value}`}
                            className="flex min-w-0 items-center gap-1.5"
                        >
                            <Mail className="h-3 w-3 shrink-0 text-(--fg-tertiary)" />
                            <span className="truncate">{e.value}</span>
                        </div>
                    ))}
                    {card.birthday && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-(--fg-tertiary)" />
                            <span>{card.birthday}</span>
                        </div>
                    )}
                </div>
            )}
            {card.phones?.some((p) => p.wa) && (
                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-md bg-(--accent-soft) py-1 text-[11px] font-medium text-(--accent) transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-(--accent-hover) hover:text-(--accent-fg) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <MessageSquare className="h-3 w-3" /> Avvia chat
                </button>
            )}
        </div>
    );
}
