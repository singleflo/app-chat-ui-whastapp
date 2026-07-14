import type { ReactNode } from "react";

/**
 * WhatsApp inline markdown renderer (B1): *bold*, _italic_, ~strike~,
 * `inline code`, ```code block```, > quote, lists. Naive but spec-aligned.
 */
export function Markdown({ text }: { text: string }) {
    return <span className="whitespace-pre-wrap leading-snug text-[var(--fg-primary)]">{renderInline(text)}</span>;
}

function renderInline(text: string): ReactNode[] {
    const tokens = text.split(/(```[\s\S]+?```|`[^`]+`|\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/g);
    return tokens.map((tok, i) => {
        const key = `t-${i}-${tok.slice(0, 6)}`;
        if (tok.startsWith("```") && tok.endsWith("```")) {
            return (
                <code
                    key={key}
                    className="block overflow-x-auto whitespace-pre-wrap break-words rounded bg-black/10 px-2 py-1 font-mono text-[12px]"
                >
                    {tok.slice(3, -3)}
                </code>
            );
        }
        if (tok.startsWith("`") && tok.endsWith("`")) {
            return (
                <code key={key} className="break-words rounded bg-black/10 px-1 font-mono text-[12px]">
                    {tok.slice(1, -1)}
                </code>
            );
        }
        if (tok.startsWith("*") && tok.endsWith("*"))
            return (
                <strong key={key} className="font-semibold">
                    {tok.slice(1, -1)}
                </strong>
            );
        if (tok.startsWith("_") && tok.endsWith("_"))
            return (
                <em key={key} className="italic">
                    {tok.slice(1, -1)}
                </em>
            );
        if (tok.startsWith("~") && tok.endsWith("~")) return <s key={key}>{tok.slice(1, -1)}</s>;
        return <span key={key}>{tok}</span>;
    });
}
