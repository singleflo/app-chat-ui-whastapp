/**
 * Modello dati interno del mockup.
 * Normalizza il payload Cloud API (webhook `messages`) in una forma
 * utilizzabile direttamente dai componenti React.
 *
 * Spec ref: T3 (regola di mapping) · B (bolle) · D (stati) · Q (team).
 */

export type ChatType = "individual" | "group";

export type AckStatus =
    "composing" | "pending" | "sent" | "delivered" | "read" | "played" | "failed";

export type ConversationState = "open" | "done";

export type WindowState =
    { kind: "open"; closesAt: string } | { kind: "closed" } | { kind: "ctwa"; expiresAt: string };

/** Attribuzione autore outbound — Q2. */
export interface SenderAttribution {
    kind: "user" | "bot" | "automation" | "api" | "system";
    /** User id when kind=user/bot/automation; source device when kind=api. */
    id: string;
    name: string;
    /** Deterministic HSL color for avatar/name rendering. */
    color: string;
    /** Bot agent name (Q5) or campaign name (Q8). */
    agentName?: string;
    /** Echo source: "Android" | "iOS" | "Web" | "API" (kind=api). */
    source?: string;
}

export interface QuotedMessage {
    id: string;
    authorName: string;
    authorColor: string;
    /** Text excerpt, or media icon hint. */
    excerpt: string;
    media?: { kind: "image" | "video" | "audio" | "document"; label: string };
}

/** R4 1–27. Varianti di contenuto bolla. */
export type MessageContent =
    | { kind: "text"; body: string; linkPreview?: LinkPreview }
    | { kind: "image"; url: string; caption?: string; album?: { total: number } }
    | {
          kind: "video";
          url: string;
          poster?: string;
          durationSec: number;
          caption?: string;
          gif?: boolean;
      }
    | {
          kind: "audio";
          url: string;
          voice: boolean;
          durationSec: number;
          waveform: number[];
          transcript?: { state: "ready" | "processing" | "error"; text?: string };
          played?: boolean;
      }
    | {
          kind: "document";
          url: string;
          mime: string;
          name: string;
          sizeBytes: number;
          pages?: number;
          thumbnail?: string;
      }
    | { kind: "sticker"; url: string; animated: boolean }
    | {
          kind: "location";
          lat: number;
          lng: number;
          name?: string;
          address?: string;
          staticMapUrl: string;
      }
    | { kind: "location_request" }
    | { kind: "address_request" }
    | { kind: "contacts"; cards: ContactCard[] }
    | { kind: "order"; items: OrderItem[]; total: string; currency: string; note?: string }
    | {
          kind: "interactive_buttons";
          header?: { text?: string; image?: string; video?: string; document?: string };
          body: string;
          footer?: string;
          buttons: { id: string; title: string }[];
          reply?: { id: string; title: string };
      }
    | {
          kind: "interactive_list";
          body: string;
          footer?: string;
          buttonTitle: string;
          sections: {
              title: string;
              rows: { id: string; title: string; description?: string }[];
          }[];
          reply?: { id: string; title: string; description?: string };
      }
    | { kind: "interactive_cta_url"; body: string; footer?: string; ctaTitle: string; url: string }
    | {
          kind: "interactive_flow";
          body: string;
          ctaTitle: string;
          flowName: string;
          flowState?: "draft" | "published";
          reply?: { flowName: string; responseJson: Record<string, unknown> };
      }
    | { kind: "call_permission_request"; state: "pending" | "accepted" | "rejected" }
    | {
          kind: "carousel";
          cards: CarouselCard[];
      }
    | {
          kind: "product";
          product: {
              id: string;
              name: string;
              price: string;
              currency: string;
              description?: string;
              image: string;
          };
      }
    | {
          kind: "product_list";
          sections: { title: string; items: { id: string; name: string; price: string }[] }[];
          headerImage?: string;
          title?: string;
      }
    | {
          kind: "catalog";
          title: string;
          body?: string;
          ctaTitle: string;
      }
    | {
          kind: "template";
          name: string;
          language: string;
          category: string;
          header?: {
              text?: string;
              image?: string;
              video?: string;
              document?: string;
              location?: { lat: number; lng: number };
          };
          body: string;
          footer?: string;
          buttons?: TemplateButton[];
          limitedTimeOffer?: { code: string; expiresAt: string; expired?: boolean };
          otp?: { code: string; autofill: boolean };
      }
    | {
          kind: "system";
          variant:
              | "date_separator"
              | "unread_count"
              | "encryption"
              | "security_change"
              | "group_created"
              | "group_name_changed"
              | "group_user_added"
              | "group_user_left"
              | "group_admin_promoted"
              | "business_info"
              | "referral_ctwa"
              | "window_closed"
              | "window_reopened"
              | "template_started"
              | "call_completed"
              | "call_permission_accepted"
              | "call_permission_rejected"
              | "optout_marketing"
              | "optin_marketing"
              | "auto_reply_offhours"
              | "assignment"
              | "unassignment"
              | "auto_assignment"
              | "auto_unassignment"
              | "state_closed"
              | "state_reopened"
              | "state_reopened_auto"
              | "bot_takeover"
              | "bot_handoff"
              | "internal_note_ref";
          text: string;
          icon?: string;
          referralAd?: { name: string; image?: string };
      }
    | { kind: "deleted" }
    | { kind: "edited_marker" }
    | {
          kind: "error";
          code: number;
          title: string;
          details?: string;
          /** Action suggestions shown as buttons. */
          actions?: { id: string; label: string; variant?: "primary" | "secondary" }[];
      }
    | { kind: "fallback"; rawType: string; payload?: unknown }
    | { kind: "internal_note"; body: string; mentions?: string[] };

