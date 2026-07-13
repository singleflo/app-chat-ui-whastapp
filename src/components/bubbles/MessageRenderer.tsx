import type { ChatEntry, Message } from "@/types/chat";
import { isMessage } from "@/types/chat";
import { Bubble, BubbleMeta, ForwardedLabel, QuotedBlock, Reactions, SenderAvatar, SenderTag } from "./Bubble";
import { TextContent } from "./content/Text";
import { ImageContent, VideoContent, DocumentContent, StickerContent } from "./content/Media";
import { AudioContent } from "./content/Audio";
import { LocationContent } from "./content/Location";
import { ContactsContent } from "./content/Contacts";
import {
    ButtonsContent,
    ListContent,
    CtaUrlContent,
    FlowContent,
    CallPermissionContent,
    CarouselContent,
    ProductContent,
    ProductListContent,
    CatalogContent,
} from "./content/Interactive";
import { OrderContent } from "./content/Order";
import { TemplateContent } from "./content/Template";
import { SystemPillRow } from "./content/System";
import { DeletedContent, FallbackContent } from "./content/Special";
import { InternalNoteContent } from "./content/InternalNote";
import { ErrorContent } from "./content/Error";
import { MessageContextMenu } from "./MessageContextMenu";

export function ChatEntryRenderer({ entry }: { entry: ChatEntry }) {
    if (!isMessage(entry)) {
        return <SystemPillRow view={{ variant: entry.variant, text: entry.text, icon: entry.icon, referralAd: entry.referralAd }} />;
    }
    return <MessageRenderer message={entry} />;
}

export function MessageRenderer({ message }: { message: Message }) {
    const { content, direction, sender, quoted, forwarded, frequentlyForwarded, reactions, ts, ack } = message;
    const hasReactions = !!reactions && reactions.length > 0;
    const isEdited = !!(message as { edited?: boolean }).edited;

    if (content.kind === "deleted") {
        const deletedInner = (
            <>
                <DeletedContent message={message} />
                <BubbleMeta ts={ts} />
                <MessageContextMenu message={message} />
            </>
        );
        if (direction === "out" && sender) {
            return (
                <div className="flex max-w-[78%] items-end justify-end gap-1.5 self-end">
                    <Bubble side="out" tone="deleted" hasReactions={hasReactions} className="max-w-full min-w-0">{deletedInner}</Bubble>
                    <SenderAvatar sender={sender} size={28} />
                </div>
            );
        }
        return <Bubble side="in" tone="deleted" hasReactions={hasReactions}>{deletedInner}</Bubble>;
    }
    if (content.kind === "error") {
        const errorInner = (
            <>
                {sender && <SenderTag sender={sender} />}
                <ErrorContent message={message} />
                <BubbleMeta ts={ts} ack={ack} />
                <MessageContextMenu message={message} />
            </>
        );
        if (direction === "out" && sender) {
            return (
                <div className="flex max-w-[78%] items-end justify-end gap-1.5 self-end">
                    <Bubble side="out" tone="error" hasReactions={hasReactions} className="max-w-full min-w-0">{errorInner}</Bubble>
                    <SenderAvatar sender={sender} size={28} />
                </div>
            );
        }
        return <Bubble side="out" tone="error" hasReactions={hasReactions}>{errorInner}</Bubble>;
    }
    if (content.kind === "fallback") {
        const fallbackInner = (
            <>
                <FallbackContent message={message} />
                <BubbleMeta ts={ts} />
                <MessageContextMenu message={message} />
            </>
        );
        if (direction === "out" && sender) {
            return (
                <div className="flex max-w-[78%] items-end justify-end gap-1.5 self-end">
                    <Bubble side="out" tone="fallback" hasReactions={hasReactions} className="max-w-full min-w-0">{fallbackInner}</Bubble>
                    <SenderAvatar sender={sender} size={28} />
                </div>
            );
        }
        return <Bubble side="in" tone="fallback" hasReactions={hasReactions}>{fallbackInner}</Bubble>;
    }
    if (content.kind === "edited_marker") return null;

    if (content.kind === "internal_note") {
        const noteInner = (
            <>
                <InternalNoteContent message={message} />
                <BubbleMeta ts={ts} />
                <MessageContextMenu message={message} />
            </>
        );
        if (sender) {
            return (
                <div className="flex max-w-[78%] items-end justify-end gap-1.5 self-end">
                    <Bubble side="out" tone="note" hasReactions={hasReactions} className="max-w-full min-w-0">{noteInner}</Bubble>
                    <SenderAvatar sender={sender} size={28} />
                </div>
            );
        }
        return <Bubble side="out" tone="note" hasReactions={hasReactions}>{noteInner}</Bubble>;
    }

    if (content.kind === "system") {
        const sys = content;
        return <SystemPillRow view={{ variant: sys.variant, text: sys.text, icon: sys.icon, referralAd: sys.referralAd }} />;
    }

    const tone = sender?.kind === "bot" ? "bot" : "default";
    const showAvatar = direction === "out" && !!sender;

    const inner = (
        <>
            {forwarded && <ForwardedLabel frequently={frequentlyForwarded} />}
            <SenderTag sender={sender} />
            {quoted && (
                <QuotedBlock
                    authorName={quoted.authorName}
                    authorColor={quoted.authorColor}
                    excerpt={quoted.excerpt}
                    media={quoted.media}
                />
            )}
            {renderContent(content)}
            <BubbleMeta ts={ts} ack={ack} edited={isEdited} />
            <Reactions reactions={reactions} />
            <MessageContextMenu message={message} />
        </>
    );

    if (showAvatar && sender) {
        return (
            <div className="flex max-w-[78%] items-end justify-end gap-1.5 self-end">
                <Bubble side="out" tone={tone} hasReactions={hasReactions} className="max-w-full min-w-0">
                    {inner}
                </Bubble>
                <SenderAvatar sender={sender} size={28} />
            </div>
        );
    }

    return (
        <Bubble side={direction === "out" ? "out" : "in"} tone={tone} hasReactions={hasReactions}>{inner}</Bubble>
    );
}

