import { Schema, model } from 'mongoose';

import { IStudentSchema } from '../types/student';

const StudentSchema = new Schema<IStudentSchema>({
  avatar: { type: String, default: '' },
  fullName: { type: String, required: true },
  classSchool: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
});

export default model<IStudentSchema>('Student', StudentSchema);
