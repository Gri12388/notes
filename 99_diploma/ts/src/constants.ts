import "dotenv/config";
import type { NotUnique } from "./types.js";

export const HOST = process.env.HOST || "localhost";
export const PROTOCOL = process.env.PROTOCOL || "http";
export const PORT = process.env.PORT || 3000;
export const ORIGIN = `${PROTOCOL}://${HOST}:${PORT}`;
export const CONNECTION_STRING = process.env.CONNECTION_STRING;
export const NOTHING = "";
export const NOT_UNIQUE = "11000";
export const USER = "user";

export const NOT_FOUND = 0;
export const TECH_ERROR = 1;

export const DATABASE = "skillbox";

export const COLLECTIONS = {
  creds: "creds",
  sessions: "sessions",
} as const;

export const ROUTES = {
  root: "/",
  dashboard: "/dashboard",
} as const;

export const ENDPOINTS = {
  login: "/login",
  logout: "/logout",
  signup: "/signup",
} as const;

export const COOKIES = {
  sessionId: "sessionId",
} as const;

export const ERRORS = {
  noCredentials: "There is neither login nor password",
  notUnique: (type: NotUnique) => `${type} is exists already`,
  somethingWrong: "Something went wrong",
  userExists: "The user exists already",
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
