import { Request, Response } from "express";

import handleConfig from "../configs/handleConfig";
import subjectSchema from "../models/subjectSchema";
import { ISubjectSchema } from "../types/subject";

class SubjectController {
  public async createSubject(req: Request, res: Response) {
    const { name } = req.body as ISubjectSchema;

    if (!name) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const subjectExist = await subjectSchema.findOne({ name });

      if (subjectExist) {
        return handleConfig.response.conflict(res, "Subject already exist!");
      }

      const subjectData = await subjectSchema.create({ name });

      return handleConfig.response.success(
        res,
        "Create subject successfully",
        "data",
        subjectData
      );
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }
  
  public async getSubjects(req: Request, res: Response) {
    try {
      const subjectExist = await subjectSchema.find();
      return res.json(subjectExist);
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }
}

export default new SubjectController();
