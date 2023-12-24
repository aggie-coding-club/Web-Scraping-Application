import scrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "./scrapeWebsite";
import { createNote } from "../controllers/objects";

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
                createNote(currentScrape._id, scrapedData);
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
