import { Request, RequestHandler, Response } from "express";
import { ISelector, SelectorModel } from "../models/selectorModel";
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

    const { selectors }: { selectors: ISelectorMetadata[] } = req.body;
    console.log("selectors:");
    for (const selector of selectors) {
      console.log("-------:");
      console.log("name: ", selector.name);
      console.log("value: ", selector.selectorValue);
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error in test:", error);
  }
};

export const testDelete = async (req: Request, res: Response) => {
  try {
    console.log("[SUCCESS] Test Delete");
    res.status(200).send("Test Delete");
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
    const { selectorsMetadata }: { selectorsMetadata: ISelectorMetadata[] } =
      req.body;

    // FIXME: can be done more efficiently; but ppl should have THAT many selectors so prob fine
    // can be done so making calls are done async, and then wait for all promises to resolve. (so done in parallel)
    // FIMXE: add error handling
    for (const selector of selectorsMetadata) {
      const savedSelectorId = await createSelector();
      if (savedSelectorId != null) {
        selector.selectorId = savedSelectorId;
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

export const deleteScrapingConfig = async (req: Request, res: Response) => {
  try {
    const { configId } = req.params;
    const myScrapingConfig: IScrapeMetadata | null =
      await ScrapeMetadataModel.findByIdAndDelete(configId).exec();

    if (!myScrapingConfig) {
      return res.status(404).send("Scraping configuration not found");
    }

    // delete selectors
    // FIXME: Can be done more efficiently. Instead of waiting one by one,
    //  can run them in parallel
    for (const selectorMetadata of myScrapingConfig.selectorsMetadata) {
      const selectorId = selectorMetadata.selectorId;
      const deletedSelector = await SelectorModel.findByIdAndDelete(
        selectorId
      ).exec();

      if (!deletedSelector) {
        console.error(`[FAILED] Selector ${selectorId} not found`);
      }
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error in deleteScrapingConfig", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteSelector = async (req: Request, res: Response) => {
  try {
    const { configId, selectorId } = req.params;

    const myScrapingConfig: IScrapeMetadata | null =
      await ScrapeMetadataModel.findById(configId).exec();

    if (!myScrapingConfig) {
      return res.status(404).send("Scraping configuration not found");
    }

    // Find the index of the selector to delete
    const indexToDelete = myScrapingConfig.selectorsMetadata.findIndex(
      (selector) =>
        selector.selectorId && selector.selectorId.toString() === selectorId
    );

    if (indexToDelete !== -1) {
      // Delete the selector from the selectorsMetadata array
      myScrapingConfig.selectorsMetadata.splice(indexToDelete, 1);
      await myScrapingConfig.save();
    } else {
      return res.status(404).send(`SelectorId ${selectorId} not found`);
    }

    await SelectorModel.findByIdAndDelete(selectorId).exec();

    return res.status(200).send();
  } catch (error) {
    console.error("Error in deleteScrapingConfig", error);
    res.status(500).send("Internal server error");
  }
};

export const updateScrapingConfig = async (req: Request, res: Response) => {
  try {
    const { name, note, url, scrapeIntervalMinute, emailNotification } =
      req.body;
    const { configId } = req.params;

    // ------- Selectors --------
    const { selectorsMetadata }: { selectorsMetadata: ISelectorMetadata[] } =
      req.body;

    // if selector NOT in metadata (no selectorId), then make new selector
    if (selectorsMetadata) {
      for (const selector of selectorsMetadata) {
        if (!selector.selectorId) {
          const savedSelectorId = await createSelector();
          if (savedSelectorId) {
            selector.selectorId = savedSelectorId;
          } else {
            throw new Error("Error in creating selector");
          }
        }
      }
    }

    const config = await ScrapeMetadataModel.findByIdAndUpdate(configId, {
      name,
      note,
      url,
      scrapeIntervalMinute,
      emailNotification,
      selectorsMetadata,
    }).exec();

    if (!config) {
      return res.status(404).send("Scraping Configuration not found");
    }

    // setNextScrapeTimeout(0); // FIXME

    res.status(200).send(config);
  } catch (error) {
    console.error("Error in updateScrapingConfig", error);
    res.status(500).send("Internal server error");
  }
};
