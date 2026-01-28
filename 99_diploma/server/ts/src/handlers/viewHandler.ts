import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkString } from "../fns/checkers.js";
import { getNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";

export const handleView = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { params } = req;
    const id = checkString(params.id);

    if (id) {
      const note = await getNote(id, user);
      if (note) {
        res.status(200).json({ title: note.title, isArchive: note.isArchive, html: note.text });
      } else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
