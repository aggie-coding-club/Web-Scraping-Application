import { Document, model, Schema } from "mongoose";

interface IData {
  timestamp: Date;
  value: string;
}

export interface ISelector extends Document {
  key: string;
  name: string;
  selectorValue: string;
  data?: IData[];
}

const selectorSchema = new Schema<ISelector>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  selectorValue: { type: String, required: true },
  data: [
    {
      timestamp: { type: Date, required: true },
      value: { type: String, required: true },
    },
  ],
});

export const SelectorModel = model<ISelector>("Selector", selectorSchema);
