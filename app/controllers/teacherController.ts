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

      const classForTeacher = await classSchema.findOne({ name: classSchool });

      if (!classForTeacher) {
        return handleConfig.response.notFound(res, 'Class not found!');
      }

      const hash = await bcrypt.hash(password, 11);

      const teacherData = await teacherSchema.create({
        avatar: '',
        fullName,
        subjects,
        classSchool: classForTeacher._id,
        email,
        password: hash,
        phone,
        gender,
      });

      return handleConfig.response.success(res, 'Create teacher successfully!', 'data', teacherData);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async getTeachers(req: Request, res: Response) {
    const keyword = req.query.q;

    try {
      let teacher;

      if (keyword) {
        teacher = await teacherSchema
          .find({
            $or: [
              { fullName: { $regex: `.*${keyword}.*`, $options: 'i' } },
              { email: { $regex: `.*${keyword}.*`, $options: 'i' } },
            ],
          })
          .populate('subjects', '-__v')
          .populate('classSchool', '-__v');
      } else {
        teacher = await teacherSchema.find().populate('subjects', '-__v').populate('classSchool', '-__v');
      }

      return res.json(teacher);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async updateTeacher(req: Request, res: Response) {
    const { teacherId } = req.params;
    const { fullName, subjects, classSchool, email, password, phone, gender } = req.body;

    try {
      const classSchoolData = await classSchema.findOne({ name: classSchool });

      if (!classSchoolData) {
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
            classSchool: classSchoolData._id,
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

      return handleConfig.response.success(res, 'Update teacher successfully!');
    } catch (error) {
      console.log(error);
      return handleConfig.response.error(res);
    }
  }

  public async deleteTeacher(req: Request, res: Response) {
    const { teacherId } = req.params;

    if (!teacherId) {
      return handleConfig.response.badRequest(res);
    }

    try {
      await teacherSchema.findByIdAndDelete(teacherId);

      return handleConfig.response.success(res, 'Delete teacher successfully!');
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }
}

export default new TeacherController();
