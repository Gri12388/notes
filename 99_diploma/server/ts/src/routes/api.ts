import express from "express";
import { ENDPOINTS, NOT_FOUND, ORIGIN, ROUTES, SESSIONS_TIME, TECH_ERROR } from "../constants.js";
import { getStringOrUdf } from "../fns/checkers.js";
import { getUrl } from "../fns/common.js";
import { findUserName } from "../fns/mongo.js";
import { handleExpire, handleTechError, handleUserNotFound } from "../fns/handlers.js";
import { handleCreateNote, handleGetNotes, handlePrerequisite } from "../fns/notes.js";

export const apiRouter = express.Router();

apiRouter.post(ENDPOINTS.create, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleCreateNote(req, res, userName);
  }
});

apiRouter.post(ENDPOINTS.notes, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleGetNotes(req, res, userName);
  }
});
