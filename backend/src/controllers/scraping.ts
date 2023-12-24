import ScrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "../util/scrapeWebsite";
import { Request, Response } from "express";
import { setNextScrapeTimeout } from "../util/checkAndExecuteScrape";

type ScrapingConfigObject = { [key: string]: string };

function processScrapingParameters(parameters: string): ScrapingConfigObject {
    parameters = parameters.trim();
    parameters = parameters.endsWith(",") ? parameters.slice(-1) : parameters;

    return parameters.split(",").reduce((obj, param) => {
        const [rawKey, rawValue] = param.split(":").map((s) => s.trim());

        const key = rawKey.startsWith('"') && rawKey.endsWith('"') ? rawKey.slice(1, -1) : rawKey;
        const value = rawValue.startsWith('"') && rawValue.endsWith('"') ? rawValue.slice(1, -1) : rawValue;

        if (!key || !value) {
            throw new Error("Invalid parameter format");
        }

        obj[key] = value;
        return obj;
    }, {} as ScrapingConfigObject);
}

// Prob add .exec() to the end of all the queries
export const createScrapingConfig = async (req: Request, res: Response) => {
    try {
        const { url, scrapeParameters, scrapeIntervalMinute } = req.body;
        const config = new ScrapeConfig({
            userId: req.session.userId,
            url,
            scrapeParameters: processScrapingParameters(scrapeParameters),
            scrapeIntervalMinute,
            timeToScrape: new Date(Date.now()),
        });
        await config.save();

        setNextScrapeTimeout(scrapeIntervalMinute * 60000);
        res.status(200).send(config);
    } catch (error) {
        console.log(error);
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

        if (!config.url || !config.scrapeParameters) {
            return res.status(400).send("URL or parameters missing in the configuration");
        }

        const scrapedData = await scrapeWebsite(config.url, config.scrapeParameters as ScrapingConfigObject);

        // Update the database with the scraped data here
        res.status(200).send(scrapedData);
    } catch (error) {
        res.status(500).send(error);
    }
};
