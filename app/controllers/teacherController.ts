import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import handleConfig from '../configs/handleConfig';
import classSchema from '../models/classSchema';
import teacherSchema from '../models/teacherSchema';
import { ITeacherRequest } from '../types/teacher';

class TeacherController {
  public async createTeacher(req: Request, res: Response) {
    const { fullName, subjects, classSchool, email, password, phone, gender } = req.body as ITeacherRequest;

    if (!fullName || !subjects || !classSchool || !email || !password || !phone || !gender) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const emailExist = await teacherSchema.findOne({ email });

      if (emailExist) {
        return handleConfig.response.conflict(res, 'Email already exist!');
      }

      const classData = await classSchema.findOne({ name: classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, 'Class is not found!');
      }

      const hash = await bcrypt.hash(password, 11);

      const teacherData = await teacherSchema.create({
        avatar: '',
        fullName,
        subjects,
        classSchool: classData._id,
        email,
        password: hash,
        phone,
        gender,
      });

      return handleConfig.response.success(res, 'Create teacher successfully!', 'data', teacherData);
    } catch (error) {
      return handleConfig.response.error(res, 'Create teacher failure!');
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
              { fullName: { $regex: `.*${keyword}.*`, $options: 'i' } },
              { email: { $regex: `.*${keyword}.*`, $options: 'i' } },
            ],
          })
          .populate('subjects', '-__v')
          .populate('classSchool', '-__v');
      } else {
        teachers = await teacherSchema.find().populate('subjects', '-__v').populate('classSchool', '-__v');
      }

      return res.json(teachers);
    } catch (error) {
      return handleConfig.response.error(res, 'Get teachers failure!');
    }
  }

  public async updateTeacher(req: Request, res: Response) {
    const { teacherId } = req.params;
    const { fullName, subjects, classSchool, email, password, phone, gender } = req.body;

    try {
      const classData = await classSchema.findOne({ name: classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, 'Class is not found!');
      }

      const teacherUpdated = await teacherSchema.findByIdAndUpdate(
        {
          _id: teacherId,
        },
        {
          $set: {
            fullName,
            subjects,
            classSchool: classData._id,
            email,
            password,
            phone,
            gender,
          },
        },
        {
          new: true,
        },
      );

      return handleConfig.response.success(res, 'Update teacher successfully!', 'data', teacherUpdated);
    } catch (error) {
      console.log(error);
      return handleConfig.response.error(res, 'Update teacher failure!');
    }
  }

  public async deleteTeacher(req: Request, res: Response) {
    const { teacherId } = req.params;

    if (!teacherId) {
      return handleConfig.response.badRequest(res);
    }

    try {
      await teacherSchema.findByIdAndDelete(teacherId);

      return handleConfig.response.success(res, 'Delete teacher successfully!', 'teacherId', teacherId);
    } catch (error) {
      return handleConfig.response.error(res, 'Delete teacher failure!');
    }
  }
}

export default new TeacherController();
