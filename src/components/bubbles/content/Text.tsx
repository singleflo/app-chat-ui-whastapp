import { Markdown } from "../Markdown";
import type { LinkPreview } from "@/types/chat";
import { Globe } from "lucide-react";

export function TextContent({ body, linkPreview }: { body: string; linkPreview?: LinkPreview }) {
    return (
        <div>
            {linkPreview && <LinkPreviewCard preview={linkPreview} />}
            <Markdown text={body} />
        </div>
    );
}

function LinkPreviewCard({ preview }: { preview: LinkPreview }) {
    return (
        <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mb-1.5 block cursor-pointer overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel) no-underline transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-(--accent) hover:shadow-(--shadow-md) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none ${preview.compact ? "flex" : ""}`}
            onClick={(e) => e.preventDefault()}
        >
            {!preview.compact && preview.image && (
                <div className="h-32 w-full bg-gradient-to-br from-(--bg-hover) to-(--bg-active)" />
            )}
            <div className="min-w-0 flex-1 px-2 py-1.5">
                <div className="truncate text-[12px] font-semibold text-(--fg-primary)">
                    {preview.title}
                </div>
                {preview.description && (
                    <div className="truncate text-[11px] text-(--fg-secondary)">
                        {preview.description}
                    </div>
                )}
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-(--fg-tertiary)">
                    <Globe className="h-2.5 w-2.5" /> {preview.domain}
                </div>
            </div>
        </a>
    );
}
