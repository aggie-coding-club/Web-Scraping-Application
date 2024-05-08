import { Document, model, Schema } from "mongoose";

export interface IData {
  timestamp: Date;
  content: string;
}

export interface ISelector extends Document {
  data?: IData[];
}

const selectorSchema = new Schema<ISelector>({
  data: [
    {
      _id: false,
      timestamp: { type: Date, required: true },
      content: { type: String, required: true },
    },
  ],
});

export const SelectorModel = model<ISelector>("Selector", selectorSchema);
