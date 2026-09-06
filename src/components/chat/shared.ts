/**
 * Shared interactive-chrome classes for chat shells.
 *
 * One source of truth for the focus ring + button press patterns that every
 * shell previously re-declared locally. Colors are token-driven, so the ring
 * and hover states follow the active design language automatically.
 *
 * `transition-[...]` lists properties explicitly — `transition-all` animates
 * unintended properties off-GPU.
 */

export const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel)";

/** Small icon-only button: subtle press (scale 0.97). */
export const iconBtn = `cursor-pointer transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out active:scale-[0.97] ${focusRing}`;

/** Text/action button: standard press (scale 0.95). */
export const actionBtn = `cursor-pointer transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out active:scale-95 ${focusRing}`;
