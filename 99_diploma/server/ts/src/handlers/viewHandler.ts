import type { Request, Response } from "express";
import markdownit from "markdown-it";
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
        const html = markdownit().render(note.text);
        res.status(200).json({ title: note.title, isArchived: note.isArchived, html });
      } else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
