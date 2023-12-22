// This file defines the data schema for 'note'. Change this for any schema we need for the application
import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    url: { type: String, required: true },
    scrape_parameters: { type: String, required: true },
    text: { type: String },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Obj", noteSchema);
