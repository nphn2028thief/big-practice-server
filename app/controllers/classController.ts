import { Request, Response } from "express";
import { IClassSchema } from "../types/class";
import handleConfig from "../configs/handleConfig";
import classSchema from "../models/classSchema";

class ClassController {
  public async createClass(req: Request, res: Response) {
    const { name } = req.body as IClassSchema;

    if (!name) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const classExist = await classSchema.findOne({ name });

      if (classExist) {
        return handleConfig.response.conflict(res, "Class already exist!");
      }

      const classData = await classSchema.create({ name });

      return handleConfig.response.success(
        res,
        "Create class successfully",
        "data",
        classData
      );
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }
  
  public async getClasses(req: Request, res: Response) {
    try {
      const classExist = await classSchema.find();
      return res.json(classExist);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }
}

export default new ClassController();
