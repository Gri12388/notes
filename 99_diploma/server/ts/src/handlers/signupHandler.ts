import type { Request, Response } from "express";
import { getCreds, hashText } from "../fns/common.js";
import { handleAuthError, handleAuthSuccess } from "./commonHandlers.js";
import { ERRORS, NOT_UNIQUE_TYPES, PGERRORS, TRUE, UNIQUE_VIOLATION } from "../constants.js";
import type { Creds } from "../types.js";
import { setCredential } from "../fns/users.js";
import { locale } from "../locale.js";

const saveCreds = async (res: Response, creds: Creds) => {
  const { login, password } = creds;
  const hash = hashText(password);

  const result = await setCredential(login, hash);

  switch (result) {
    case TRUE:
      handleAuthSuccess(res, 204, locale.credsSet);
      break;

    case UNIQUE_VIOLATION:
      handleAuthError(res, 307, ERRORS.notUnique(NOT_UNIQUE_TYPES.user));
      break;

    default:
      handleAuthError(res, 500, ERRORS.somethingWrong);
  }
};

export const handleSignup = async (req: Request, res: Response) => {
  const creds = getCreds(req.body);

  if (creds) await saveCreds(res, creds);
  else handleAuthError(res, 307, ERRORS.noCredentials);
};
