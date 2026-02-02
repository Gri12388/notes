import "dotenv/config";
import type { NotUnique, Session } from "./types.js";
export declare const HOST: string;
export declare const PROTOCOL: string;
export declare const PORT: string | number;
export declare const ORIGIN: string;
export declare const CONNECTION_STRING: string | undefined;
export declare const PGPORT: string | undefined;
export declare const PGHOST: string | undefined;
export declare const PGDATABASE: string | undefined;
export declare const PGUSER: string | undefined;
export declare const PGPASSWORD: string | undefined;
export declare const LIMIT = 10;
export declare const NOTHING = "";
export declare const NO_ONE = -1;
export declare const NOT_UNIQUE = "11000";
export declare const USER = "user";
export declare const TRUE = "true";
export declare const FALSE = "false";
export declare const NOT_FOUND = "notFound";
export declare const TECH_ERROR = 1;
export declare const UNIQUE_VIOLATION = "uniqueViolation";
export declare const DATABASE = "skillbox";
export declare const PGCONFIG: {
    readonly port: number;
    readonly host: string | undefined;
    readonly database: string | undefined;
    readonly user: string | undefined;
    readonly password: string | undefined;
};
export declare const PGERRORS: {
    readonly uniqueViolation: "23505";
};
export declare const SCHEMA: {
    readonly public: "public";
};
export declare const TABLES: {
    readonly notes: "notes";
    readonly sessions: "sessions";
    readonly users: "users";
};
export declare const COLLECTIONS: {
    readonly creds: "creds";
    readonly sessions: "sessions";
};
export declare const ROUTES: {
    readonly root: "/";
    readonly api: "/api";
};
export declare const ENDPOINTS: {
    readonly archive: "/:id/archive";
    readonly create: "/create";
    readonly delete: "/:id/delete";
    readonly edit: "/edit";
    readonly list: "/list";
    readonly login: "/login";
    readonly logout: "/logout";
    readonly pdf: "/:id/pdf";
    readonly purge: "/purge";
    readonly signup: "/signup";
    readonly unarchive: "/:id/unarchive";
    readonly view: "/:id/view";
};
export declare const COOKIES: {
    readonly sessionId: "sessionId";
};
export declare const ERRORS: {
    readonly badRequest: "Bad request";
    readonly noCredentials: "There is neither login nor password";
    readonly noSession: "There is no session";
    readonly notUnique: (type: NotUnique) => string;
    readonly somethingWrong: "Something went wrong";
    readonly userExists: "The user exists already";
    readonly userNotFound: "The user is not found";
    readonly wrongCreds: "There is wrong credentials";
};
export declare const SEARCHES: {
    readonly authError: "authError";
    readonly success: "success";
};
export declare const NOT_UNIQUE_TYPES: {
    readonly user: "user";
    readonly session: "session";
};
export declare const SESSIONS: Map<string, Session>;
export declare const OFFSETS: Record<string, number>;
export declare const AGE: {
    readonly allTime: "alltime";
    readonly archive: "archive";
    readonly oneMonth: "1month";
    readonly threeMonth: "3month";
};
