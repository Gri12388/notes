import type { Request, Response } from "express";
import { checkString } from "./checkers.js";
import type { Dictionary } from "../types.js";
import { getUrl } from "./common.js";
import { COOKIES, ORIGIN, ROUTES, SESSIONS } from "../constants.js";
import { delSession } from "./sessions.js";

const redirectTo = (res: Response, status: number, path: string, search: Dictionary<string>[] = []) => {
  res
    .status(status)
    .clearCookie(COOKIES.sessionId)
    .redirect(getUrl({ origin: ORIGIN, path, search }).toString());
};

const deleteSession = async (res: Response, sessionId: string) => {
  SESSIONS.delete(sessionId);
  await delSession(sessionId);
  redirectTo(res, 307, ROUTES.root);
};

export const getUser = async (req: Request, res: Response) => {
  let result: string = "";
  const sessionId = req.cookies ? checkString(req.cookies.sessionId) : undefined;

  if (sessionId) {
    const session = SESSIONS.get(sessionId);
    if (session) {
      const { expire, user } = session;
      const now = Date.now();
      if (expire > now) {
        result = user;
      } else await deleteSession(res, sessionId);
    } else redirectTo(res, 307, ROUTES.root);
  } else redirectTo(res, 307, ROUTES.root);

  return result;
};
