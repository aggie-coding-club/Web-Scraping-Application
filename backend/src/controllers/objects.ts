import { RequestHandler } from "express";
import NoteModel from "../models/obj";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import ScrapeConfig from "../models/scrapeConfig";

export const getNote: RequestHandler = async (req, res, next) => {
    const { userId } = req.session;
    const { configId } = req.params;

    try {
        assertIsDefined(userId);
        assertIsDefined(configId);

        const note = await NoteModel.findOne({ configId }).exec();
        if (!note) {
            res.status(404).send("Not found");
        } else if (note.userId.toString() !== userId.toString()) {
            res.status(403).send("Forbidden");
        } else {
            res.status(200).json(note.scrapedData.map((scrapedObject) => JSON.stringify(scrapedObject, null, 2)).join(",\n"));
        }
    } catch (error) {
        next(error);
    }
};

export const createNote = async (userId: mongoose.Types.ObjectId, configId: mongoose.Types.ObjectId): Promise<void> => {
    try {
        await NoteModel.create({ userId, configId, scrapedData: [] });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// export const getNotes: RequestHandler = async (req, res, next) => {
//     const authenticatedUserId = req.session.userId;

//     try {
//         // throw createHttpError(401); // For testing error handling
//         assertIsDefined(authenticatedUserId);

//         const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
//         res.status(200).json(notes); // OK status
//     } catch (error) {
//         next(error);
//     }
// };

// interface CreateNoteBody {
//     url?: string;
//     text?: string;
//     scrape_parameters?: string;
// }

// export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
//     const url = req.body.url;
//     const text = req.body.text;
//     const scrape_parameters = req.body.scrape_parameters;
//     const authenticatedUserId = req.session.userId;

//     try {
//         assertIsDefined(authenticatedUserId);

//         if (!url) {
//             throw createHttpError(400, "Must have an URL"); // Bad request
//         }
//         if (!scrape_parameters) {
//             throw createHttpError(400, "Must have scrape parameters"); // Bad request
//         }
//         const newNote = await NoteModel.create({
//             userId: authenticatedUserId,
//             url: url,
//             scrape_parameters: scrape_parameters,
//             text: text,
//         });
//         res.status(201).json(newNote); // new resource created
//     } catch (error) {
//         next(error);
//     }
// };
