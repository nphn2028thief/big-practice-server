import { Schema, model } from "mongoose";
import { IClassSchema } from "../types/class";

const ClassSchema = new Schema<IClassSchema>({
  name: { type: String, required: true },
});

export default model<IClassSchema>("Class", ClassSchema);
