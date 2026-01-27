import type { Request, Response } from "express";
import { getSessionOrUdf, getStringOrUdf } from "../fns/checkers.js";
import { delSession, findSession } from "../fns/sessions.js";
import { COOKIES, ERRORS, NOT_FOUND, NOTHING, SESSIONS } from "../constants.js";
import { handleAuthError } from "./commonHandlers.js";
import type { Session } from "../types.js";

const handleExpireError = async (res: Response, sessionId: string) => {
  SESSIONS.delete(sessionId.toString());
  await delSession(sessionId);
  res.clearCookie(COOKIES.sessionId);
  handleAuthError(res, 307);
};

const handleTechError = (res: Response) => {
  res.clearCookie(COOKIES.sessionId);
  handleAuthError(res, 500, ERRORS.somethingWrong);
};

const handleNotFound = handleTechError;

const goToDashboard = (res: Response, session: Session, sessionId: string) => {
  const { expire, user } = session;
  SESSIONS.set(sessionId, { expire, user });
  res.render("dashboard");
};

const checkSessionPeriod = async (res: Response, session: Session, sessionId: string) => {
  const { expire } = session;
  const now = Date.now();
  const isExpired = now > expire;
  if (isExpired) await handleExpireError(res, sessionId);
  else goToDashboard(res, session, sessionId);
};

const parseFound = async (res: Response, found: string | Session, sessionId: string) => {
  const session = getSessionOrUdf(found);
  if (session) await checkSessionPeriod(res, session, sessionId);
  else handleTechError(res);
};

const findSessionById = async (res: Response, sessionId: string) => {
  const found = await findSession(sessionId);

  switch (found) {
    case NOT_FOUND:
      handleNotFound(res);
      break;

    case NOTHING:
      handleTechError(res);
      break;

    default:
      await parseFound(res, found, sessionId);
  }
};

export const handleRoot = async (req: Request, res: Response) => {
  const { cookies } = req;
  const sessionId = getStringOrUdf(cookies?.sessionId);

  if (sessionId !== undefined) await findSessionById(res, sessionId);
  else res.render("index", { index: { authError: req.query.authError, success: req.query.success } });
};
