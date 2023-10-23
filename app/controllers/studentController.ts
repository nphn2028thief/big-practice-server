import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import handleConfig from "../configs/handleConfig";
import classSchema from "../models/classSchema";
import studentSchema from "../models/studentSchema";
import { createStudentValidate } from "../validations/student";
import { IStudentSchema } from "../types/student";

class StudentController {
  public async createStudent(req: Request, res: Response) {
    const { error, value } = createStudentValidate(req.body as IStudentSchema);

    if (error) {
      return handleConfig.response.badRequest(res, error.details[0].message);
    }

    try {
      const emailExist = await studentSchema.findOne({ email: value.email });

      if (emailExist) {
        return handleConfig.response.conflict(res, "Email already exist!");
      }

      const classData = await classSchema.findOne({ name: value.classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, "Class is not found!");
      }

      const hash = await bcrypt.hash(value.password, 12);

      const studentData = await studentSchema.create({
        fullName: value.fullName,
        classSchool: classData._id,
        email: value.email,
        password: hash,
        phone: value.phone,
        gender: value.gender,
      });

      return handleConfig.response.success(
        res,
        "Create student successfully!",
        "data",
        studentData
      );
    } catch (error) {
      return handleConfig.response.error(res, "Create student failure!");
    }
  }

  public async getStudents(req: Request, res: Response) {
    const keyword = req.query.q;

    try {
      let students;

      if (keyword) {
        students = await studentSchema
          .find({
            $or: [
              { fullName: { $regex: `.*${keyword}.*`, $options: "i" } },
              { email: { $regex: `.*${keyword}.*`, $options: "i" } },
            ],
          })
          .select("-password")
          .populate("classSchool", "-__v");
      } else {
        students = await studentSchema
          .find()
          .select("-password")
          .populate("classSchool", "-__v");
      }

      return res.json(students);
    } catch (error) {
      return handleConfig.response.error(res, "Get students failure!");
    }
  }

  public async getStudentById(req: Request, res: Response) {
    const { studentId } = req.params;

    if (!studentId && !mongoose.Types.ObjectId.isValid(studentId)) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const student = await studentSchema.findById(studentId);

      if (!student) {
        return handleConfig.response.notFound(res, "Student not found!");
      }

      return res.json(student);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async updateStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const { avatar, fullName, classSchool, email, phone, gender } =
      req.body as Omit<IStudentSchema, "password">;

    try {
      const classData = await classSchema.findOne({ name: classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, "Class is not found!");
      }

      const studentUpdated = await studentSchema.findByIdAndUpdate(
        {
          _id: studentId,
        },
        {
          $set: {
            avatar,
            fullName,
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
        "Update student successfully!",
        "data",
        studentUpdated
      );
    } catch (error) {
      return handleConfig.response.error(res, "Update student failure!");
    }
  }

  public async deleteStudent(req: Request, res: Response) {
    const { studentId } = req.params;

    if (!studentId) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const result = await studentSchema.findByIdAndDelete(studentId);

      if (result) {
        return handleConfig.response.success(
          res,
          "Delete student successfully!",
          "studentId",
          studentId
        );
      }

      return handleConfig.response.notFound(res);
    } catch (error) {
      return handleConfig.response.error(res, "Delete student failure!");
    }
  }
}

export default new StudentController();
