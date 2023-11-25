import mongoose from "mongoose";

const scrapeConfigSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: String,
  parameters: mongoose.Schema.Types.Mixed,
  lastScraped: Date,
  scrapedData: mongoose.Schema.Types.Mixed,
});

const ScrapeConfig = mongoose.model("ScrapeConfig", scrapeConfigSchema);
export default ScrapeConfig;
