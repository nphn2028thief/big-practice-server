import { Request, Response } from 'express';
import { IStudentSchema } from '../types/student';
import handleConfig from '../configs/handleConfig';
import studentSchema from '../models/studentSchema';
import classSchema from '../models/classSchema';
import bcrypt from 'bcrypt';

class StudentController {
  public async createStudent(req: Request, res: Response) {
    const { fullName, classSchool, email, password, phone, gender } = req.body as IStudentSchema;

    if (!fullName || !classSchool || !email || !password || !phone || !gender) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const emailExist = await studentSchema.findOne({ email });

      if (emailExist) {
        return handleConfig.response.conflict(res, 'Email already exist!');
      }

      const classData = await classSchema.findOne({ name: classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, 'Class is not found!');
      }

      const hash = await bcrypt.hash(password, 12);

      const studentData = await studentSchema.create({
        fullName,
        classSchool: classData._id,
        email,
        password: hash,
        phone,
        gender,
      });

      return handleConfig.response.success(res, 'Create student successfully!', 'data', studentData);
    } catch (error) {
      return handleConfig.response.error(res, 'Create student failure!');
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
              { fullName: { $regex: `.*${keyword}.*`, $options: 'i' } },
              { email: { $regex: `.*${keyword}.*`, $options: 'i' } },
            ],
          })
          .populate('classSchool', '-__v');
      } else {
        students = await studentSchema.find().populate('classSchool', '-__v');
      }

      return res.json(students);
    } catch (error) {
      return handleConfig.response.error(res, 'Get students failure!');
    }
  }

  public async updateStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const { avatar, fullName, classSchool, email, password, phone, gender } = req.body as IStudentSchema;

    try {
      const classData = await classSchema.findOne({ name: classSchool });

      if (!classData) {
        return handleConfig.response.notFound(res, 'Class is not found!');
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
            password,
            phone,
            gender,
          },
        },
        {
          new: true,
        },
      );

      return handleConfig.response.success(res, 'Update student successfully!', 'data', studentUpdated);
    } catch (error) {
      return handleConfig.response.error(res, 'Update student failure!');
    }
  }

  public async deleteStudent(req: Request, res: Response) {
    const { studentId } = req.params;

    if (!studentId) {
      return handleConfig.response.badRequest(res);
    }

    try {
      await studentSchema.findByIdAndDelete(studentId);

      return handleConfig.response.success(res, 'Delete student successfully!', 'studentId', studentId);
    } catch (error) {
      return handleConfig.response.error(res, 'Delete student failure!');
    }
  }
}

export default new StudentController();
