import express from "express";
import https from "https";
import * as scrapingController from "../controllers/scraping";

const router = express.Router();

router.get("/getScrapingConfigs", scrapingController.getScrapingConfigs);

router.post('/fetchHtml', (req, res) => {
    const { url } = req.body;

    https.get(url, (response) => {
        let data = '';

        // chunk
        response.on('data', (chunk) => {
            data += chunk;
        });

        // whole response
        response.on('end', () => {
            res.send(data);
        });
    }).on("error", (err) => {
        res.status(500).send(`Error fetching HTML content: ${err.message}`);
    });
});

router.post("/createScrapingConfig", scrapingController.createScrapingConfig);

router.patch("/updateScrapingConfig/:configId", scrapingController.updateScrapingConfig);

router.delete("/deleteScrapingConfig/:configId", scrapingController.deleteScrapingConfig);

export default router;
