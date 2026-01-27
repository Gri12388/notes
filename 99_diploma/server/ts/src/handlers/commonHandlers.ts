import type { Response } from "express";
import { getUrl } from "../fns/common.js";
import { ORIGIN, ROUTES, SEARCHES } from "../constants.js";

export const handleAuthError = (res: Response, code: number, message?: string) => {
  res.status(code).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: message ? [{ name: SEARCHES.authError, value: message }] : [],
    }).toString(),
  );
};

export const handleAuthSuccess = (res: Response, code: number, message?: string) => {
  res.status(code).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: message ? [{ name: SEARCHES.success, value: message }] : [],
    }).toString(),
  );
};
