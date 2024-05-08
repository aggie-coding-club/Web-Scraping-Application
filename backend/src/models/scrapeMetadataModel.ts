import { Document, model, Schema } from "mongoose";

export interface ISelectorMetadata {
  name: string;
  selectorValue: string;
  selectorId: Schema.Types.ObjectId; // make optional so can load later
}

export interface IScrapeMetadata extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  description: string;
  url: string;
  status: string;
  timeToScrape: Date;
  scrapeIntervalMinute: number;
  emailNotification: string;
  lastSuccessfulScrape: Date;
  lastDataChangeTime: Date; //
  selectorsMetadata: ISelectorMetadata[];
}

const scrapeMetadataSchema = new Schema<IScrapeMetadata>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    status: { type: String, default: "pending" },
    timeToScrape: { type: Date, required: true },
    scrapeIntervalMinute: { type: Number, required: true },
    emailNotification: { type: String, required: true },
    lastSuccessfulScrape: { type: Date },
    selectorsMetadata: [
      {
        _id: false,
        name: { type: String, required: true },
        selectorValue: { type: String, required: true },
        selectorId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Selector",
        },
      },
    ],
  },
  { timestamps: true }
);

export const ScrapeMetadataModel = model<IScrapeMetadata>(
  "ScrapeMetadata",
  scrapeMetadataSchema
);
