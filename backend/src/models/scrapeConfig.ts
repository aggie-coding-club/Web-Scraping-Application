import mongoose from "mongoose";

const scrapeConfigSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: { type:String, required: true },
  parameters: { type:mongoose.Schema.Types.Mixed, required: true },
  lastScraped: Date,
  timeToScrape: { type:Date, required: true },
  scrapeIntervalMinute: { type:Number, required: true },
  scrapedData: mongoose.Schema.Types.Mixed,
});

const ScrapeConfig = mongoose.model("ScrapeConfig", scrapeConfigSchema);
export default ScrapeConfig;
