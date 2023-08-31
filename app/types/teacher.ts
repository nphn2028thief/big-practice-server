import { ObjectId } from "mongoose";

export interface ITeacherSchema {
  avatar: string;
  fullName: string;
  // subjects: ObjectId[];
  subjects: ObjectId[];
  classSchool: ObjectId;
  email: string;
  password: string;
  phone: string;
  gender: string;
}

export interface ITeacherRequest {
  fullName: string;
  subjects: {
    name: string;
  }[];
  classSchool: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
}
