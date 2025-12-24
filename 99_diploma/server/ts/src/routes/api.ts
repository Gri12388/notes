import express from "express";
import { ENDPOINTS } from "../constants.js";
import {
  handleArchiveNote,
  handleCreateNote,
  handleGetNotes,
  handlePrerequisite,
  handleViewNote,
} from "../fns/notes.js";

export const apiRouter = express.Router();

apiRouter.get(ENDPOINTS.archive, async (req, res) => {
  await handlePrerequisite(req, res, false);
  await handleArchiveNote(req, res);
});

apiRouter.get(ENDPOINTS.deleteId, async (req, res) => {
  const { params } = req;
  const { id } = params;
  console.log("id", id);
  // const userName = await handlePrerequisite(req, res);

  // if (userName) {
  //   await handleCreateNote(req, res, userName);
  // }
});

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
