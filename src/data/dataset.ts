import rawDataset from "../../fixtures/demo-dataset.json";
import type { DemoDataset } from "@/types/chat";

export const dataset = rawDataset as unknown as DemoDataset;

export const currentUser = dataset.users[0];

export function conversationById(id: string) {
    return dataset.conversations.find((c) => c.id === id);
}

export function messagesFor(id: string) {
    return dataset.messages[id] ?? [];
}

export function activityFor(id: string) {
    return dataset.activity[id] ?? [];
}

export function profileFor(convId: string) {
    return dataset.contactsProfiles.find((p) => p.contactId === convId);
}

export function attributesFor(convId: string) {
    return dataset.attributesValues[convId] ?? {};
}

export function automationRunsFor(convId: string) {
    return dataset.automationRuns[convId] ?? [];
}

export function userById(id: string) {
    return dataset.users.find((u) => u.id === id);
}
