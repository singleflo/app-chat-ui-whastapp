import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Deterministic color from string (used for avatars fallback, group senders). */
export function colorFromString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} 55% 45%)`;
}

/** Initials from a name (max 2 chars). */
export function initials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

/** Italian short time HH:mm. */
export function fmtTime(ts: string | number): string {
    const d = new Date(ts);
    return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

/** Adaptive timestamp: today → HH:mm, yesterday → "Ieri", <7d → weekday, else short date. */
export function fmtRelativeDay(ts: string | number): string {
    const d = new Date(ts);
    const now = new Date();
    const dayMs = 86_400_000;
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return fmtTime(ts);
    const yesterday = new Date(now.getTime() - dayMs);
    if (d.toDateString() === yesterday.toDateString()) return "Ieri";
    if (now.getTime() - d.getTime() < 7 * dayMs) {
        return d.toLocaleDateString("it-IT", { weekday: "long" });
    }
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

/** Format seconds → mm:ss or h:mm:ss. */
export function fmtDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

/** Format bytes → human readable. */
export function fmtBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
