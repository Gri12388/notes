import "dotenv/config";
export const HOST = process.env.HOST || "localhost";
export const PROTOCOL = process.env.PROTOCOL || "http";
export const PORT = process.env.PORT || 3000;
export const ORIGIN = `${PROTOCOL}://${HOST}:${PORT}`;
export const CONNECTION_STRING = process.env.CONNECTION_STRING;
export const PGPORT = process.env.PGPORT;
export const PGHOST = process.env.PGHOST;
export const PGDATABASE = process.env.PGDATABASE;
export const PGUSER = process.env.PGUSER;
export const PGPASSWORD = process.env.PGPASSWORD;
export const LIMIT = 10;
export const NOTHING = "";
export const NO_ONE = -1;
export const NOT_UNIQUE = "11000";
export const USER = "user";
export const TRUE = "true";
export const FALSE = "false";
export const NOT_FOUND = "notFound";
export const TECH_ERROR = 1;
export const UNIQUE_VIOLATION = "uniqueViolation";
export const DATABASE = "skillbox";
export const PGCONFIG = {
    port: Number.parseInt(PGPORT ?? "5432", 10),
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
};
export const PGERRORS = {
    uniqueViolation: "23505",
};
export const SCHEMA = {
    public: "public",
};
export const TABLES = {
    notes: "notes",
    sessions: "sessions",
    users: "users",
};
export const COLLECTIONS = {
    creds: "creds",
    sessions: "sessions",
};
export const ROUTES = {
    root: "/",
    api: "/api",
};
export const ENDPOINTS = {
    archive: `/:id/archive`,
    create: "/create",
    delete: "/:id/delete",
    edit: "/edit",
    list: "/list",
    login: "/login",
    logout: "/logout",
    pdf: "/:id/pdf",
    purge: "/purge",
    signup: "/signup",
    unarchive: `/:id/unarchive`,
    view: "/:id/view",
};
export const COOKIES = {
    sessionId: "sessionId",
};
export const ERRORS = {
    badRequest: "Bad request",
    noCredentials: "There is neither login nor password",
    noSession: "There is no session",
    notUnique: (type) => `The ${type} already exists`,
    somethingWrong: "Something went wrong",
    userExists: "The user exists already",
    userNotFound: "The user is not found",
    wrongCreds: "There is wrong credentials",
};
export const SEARCHES = {
    authError: "authError",
    success: "success",
};
export const NOT_UNIQUE_TYPES = {
    user: "user",
    session: "session",
};
export const SESSIONS = new Map();
export const OFFSETS = {};
export const AGE = {
    allTime: "alltime",
    archive: "archive",
    oneMonth: "1month",
    threeMonth: "3month",
};
//# sourceMappingURL=constants.js.map