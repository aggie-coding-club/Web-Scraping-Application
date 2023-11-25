import ScrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "../util/scrapeWebsite";
import { Request, Response } from "express";

export const updateScrapingConfig = async (req: Request, res: Response) => {
  const { userId, url, parameters } = req.body;
  try {
    const config = new ScrapeConfig({ user: userId, url, parameters });
    await config.save();
    res.status(200).send(config);
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

    // Ensure url and parameters are defined
    if (!config.url || !config.parameters) {
      return res
        .status(400)
        .send("URL or parameters missing in the configuration");
    }

    const scrapedData = await scrapeWebsite(
      config.url,
      config.parameters as string[]
    );
    // Update the database with the scraped data here
    res.status(200).send(scrapedData);
  } catch (error) {
    res.status(500).send(error);
  }
};
