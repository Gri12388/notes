import express from "express";
import { ENDPOINTS, NOT_FOUND, ORIGIN, ROUTES, SESSIONS_TIME, TECH_ERROR } from "../constants.js";
import { getStringOrUdf } from "../fns/checkers.js";
import { getUrl } from "../fns/common.js";
import { findUserName } from "../fns/mongo.js";
import { handleExpire, handleTechError, handleUserNotFound } from "../fns/handlers.js";
import { handleGetNotes } from "../fns/notes.js";

export const apiRouter = express.Router();

apiRouter.post(ENDPOINTS.notes, express.json(), async (req, res) => {
  const sessionId = req.cookies ? getStringOrUdf(req.cookies.sessionId) : undefined;

  if (sessionId) {
    const now = Date.now();
    if (SESSIONS_TIME[sessionId] > now) {
      const user = await findUserName(sessionId);
      switch (user) {
        case NOT_FOUND:
          handleUserNotFound(res);
          break;

        case TECH_ERROR:
          handleTechError(res);
          break;

        default:
          const { found: userName } = user;
          await handleGetNotes(req, res, userName);
      }

      // const { body } = req;
      // console.log("body", body);
      // res.status(200).json({ data: [] });
    } else handleExpire(res, sessionId);
  } else {
    res.status(307).redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
  }
});
