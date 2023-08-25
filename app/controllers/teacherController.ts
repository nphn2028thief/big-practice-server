import { Request, Response } from "express";
import { ITeacherRequest } from "../types/teacher";
import handleConfig from "../configs/handleConfig";
import teacherSchema from "../models/teacherSchema";
import classSchema from "../models/classSchema";
import subjectSchema from "../models/subjectSchema";
import bcrypt from "bcrypt";

class TeacherController {
  public async createTeacher(req: Request, res: Response) {
    const {
      fullName,
      subjects,
      class: classSchool,
      email,
      password,
      phone,
      gender,
    } = req.body as ITeacherRequest;

    if (
      !fullName ||
      !subjects ||
      !classSchool ||
      !email ||
      !password ||
      !phone ||
      !gender
    ) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const emailExist = await teacherSchema.findOne({ email });

      if (emailExist) {
        return handleConfig.response.conflict(res, "Email already exist!");
      }

      const classForTeacher = await classSchema.findOne({ name: classSchool });

      if (!classForTeacher) {
        return handleConfig.response.notFound(res, "Class not found!")
      }

      let subjectList: any[] = [];

      subjects.forEach(async (subject) => {
        const subjectData = await subjectSchema.findOne({ name: subject });

        if (subjectData) {
          subjectList.push(subjectData._id);
        }
      });

      const hash = await bcrypt.hash(password, 11);

      const teacherData = await teacherSchema.create({
        avatar: "",
        fullName,
        subjects: subjectList,
        class: classForTeacher._id,
        email,
        password: hash,
        phone,
        gender,
      });

      return handleConfig.response.success(
        res,
        "Create teacher successfully!",
        "data",
        teacherData
      );
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async getTeachers(req: Request, res: Response) {
    const keyword = req.query.keyword as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    try {
      const teacher = await teacherSchema
        .find()
        .skip(page - 1)
        .limit(limit);
    } catch (error) {}
  }

  public async getTeacherById(req: Request, res: Response) {}

  public async updateTeacher(req: Request, res: Response) {}
  
  public async deleteTeacher(req: Request, res: Response) {}
}

export default new TeacherController();
