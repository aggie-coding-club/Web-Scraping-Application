import ScrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "../util/scrapeWebsite";
import { Request, Response } from "express";

// Prob add .exec() to the end of all the queries
export const createScrapingConfig = async (req: Request, res: Response) => {
    const { url, parameters, scrapeIntervalMinute } = req.body;
    try {
        const config = new ScrapeConfig({ userId: req.session.userId, url, parameters, scrapeIntervalMinute });
        await config.save();
        res.status(200).send(config);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateScrapingConfig = async (req: Request, res: Response) => {
    const { url, parameters, scrapeIntervalMinute } = req.body;
    const { configId } = req.params;

    try {
        const config = await ScrapeConfig.findByIdAndUpdate(
            configId,
            { userId: req.session.userId, url, parameters, scrapeIntervalMinute },
            { new: true }
        );

        if (!config) {
            return res.status(404).send("Scraping configuration not found");
        }

        res.status(200).send(config);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteScrapingConfig = async (req: Request, res: Response) => {
    const { configId } = req.params;

    try {
        const config = await ScrapeConfig.findByIdAndDelete(configId);

        if (!config) {
            return res.status(404).send("Scraping configuration not found");
        }

        // delete notes with configid as well

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getScrapingConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await ScrapeConfig.find({ userId: req.session.userId });
        console.log(configs);
        res.status(200).send(configs);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const performScraping = async (req: Request, res: Response) => {
    const { configId } = req.body;
    try {
        const config = await ScrapeConfig.findById(configId);
        if (!config) {
            return res.status(404).send("Config not found");
        }

        if (!config.url || !config.parameters) {
            return res.status(400).send("URL or parameters missing in the configuration");
        }

        const scrapedData = await scrapeWebsite(config.url, config.parameters as ScrapingConfigObject);

        // Update the database with the scraped data here
        res.status(200).send(scrapedData);
    } catch (error) {
        res.status(500).send(error);
    }
};
