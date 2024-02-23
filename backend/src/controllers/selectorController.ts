import { ISelector, SelectorModel } from "../models/selectorModel";
import { ISelectorMetadata } from "../models/scrapeMetadataModel";
import mongoose from "mongoose";

export const createSelector = async (
  selector: ISelector
): Promise<ISelectorMetadata | null> => {
  try {
    const mySelector = new SelectorModel({
      key: selector.key,
      name: selector.name,
      selectorValue: selector.selectorValue,
      data: [],
    });

    const savedSelector = await mySelector.save();

    const metadata: ISelectorMetadata = {
      key: selector.key,
      name: selector.name,
      selectorValue: selector.selectorValue,
      objectId: savedSelector._id,
    };

    return metadata;
  } catch (error) {
    console.error("Error in createSelector", error);
  }

  return null;
};

export const getSelectorByObjectId = async (
  objectId: mongoose.Schema.Types.ObjectId
): Promise<ISelector | null> => {
  try {
    const selector: ISelector | null = await SelectorModel.findById(objectId);
    return selector;
  } catch (error) {
    console.error("Error in getSelector:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// pushes {timestamp, value} to end of selector.data
export const updateSelector = async (
  objectId: mongoose.Types.ObjectId,
  timestamp: Date,
  value: string
) => {
  try {
    // Find the selector by its _id and update its properties
    const updatedSelector = await SelectorModel.findByIdAndUpdate(
      objectId,
      { $push: { data: { timestamp, value } } }, // push to data array
      { new: true } // return the updated selector, not the old one
    );

    return updatedSelector;
  } catch (error) {
    console.error("Error in updateSelector:", error);
    throw error;
  }
};
