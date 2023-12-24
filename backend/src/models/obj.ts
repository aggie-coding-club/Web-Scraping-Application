import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    configId: { type: Schema.Types.ObjectId, ref: "ScrapeConfig", required: true },
    scrapedData: [{ type: Schema.Types.Mixed }],
});

type Note = InferSchemaType<typeof noteSchema>;
export default model<Note>("Obj", noteSchema);

// const noteSchema = new Schema(
//     {
//         // userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//         configId: { type: Schema.Types.ObjectId, ref: "ScrapeConfig", required: true },
//         text: { type: Schema.Types.Mixed }, // later update this to specify key and value are strings and also change name to scrapedData
//         // url: { type: String, required: true },
//         // scrape_parameters: { type: String, required: true },
//     }
//     // { timestamps: true }
// );
