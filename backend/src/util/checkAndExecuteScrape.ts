import scrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "./scrapeWebsite";
import NoteModel from "../models/obj";

let scrapeTimeout: any; // fix type to be more specific later

const checkAndExecuteScrape = async () => {
    try {
        const [currentScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();

        if (!currentScrape) {
            console.log("No scheduled scrapes. Checking again in 10 second.");
            setNextScrapeTimeout(10 * 1000);
        } else if (currentScrape.timeToScrape.getTime() <= Date.now()) {
            console.log("Scraping for:", currentScrape.url, "at time:", new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));

            const scrapedData = await scrapeWebsite(currentScrape.url, currentScrape.scrapeParameters);
            if (scrapedData === undefined) {
                console.log("Scrape failed.");
            } else {
                await NoteModel.findOneAndUpdate({ configId: currentScrape._id }, { $push: { scrapedData } });
                console.log("Scrape successful.");
            }

            currentScrape.timeToScrape = new Date(Date.now() + currentScrape.scrapeIntervalMinute * 60000);
            await currentScrape.save();

            const [nextScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();
            setNextScrapeTimeout(nextScrape.scrapeIntervalMinute * 60000);
        } else {
            setNextScrapeTimeout(currentScrape.timeToScrape.getTime() - Date.now());
        }
    } catch (error) {
        console.error("Error in checkAndExecuteScrape:", error);
        setNextScrapeTimeout(1 * 1000);
    }
};

export const setNextScrapeTimeout = (interval: number) => {
    clearTimeout(scrapeTimeout);
    scrapeTimeout = setTimeout(checkAndExecuteScrape, interval);
};
