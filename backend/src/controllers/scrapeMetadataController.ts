import { Request, Response } from "express";
import { ISelector } from "../models/selectorModel";
import {
  ISelectorMetadata,
  ScrapeMetadataModel,
} from "../models/scrapeMetadataModel";
import { assertIsDefined } from "../util/assertIsDefined";
import { createSelector } from "./selectorController";
import { setNextScrapeTimeout } from "../util/checkAndExecuteScrape";

export const createScrapingConfig = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    assertIsDefined(userId, "User ID must be defined");

    const { name, note, url, scrapeIntervalMinute, emailNotification } =
      req.body;

    // ------- Create Selectors ---------------
    const { selectors }: { selectors: ISelector[] } = req.body;
    let selectorsMetadata: ISelectorMetadata[] = [];

    // FIXME: can be done more efficiently; but ppl should have THAT many selectors so prob fine
    // can be done so making calls are done async, and then wait for all promises to resolve. (so done in parallel)
    // FIMXE: add error handling
    for (const selector of selectors) {
      const selectorMetadata = await createSelector(selector);
      if (selectorMetadata != null) {
        selectorsMetadata.push(selectorMetadata);
      } else {
        throw new Error("Error in creating selector");
      }
    }

    // ------------------- Create ScrapeMetadata ------------------
    const config = new ScrapeMetadataModel({
      userId,
      name,
      note,
      url,
      selectorsMetadata,
      scrapeIntervalMinute,
      timeToScrape: new Date(),
      emailNotification,
    });

    await config.save();

    setNextScrapeTimeout(0); // FIXME!!!
  } catch (error) {
    console.error(
      "Error in createScrapingConfig in scrapeMetadataController.ts:",
      error
    );
    res.status(500).send("Internal server error");
  }
};

export const getScrapingConfigs = async (req: Request, res: Response) => {
  try {
    const configs = await ScrapeMetadataModel.find({
      userId: req.session.userId,
    });
    res.status(200).send(configs);
  } catch (error) {
    console.error(
      "Error in getScrapingConfigs in scrapeMetadataController:",
      error
    );
    res.status(500).send("Internal server error");
  }
};

// FIXME: add updateScrapingConfig
// FIXME: add deleteScrapingConfig
