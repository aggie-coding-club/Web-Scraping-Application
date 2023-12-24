import { RequestHandler } from "express";
import NoteModel from "../models/obj";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const { configId } = req.params;

    try {
        // throw createHttpError(401); // For testing error handling
        assertIsDefined(configId);

        const notes = await NoteModel.find({ configId }).exec();
        res.status(200).json(notes); // OK status
    } catch (error) {
        next(error);
    }
};

export const createNote = async (configId: mongoose.Types.ObjectId, text: ScrapingConfigObject): Promise<void> => {
    try {
        await NoteModel.create({
            configId: configId,
            // url: url,
            text: text,
        });
    } catch (error) {
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
