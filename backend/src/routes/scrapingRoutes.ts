import express from 'express';
import * as scrapingController from '../controllers/scraping';

const router = express.Router();

router.post('/updateConfig', scrapingController.updateScrapingConfig);
router.post('/scrape', scrapingController.performScraping);

export default router;
