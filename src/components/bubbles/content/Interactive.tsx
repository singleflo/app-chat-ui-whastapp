import { useState } from "react";
import {
    List,
    ChevronDown,
    ExternalLink,
    Phone,
    Copy,
    CheckCheck,
    ShoppingCart,
    X,
    Check,
    PhoneCall,
} from "lucide-react";
import type { CarouselCard, TemplateButton } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Markdown } from "../Markdown";
import { MediaPlaceholder } from "./Media";

/* ============ B11 — Reply buttons ============ */
export function ButtonsContent({
    header,
    body,
    footer,
    buttons,
    reply,
}: {
    header?: { text?: string; image?: string; video?: string; document?: string };
    body: string;
    footer?: string;
    buttons: { id: string; title: string }[];
    reply?: { id: string; title: string };
}) {
    if (reply) {
        return (
            <div className="flex w-[220px] max-w-full flex-col gap-1">
                <div className="text-[10px] tracking-wide text-(--fg-tertiary) uppercase">
                    Risposta
                </div>
                <div className="text-[14px] font-medium">{reply.title}</div>
            </div>
        );
    }
    return (
        <div className="flex w-[240px] max-w-full flex-col gap-1.5">
            {header?.image && (
                <MediaPlaceholder url={header.image} className="aspect-video rounded-md" />
            )}
            {header?.text && <div className="text-[13px] font-semibold">{header.text}</div>}
            <div className="text-[13px]">
                <Markdown text={body} />
            </div>
            {footer && <div className="text-[11px] text-(--fg-tertiary)">{footer}</div>}
            <div className="mt-1 flex flex-col divide-y divide-(--border-strong) border-t border-(--border-strong)">
                {buttons.map((b) => (
                    <button
                        type="button"
                        key={b.id}
                        className="flex cursor-pointer items-center justify-center py-1.5 text-[13px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                    >
                        {b.title}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ============ B11 — List message ============ */
export function ListContent({
    body,
    footer,
    buttonTitle,
    sections,
    reply,
}: {
    body: string;
    footer?: string;
    buttonTitle: string;
    sections: { title: string; rows: { id: string; title: string; description?: string }[] }[];
    reply?: { id: string; title: string; description?: string };
}) {
    const [open, setOpen] = useState(false);
    if (reply) {
        return (
            <div className="flex w-[220px] max-w-full flex-col gap-0.5">
                <div className="text-[10px] tracking-wide text-(--fg-tertiary) uppercase">
                    Scelta
                </div>
                <div className="text-[14px] font-medium">{reply.title}</div>
                {reply.description && (
                    <div className="text-[11px] text-(--fg-secondary)">{reply.description}</div>
                )}
            </div>
        );
    }
    return (
        <div className="relative w-[240px] max-w-full">
            <div className="text-[13px]">
                <Markdown text={body} />
            </div>
            {footer && <div className="mt-0.5 text-[11px] text-(--fg-tertiary)">{footer}</div>}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-(--border-strong) py-1.5 text-[13px] font-medium text-(--fg-primary) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                <List className="h-3.5 w-3.5" />
                {buttonTitle}
                <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute right-0 bottom-full left-0 z-10 mb-1 max-h-[260px] overflow-y-auto rounded-md border border-(--border-strong) bg-(--bg-panel) shadow-(--shadow-overlay)">
                    {sections.map((s) => (
                        <div key={s.title}>
                            <div className="px-2 py-1 text-[10px] font-semibold tracking-wide text-(--fg-tertiary) uppercase">
                                {s.title}
                            </div>
                            {s.rows.map((r) => (
                                <button
                                    type="button"
                                    key={r.id}
                                    onClick={() => setOpen(false)}
                                    className="block w-full cursor-pointer px-2 py-1.5 text-left transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none focus-visible:ring-inset active:scale-95"
                                >
                                    <div className="text-[13px] font-medium text-(--fg-primary)">
                                        {r.title}
                                    </div>
                                    {r.description && (
                                        <div className="text-[11px] text-(--fg-secondary)">
                                            {r.description}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ============ B11 — CTA URL ============ */
export function CtaUrlContent({
    body,
    footer,
    ctaTitle,
    url,
}: {
    body: string;
    footer?: string;
    ctaTitle: string;
    url: string;
}) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            <div className="text-[13px]">
                <Markdown text={body} />
            </div>
            {footer && <div className="text-[11px] text-(--fg-tertiary)">{footer}</div>}
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-t border-(--border-strong) py-1.5 text-[13px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                <ExternalLink className="h-3.5 w-3.5" /> {ctaTitle}
            </a>
        </div>
    );
}

/* ============ B11 — Flow message ============ */
export function FlowContent({
    body,
    ctaTitle,
    flowName,
    reply,
}: {
    body: string;
    ctaTitle: string;
    flowName: string;
    reply?: { flowName: string; responseJson: Record<string, unknown> };
}) {
    const [showJson, setShowJson] = useState(false);
    if (reply) {
        return (
            <div className="flex w-[240px] max-w-full flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-(--accent)">
                    <CheckCheck className="h-4 w-4" /> Modulo completato
                </div>
                <div className="text-[11px] text-(--fg-tertiary)">Flow: {reply.flowName}</div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
                    {Object.entries(reply.responseJson).map(([k, v]) => (
                        <div key={`flow-${k}`} className="contents">
                            <dt className="text-(--fg-tertiary)">{k}</dt>
                            <dd className="text-(--fg-primary)">{String(v)}</dd>
                        </div>
                    ))}
                </dl>
                <button
                    type="button"
                    onClick={() => setShowJson(!showJson)}
                    className="cursor-pointer rounded text-left text-[10px] text-(--fg-link) transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    {showJson ? "Nascondi dettagli" : "Vedi dettagli"}
                </button>
                {showJson && (
                    <pre className="overflow-x-auto rounded bg-black/10 p-1.5 font-mono text-[10px]">
                        {JSON.stringify(reply.responseJson, null, 2)}
                    </pre>
                )}
            </div>
        );
    }
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            <div className="text-[13px]">
                <Markdown text={body} />
            </div>
            <button
                type="button"
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-t border-(--border-strong) py-1.5 text-[13px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                <ExternalLink className="h-3.5 w-3.5" /> {ctaTitle}
            </button>
            <div className="text-[10px] text-(--fg-tertiary)">Flow: {flowName}</div>
        </div>
    );
}

/* ============ B11 — Call permission request ============ */
export function CallPermissionContent({ state }: { state: "pending" | "accepted" | "rejected" }) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[13px]">
                <PhoneCall className="h-4 w-4 text-(--accent)" />
                Richiesta di chiamata
            </div>
            {state === "pending" && (
                <div className="text-[11px] text-(--fg-tertiary)">
                    In attesa di autorizzazione (1/24h, 2/7gg)
                </div>
            )}
            {state === "accepted" && (
                <div className="text-[11px] text-(--accent)">✓ Autorizzata</div>
            )}
            {state === "rejected" && (
                <div className="text-[11px] text-(--status-failed)">✗ Rifiutata</div>
            )}
        </div>
    );
}

/* ============ B11 — Carousel ============ */
export function CarouselContent({ cards }: { cards: CarouselCard[] }) {
    return (
        <div className="w-[260px] max-w-full">
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
                {cards.map((c) => (
                    <div
                        key={c.id}
                        className="w-[200px] shrink-0 snap-start overflow-hidden rounded-md border border-(--border-strong) bg-(--bg-panel-2)"
                    >
                        {c.headerImage && (
                            <MediaPlaceholder
                                url={c.headerImage}
                                className="aspect-video w-full rounded-none"
                            />
                        )}
                        <div className="p-2">
                            <div className="text-[12px] text-(--fg-primary)">{c.body}</div>
                            <div className="mt-1.5 flex flex-col gap-1 border-t border-(--border-strong) pt-1.5">
                                {c.buttons.map((b) => (
                                    <button
                                        type="button"
                                        key={b.id}
                                        className="flex cursor-pointer items-center justify-center gap-1 rounded py-0.5 text-[11px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                                    >
                                        {b.kind === "url" && <ExternalLink className="h-3 w-3" />}
                                        {b.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-1 flex justify-center gap-1">
                {cards.map((c, idx) => (
                    <span
                        key={c.id}
                        className={cn(
                            "h-1 rounded-full",
                            idx === 0 ? "w-3 bg-(--accent)" : "w-1 bg-(--fg-tertiary)/40"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

/* ============ B11 — Product ============ */
export function ProductContent({
    product,
}: {
    product: {
        id: string;
        name: string;
        price: string;
        currency: string;
        description?: string;
        image: string;
    };
}) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5 overflow-hidden rounded-md">
            <MediaPlaceholder url={product.image} className="aspect-square w-full rounded-none" />
            <div className="px-2">
                <div className="text-[13px] font-semibold">{product.name}</div>
                {product.description && (
                    <div className="line-clamp-2 text-[11px] text-(--fg-secondary)">
                        {product.description}
                    </div>
                )}
                <div className="text-[14px] font-bold text-(--accent)">
                    {product.price} {product.currency}
                </div>
            </div>
        </div>
    );
}

/* ============ B11 — Product list ============ */
export function ProductListContent({
    sections,
    headerImage,
    title,
}: {
    sections: { title: string; items: { id: string; name: string; price: string }[] }[];
    headerImage?: string;
    title?: string;
}) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            {headerImage && (
                <MediaPlaceholder url={headerImage} className="aspect-[5/2] rounded-md" />
            )}
            {title && <div className="text-[13px] font-semibold">{title}</div>}
            {sections.map((s) => (
                <div key={s.title}>
                    <div className="text-[10px] tracking-wide text-(--fg-tertiary) uppercase">
                        {s.title}
                    </div>
                    {s.items.map((it) => (
                        <div
                            key={it.id}
                            className="flex items-center justify-between py-0.5 text-[12px]"
                        >
                            <span>{it.name}</span>
                            <span className="text-(--accent)">{it.price}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

/* ============ B11 — Catalog ============ */
export function CatalogContent({
    title,
    body,
    ctaTitle,
}: {
    title: string;
    body?: string;
    ctaTitle: string;
}) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-(--accent)" />
                <div className="text-[13px] font-semibold">{title}</div>
            </div>
            {body && <div className="text-[11px] text-(--fg-secondary)">{body}</div>}
            <button
                type="button"
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-t border-(--border-strong) py-1.5 text-[13px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                {ctaTitle}
            </button>
        </div>
    );
}

/* ============ shared button renderer (template buttons) ============ */
export function TemplateButtonRow({ button }: { button: TemplateButton }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = (code?: string) => {
        if (!code) return;
        try {
            navigator.clipboard?.writeText(code);
        } catch {
            // mockup — clipboard not available
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };
    switch (button.kind) {
        case "url":
            return (
                <a
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.preventDefault()}
                    className="flex cursor-pointer items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <ExternalLink className="h-3 w-3" /> {button.title}
                </a>
            );
        case "phone":
            return (
                <a
                    href={`tel:${button.phone}`}
                    onClick={(e) => e.preventDefault()}
                    className="flex cursor-pointer items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <Phone className="h-3 w-3" /> {button.title}
                </a>
            );
        case "copy_code":
        case "otp_copy":
            return (
                <button
                    type="button"
                    onClick={() => handleCopy(button.code)}
                    className="flex cursor-pointer items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{" "}
                    {button.title}
                </button>
            );
        case "otp_one_tap":
            return (
                <button
                    type="button"
                    onClick={() => handleCopy(button.code)}
                    className="flex cursor-pointer items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <CheckCheck className="h-3 w-3" /> {button.title}
                </button>
            );
        case "quick_reply":
        case "catalog":
        case "mpm":
        case "flow":
            return (
                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    {button.kind === "catalog" && <ShoppingCart className="h-3 w-3" />}
                    {button.kind === "flow" && <ExternalLink className="h-3 w-3" />}
                    {button.title}
                </button>
            );
        default:
            return null;
    }
}

export { X };
