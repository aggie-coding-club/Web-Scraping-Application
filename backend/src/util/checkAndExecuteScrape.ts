import scrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "./scrapeWebsite";
import NoteModel from "../models/obj";
import UserModel from "../models/user";
import { sendEmail } from "./emailNotification";

let scrapeTimeout: NodeJS.Timeout;

function isScrapedDataChanged(oldScrapedData: ScrapedData, newScrapedData: ScrapedData): boolean {
    if (oldScrapedData.url !== newScrapedData.url) {
        return true;
    }

    if (oldScrapedData.selectors.length != newScrapedData.selectors.length) {
        return true;
    }

    const oldScrapedDataSelectorObject: { [key: string]: ScrapedSelector } = {};
    oldScrapedData.selectors.forEach((selector) => (oldScrapedDataSelectorObject[selector.id] = selector));

    return newScrapedData.selectors.some((selector) => selector.content != oldScrapedDataSelectorObject[selector.id].content);
}

const checkAndExecuteScrape = async () => {
    try {
        const [currentScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();

        if (!currentScrape) {
            console.log("No scheduled scrapes. Checking again in 10 second.");
            setNextScrapeTimeout(10 * 1000);
        } else if (currentScrape.timeToScrape.getTime() <= Date.now()) {
            console.log(
                "Scraping for:",
                currentScrape.url,
                "at time:",
                new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
                "America/Chicago"
            );

            const scrapedData = await scrapeWebsite(currentScrape.url, currentScrape.scrapeParameters);

            if (scrapedData === undefined) {
                throw Error("Scrape failed.");
            } else {
                const lastScrapedData = (await NoteModel.findOne({ configId: currentScrape._id }, { scrapedData: { $slice: -1 } }))?.scrapedData[0];
                const isChanged = lastScrapedData ? isScrapedDataChanged(lastScrapedData, scrapedData) : true;

                if (isChanged) {
                    await NoteModel.updateOne({ configId: currentScrape._id }, { $push: { scrapedData } });
                }
                console.log(isChanged);

                const userId = currentScrape.userId;
                const user = await UserModel.findById(userId).select("+email");
                if (user) {
                    const { email } = user;
                    const { emailNotification } = currentScrape;
                    if (emailNotification === "update_on_scrape") {
                        sendEmail(email!, "Test Config", scrapedData);
                    }
                }
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
    try {
        clearTimeout(scrapeTimeout);
        scrapeTimeout = setTimeout(checkAndExecuteScrape, interval);
    } catch {
        setNextScrapeTimeout(1 * 1000);
    }
};
