import type { Response } from "express";
import { COOKIES, ERRORS, ORIGIN, ROUTES, SEARCHES } from "../constants.js";
import { locale } from "../locale.js";
import { getUrl } from "./common.js";
import type { NotUnique } from "../types.js";

export const handleNoCredentials = (res: Response) => {
  res.status(307).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: [{ name: SEARCHES.authError, value: ERRORS.noCredentials }],
    }).toString(),
  );
};

export const handleUserExists = (res: Response) => {
  res.status(307).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: [{ name: SEARCHES.authError, value: ERRORS.userExists }],
    }).toString(),
  );
};

export const handleSomthingWentWrong = (res: Response) => {
  res.status(307).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: [{ name: SEARCHES.authError, value: ERRORS.somethingWrong }],
    }).toString(),
  );
};

export const handleNotUnique = (res: Response, type: NotUnique) => {
  res.status(307).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: [{ name: SEARCHES.authError, value: ERRORS.notUnique(type) }],
    }).toString(),
  );
};

export const handleWrongCreds = (res: Response) => {
  res.status(307).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: [{ name: SEARCHES.authError, value: ERRORS.wrongCreds }],
    }).toString(),
  );
};

export const handleCredsSet = (res: Response) => {
  res.status(204).redirect(
    getUrl({
      origin: ORIGIN,
      path: ROUTES.root,
      search: [{ name: SEARCHES.success, value: locale.credsSet }],
    }).toString(),
  );
};

export const handleLogin = async (res: Response, sessionId: string) => {
  res
    .status(204)
    .cookie(COOKIES.sessionId, sessionId, { httpOnly: true })
    .redirect(
      getUrl({
        origin: ORIGIN,
        path: ROUTES.api,
        search: [],
      }).toString(),
    );
};
