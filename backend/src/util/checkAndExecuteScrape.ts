import scrapeConfig from "../models/scrapeConfig";
import { scrapeWebsite } from "./scrapeWebsite";
import NoteModel from "../models/obj";
import UserModel from "../models/user"
import { sendEmail } from "./emailNotification";

let scrapeTimeout: NodeJS.Timeout;

type ScrapingConfigObject = { [key: string]: string };

function processScrapingParameters(parameters: any[]): ScrapingConfigObject {
    return parameters.reduce((obj, param) => {
        const key = param.name;
        const value = param.value;

        if (!key || !value) {
            console.error("Invalid parameter format");
            return obj;
        }

        obj[key] = value;
        return obj;
    }, {} as ScrapingConfigObject);
}

const checkAndExecuteScrape = async () => {
    try {
        const [currentScrape] = await scrapeConfig.find({}).sort({ timeToScrape: 1 }).limit(1).exec();

        if (!currentScrape) {
            console.log("No scheduled scrapes. Checking again in 10 second.");
            setNextScrapeTimeout(10 * 1000);
        } else if (currentScrape.timeToScrape.getTime() <= Date.now()) {
            console.log("Scraping for:", currentScrape.url, "at time:", new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }), "America/Chicago");

            const scrapedData = await scrapeWebsite(currentScrape.url, currentScrape.scrapeParameters);

            if (scrapedData === undefined) {
                throw Error("Scrape failed.")
            } else {
                await NoteModel.updateOne({ configId: currentScrape._id }, { $push: { scrapedData } });
                const userId = currentScrape.userId;
                const user = (await UserModel.findById(userId).select('+email'));
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
