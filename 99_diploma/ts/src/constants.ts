import "dotenv/config";

export const HOST = process.env.HOST || "localhost";
export const PROTOCOL = process.env.PROTOCOL || "http";
export const PORT = process.env.PORT || 3000;
export const ORIGIN = `${PROTOCOL}://${HOST}:${PORT}`;
export const CONNECTION_STRING = process.env.CONNECTION_STRING;

export const NOT_FOUND = 0;
export const TECH_ERROR = 1;

export const DATABASE = "skillbox";

export const COLLECTIONS = {
  creds: "creds",
  sessions: "sessions",
} as const;

export const ROUTES = {
  auth: "/",
} as const;

export const ERRORS = {
  noCredentials: "There is neither login nor password",
  somethingWrong: "Something went wrong",
  userExists: "The user exists already",
};

export const SEARCHES = {
  authError: "authError",
  success: "success",
} as const;
