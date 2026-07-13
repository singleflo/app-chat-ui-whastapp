import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { MediaPlaceholder } from "@/components/bubbles/content/Media";

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
    const [zoomed, setZoomed] = useState(false);
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

    const handleDownload = useCallback(() => {
        const link = document.createElement("a");
        link.href = state.url;
        link.download = state.url.split("/").pop() ?? "download";
        link.click();
    }, [state.url]);

    const handleShare = useCallback(async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: state.caption ?? "Immagine", url: state.url });
            }
        } catch {
            // user cancelled or not available
        }
    }, [state.url, state.caption]);

    if (!state.open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
            <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Chiudi"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
                {state.index + 1} di {state.total}
            </div>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                <button
                    type="button"
                    onClick={() => setZoomed(!zoomed)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label={zoomed ? "Riduci zoom" : "Ingrandisci"}
                >
                    {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="Scarica"
                >
                    <Download className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="Condividi"
                >
                    <Share2 className="h-5 w-5" />
                </button>
            </div>

            {state.index > 0 && (
                <button
                    type="button"
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="Precedente"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            {state.index < state.total - 1 && (
                <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="Successiva"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}

            <div
                className="max-h-[85vh] max-w-[90vw] overflow-auto"
                style={{ transform: zoomed ? "scale(1.5)" : "scale(1)", transition: "transform 0.2s" }}
            >
                <MediaPlaceholder
                    url={state.url}
                    className="max-h-[85vh] w-auto rounded-lg"
                />
                {state.caption && (
                    <p className="mt-2 text-center text-sm text-white/80">{state.caption}</p>
                )}
            </div>
        </div>
    );
}
