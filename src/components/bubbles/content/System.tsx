import {
    Megaphone,
    ShieldCheck,
    UserPlus,
    UserMinus,
    Crown,
    PhoneCall,
    Bot,
    UserCog,
    MessageSquareOff,
    ArrowRightLeft,
} from "lucide-react";
import type { SystemVariant } from "@/types/chat";
import { MediaPlaceholder } from "./Media";

export interface SystemView {
    variant: SystemVariant;
    text: string;
    icon?: string;
    referralAd?: { name: string; image?: string };
}

const ICONS = {
    encryption: ShieldCheck,
    business_info: Megaphone,
    group_created: UserPlus,
    group_user_added: UserPlus,
    group_user_left: UserMinus,
    group_admin_promoted: Crown,
    group_name_changed: Crown,
    referral_ctwa: Megaphone,
    call_completed: PhoneCall,
    call_permission_accepted: PhoneCall,
    call_permission_rejected: PhoneCall,
    optout_marketing: MessageSquareOff,
    optin_marketing: Megaphone,
    auto_reply_offhours: Bot,
    assignment: UserCog,
    unassignment: UserCog,
    auto_assignment: Bot,
    auto_unassignment: Bot,
    reassigned_timeout: UserCog,
    bot_takeover: Bot,
    bot_handoff: ArrowRightLeft,
    state_closed: UserCog,
    state_reopened: UserCog,
    state_reopened_auto: Bot,
    window_closed: ShieldCheck,
    window_reopened: ShieldCheck,
    template_started: Megaphone,
    security_change: ShieldCheck,
    internal_note_ref: MessageSquareOff,
};

export function SystemPillRow({ view }: { view: SystemView }) {
    if (view.variant === "date_separator")
        return (
            <div className="mx-auto my-2 rounded-md bg-(--bg-bubble-system) px-3 py-0.5 text-[11px] font-semibold tracking-wide text-(--fg-secondary) uppercase shadow-(--shadow-bubble)">
                {view.text}
            </div>
        );

    if (view.variant === "unread_count")
        return (
            <div className="mx-auto my-1 rounded-full bg-(--accent-soft) px-3 py-0.5 text-[11px] font-medium text-(--accent)">
                {view.text}
            </div>
        );

    if (view.variant === "referral_ctwa") return <ReferralCtwaRow view={view} />;

    const Icon = ICONS[view.variant] ?? MessageSquareOff;
    return (
        <div className="mx-auto my-1 flex max-w-[85%] items-center gap-1.5 rounded-md bg-(--bg-bubble-system) px-2.5 py-1 text-[11px] text-(--fg-secondary) shadow-(--shadow-bubble)">
            <Icon className="h-3 w-3 shrink-0" />
            <span>{view.text}</span>
        </div>
    );
}

function ReferralCtwaRow({ view }: { view: SystemView }) {
    return (
        <div className="mx-auto my-1 flex max-w-[85%] items-center gap-2 rounded-md bg-(--bg-bubble-system) px-2 py-1 text-[11px] shadow-(--shadow-bubble)">
            {view.referralAd?.image && (
                <MediaPlaceholder
                    url={view.referralAd.image}
                    className="h-8 w-8 shrink-0 rounded"
                />
            )}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-(--fg-secondary)">
                    <Megaphone className="h-3 w-3" /> {view.text}
                </div>
                {view.referralAd?.name && (
                    <div className="truncate text-(--fg-tertiary)">{view.referralAd.name}</div>
                )}
            </div>
            <span className="shrink-0 rounded bg-(--accent-soft) px-1 text-[9px] text-(--accent)">
                CTWA · 72h
            </span>
        </div>
    );
}
