import type { Session } from "../types.js";
export declare const configSessions: () => Promise<boolean>;
export declare const setSession: (user: string, expire: number) => Promise<string>;
export declare const findSession: (id: string) => Promise<string | Session>;
export declare const delSession: (id: string) => Promise<boolean>;
export declare const delSessionByUser: (user: string) => Promise<boolean>;
