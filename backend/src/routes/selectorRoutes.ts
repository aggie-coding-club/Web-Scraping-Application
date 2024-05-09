import express from "express";
import * as selectorController from "../controllers/selectorController";

const router = express.Router();

// router.get("/getSelectors");

router.delete("/deleteAllSelectors", selectorController.deleteAllSelectors);

export default router;
