import express from "express";
import { ENDPOINTS } from "../constants.js";
import { handleCreateNote, handleGetNotes, handlePrerequisite, handleViewNote } from "../fns/notes.js";

export const apiRouter = express.Router();

apiRouter.post(ENDPOINTS.create, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleCreateNote(req, res, userName);
  }
});

apiRouter.post(ENDPOINTS.view, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleViewNote(req, res, userName);
  }
});

apiRouter.post(ENDPOINTS.notes, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleGetNotes(req, res, userName);
  }
});
