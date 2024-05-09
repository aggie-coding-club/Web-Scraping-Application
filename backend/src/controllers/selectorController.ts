import { Schema } from "mongoose";
import { ISelector, SelectorModel } from "../models/selectorModel";
import mongoose from "mongoose";
import { Request, Response } from "express";

/**
 *
 * @returns Metadata loaded with newly created id
 */
export const createSelector =
  async (): Promise<Schema.Types.ObjectId | null> => {
    try {
      const mySelector = new SelectorModel({
        data: [],
      });

      const savedSelector = await mySelector.save();

      if (!savedSelector) {
        return null;
      }

      return savedSelector._id;
    } catch (error) {
      console.error("Error in createSelector", error);
    }

    return null;
  };

export const getSelectorByObjectId = async (
  objectId: mongoose.Schema.Types.ObjectId
): Promise<ISelector | null> => {
  try {
    return await SelectorModel.findById(objectId);
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

/* DELETE ME!!!! Only for Debugging */
export const deleteAllSelectors = async (req: Request, res: Response) => {
  try {
    await SelectorModel.deleteMany({});
    res.status(200).send();
  } catch (error) {
    console.error("Error in deleting all selectors:", error);
    throw error;
  }
};
