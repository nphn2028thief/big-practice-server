import { ObjectId } from 'mongoose';

export interface IStudentSchema {
  avatar: string;
  fullName: string;
  classSchool: ObjectId;
  email: string;
  password: string;
  phone: string;
  gender: string;
}
