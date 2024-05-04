import { Document, model, Schema } from "mongoose";

interface IData {
  timestamp: Date;
  value: string;
}

export interface ISelector extends Document {
  data?: IData[];
}

const selectorSchema = new Schema<ISelector>({
  data: [
    {
      timestamp: { type: Date, required: true },
      value: { type: String, required: true },
    },
  ],
});

export const SelectorModel = model<ISelector>("Selector", selectorSchema);
