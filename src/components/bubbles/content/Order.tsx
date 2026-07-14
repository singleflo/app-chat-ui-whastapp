import type { OrderItem } from "@/types/chat";
import { MediaPlaceholder } from "./Media";
import { ChevronRight } from "lucide-react";

export function OrderContent({
    items,
    total,
    currency,
    note,
}: {
    items: OrderItem[];
    total: string;
    currency: string;
    note?: string;
}) {
    return (
        <div className="flex w-[260px] max-w-full flex-col gap-2">
            <div className="text-[10px] tracking-wide text-(--fg-tertiary) uppercase">
                🛒 Ordine · {items.length} articoli
            </div>
            <div className="space-y-1.5">
                {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-2">
                        <MediaPlaceholder
                            url={it.image ?? `prod:${it.id}`}
                            className="h-10 w-10 shrink-0 rounded"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px] font-medium">{it.name}</div>
                            <div className="text-[10px] text-(--fg-tertiary)">
                                {it.qty} × {it.price} {it.currency}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {note && <div className="text-[11px] text-(--fg-secondary) italic">"{note}"</div>}
            <div className="flex items-center justify-between border-t border-(--border-strong) pt-1.5 text-[13px] font-semibold">
                <span>Totale</span>
                <span className="text-(--accent)">
                    {total} {currency}
                </span>
            </div>
            <button
                type="button"
                className="flex cursor-pointer items-center justify-center gap-1 rounded py-1 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                Vedi ordine <ChevronRight className="h-3 w-3" />
            </button>
        </div>
    );
}
