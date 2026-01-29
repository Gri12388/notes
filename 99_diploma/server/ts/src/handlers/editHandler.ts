import type { Request, Response } from "express";
import { getUser } from "../fns/getUser.js";
import { checkEdit } from "../fns/checkers.js";
import { editNote } from "../fns/pg.js";
import { handleApiError } from "./commonHandlers.js";
import { ERRORS } from "../constants.js";

export const handleEdit = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

  if (user) {
    const { body } = req;
    const payload = checkEdit(body);

    if (payload) {
      const isEdited = await editNote(payload);
      if (isEdited) {
        res.status(200).json({ status: "success" });
      } else handleApiError(res, 500, ERRORS.somethingWrong);
    } else handleApiError(res, 400, ERRORS.badRequest);
  }
};
