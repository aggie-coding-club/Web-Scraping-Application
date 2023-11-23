import { InferSchemaType, model, Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  scrapingConfigs: [{
    url: String,
    parameters: mongoose.Schema.Types.Mixed,
}],
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
