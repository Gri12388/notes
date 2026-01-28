import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkList } from "../fns/checkers.js";
import { selectNotes } from "../fns/pg.js";
import { ERRORS, LIMIT } from "../constants.js";
import { handleApiError } from "./commonHandlers.js";

export const handleList = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { body } = req;
    const payload = checkList(body);

    if (payload) {
      const notes = await selectNotes(payload, user);
      if (notes) {
        const hasMore = notes.length > LIMIT;
        res.status(200).json({ data: notes, hasMore });
      } else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
