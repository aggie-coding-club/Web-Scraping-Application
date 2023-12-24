import scrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "./scrapeWebsite";
import NoteModel from "../models/obj";

let scrapeTimeout: any; // fix type to be more specific later

const checkAndExecuteScrape = async () => {
    try {
        const [currentScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();

        if (currentScrape) {
            console.log("Scraping for:", currentScrape.url);

            const scrapedData = await scrapeWebsite(currentScrape.url, currentScrape.scrapeParameters);
            if (scrapedData === undefined) {
                console.log("Scrape failed.");
            } else {
                NoteModel.findOneAndUpdate({ configId: currentScrape._id }, { $push: { scrapedData } });

                // consider using this for handling when creating a Note failed
                // NoteModel.findOneAndUpdate(
                //     { configId: currentScrape._id, userId: currentScrape.userId },
                //     { upsert: true },
                //     { $push: { scrapedData } }
                // );
            }

            currentScrape.timeToScrape = new Date(Date.now() + currentScrape.scrapeIntervalMinute * 60000);
            await currentScrape.save();

            const [nextScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();
            setNextScrapeTimeout(nextScrape.scrapeIntervalMinute * 60000);
        } else {
            console.log("No scheduled scrapes. Checking again in 1 minute.");
            setNextScrapeTimeout(60000);
        }
    } catch (error) {
        console.error("Error in checkAndExecuteScrape:", error);
        setNextScrapeTimeout(60000);
    }
};

export const setNextScrapeTimeout = (interval: number) => {
    clearTimeout(scrapeTimeout);
    scrapeTimeout = setTimeout(checkAndExecuteScrape, interval);
};
