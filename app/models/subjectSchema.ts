import { Schema, model } from "mongoose";

import { ISubjectSchema } from "../types/subject";

const SubjectSchema = new Schema<ISubjectSchema>({
  name: { type: String, required: true },
});

export default model<ISubjectSchema>("Subject", SubjectSchema);
