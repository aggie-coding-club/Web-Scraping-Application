import { Document, model, Schema } from "mongoose";

interface IData {
  timestamp: Date;
  value: string;
}

interface ISelector extends Document {
  name: string;
  selector: string;
  data: IData[];
}

const selectorSchema = new Schema<ISelector>({
  name: { type: String, required: true },
  selector: { type: String, required: true },
  data: [
    {
      timestamp: { type: Date, required: true },
      value: { type: String, required: true },
    },
  ],
});

const SelectorModel = model<ISelector>("Selector", selectorSchema);
