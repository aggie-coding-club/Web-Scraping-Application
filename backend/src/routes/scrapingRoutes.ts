import express from "express";
import * as scrapingController from "../controllers/scraping";

const router = express.Router();

router.get("/getScrapingConfigs", scrapingController.getScrapingConfigs);

router.post("/createScrapingConfig", scrapingController.createScrapingConfig);

router.patch("/updateScrapingConfig/:configId", scrapingController.updateScrapingConfig);

router.delete("/deleteScrapingConfig/:configId", scrapingController.deleteScrapingConfig);

export default router;
