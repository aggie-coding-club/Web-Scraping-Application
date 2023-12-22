import { RequestHandler } from "express";
import NoteModel from "../models/obj";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

// get all
export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        // throw createHttpError(401); // For testing error handling
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(notes); // OK status
    } catch (error) {
        next(error);
    }
};

// get singular
export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid object id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Object not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this obj");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

interface CreateNoteBody {
    url?: string;
    text?: string;
    scrape_parameters?: string;
}

// create
export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const url = req.body.url;
    const text = req.body.text;
    const scrape_parameters = req.body.scrape_parameters;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!url) {
            throw createHttpError(400, "Must have an URL"); // Bad request
        }
        if (!scrape_parameters) {
            throw createHttpError(400, "Must have scrape parameters"); // Bad request
        }
        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            url: url,
            scrape_parameters: scrape_parameters,
            text: text,
        });
        res.status(201).json(newNote); // new resource created
    } catch (error) {
        next(error);
    }
};

interface UpdateNoteParams {
    noteId: string;
}

interface UpdateNoteBody {
    url?: string;
    scrape_parameters?: string;
    text?: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newURL = req.body.url;
    const newScrapeParameters = req.body.scrape_parameters;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid object id");
        }

        if (!newURL) {
            throw createHttpError(400, "Must have an URL"); // Bad request
        }

        if (!newScrapeParameters) {
            throw createHttpError(400, "Must have scrape parameters"); // Bad request
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Object not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this obj");
        }

        note.url = newURL;
        note.scrape_parameters = newScrapeParameters;
        note.text = newText;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid object id");
        }

        const note = await NoteModel.findByIdAndDelete(noteId);

        if (!note) {
            throw createHttpError(404, "Object not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this obj");
        }

        res.sendStatus(204); // Deletion successful
    } catch (error) {
        next(error);
    }
};
