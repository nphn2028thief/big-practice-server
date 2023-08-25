import { Schema, model } from "mongoose";
import { IUserSchema } from "../types/auth";

const UserSchema = new Schema<IUserSchema>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
});

export default model<IUserSchema>("User", UserSchema)