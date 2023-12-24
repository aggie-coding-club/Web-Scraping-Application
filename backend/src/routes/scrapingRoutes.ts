import express from "express";
import * as scrapingController from "../controllers/scraping";

const router = express.Router();

router.post("/createScrapingConfig", scrapingController.createScrapingConfig);
router.get("/getScrapingConfigs", scrapingController.getScrapingConfigs);
router.post("/scrape", scrapingController.performScraping);

export default router;
