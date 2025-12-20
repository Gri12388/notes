import "dotenv/config";
import type { NotUnique } from "./types.js";

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

export const NOT_FOUND = 0;
export const TECH_ERROR = 1;

export const DATABASE = "skillbox";

export const PGCONFIG = {
  port: Number.parseInt(PGPORT ?? "5432", 10),
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  ssl: true,
};

export const SCHEMA = {
  public: "public",
} as const;

export const TABLES = {
  notes: "notes",
} as const;

export const COLLECTIONS = {
  creds: "creds",
  sessions: "sessions",
} as const;

export const ROUTES = {
  root: "/",
  api: "/api",
} as const;

export const ENDPOINTS = {
  create: "/create",
  login: "/login",
  logout: "/logout",
  notes: "/notes",
  signup: "/signup",
} as const;

export const COOKIES = {
  sessionId: "sessionId",
} as const;

export const ERRORS = {
  badRequest: "Bad request",
  noCredentials: "There is neither login nor password",
  notUnique: (type: NotUnique) => `${type} is exists already`,
  somethingWrong: "Something went wrong",
  userExists: "The user exists already",
  userNotFound: "The user is not found",
  wrongCreds: "There is wrong credentials",
} as const;

export const SEARCHES = {
  authError: "authError",
  success: "success",
} as const;

export const NOT_UNIQUE_TYPES = {
  user: "user",
  session: "session",
} as const;

export const SESSIONS_TIME: Record<string, number> = {};

export const OFFSETS: Record<string, number> = {};

export const AGE = {
  allTime: "alltime",
  archive: "archive",
  oneMonth: "1month",
  threeMonth: "3month",
} as const;
