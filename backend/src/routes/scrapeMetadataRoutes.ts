import express from "express";
import * as scrapingMetadataController from "../controllers/scrapeMetadataController";

const router = express.Router();

router.get("/getScrapeMetadata", scrapingMetadataController.getScrapingConfigs);

router.post(
  "/createScrapeMetadata",
  scrapingMetadataController.createScrapingConfig
);

router.delete(
  "/deleteScrapeMetadata/:configId",
  scrapingMetadataController.deleteScrapingConfig
);

router.delete(
  "/deleteSelector/:configId/:selectorId",
  scrapingMetadataController.deleteSelector
);

router.patch(
  "/updateScrapeMetadata/:configId",
  scrapingMetadataController.updateScrapingConfig
);
export default router;
