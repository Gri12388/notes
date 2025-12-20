import type { Response } from "express";
import { COOKIES, ERRORS, NO_ONE, ORIGIN, ROUTES, SEARCHES, SESSIONS_TIME } from "../constants.js";
import { locale } from "../locale.js";
import { getUrl } from "./common.js";
import type { NotUnique } from "../types.js";
import { deleteSession } from "./mongo.js";

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
        path: ROUTES.root,
        search: [],
      }).toString(),
    );
};

export const handleExpire = async (res: Response, sessionId: string) => {
  SESSIONS_TIME[sessionId] = NO_ONE;
  await deleteSession(sessionId);
  res
    .status(307)
    .clearCookie(COOKIES.sessionId)
    .redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
};

export const handleUserNotFound = async (res: Response) => {
  res.status(404).send(ERRORS.userNotFound);
};

export const handleTechError = async (res: Response) => {
  res.status(500).send(ERRORS.somethingWrong);
};
