import express from "express";
import { ENDPOINTS } from "../constants.js";
import { handleList } from "../handlers/listHandler.js";
import { handleDelete } from "../handlers/deleteHandler.js";
import { handlePurge } from "../handlers/purgeHandler.js";
import { handleArchive } from "../handlers/archiveHandler.js";
import { handleCreate } from "../handlers/createHandler.js";
import { handleEdit } from "../handlers/editHandler.js";
import { handleUnarchive } from "../handlers/unarchiveHandler.js";
import { handleView } from "../handlers/viewHandler.js";

export const apiRouter = express.Router();

apiRouter.get(ENDPOINTS.archive, handleArchive);

apiRouter.get(ENDPOINTS.purge, handlePurge);

apiRouter.get(ENDPOINTS.delete, handleDelete);

apiRouter.post(ENDPOINTS.create, express.json(), handleCreate);

apiRouter.post(ENDPOINTS.edit, express.json(), handleEdit);

apiRouter.post(ENDPOINTS.list, express.json(), handleList);

apiRouter.get(ENDPOINTS.unarchive, handleUnarchive);

apiRouter.get(ENDPOINTS.view, express.json(), handleView);
