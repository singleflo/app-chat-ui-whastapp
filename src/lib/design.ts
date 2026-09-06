/**
 * Design-language store — white-label mechanism.
 *
 * A "design" is a named token layer applied via `data-design` on <html>
 * (see index.css). The default is the original WhatsApp look; linear,
 * intercom and slack remap the same tokens (docs in design/README.md).
 *
 * Source of truth: design/*.DESIGN.md (verbatim brand system docs).
 */
import { useSyncExternalStore } from "react";

export const DESIGN_IDS = ["whatsapp", "linear", "intercom", "slack"] as const;
export type DesignId = (typeof DESIGN_IDS)[number];
export const DEFAULT_DESIGN: DesignId = "whatsapp";

const STORAGE_KEY = "wa-design";

function isDesignId(value: unknown): value is DesignId {
    return typeof value === "string" && (DESIGN_IDS as readonly string[]).includes(value);
}

function readStored(): DesignId {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isDesignId(stored) ? stored : DEFAULT_DESIGN;
}

let current: DesignId | null = null;
const listeners = new Set<() => void>();

export function getDesign(): DesignId {
    if (current === null) current = readStored();
    return current;
}

export function setDesign(design: DesignId): void {
    if (design === getDesign()) return;
    current = design;
    localStorage.setItem(STORAGE_KEY, design);
    // Invariant: any store change is immediately reflected on <html>,
    // independent of which component triggered it.
    applyDesignAttribute(design);
    listeners.forEach((notify) => notify());
}

export function subscribeDesign(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function applyDesignAttribute(design: DesignId): void {
    document.documentElement.setAttribute("data-design", design);
}

export function useDesign(): [DesignId, (design: DesignId) => void] {
    const design = useSyncExternalStore(subscribeDesign, getDesign);
    return [design, setDesign];
}

/** Test seam: forces re-reading localStorage on next getDesign(). */
export function resetDesignStoreForTests(): void {
    current = null;
}
