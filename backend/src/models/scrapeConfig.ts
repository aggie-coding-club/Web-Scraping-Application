import { Schema, model } from "mongoose";

const scrapeConfigSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        url: { type: String, required: true },
        parameters: { type: Schema.Types.Mixed, required: true },
        timeToScrape: { type: Date, required: true },
        scrapeIntervalMinute: { type: Number, required: true },
    },
    { timestamps: true }
);

const ScrapeConfig = model("ScrapeConfig", scrapeConfigSchema);
export default ScrapeConfig;
