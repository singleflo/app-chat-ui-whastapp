import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import {
    ChatDataProvider,
    isUnassignedConversation,
    useAgents,
    useAssignationActions,
    useAssignedConversationsByUser,
    useInstances,
    useUnassignedChats,
    useUsers,
} from "@/data/chat-data";
import type { Conversation } from "@/types/chat";

function minimalConversation(overrides: Partial<Conversation> = {}): Conversation {
    return {
        id: "cx",
        type: "individual",
        name: "Chat X",
        phone: "+3900000000",
        avatarColor: "hsl(0 50% 40%)",
        lastMessagePreview: "preview",
        lastMessageTs: "2026-07-14T12:00:00+02:00",
        lastMessageType: "text",
        lastMessageDirection: "in",
        unread: 0,
        state: "open",
        ...overrides,
    };
}

describe("isUnassignedConversation", () => {
    it("is true without assignee or failed attempt", () => {
        expect(isUnassignedConversation(minimalConversation())).toBe(true);
        expect(isUnassignedConversation(minimalConversation({ unassigned: true }))).toBe(true);
    });

    it("is false with an assignee or a failed attempt", () => {
        expect(isUnassignedConversation(minimalConversation({ assignedUserId: "u_marco" }))).toBe(false);
        expect(isUnassignedConversation(minimalConversation({ assignmentFailed: true }))).toBe(false);
    });
});

function useTestHarness() {
    const chats = useUnassignedChats();
    const users = useUsers();
    const agents = useAgents();
    const instances = useInstances();
    const byUser = useAssignedConversationsByUser();
    const actions = useAssignationActions();
    return { chats, users, agents, instances, byUser, actions };
}

describe("assignation hooks (fixture-backed)", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <ChatDataProvider>{children}</ChatDataProvider>
    );

    it("exposes users, agents and instances from the fixture", () => {
        const { result } = renderHook(useTestHarness, { wrapper });

        expect(result.current.users.map((u) => u.id)).toEqual(["u_laura", "u_marco", "u_sara"]);
        expect(result.current.agents).toHaveLength(2);
        expect(result.current.instances.map((i) => i.id)).toEqual(["i_acme", "i_acme2"]);
    });

    it("useUnassignedChats returns exactly the unassigned conversations", () => {
        const { result } = renderHook(useTestHarness, { wrapper });

        const ids = result.current.chats.map((c) => c.id);
        expect(ids).toContain("c4");
        expect(ids).toContain("c8");
        expect(ids).not.toContain("c1");
    });

    it("groups assigned conversations by user", () => {
        const { result } = renderHook(useTestHarness, { wrapper });

        const marco = result.current.byUser.get("u_marco")?.map((c) => c.id);
        const laura = result.current.byUser.get("u_laura")?.map((c) => c.id);
        expect(marco).toEqual(expect.arrayContaining(["c1", "c5"]));
        expect(laura).toEqual(expect.arrayContaining(["c2", "c3"]));
    });

    it("assign moves a chat out of the unassigned list and appends activity", () => {
        const { result } = renderHook(useTestHarness, { wrapper });

        act(() => result.current.actions.assign("c4", "u_sara"));

        expect(result.current.chats.map((c) => c.id)).not.toContain("c4");
        const assignedToSara = result.current.byUser.get("u_sara")?.map((c) => c.id);
        expect(assignedToSara).toContain("c4");
    });

    it("unassign (null user) releases a chat back to the unassigned list", () => {
        const { result } = renderHook(useTestHarness, { wrapper });

        act(() => result.current.actions.assign("c1", null));

        expect(result.current.chats.map((c) => c.id)).toContain("c1");
    });

    it("close/reopen flip the conversation state", () => {
        const { result } = renderHook(useTestHarness, { wrapper });

        act(() => result.current.actions.close("c4"));
        expect(result.current.chats.find((c) => c.id === "c4")?.state).toBe("done");

        act(() => result.current.actions.reopen("c4"));
        expect(result.current.chats.find((c) => c.id === "c4")?.state).toBe("open");
    });

    it("simulateIncoming appends a message and bumps unread", () => {
        const { result } = renderHook(useTestHarness, { wrapper });
        const before = result.current.chats.find((c) => c.id === "c4")?.unread ?? 0;

        act(() => result.current.actions.simulateIncoming("c4", "ciao test"));

        const chat = result.current.chats.find((c) => c.id === "c4");
        expect(chat?.unread).toBe(before + 1);
        expect(chat?.lastMessagePreview).toBe("ciao test");
    });
});
