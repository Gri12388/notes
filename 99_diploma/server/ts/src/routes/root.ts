import bodyParser from "body-parser";
import express from "express";
import {
  COOKIES,
  ENDPOINTS,
  NO_ONE,
  NOT_FOUND,
  NOT_UNIQUE,
  NOT_UNIQUE_TYPES,
  NOTHING,
  ORIGIN,
  ROUTES,
  SESSIONS_TIME,
  TECH_ERROR,
} from "../constants.js";
import type { Session } from "../types.js";
import ms from "ms";
import { getCreds, getUrl, hashText } from "../fns/common.js";
import { createSession, deleteSession, findPassword, findSession, findUser, setCredential } from "../fns/mongo.js";
import {
  handleCredsSet,
  handleLogin,
  handleNoCredentials,
  handleNotUnique,
  handleSomthingWentWrong,
  handleUserExists,
  handleWrongCreds,
} from "../fns/handlers.js";
import { getStringOrUdf } from "../fns/checkers.js";

export const rootRouter = express.Router();

rootRouter.get(ROUTES.root, async (req, res) => {
  const { cookies } = req;

  if (cookies && cookies.sessionId) {
    const { sessionId } = cookies;
    const session = await findSession(sessionId);
    switch (session) {
      case NOT_FOUND:
        res.clearCookie(COOKIES.sessionId);
        handleSomthingWentWrong(res);
        break;

      case TECH_ERROR:
        res.clearCookie(COOKIES.sessionId);
        handleSomthingWentWrong(res);
        break;

      default:
        const { expire } = session.found;
        const now = Date.now();
        const isEspired = now > expire;
        if (isEspired) {
          SESSIONS_TIME[sessionId] = NO_ONE;
          await deleteSession(sessionId);
          res
            .status(307)
            .clearCookie(COOKIES.sessionId)
            .redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
        } else {
          SESSIONS_TIME[sessionId] = expire;
          res.render("dashboard");
        }
    }
  } else {
    const { authError, success } = req.query;
    res.render("index", { index: { authError, success } });
  }
});

rootRouter.get(ENDPOINTS.logout, async (req, res) => {
  const { cookies } = req;

  if (cookies && cookies.sessionId) {
    const sessionId = getStringOrUdf(cookies.sessionId);
    if (sessionId) {
      const isDeleted = await deleteSession(sessionId);
      if (isDeleted) {
        res
          .status(307)
          .clearCookie(COOKIES.sessionId)
          .redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
      }
    }
  }
});

rootRouter.post(ENDPOINTS.login, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const creds = getCreds(req.body);

  if (creds) {
    const { login, password } = creds;
    const findData = await findPassword(login);
    switch (findData) {
      case NOT_FOUND:
        handleWrongCreds(res);
        break;

      case TECH_ERROR:
        handleSomthingWentWrong(res);
        break;

      default:
        const hash = hashText(password);
        const isMatch = hash === findData.found;
        if (isMatch) {
          const session: Session = {
            user: login,
            expire: Date.now() + ms("1d"),
          };
          const id = await createSession(session);
          if (id) handleLogin(res, id);
          else handleSomthingWentWrong(res);
        } else handleWrongCreds(res);
    }
  } else handleNoCredentials(res);
});

rootRouter.post(ENDPOINTS.signup, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const creds = getCreds(req.body);

  if (creds) {
    const { login, password } = creds;
    const found = await findUser(login);
    switch (found) {
      case NOT_FOUND:
        const hash = hashText(password);
        const isSet = await setCredential(login, hash);
        switch (isSet) {
          case NOTHING:
            handleSomthingWentWrong(res);
            break;

          case NOT_UNIQUE:
            handleNotUnique(res, NOT_UNIQUE_TYPES.user);
            break;

          default:
            handleCredsSet(res);
        }
        break;

      case TECH_ERROR:
        handleSomthingWentWrong(res);
        break;

      default:
        handleUserExists(res);
    }
  } else handleNoCredentials(res);
});
