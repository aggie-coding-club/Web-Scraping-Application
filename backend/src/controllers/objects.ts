import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";

import NoteModel from "../models/obj";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNote: RequestHandler = async (req, res, next) => {
    const { userId } = req.session;
    const { configId } = req.params;

    try {
        assertIsDefined(userId, "User ID must be defined");
        assertIsDefined(configId, "Config ID must be defined");

        const note = await NoteModel.findOne({ configId }).exec();
        if (!note) {
            throw createHttpError(404, "Not found");
        }

        if (note.userId.toString() !== userId.toString()) {
            throw createHttpError(403, "Forbidden");
        }

        res.status(200).send(note);
        // res.status(200).json(note.scrapedData.map((data) => JSON.stringify(data, null, 2)).join(",\n"));
    } catch (error) {
        next(error);
    }
};

export const createNote = async (userId: mongoose.Types.ObjectId, configId: mongoose.Types.ObjectId): Promise<void> => {
    try {
        await NoteModel.create({ userId, configId, scrapedData: [] });
    } catch (error) {
        console.error("Error creating note:", error);
        throw createHttpError(500, "Error creating note");
    }
};