function renderContent(content: Message["content"]) {
    switch (content.kind) {
        case "text": return <TextContent body={content.body} linkPreview={content.linkPreview} />;
        case "image": return <ImageContent url={content.url} caption={content.caption} album={content.album} />;
        case "video": return <VideoContent url={content.url} poster={content.poster} durationSec={content.durationSec} caption={content.caption} gif={content.gif} />;
        case "audio": return <AudioContent voice={content.voice} durationSec={content.durationSec} waveform={content.waveform} transcript={content.transcript} played={content.played} />;
        case "document": return <DocumentContent name={content.name} mime={content.mime} sizeBytes={content.sizeBytes} pages={content.pages} />;
        case "sticker": return <StickerContent url={content.url} animated={content.animated} />;
        case "location": return <LocationContent lat={content.lat} lng={content.lng} name={content.name} address={content.address} staticMapUrl={content.staticMapUrl} />;
        case "location_request": return <LocationContent locationRequest />;
        case "address_request": return <LocationContent addressRequest />;
        case "contacts": return <ContactsContent cards={content.cards} />;
        case "interactive_buttons": return <ButtonsContent header={content.header} body={content.body} footer={content.footer} buttons={content.buttons} reply={content.reply} />;
        case "interactive_list": return <ListContent body={content.body} footer={content.footer} buttonTitle={content.buttonTitle} sections={content.sections} reply={content.reply} />;
        case "interactive_cta_url": return <CtaUrlContent body={content.body} footer={content.footer} ctaTitle={content.ctaTitle} url={content.url} />;
        case "interactive_flow": return <FlowContent body={content.body} ctaTitle={content.ctaTitle} flowName={content.flowName} reply={content.reply} />;
        case "call_permission_request": return <CallPermissionContent state={content.state} />;
        case "carousel": return <CarouselContent cards={content.cards} />;
        case "product": return <ProductContent product={content.product} />;
        case "product_list": return <ProductListContent sections={content.sections} headerImage={content.headerImage} title={content.title} />;
        case "catalog": return <CatalogContent title={content.title} body={content.body} ctaTitle={content.ctaTitle} />;
        case "order": return <OrderContent items={content.items} total={content.total} currency={content.currency} note={content.note} />;
        case "template": return <TemplateContent template={content} />;
        default: return null;
    }
}
