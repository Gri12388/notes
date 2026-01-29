import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkCreate } from "../fns/checkers.js";
import { createNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";

export const handleCreate = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { body } = req;
    const payload = checkCreate(body);

    if (payload) {
      const id = await createNote(payload, user);
      if (id) {
        res.status(200).json({ id });
      } else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
