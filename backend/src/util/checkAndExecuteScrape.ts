import scrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "./scrapeWebsite";
import { createNote } from "../controllers/objects";

export const checkAndExecuteScrape = async () => {
    try {
        const [nextScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();

        if (nextScrape) {
            console.log("Scraping for:", nextScrape.url);

            const scrapedData = await scrapeWebsite(nextScrape.url, nextScrape.parameters);
            createNote(nextScrape._id, scrapedData);

            nextScrape.timeToScrape = new Date(Date.now() + nextScrape.scrapeIntervalMinute * 60000);
            await nextScrape.save();

            setTimeout(checkAndExecuteScrape, nextScrape.scrapeIntervalMinute * 60000);
        } else {
            console.log("No scheduled scrapes. Checking again in 1 minute.");
            setTimeout(checkAndExecuteScrape, 60000);
        }
    } catch (error) {
        console.error("Error in checkAndExecuteScrape:", error);
        setTimeout(checkAndExecuteScrape, 60000);
    }
};
