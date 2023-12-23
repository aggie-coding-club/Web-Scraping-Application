import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema(
    {
        scrapeConfig: { type: Schema.Types.ObjectId, ref: "ScrapeConfig", required: true },
        scrapedData: { type: Schema.Types.Mixed }, // later update this to specify key and value are strings
    },
    { timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;
export default model<Note>("Obj", noteSchema);
