import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Meeting {
    id: bigint;
    title: string;
    owner: Principal;
    description: string;
}
export interface Notice {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
}
export interface Message {
    content: string;
    subject: string;
    recipient: Principal;
    sender: Principal;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMeeting(title: string, description: string): Promise<void>;
    createNotice(title: string, content: string): Promise<void>;
    deleteDocument(name: string): Promise<void>;
    deleteNotice(id: bigint): Promise<void>;
    downloadDocument(name: string): Promise<ExternalBlob | null>;
    getAllMembers(): Promise<Array<[Principal, UserProfile]>>;
    getAllNotices(): Promise<Array<Notice>>;
    getAllUsernames(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInbox(): Promise<Array<Message>>;
    getMeetings(): Promise<Array<Meeting>>;
    getMemberCount(): Promise<bigint>;
    getSentMessages(): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listDocuments(): Promise<Array<string>>;
    register(profile: UserProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessageByUsername(recipientName: string, subject: string, content: string): Promise<void>;
    uploadDocument(name: string, blob: ExternalBlob): Promise<void>;
}
