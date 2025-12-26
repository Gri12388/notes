import express from "express";
import { ENDPOINTS } from "../constants.js";
import {
  handleArchiveNote,
  handleCreateNote,
  handleDelete,
  handleDeleteNote,
  handleEditNote,
  handleGetNotes,
  handlePrerequisite,
  handleUnarchiveNote,
  handleViewNote,
} from "../fns/notes.js";

export const apiRouter = express.Router();

apiRouter.get(ENDPOINTS.archive, async (req, res) => {
  await handlePrerequisite(req, res, false);
  await handleArchiveNote(req, res);
});

apiRouter.get(ENDPOINTS.delete, async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleDelete(res, userName);
  }
});

apiRouter.get(ENDPOINTS.deleteNote, async (req, res) => {
  await handlePrerequisite(req, res, false);
  await handleDeleteNote(req, res);
});

apiRouter.post(ENDPOINTS.create, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleCreateNote(req, res, userName);
  }
});

apiRouter.post(ENDPOINTS.edit, express.json(), async (req, res) => {
  await handlePrerequisite(req, res);
  await handleEditNote(req, res);
});

apiRouter.post(ENDPOINTS.notes, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleGetNotes(req, res, userName);
  }
});

apiRouter.get(ENDPOINTS.unarchive, async (req, res) => {
  await handlePrerequisite(req, res, false);
  await handleUnarchiveNote(req, res);
});

apiRouter.get(ENDPOINTS.view, express.json(), async (req, res) => {
  const userName = await handlePrerequisite(req, res);

  if (userName) {
    await handleViewNote(req, res, userName);
  }
});
