import express from "express";
import { COOKIES, ENDPOINTS, NO_ONE, NOT_FOUND, ORIGIN, ROUTES, SESSIONS_TIME, TECH_ERROR } from "../constants.js";
import { getStringOrUdf } from "../fns/checkers.js";
import { getUrl } from "../fns/common.js";
import { deleteSession } from "../fns/db.js";

export const apiRouter = express.Router();

apiRouter.post(ENDPOINTS.notes, express.json(), async (req, res) => {
  const sessionId = req.cookies ? getStringOrUdf(req.cookies.sessionId) : undefined;

  if (sessionId) {
    const now = Date.now();
    if (SESSIONS_TIME[sessionId] > now) {
      const { body } = req;
      console.log("body", body);
      res.status(200).json({ data: [] });
    } else {
      SESSIONS_TIME[sessionId] = NO_ONE;
      await deleteSession(sessionId);
      res
        .status(307)
        .clearCookie(COOKIES.sessionId)
        .redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
    }
  } else {
    res.status(307).redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
  }
});
