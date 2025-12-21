import type { Request, Response } from "express";
import { getNoteLiteOrUdf, getNotesPayloadOrUdf, getStringOrUdf } from "./checkers.js";
import { ERRORS, LIMIT, NOT_FOUND, ORIGIN, ROUTES, SESSIONS_TIME, TECH_ERROR } from "../constants.js";
import { createNote, getNote, getNotes } from "./pg.js";
import { findUserName } from "./mongo.js";
import { handleExpire, handleTechError, handleUserNotFound } from "./handlers.js";
import { getUrl } from "./common.js";

export const handlePrerequisite = async (req: Request, res: Response) => {
  let result: string = "";
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
          result = userName;
      }
    } else handleExpire(res, sessionId);
  } else {
    res.status(307).redirect(getUrl({ origin: ORIGIN, path: ROUTES.root, search: [] }).toString());
  }

  return result;
};

export const handleGetNotes = async (req: Request, res: Response, userName: string) => {
  const { body } = req;
  const payload = getNotesPayloadOrUdf(body);

  if (payload) {
    const notes = await getNotes(payload, userName);
    if (notes) {
      const hasMore = notes.length > LIMIT;
      res.status(200).json({ data: notes, hasMore });
    } else res.status(500).send(ERRORS.somethingWrong);
  } else res.status(400).send(ERRORS.badRequest);
};

export const handleCreateNote = async (req: Request, res: Response, userName: string) => {
  const { body } = req;
  const payload = getNoteLiteOrUdf(body);

  if (payload) {
    const id = await createNote(payload, userName);
    if (id) {
      res.status(200).json({ _id: id });
    } else res.status(500).send(ERRORS.somethingWrong);
  } else res.status(400).send(ERRORS.badRequest);
};

export const handleViewNote = async (req: Request, res: Response, userName: string) => {
  const { body } = req;
  const id = getStringOrUdf(body.id);

  if (id !== undefined) {
    const note = await getNote(id, userName);
    if (note) {
      res.status(200).json({ title: note.title, isArchived: note.isArchive, html: note.text });
    } else res.status(500).send(ERRORS.somethingWrong);
  } else res.status(400).send(ERRORS.badRequest);
};
