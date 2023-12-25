import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    configId: { type: Schema.Types.ObjectId, ref: "ScrapeConfig", required: true },
    scrapedData: [{ type: Schema.Types.Mixed }],
});

type Note = InferSchemaType<typeof noteSchema>;
export default model<Note>("Obj", noteSchema);
