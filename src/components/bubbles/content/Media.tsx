import { FileText, FileSpreadsheet, FileCode, FileArchive, File, Layers } from "lucide-react";
import { cn, fmtBytes } from "@/lib/utils";
import { Markdown } from "../Markdown";
import { Play, MoreVertical } from "lucide-react";

export function ImageContent({
    url,
    caption,
    album,
}: {
    url: string;
    caption?: string;
    album?: { total: number };
}) {
    const openLightbox = () => {
        window.dispatchEvent(new CustomEvent("wa-lightbox-open", { detail: { url, caption } }));
    };
    return (
        <div className="flex flex-col gap-1">
            <div className="relative">
                <button type="button" onClick={openLightbox} className="block cursor-zoom-in rounded-lg transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]" aria-label="Apri immagine">
                    <MediaPlaceholder url={url} className="aspect-video w-[240px] max-w-full max-w-[320px] rounded-lg" />
                </button>
                {album && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                        +{album.total - 1}
                    </span>
                )}
            </div>
            {caption && <Markdown text={caption} />}
        </div>
    );
}

export function VideoContent({
    url,
    poster,
    durationSec,
    caption,
    gif,
}: {
    url: string;
    poster?: string;
    durationSec: number;
    caption?: string;
    gif?: boolean;
}) {
    const mm = String(Math.floor(durationSec / 60)).padStart(1, "0");
    const ss = String(durationSec % 60).padStart(2, "0");
    return (
        <div className="flex flex-col gap-1">
            <div className="relative">
                <MediaPlaceholder
                    url={poster ?? url}
                    className="aspect-video w-[240px] max-w-full max-w-[320px] rounded-lg"
                />
                <button
                    type="button"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]"
                    aria-label="Riproduci"
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
                        <Play className="h-5 w-5" />
                    </span>
                </button>
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    {gif ? "GIF" : `${mm}:${ss}`}
                </span>
            </div>
            {caption && <Markdown text={caption} />}
        </div>
    );
}

export function DocumentContent({
    name,
    mime,
    sizeBytes,
    pages,
}: {
    name: string;
    mime: string;
    sizeBytes: number;
    pages?: number;
}) {
    const Icon = pickDocIcon(mime);
    return (
        <div className="flex w-[220px] max-w-full items-center gap-2 rounded-md bg-[var(--bg-panel-2)] p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{truncateMiddle(name, 28)}</div>
                <div className="text-[10px] text-[var(--fg-tertiary)]">
                    {fmtBytes(sizeBytes)}
                    {pages ? ` · ${pages} pag` : ""}
                </div>
            </div>
            <button type="button" className="shrink-0 cursor-pointer rounded text-[var(--fg-tertiary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[var(--fg-secondary)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]" aria-label="Opzioni documento">
                <MoreVertical className="h-4 w-4" />
            </button>
        </div>
    );
}

export function StickerContent({ url, animated }: { url: string; animated: boolean }) {
    return (
        <div className="relative h-[140px] w-[140px] overflow-hidden rounded-lg">
            <MediaPlaceholder
                url={url}
                className="h-[140px] w-[140px] rounded-lg"
                transparent
            />
            {animated && (
                <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1 text-[9px] text-white">
                    ANIM
                </span>
            )}
        </div>
    );
}

export function MediaPlaceholder({
    url,
    className,
    transparent,
}: {
    url: string;
    className?: string;
    transparent?: boolean;
}) {
    const hue = hashHue(url);
    return (
        <div
            className={cn(
                !transparent && "bg-[var(--bg-panel-2)]",
                "flex items-center justify-center",
                className
            )}
            style={{
                backgroundImage: `linear-gradient(${hue}deg, hsl(${hue} 50% 70%), hsl(${(hue + 60) % 360} 50% 80%))`,
            }}
        >
            <div className="text-2xl opacity-40">🖼</div>
        </div>
    );
}

function truncateMiddle(s: string, max: number) {
    if (s.length <= max) return s;
    const half = Math.floor((max - 1) / 2);
    return `${s.slice(0, half)}…${s.slice(-half)}`;
}

function hashHue(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return h;
}

function pickDocIcon(mime: string) {
    if (mime.includes("pdf")) return FileText;
    if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("xls")) return FileSpreadsheet;
    if (mime.includes("json") || mime.includes("javascript") || mime.includes("text/")) return FileCode;
    if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar") || mime.includes("gz"))
        return FileArchive;
    if (mime.includes("presentation") || mime.includes("powerpoint")) return Layers;
    if (mime.includes("msword") || mime.includes("wordprocessing")) return FileText;
    return File;
}
