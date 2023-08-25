import { ObjectId } from "mongoose";

export interface ITeacherSchema {
  avatar: string;
  fullName: string;
  subjects: ObjectId[];
  class: ObjectId;
  email: string;
  password: string;
  phone: string;
  gender: string;
}

export interface ITeacherRequest {
  fullName: string;
  subjects: ObjectId[];
  class: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
}
