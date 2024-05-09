import { ScrapeMetadataModel } from "../models/scrapeMetadataModel";
import { scrapeWebsite } from "./scrapeWebsite";
import { SelectorModel } from "../models/selectorModel";
import UserModel from "../models/user";
import { sendEmail } from "./emailNotification";
import { IData } from "../models/selectorModel";

let scrapeTimeout: NodeJS.Timeout;

const checkAndExecuteScrape = async () => {
  const [currentScrape] = await ScrapeMetadataModel.find({})
    .sort({ timeToScrape: 1 })
    .limit(1)
    .exec();

  if (!currentScrape) {
    console.log("No scheduled scrapes. Checking again in 10 second.");
    setNextScrapeTimeout(10 * 1000);
    return;
  }

  try {
    if (currentScrape.timeToScrape.getTime() <= Date.now()) {
      let currentDate = new Date();
      let currentDateStr = currentDate.toLocaleString("en-US", {
        timeZone: "America/Chicago",
      });
      console.log(
        `Scraping for: ${currentScrape.url} at time: ${currentDateStr}, America/Chicago`
      );

      const scrapedData = await scrapeWebsite(
        currentScrape.url,
        currentScrape.selectorsMetadata
      );

      if (scrapedData === undefined) {
        throw Error("Scrape failed.");
      }

      Promise.all(
        scrapedData.selectors.map(async (selector) => {
          // check to see if data has changed
          const mySelector = await SelectorModel.findOne(
            { _id: selector.selectorId },
            { data: { $slice: -1 } }
          );

          if (!mySelector) {
            throw new Error(`Selector ${selector.selectorId} not found`);
          }

          // check if content changed
          if (
            !selector.content ||
            mySelector.data[0]?.content === selector.content
          ) {
            console.log("duplicate content, do not save...");
            return;
          }

          // insert new data into selector
          const myData: IData = {
            timestamp: new Date(scrapedData.timestamp),
            content: selector.content,
          };

          await SelectorModel.updateOne(
            { _id: selector.selectorId },
            {
              $push: { data: myData },
            }
          );
        })
      );

      // send email
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

      currentScrape.status = "success";
      currentScrape.lastSuccessfulScrape = currentDate;
      await currentScrape.save();
    } else {
      setNextScrapeTimeout(currentScrape.timeToScrape.getTime() - Date.now());
    }
  } catch (error) {
    console.error("Error in checkAndExecuteScrape:", error);
    currentScrape.status = "failed";
    await currentScrape.save();
  } finally {
    currentScrape.timeToScrape = new Date(
      Date.now() + currentScrape.scrapeIntervalMinute * 60000
    );
    await currentScrape.save();

    const [nextScrape] = await ScrapeMetadataModel.find({})
      .sort({ timeToScrape: 1 })
      .limit(1)
      .exec();
    setNextScrapeTimeout(nextScrape.scrapeIntervalMinute * 60000);
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
