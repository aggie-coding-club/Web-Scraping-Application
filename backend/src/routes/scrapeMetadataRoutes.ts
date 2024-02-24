import express from "express";
import * as scrapingMetadataController from "../controllers/scrapeMetadataController";

const router = express.Router();

router.get(
  "/testGet/:scrapingConfigId/:key",
  scrapingMetadataController.testGet
);
router.get("/getScrapeMetadata", scrapingMetadataController.getScrapingConfigs);
router.get(
  "/getSelectorData/:scrapingconfigId/:key",
  scrapingMetadataController.getSelectorDataByKey
);

router.post("/testPost", scrapingMetadataController.testPost);
router.post(
  "/createScrapeMetadata",
  scrapingMetadataController.createScrapingConfig
);

export default router;
