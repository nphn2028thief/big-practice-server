import { ObjectId } from 'mongoose';

export interface ITeacherSchema {
  avatar: string;
  fullName: string;
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
    _id: string;
    name: string;
  }[];
  classSchool: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
}
