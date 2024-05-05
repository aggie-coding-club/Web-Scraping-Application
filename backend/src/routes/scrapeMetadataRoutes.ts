import express from "express";
import * as scrapingMetadataController from "../controllers/scrapeMetadataController";

const router = express.Router();

router.get(
  "/testGet/:scrapingConfigId/:key",
  scrapingMetadataController.testGet
); // DELETE ME
router.get("/getScrapeMetadata", scrapingMetadataController.getScrapingConfigs);

router.post("/testPost", scrapingMetadataController.testPost); // DELETE ME
router.post(
  "/createScrapeMetadata",
  scrapingMetadataController.createScrapingConfig
);

router.delete("/testDelete", scrapingMetadataController.testDelete); // DELETE ME
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
