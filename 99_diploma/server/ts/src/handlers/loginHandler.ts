import type { Request, Response } from "express";
import ms from "ms";
import { getCreds, hashText } from "../fns/common.js";
import { handleAuthError, handleAuthSuccess } from "./commonHandlers.js";
import { COOKIES, ERRORS, NOT_FOUND, NOTHING, PGERRORS, UNIQUE_VIOLATION } from "../constants.js";
import type { Creds } from "../types.js";
import { findPassword } from "../fns/users.js";
import { delSessionByUser, setSession } from "../fns/sessions.js";

const handleSuccess = (res: Response, id: string) => {
  res.cookie(COOKIES.sessionId, id.toString(), { httpOnly: true });
  handleAuthSuccess(res, 204);
};

const retryCreateNewSession = async (res: Response, creds: Creds) => {
  const user = creds.login;
  const expire = Date.now() + ms("1d");
  const result = await setSession(user, expire);

  switch (result) {
    case NOTHING:
      handleAuthError(res, 500, ERRORS.somethingWrong);
      break;

    case UNIQUE_VIOLATION:
      handleAuthError(res, 500, ERRORS.somethingWrong);
      break;

    default:
      handleSuccess(res, result);
  }
};

const deleteOldSession = async (res: Response, creds: Creds) => {
  const { login } = creds;
  const isDeleted = await delSessionByUser(login);

  if (isDeleted) await retryCreateNewSession(res, creds);
  else handleAuthError(res, 500, ERRORS.somethingWrong);
};

const createNewSession = async (res: Response, creds: Creds) => {
  const user = creds.login;
  const expire = Date.now() + ms("1d");
  const result = await setSession(user, expire);

  switch (result) {
    case NOTHING:
      handleAuthError(res, 500, ERRORS.somethingWrong);
      break;

    case UNIQUE_VIOLATION:
      await deleteOldSession(res, creds);
      break;

    default:
      handleSuccess(res, result);
  }
};

const comparePasswords = async (res: Response, found: string, creds: Creds) => {
  const { password } = creds;
  const hash = hashText(password);
  const isMatch = hash === found;

  if (isMatch) await createNewSession(res, creds);
  else handleAuthError(res, 307, ERRORS.wrongCreds);
};

const findPasswordByUser = async (res: Response, creds: Creds) => {
  const { login } = creds;
  const found = await findPassword(login);

  switch (found) {
    case NOT_FOUND:
      handleAuthError(res, 307, ERRORS.wrongCreds);
      break;

    case NOTHING:
      handleAuthError(res, 500, ERRORS.somethingWrong);
      break;

    default:
      await comparePasswords(res, found, creds);
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  const creds = getCreds(req.body);

  if (creds) await findPasswordByUser(res, creds);
  else handleAuthError(res, 307, ERRORS.noCredentials);
};
