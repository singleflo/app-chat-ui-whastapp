import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { MediaPlaceholder } from "@/components/bubbles/content/Media";

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--scrim)";
const iconBtn = `cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] ${focusRing}`;

export interface LightboxState {
    open: boolean;
    url: string;
    caption?: string;
    index: number;
    total: number;
}

export function Lightbox({
    state,
    onClose,
    onPrev,
    onNext,
}: {
    state: LightboxState;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const { t } = useTranslation();
    const [zoomed, setZoomed] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const [prevIndex, setPrevIndex] = useState(state.index);
    if (state.index !== prevIndex) {
        setPrevIndex(state.index);
        setZoomed(false);
    }

    useEffect(() => {
        if (!state.open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && state.index > 0) onPrev();
            if (e.key === "ArrowRight" && state.index < state.total - 1) onNext();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [state, onClose, onPrev, onNext]);

    useEffect(() => {
        if (!state.open) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusable = () =>
            Array.from(
                dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
                ) ?? []
            ).filter((el) => !el.hasAttribute("disabled"));
        focusable()[0]?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const items = focusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            previouslyFocused?.focus();
        };
    }, [state.open]);

    const handleDownload = useCallback(() => {
        const link = document.createElement("a");
        link.href = state.url;
        link.download = state.url.split("/").pop() ?? "download";
        link.click();
    }, [state.url]);

    const handleShare = useCallback(async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: state.caption ?? t("overlays.lightbox.image"),
                    url: state.url,
                });
            }
        } catch {
            // user cancelled or not available
        }
    }, [state.url, state.caption, t]);

    if (!state.open) return null;

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={state.caption ?? t("overlays.lightbox.image")}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-(--scrim)"
        >
            <button
                type="button"
                onClick={onClose}
                className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-hover) text-(--fg-on-accent) hover:bg-(--bg-active) ${iconBtn}`}
                aria-label={t("overlays.lightbox.close")}
            >
                <X className="h-5 w-5" />
            </button>

            <div className="absolute top-4 left-4 z-10 rounded-full bg-(--bg-hover) px-3 py-1 text-sm font-medium text-(--fg-on-accent)">
                {t("overlays.lightbox.counter", { current: state.index + 1, total: state.total })}
            </div>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                <button
                    type="button"
                    onClick={() => setZoomed(!zoomed)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-hover) text-(--fg-on-accent) hover:bg-(--bg-active) ${iconBtn}`}
                    aria-label={zoomed ? t("overlays.lightbox.zoomOut") : t("overlays.lightbox.zoomIn")}
                >
                    {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-hover) text-(--fg-on-accent) hover:bg-(--bg-active) ${iconBtn}`}
                    aria-label={t("overlays.lightbox.download")}
                >
                    <Download className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-(--bg-hover) text-(--fg-on-accent) hover:bg-(--bg-active) ${iconBtn}`}
                    aria-label={t("overlays.lightbox.share")}
                >
                    <Share2 className="h-5 w-5" />
                </button>
            </div>

            {state.index > 0 && (
                <button
                    type="button"
                    onClick={onPrev}
                    className={`absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-(--bg-hover) text-(--fg-on-accent) hover:bg-(--bg-active) ${iconBtn}`}
                    aria-label={t("overlays.lightbox.previous")}
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            {state.index < state.total - 1 && (
                <button
                    type="button"
                    onClick={onNext}
                    className={`absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-(--bg-hover) text-(--fg-on-accent) hover:bg-(--bg-active) ${iconBtn}`}
                    aria-label={t("overlays.lightbox.next")}
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}

            <div
                className="max-h-[85vh] max-w-[90vw] overflow-auto"
                style={{
                    transform: zoomed ? "scale(1.5)" : "scale(1)",
                    transition: "transform 0.2s",
                }}
            >
                <MediaPlaceholder url={state.url} className="max-h-[85vh] w-auto rounded-lg" />
                {state.caption && (
                    <p className="mt-2 text-center text-sm text-(--fg-secondary)">
                        {state.caption}
                    </p>
                )}
            </div>
        </div>
    );
}
