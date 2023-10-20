import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import handleConfig from "../configs/handleConfig";
import subjectSchema from "../models/subjectSchema";
import classSchema from "../models/classSchema";
import teacherSchema from "../models/teacherSchema";
import { ITeacherRequest } from "../types/teacher";
import { createTeacherValidate } from "../validations/teacher";

class TeacherController {
  public async createTeacher(req: Request, res: Response) {
    const { error, value } = createTeacherValidate(req.body as ITeacherRequest);

    if (error) {
      return handleConfig.response.badRequest(res, error.details[0].message);
    }

    try {
      const emailExist = await teacherSchema.findOne({ email: value.email });

      if (emailExist) {
        return handleConfig.response.conflict(res, "Email already exist!");
      }

      const classData = await classSchema.findOne({ name: value.classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, "Class is not found!");
      }

      const handleSubject = async () => {
        const newSubjects = value.subjects.map(
          (subject: { name: string }) => subject.name
        );
        return newSubjects;
      };

      const results = await handleSubject();

      const subjectsFound = await subjectSchema.find({
        name: { $in: results },
      });

      const hash = await bcrypt.hash(value.password, 11);

      const teacherData = await teacherSchema.create({
        avatar: "",
        fullName: value.fullName,
        subjects: subjectsFound,
        classSchool: classData._id,
        email: value.email,
        password: hash,
        phone: value.phone,
        gender: value.gender,
      });

      return handleConfig.response.success(
        res,
        "Create teacher successfully!",
        "data",
        teacherData
      );
    } catch (error) {
      return handleConfig.response.error(res, "Create teacher failure!");
    }
  }

  public async getTeachers(req: Request, res: Response) {
    const keyword = req.query.q;

    try {
      let teachers;

      if (keyword) {
        teachers = await teacherSchema
          .find({
            $or: [
              { fullName: { $regex: `.*${keyword}.*`, $options: "i" } },
              { email: { $regex: `.*${keyword}.*`, $options: "i" } },
            ],
          })
          .select("-password")
          .populate("subjects", "-__v")
          .populate("classSchool", "-__v");
      } else {
        teachers = await teacherSchema
          .find()
          .select("-password")
          .populate("subjects", "-__v")
          .populate("classSchool", "-__v");
      }

      return res.json(teachers);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async getTeacherById(req: Request, res: Response) {
    const { teacherId } = req.params;

    if (!teacherId && !mongoose.Types.ObjectId.isValid(teacherId)) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const teacher = await teacherSchema.findById(teacherId);

      if (!teacher) {
        return handleConfig.response.notFound(res, "Teacher not found!");
      }

      return res.json(teacher);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async updateTeacher(req: Request, res: Response) {
    const { teacherId } = req.params;
    const { fullName, subjects, classSchool, email, phone, gender } =
      req.body as Omit<ITeacherRequest, "password">;

    if (!subjects.length) {
      return handleConfig.response.badRequest(res);
    }

    for (let key in subjects) {
      if (!subjects[key].name) {
        return handleConfig.response.badRequest(res);
      }
    }

    try {
      const classData = await classSchema.findOne({ name: classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, "Class is not found!");
      }

      const handleSubject = async () => {
        const newSubjects = subjects.map((subject) => subject.name);
        return newSubjects;
      };

      const results = await handleSubject();

      const subjectsFound = await subjectSchema.find({
        name: { $in: results },
      });

      const teacherUpdated = await teacherSchema.findByIdAndUpdate(
        {
          _id: teacherId,
        },
        {
          $set: {
            fullName,
            subjects: subjectsFound,
            classSchool: classData._id,
            email,
            phone,
            gender,
          },
        },
        {
          new: true,
        }
      );

      return handleConfig.response.success(
        res,
        "Update teacher successfully!",
        "data",
        teacherUpdated
      );
    } catch (error) {
      return handleConfig.response.error(res, "Update teacher failure!");
    }
  }

  public async deleteTeacher(req: Request, res: Response) {
    const { teacherId } = req.params;

    if (!teacherId) {
      return handleConfig.response.badRequest(res);
    }

    try {
      await teacherSchema.findByIdAndDelete(teacherId);

      return handleConfig.response.success(
        res,
        "Delete teacher successfully!",
        "teacherId",
        teacherId
      );
    } catch (error) {
      return handleConfig.response.error(res, "Delete teacher failure!");
    }
  }
}

export default new TeacherController();
