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
import type {
    CarouselCard,
    TemplateButton,
} from "@/types/chat";
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
                <div className="text-[10px] uppercase tracking-wide text-[var(--fg-tertiary)]">Risposta</div>
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
            {footer && <div className="text-[11px] text-[var(--fg-tertiary)]">{footer}</div>}
            <div className="mt-1 flex flex-col divide-y divide-[var(--border-strong)] border-t border-[var(--border-strong)]">
                {buttons.map((b) => (
                    <button
                        type="button"
                        key={b.id}
                        className="flex items-center justify-center py-1.5 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
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
                <div className="text-[10px] uppercase tracking-wide text-[var(--fg-tertiary)]">Scelta</div>
                <div className="text-[14px] font-medium">{reply.title}</div>
                {reply.description && (
                    <div className="text-[11px] text-[var(--fg-secondary)]">{reply.description}</div>
                )}
            </div>
        );
    }
    return (
        <div className="relative w-[240px] max-w-full">
            <div className="text-[13px]">
                <Markdown text={body} />
            </div>
            {footer && <div className="mt-0.5 text-[11px] text-[var(--fg-tertiary)]">{footer}</div>}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border-strong)] py-1.5 text-[13px] font-medium text-[var(--fg-primary)] hover:bg-[var(--bg-hover)]"
            >
                <List className="h-3.5 w-3.5" />
                {buttonTitle}
                <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute bottom-full left-0 right-0 z-10 mb-1 max-h-[260px] overflow-y-auto rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)]">
                    {sections.map((s) => (
                        <div key={s.title}>
                            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--fg-tertiary)]">
                                {s.title}
                            </div>
                            {s.rows.map((r) => (
                                <button
                                    type="button"
                                    key={r.id}
                                    onClick={() => setOpen(false)}
                                    className="block w-full px-2 py-1.5 text-left hover:bg-[var(--bg-hover)]"
                                >
                                    <div className="text-[13px] font-medium text-[var(--fg-primary)]">{r.title}</div>
                                    {r.description && (
                                        <div className="text-[11px] text-[var(--fg-secondary)]">{r.description}</div>
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
            {footer && <div className="text-[11px] text-[var(--fg-tertiary)]">{footer}</div>}
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-1.5 rounded-md border-t border-[var(--border-strong)] py-1.5 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
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
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)]">
                    <CheckCheck className="h-4 w-4" /> Modulo completato
                </div>
                <div className="text-[11px] text-[var(--fg-tertiary)]">Flow: {reply.flowName}</div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
                    {Object.entries(reply.responseJson).map(([k, v]) => (
                        <div key={`flow-${k}`} className="contents">
                            <dt className="text-[var(--fg-tertiary)]">{k}</dt>
                            <dd className="text-[var(--fg-primary)]">{String(v)}</dd>
                        </div>
                    ))}
                </dl>
                <button
                    type="button"
                    onClick={() => setShowJson(!showJson)}
                    className="text-left text-[10px] text-[var(--fg-link)]"
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
                className="flex items-center justify-center gap-1.5 rounded-md border-t border-[var(--border-strong)] py-1.5 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
            >
                <ExternalLink className="h-3.5 w-3.5" /> {ctaTitle}
            </button>
            <div className="text-[10px] text-[var(--fg-tertiary)]">Flow: {flowName}</div>
        </div>
    );
}

/* ============ B11 — Call permission request ============ */
export function CallPermissionContent({ state }: { state: "pending" | "accepted" | "rejected" }) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[13px]">
                <PhoneCall className="h-4 w-4 text-[var(--accent)]" />
                Richiesta di chiamata
            </div>
            {state === "pending" && (
                <div className="text-[11px] text-[var(--fg-tertiary)]">In attesa di autorizzazione (1/24h, 2/7gg)</div>
            )}
            {state === "accepted" && (
                <div className="text-[11px] text-[var(--accent)]">✓ Autorizzata</div>
            )}
            {state === "rejected" && (
                <div className="text-[11px] text-[var(--status-failed)]">✗ Rifiutata</div>
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
                        className="w-[200px] shrink-0 snap-start rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel-2)] overflow-hidden"
                    >
                        {c.headerImage && (
                            <MediaPlaceholder url={c.headerImage} className="aspect-video w-full rounded-none" />
                        )}
                        <div className="p-2">
                            <div className="text-[12px] text-[var(--fg-primary)]">{c.body}</div>
                            <div className="mt-1.5 flex flex-col gap-1 border-t border-[var(--border-strong)] pt-1.5">
                                {c.buttons.map((b) => (
                                    <button
                                        type="button"
                                        key={b.id}
                                        className="flex items-center justify-center gap-1 py-0.5 text-[11px] font-medium text-[var(--accent)]"
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
                            idx === 0 ? "w-3 bg-[var(--accent)]" : "w-1 bg-[var(--fg-tertiary)]/40"
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
    product: { id: string; name: string; price: string; currency: string; description?: string; image: string };
}) {
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5 rounded-md overflow-hidden">
            <MediaPlaceholder url={product.image} className="aspect-square w-full rounded-none" />
            <div className="px-2">
                <div className="text-[13px] font-semibold">{product.name}</div>
                {product.description && (
                    <div className="text-[11px] text-[var(--fg-secondary)] line-clamp-2">{product.description}</div>
                )}
                <div className="text-[14px] font-bold text-[var(--accent)]">
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
            {headerImage && <MediaPlaceholder url={headerImage} className="aspect-[5/2] rounded-md" />}
            {title && <div className="text-[13px] font-semibold">{title}</div>}
            {sections.map((s) => (
                <div key={s.title}>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--fg-tertiary)]">{s.title}</div>
                    {s.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between py-0.5 text-[12px]">
                            <span>{it.name}</span>
                            <span className="text-[var(--accent)]">{it.price}</span>
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
                <ShoppingCart className="h-5 w-5 text-[var(--accent)]" />
                <div className="text-[13px] font-semibold">{title}</div>
            </div>
            {body && <div className="text-[11px] text-[var(--fg-secondary)]">{body}</div>}
            <button
                type="button"
                className="flex items-center justify-center gap-1.5 rounded-md border-t border-[var(--border-strong)] py-1.5 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
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
                    className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
                >
                    <ExternalLink className="h-3 w-3" /> {button.title}
                </a>
            );
        case "phone":
            return (
                <a
                    href={`tel:${button.phone}`}
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
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
                    className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {button.title}
                </button>
            );
        case "otp_one_tap":
            return (
                <button
                    type="button"
                    onClick={() => handleCopy(button.code)}
                    className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
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
                    className="flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--bg-hover)]"
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