export interface LinkPreview {
    url: string;
    title: string;
    description?: string;
    image?: string;
    domain: string;
    compact?: boolean;
}

export interface ContactCard {
    name: { formatted: string; first?: string; last?: string };
    org?: string;
    phones?: { type: "HOME" | "WORK" | "MOBILE" | "MAIN"; number: string; wa?: boolean }[];
    emails?: { type: "HOME" | "WORK"; value: string }[];
    urls?: string[];
    addresses?: { type: string; street: string; city: string; zip: string }[];
    birthday?: string;
}

export interface OrderItem {
    id: string;
    name: string;
    qty: number;
    price: string;
    currency: string;
    image?: string;
}

export interface CarouselCard {
    id: string;
    headerImage?: string;
    headerVideo?: string;
    body: string;
    buttons: { id: string; title: string; kind: "quick_reply" | "url" | "phone" | "catalog" }[];
}

export interface TemplateButton {
    kind:
        | "quick_reply"
        | "url"
        | "phone"
        | "copy_code"
        | "flow"
        | "otp_one_tap"
        | "otp_copy"
        | "catalog"
        | "mpm";
    title: string;
    /** For url buttons. */
    url?: string;
    /** For phone buttons. */
    phone?: string;
    /** For copy_code/otp buttons. */
    code?: string;
    /** For flow buttons. */
    flowName?: string;
    /** For otp_one_tap autofill. */
    autofill?: boolean;
}

export interface Reaction {
    emoji: string;
    count: number;
    /** User ids who reacted with this emoji. */
    by: string[];
    mine?: boolean;
}

export interface Message {
    id: string;
    conversationId: string;
    ts: string;
    direction: "in" | "out";
    content: MessageContent;
    /** Quoted/replied message. */
    quoted?: QuotedMessage;
    /** Forwarded marker. */
    forwarded?: boolean;
    frequentlyForwarded?: boolean;
    /** Echo from another device/API (Q2). */
    echo?: boolean;
    /** Ack pipeline state (D1). */
    ack?: AckStatus;
    /** Group: sender info for inbound. */
    groupSender?: { name: string; color: string };
    /** Outbound attribution (Q2). */
    sender?: SenderAttribution;
    /** Reactions attached (B9). */
    reactions?: Reaction[];
    /** Pinned state (C). */
    pinned?: { until?: "24h" | "7d" | "30d" } | { at: string };
    /** Starred/important (C). */
    starred?: boolean;
    /** Mentions in groups (E11). */
    mentions?: string[];
    /** Errors object (raw webhook `errors`). */
    errors?: { code: number; title: string; details?: string }[];
    /** Template metadata badge. */
    templateBadge?: { name: string; language: string };
    /** AI extraction state for media (Q5). */
    aiExtract?: { state: "processing" | "ready" | "error"; text?: string };
}

export interface Conversation {
    id: string;
    type: ChatType;
    name: string;
    phone: string;
    pushName?: string;
    avatarColor: string;
    avatarUrl?: string;
    businessVerified?: boolean;
    lastMessagePreview: string;
    lastMessageTs: string;
    lastMessageType: MessageContent["kind"] | "internal_note" | "call";
    lastMessageDirection: "in" | "out";
    lastAck?: AckStatus;
    unread: number;
    mentionCount?: number;
    typing?: "text" | "audio";
    pinned?: boolean;
    silenced?: boolean;
    draft?: string;
    failed?: boolean;
    windowClosed?: boolean;
    /** Team inbox — Q. */
    assignedUserId?: string;
    assignedAt?: string;
    unassigned?: boolean;
    assignmentFailed?: boolean;
    /** Assignation surface — WhatsApp instance this conversation belongs to. */
    instanceId?: string;
    /** Assignation surface — acquisition channel shown on unassigned cards. */
    channel?: "ads" | "whatsapp" | "api";
    state: ConversationState;
    closedAt?: string;
    isBotActive?: boolean;
    botAgentName?: string;
    officeHours?: { active: boolean };
    labels?: { id: string; name: string; color: string }[];
    /** Group fields. */
    groupParticipants?: number;
    /** Record refs (Q7). */
    linkedRecords?: { kind: "lead" | "order" | "ticket"; id: string }[];
    /** Group members (when type=group). */
    members?: {
        id: string;
        name: string;
        color: string;
        role: "admin" | "member";
        phone?: string;
    }[];
}

