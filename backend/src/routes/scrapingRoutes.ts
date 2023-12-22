import express from "express";
import * as scrapingController from "../controllers/scraping";

const router = express.Router();

router.post("/createScrapingConfig", scrapingController.createScrapingConfig);
router.post("/scrape", scrapingController.performScraping);

export default router;
