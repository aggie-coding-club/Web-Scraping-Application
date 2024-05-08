import { ScrapeMetadataModel } from "../models/scrapeMetadataModel";
import { scrapeWebsite } from "./scrapeWebsite";
import { SelectorModel } from "../models/selectorModel";
import UserModel from "../models/user";
import { sendEmail } from "./emailNotification";
import { IData } from "../models/selectorModel";

let scrapeTimeout: NodeJS.Timeout;

function isScrapedDataChanged(
  oldScrapedData: ScrapedData,
  newScrapedData: ScrapedData
): boolean {
  if (oldScrapedData.url !== newScrapedData.url) {
    return true;
  }

  if (oldScrapedData.selectors.length != newScrapedData.selectors.length) {
    return true;
  }

  const oldScrapedDataSelectorObject: { [key: string]: ScrapedSelector } = {};
  oldScrapedData.selectors.forEach(
    (selector) => (oldScrapedDataSelectorObject[selector.selectorId] = selector)
  );

  return newScrapedData.selectors.some(
    (selector) =>
      oldScrapedDataSelectorObject[selector.selectorId] === undefined ||
      selector.content !=
        oldScrapedDataSelectorObject[selector.selectorId].content
  );
}

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
      console.log(
        "Scraping for:",
        currentScrape.url,
        "at time:",
        new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
        "America/Chicago"
      );

      const scrapedData = await scrapeWebsite(
        currentScrape.url,
        currentScrape.selectorsMetadata
      );

      if (scrapedData === undefined) {
        throw Error("Scrape failed.");
      } else {
        // check when the last time the data was scraped
        //

        console.log("scrapedData: ", scrapedData);
        scrapedData.selectors.map(async (selector) => {
          // check to see if data has changed
          /*
          const lastScrapedData = await SelectorModel.findOne(
            { selectorId: selector.selectorId },
            { content: { $slice: -1 } }
          );

          console.log(lastScrapedData);
          */

          const myData: IData = {
            timestamp: new Date(scrapedData.timestamp), // fixme
            content: selector.content ? selector.content : "",
          };

          console.log("idata:", myData);
          console.log("update at:", selector.selectorId);

          await SelectorModel.updateOne(
            { _id: selector.selectorId },
            {
              $push: { data: myData },
            }
          );
        });

        currentScrape.status = "success";
        await currentScrape.save();
        /*
        const lastScrapedData = (
          await SelectorModel.findOne(
            { configId: currentScrape._id },
            { scrapedData: { $slice: -1 } }
          )
        )?.scrapedData[0];
        const isChanged = lastScrapedData
          ? isScrapedDataChanged(lastScrapedData, scrapedData)
          : true;

        if (isChanged) {
          await NoteModel.updateOne(
            currentScrape.selectorId,
            { $push: { scrapedData } }
          );
          await ScrapeConfigModel.updateOne(
            { _id: currentScrape._id },
            { lastChanged: new Date() }
          );
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
        await ScrapeConfigModel.updateOne(
          { _id: currentScrape._id },
          { status: "success" }
      
        );
        */
      }
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
  console.log("next scrape after:", interval);
  try {
    clearTimeout(scrapeTimeout);
    scrapeTimeout = setTimeout(checkAndExecuteScrape, interval);
  } catch {
    setNextScrapeTimeout(1 * 1000);
  }
};
