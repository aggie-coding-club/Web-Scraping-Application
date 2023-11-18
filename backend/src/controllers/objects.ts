import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

// get all
export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    // throw createHttpError(401); // For testing error handling
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes); // OK status
  } catch (error) {
    next(error);
  }
};

// get singular
export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid object id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Object not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

// create
export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    if (!title) {
      throw createHttpError(400, "Must have a title"); // Bad request
    }
    const newNote = await NoteModel.create({
      title: title,
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
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid object id");
    }

    if (!newTitle) {
      throw createHttpError(400, "Must have a title"); // Bad request
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Object not found");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async(req, res, next) => {
  const noteId = req.params.noteId;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid object id");
    }

    const deletedNote = await NoteModel.findByIdAndDelete(noteId);

    if (!deletedNote) {
      throw createHttpError(404, "Object not found");
    }

    res.sendStatus(204); // Deletion successful

  } catch (error) {
    next(error);
  }
}

