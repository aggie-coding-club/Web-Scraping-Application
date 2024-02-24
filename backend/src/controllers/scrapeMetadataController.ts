import { Request, RequestHandler, Response } from "express";
import { ISelector } from "../models/selectorModel";
import {
  ISelectorMetadata,
  IScrapeMetadata,
  ScrapeMetadataModel,
} from "../models/scrapeMetadataModel";
import { assertIsDefined } from "../util/assertIsDefined";
import { createSelector, getSelectorByObjectId } from "./selectorController";
import { setNextScrapeTimeout } from "../util/checkAndExecuteScrape";
import createHttpError from "http-errors";
import { Schema } from "mongoose";

export const testGet = async (req: Request, res: Response) => {
  try {
    console.log("[SUCCESS] Test Get");
    const { userId } = req.session;

    const { name, note, url, scrapeIntervalMinute, emailNotification } =
      req.body;

    console.log("userId:", userId);

    console.log("name:", name);
    console.log("name:", name);
    console.log("note:", note);
    console.log("url:", url);
    console.log("scrapeIntervalMinute:", scrapeIntervalMinute);
    console.log("emailNotification:", emailNotification);

    res.status(200).send();
  } catch (error) {
    console.error("Error in test:", error);
  }
};

export const testPost = async (req: Request, res: Response) => {
  try {
    console.log("[SUCCESS] Test Post");
    console.log("Session:", req.session);
    const { userId } = req.session;

    const { name, note, url, scrapeIntervalMinute, emailNotification } =
      req.body;

    console.log("userId:", userId);

    console.log("name:", name);
    console.log("note:", note);
    console.log("url:", url);
    console.log("scrapeIntervalMinute:", scrapeIntervalMinute);
    console.log("emailNotification:", emailNotification);

    const { selectors }: { selectors: ISelector[] } = req.body;
    console.log("selectors:");
    for (const selector of selectors) {
      console.log("-------:");
      console.log("key: ", selector.key);
      console.log("name: ", selector.name);
      console.log("value: ", selector.selectorValue);
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error in test:", error);
  }
};

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

    // setNextScrapeTimeout(0); // FIXME!!!

    res.status(204).send();
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

// gets selector data based on name
export const getSelectorDataByKey: RequestHandler = async (req, res, next) => {
  const { userId } = req.session;
  const { scrapingConfigId, key } = req.params;
  try {
    const myScrapingConfig: IScrapeMetadata | null =
      await ScrapeMetadataModel.findById(scrapingConfigId).exec();

    if (!myScrapingConfig) {
      return res
        .status(404)
        .json({ message: "Scraping configuration not found" });
    }

    if (myScrapingConfig.userId.toString() !== userId?.toString()) {
      throw createHttpError(403, "Forbidden");
    }

    let objectId: Schema.Types.ObjectId | null = null;
    for (const selectorMetadata of myScrapingConfig.selectorsMetadata) {
      if (selectorMetadata.key === key) {
        // get selector
        objectId = selectorMetadata.objectId;
        break;
      }
    }

    if (objectId == null) {
      throw createHttpError(404, "Selector ID not Found in config");
    }

    let selectorData: ISelector | null = await getSelectorByObjectId(objectId);

    if (selectorData == null) {
      console.error("Selector ID in found metadata, but not in database o.O");
      throw createHttpError(500, "Internal Server Error");
    }

    return res.status(200).json(selectorData);
  } catch (error) {
    console.error("Error in getSelectorData:", error);
    next(error);
  }
};
// FIXME: add updateScrapingConfig
// FIXME: add deleteScrapingConfig
