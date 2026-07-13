export type SurfaceVariant = "desktop" | "mobile" | "side-panel" | "quick-popover";

export interface SurfaceCapabilities {
    /** Number of simultaneously visible panels. */
    panels: 1 | 2 | 3;
    /** Composer/input area visibility (Quick Popover readonly hides it). */
    showInput: boolean;
    /** Side panel collapsed by default (desktop only). */
    contextPanelCollapsible: boolean;
    /** Approximate width budget per panel in px (for hints). */
    widthClass: "narrow" | "standard" | "wide";
}

export const SURFACE_CAPS: Record<SurfaceVariant, SurfaceCapabilities> = {
    desktop: {
        panels: 3,
        showInput: true,
        contextPanelCollapsible: true,
        widthClass: "wide",
    },
    mobile: {
        panels: 1,
        showInput: true,
        contextPanelCollapsible: false,
        widthClass: "narrow",
    },
    "side-panel": {
        panels: 1,
        showInput: true,
        contextPanelCollapsible: false,
        widthClass: "narrow",
    },
    "quick-popover": {
        panels: 1,
        showInput: false,
        contextPanelCollapsible: false,
        widthClass: "narrow",
    },
};
