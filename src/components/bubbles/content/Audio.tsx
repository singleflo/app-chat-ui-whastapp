import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Mic, FileAudio } from "lucide-react";
import type { MessageContent } from "@/types/chat";
import { cn, fmtDuration } from "@/lib/utils";

type AudioTranscript = Extract<MessageContent, { kind: "audio" }>["transcript"];

export function AudioContent({
    voice,
    durationSec,
    waveform,
    transcript,
    played,
}: {
    voice: boolean;
    durationSec: number;
    waveform: number[];
    transcript?: AudioTranscript;
    played?: boolean;
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
    const [showTranscript, setShowTranscript] = useState(false);
    const raf = useRef<number>(0);
    const startTs = useRef<number>(0);
    const progressRef = useRef(0);
    progressRef.current = progress;

    useEffect(() => {
        if (!isPlaying) return;
        startTs.current = performance.now() - (progressRef.current / durationSec) * 1000;
        const tick = (now: number) => {
            const elapsed = (now - startTs.current) / 1000;
            const p = Math.min(elapsed / durationSec, 1);
            setProgress(p);
            if (p < 1) raf.current = requestAnimationFrame(tick);
            else setIsPlaying(false);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [isPlaying, durationSec]);

    const remaining = Math.max(0, Math.ceil(durationSec * (1 - progress)));

    return (
        <div className="flex w-[230px] max-w-full flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)]"
                    aria-label={isPlaying ? "Pausa" : "Riproduci"}
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                {voice ? (
                    <Mic className={cn("h-3.5 w-3.5", played && "text-[var(--color-ack-blue)]")} />
                ) : (
                    <FileAudio className="h-3.5 w-3.5 text-[var(--fg-secondary)]" />
                )}
                <Waveform peaks={waveform} progress={progress} />
                <span className="ml-1 min-w-10 text-right text-[10px] tabular-nums text-[var(--fg-tertiary)]">
                    {fmtDuration(remaining)}
                </span>
                <button
                    type="button"
                    onClick={() => setSpeed(speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1)}
                    className="rounded px-1 text-[10px] font-semibold text-[var(--accent)]"
                >
                    {speed}×
                </button>
            </div>
            {transcript && (
                <div className="rounded bg-[var(--bg-panel-2)] p-1.5">
                    <button
                        type="button"
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center gap-1 text-[10px] text-[var(--fg-link)]"
                    >
                        ✨ Trascrizione {transcript.state === "ready" ? "✓" : transcript.state === "processing" ? "…" : "⚠"}
                    </button>
                    {showTranscript && transcript.state === "ready" && (
                        <div className="mt-1 text-[12px] text-[var(--fg-primary)]">{transcript.text}</div>
                    )}
                </div>
            )}
        </div>
    );
}

function Waveform({ peaks, progress }: { peaks: number[]; progress: number }) {
    const bars = useMemo(
        () => peaks.map((p, i) => ({ id: `pk-${i}-v${p}`, value: p, ratio: i / peaks.length })),
        [peaks]
    );
    return (
        <div className="flex h-7 flex-1 items-center gap-[1.5px]">
            {bars.map((b) => (
                <span
                    key={b.id}
                    className={cn(
                        "w-[2px] rounded-full",
                        b.ratio <= progress ? "bg-[var(--accent)]" : "bg-[var(--fg-tertiary)]/40"
                    )}
                    style={{ height: `${Math.max(b.value, 8)}%` }}
                />
            ))}
        </div>
    );
}
