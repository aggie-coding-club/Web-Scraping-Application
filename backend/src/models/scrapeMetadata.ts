import { Document, model, Schema } from "mongoose";

interface ISelectorMetadata extends Document {
  name: string;
  selector: string;
  objectId: Schema.Types.ObjectId;
}

interface IScrapeMetadata extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  note: string;
  url: string;
  status: string;
  timeToScrape: Date;
  scrapeIntervalMinute: number;
  emailNotification: string;
  lastSuccessfulScrape: Date;
  lastDataChangeTime: Date; //
  selectors: ISelectorMetadata[];
}

const scrapeMetadataSchema = new Schema<IScrapeMetadata>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    note: { type: String },
    url: { type: String, required: true },
    status: { type: String, default: "pending" },
    timeToScrape: { type: Date, required: true },
    scrapeIntervalMinute: { type: Number, required: true },
    emailNotification: { type: String, required: true },
    lastSuccessfulScrape: { type: Date },
    selectors: [
      {
        name: { type: String, required: true },
        selector: { type: String, required: true },
        objectId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Selector",
        },
      },
    ],
  },
  { timestamps: true }
);

const ScrapeMetadataModel = model<IScrapeMetadata>(
  "ScrapeMetadata",
  scrapeMetadataSchema
);