export interface User {
    id: string;
    name: string;
    email?: string;
    color: string;
    online?: boolean;
    openChatsCount?: number;
    role?: "operator" | "manager" | "admin";
}

export interface Agent {
    id: string;
    name: string;
    emoji: "🤖";
    color: string;
    status: "running" | "paused" | "stopped";
}

/** WhatsApp Business instance (phone line) usable for the assignation filter. */
export interface Instance {
    id: string;
    name: string;
    state: "open" | "closed";
    allowedUserIds?: string[];
}

export interface ActivityEvent {
    id: string;
    ts: string;
    type:
        | "assigned"
        | "unassigned"
        | "auto_assigned"
        | "auto_unassigned"
        | "reassigned_timeout"
        | "state_closed"
        | "state_reopened"
        | "state_reopened_auto"
        | "offhours_reply"
        | "queued_sent"
        | "outbound_sent"
        | "bot_takeover"
        | "bot_handoff";
    userId?: string;
    userName?: string;
    targetUserId?: string;
    targetUserName?: string;
    reason?: string;
    auto?: boolean;
}

export interface CallLog {
    id: string;
    conversationId: string;
    direction: "in" | "out";
    outcome: "completed" | "missed" | "declined";
    startedAt: string;
    durationSec: number;
}

export interface ContactProfile {
    contactId: string;
    name: string;
    pushName?: string;
    avatarColor: string;
    phones: {
        number: string;
        label: "WHATSAPP" | "WORK" | "HOME" | "MOBILE";
        verified?: boolean;
    }[];
    emails: string[];
    company?: string;
    language?: string;
    timezone?: string;
    labels: { id: string; name: string; color: string }[];
}

export interface AttributeSchema {
    key: string;
    label: string;
    type: "text" | "number" | "date" | "select" | "multi_select" | "checkbox" | "url";
    options?: string[];
    required?: boolean;
}

export interface AutomationRun {
    id: string;
    ts: string;
    kind: "campaign" | "bot" | "rule";
    icon: "⚡" | "🤖";
    name: string;
    state: "done" | "running" | "failed";
    details?: string;
}

export interface Template {
    id: string;
    name: string;
    language: string;
    category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
    status: "approved" | "pending" | "rejected" | "paused";
    header?: { kind: "text" | "image" | "video" | "document" | "location"; text?: string };
    body: string;
    footer?: string;
    buttons?: TemplateButton[];
    limitedTimeOffer?: { code: string; hours: number };
}

export interface DemoDataset {
    account: {
        name: string;
        phoneNumbers: { id: string; display: string; unread: number }[];
    };
    users: User[];
    agents: (Agent & { emoji: string })[];
    instances: Instance[];
    conversations: Conversation[];
    messages: Record<string, ChatEntry[]>;
    activity: Record<string, ActivityEvent[]>;
    calls: CallLog[];
    templates: Template[];
    contactsProfiles: ContactProfile[];
    attributesSchema: AttributeSchema[];
    attributesValues: Record<string, Record<string, string | number | boolean | string[]>>;
    automationRuns: Record<string, AutomationRun[]>;
    labels: { id: string; name: string; color: string }[];
}

/**
 * All variants of system messages — both inline pills and full Message entries
 * with content.kind === "system". Extracted from the MessageContent union.
 */
export type SystemVariant = Extract<MessageContent, { kind: "system" }>["variant"];

/**
 * Lightweight inline system pill (date separator, unread count, group event
 * pill, etc.) that doesn't carry full Message metadata. Lives in the same
 * stream as Message so the renderer can interleave them naturally.
 */
export interface SystemPill {
    id: string;
    kind: "system";
    variant: SystemVariant;
    text: string;
    icon?: string;
    referralAd?: { name: string; image?: string };
}

export type ChatEntry = Message | SystemPill;

/** Narrows a ChatEntry to Message. Discriminate on `content`, not `id`: both members now carry `id`. */
export function isMessage(entry: ChatEntry): entry is Message {
    return "content" in entry;
}
