import { Schema, model } from "mongoose";

const scrapeConfigSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        url: { type: String, required: true },
        parameters: { type: Schema.Types.Mixed, required: true },
        timeToScrape: { type: Date, required: true },
        scrapeIntervalMinute: { type: Number, required: true },
    },
    { timestamps: true }
);

const ScrapeConfig = model("ScrapeConfig", scrapeConfigSchema);
export default ScrapeConfig;

scrapeConfigSchema.pre("save", function (next) {
    this.timeToScrape = new Date(Date.now() + this.scrapeIntervalMinute * 60000);
    next();
});
