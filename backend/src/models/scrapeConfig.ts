import { Schema, model, Document } from "mongoose";

interface IScrapeConfig extends Document {
    userId: Schema.Types.ObjectId;
    url: string;
    scrapeParameters: any;
    timeToScrape: Date;
    scrapeIntervalMinute: number;
}

const scrapeConfigSchema = new Schema<IScrapeConfig>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        url: { type: String, required: true },
        scrapeParameters: { type: Schema.Types.Mixed, required: true },
        timeToScrape: { type: Date, required: true },
        scrapeIntervalMinute: { type: Number, required: true },
    },
    { timestamps: true }
);

const ScrapeConfig = model<IScrapeConfig>("ScrapeConfig", scrapeConfigSchema);
export default ScrapeConfig;
