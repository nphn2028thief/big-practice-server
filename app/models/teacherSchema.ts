import { Schema, model } from "mongoose";

import { ITeacherSchema } from "../types/teacher";

const TeacherSchema = new Schema<ITeacherSchema>({
  avatar: { type: String, default: "" },
  fullName: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  classSchool: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
});

export default model<ITeacherSchema>("Teacher", TeacherSchema);
