import type { Request, Response } from "express";
import { getNotesPayloadOrUdf } from "./checkers.js";
import { ERRORS, LIMIT } from "../constants.js";
import { getNotes } from "./pg.js";

export const handleGetNotes = async (req: Request, res: Response, userName: string) => {
  const { body } = req;
  const payload = getNotesPayloadOrUdf(body);

  if (payload) {
    const notes = await getNotes(payload, userName);
    if (notes) {
      const hasMore = notes.length > LIMIT;
      res.status(200).json({ data: [], hasMore });
    } else res.status(500).send(ERRORS.somethingWrong);
  } else res.status(400).send(ERRORS.badRequest);
};
