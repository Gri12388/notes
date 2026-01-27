import type { Request, Response } from "express";
import { handleAuthError, handleAuthSuccess } from "./commonHandlers.js";
import { COOKIES, ERRORS } from "../constants.js";
import { getIntOrUdf, getStringOrUdf } from "../fns/checkers.js";
import { delSession } from "../fns/sessions.js";

const handleSuccess = (res: Response) => {
  res.clearCookie(COOKIES.sessionId);
  handleAuthSuccess(res, 307);
};

const deleteSession = async (res: Response, sessionId: number) => {
  const isDeleted = await delSession(sessionId);
  if (isDeleted) handleSuccess(res);
  else handleAuthError(res, 500, ERRORS.somethingWrong);
};

export const handleLogout = async (req: Request, res: Response) => {
  const { cookies } = req;
  const str = getStringOrUdf(cookies?.sessionId);
  const sessionId = str ? getIntOrUdf(str) : undefined;

  if (sessionId !== undefined) await deleteSession(res, sessionId);
  else handleAuthError(res, 400, ERRORS.noSession);
};
