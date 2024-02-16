import { Request, Response } from "express";
import ScrapeConfig from "../models/scrapeConfig";
import NoteModel from "../models/obj";
import { setNextScrapeTimeout } from "../util/checkAndExecuteScrape";
import { createNote } from "./objects";
import { assertIsDefined } from "../util/assertIsDefined";

export const createScrapingConfig = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        assertIsDefined(userId, "User ID must be defined");

        const { name, description, url, scrapeParameters, scrapeIntervalMinute, emailNotification } = req.body;
        const config = new ScrapeConfig({
            name,
            description,
            userId,
            url,
            scrapeParameters,
            scrapeIntervalMinute,
            timeToScrape: new Date(),
            emailNotification,
        });

        await createNote(userId, config._id);
        await config.save();

        setNextScrapeTimeout(0);
        res.status(200).send(config);
    } catch (error) {
        console.error("Error in createScrapingConfig:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateScrapingConfig = async (req: Request, res: Response) => {
    try {
        const { url, scrapeParameters, scrapeIntervalMinute, emailNotification } = req.body;
        const { configId } = req.params;

        const config = await ScrapeConfig.findByIdAndUpdate(
            configId,
            { userId: req.session.userId, url, scrapeParameters, scrapeIntervalMinute, emailNotification },
            { new: true }
        ).exec();

        if (!config) {
            return res.status(404).send("Scraping configuration not found");
        }

        setNextScrapeTimeout(0);
        res.status(200).send(config);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteScrapingConfig = async (req: Request, res: Response) => {
    try {
        const { configId } = req.params;
        const config = await ScrapeConfig.findByIdAndDelete(configId).exec();

        if (!config) {
            return res.status(404).send("Scraping configuration not found");
        }

        await NoteModel.deleteMany({ configId }).exec();
        setNextScrapeTimeout(0);

        res.status(204).send();
    } catch (error) {
        console.error("Error in deleteScrapingConfig:", error);
        res.status(500).send("Internal server error");
    }
};

export const getScrapingConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await ScrapeConfig.find({ userId: req.session.userId });
        res.status(200).send(configs);
    } catch (error) {
        console.error("Error in getScrapingConfigs:", error);
        res.status(500).send("Internal server error");
    }
};
