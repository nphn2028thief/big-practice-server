import { Request, Response } from "express";
import bcrypt from "bcrypt";

import {
  ERole,
  ISignInRequest,
  ISignUpRequest,
} from "../types/auth";
import handleConfig from "../configs/handleConfig";
import userSchema from "../models/userSchema";
import { signAccessToken } from "../jwt";
import { signInValidate, signUpValidate } from "../validations/auth";

class AuthController {
  public async signUp(req: Request, res: Response) {
    const { error, value } = signUpValidate(req.body as ISignUpRequest);

    if (error) {
      return handleConfig.response.badRequest(res, error.details[0].message);
    }

    try {
      const emailExist = await userSchema.findOne({ email: value.email });

      if (emailExist) {
        return handleConfig.response.badRequest(res, "Email already exist!");
      }

      const hash = await bcrypt.hash(value.password, 12);

      await userSchema.create({
        email: value.email,
        password: hash,
        firstName: value.firstName,
        lastName: value.lastName,
        role: ERole.ADMIN,
      });

      return res.json({
        message: "Sign up successfully!",
      });
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async signIn(req: Request, res: Response) {
    const { error, value } = signInValidate(req.body as ISignInRequest);

    if (error) {
      return handleConfig.response.badRequest(res, error.details[0].message);
    }

    try {
      const userExist = await userSchema.findOne({ email: value.email });

      if (!userExist) {
        return handleConfig.response.badRequest(
          res,
          "Email or password is not correct!"
        );
      }

      const match = await bcrypt.compare(value.password, userExist.password); 

      if (!match) {
        return handleConfig.response.badRequest(
          res,
          "Email or password is not correct!"
        );
      }

      const accessToken = await signAccessToken(userExist._id);

      return handleConfig.response.success(
        res,
        "Sign in successfully!",
        "data",
        { role: userExist.role, accessToken }
      );
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async getMe(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const user = await userSchema.findById(userId);

      if (!user) {
        return handleConfig.response.unauthorized(res);
      }

      return res.json({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }
}

export default new AuthController();
