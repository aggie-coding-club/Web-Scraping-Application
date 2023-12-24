import express from "express";
import * as NotesController from "../controllers/objects";

const router = express.Router();

router.get("/:configId", NotesController.getNote);

export default router;
