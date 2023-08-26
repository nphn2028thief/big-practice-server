import { Request, Response } from 'express';
import { ERole, ISignInRequest, ISignUpRequest, IUserSchema } from '../types/auth';
import handleConfig from '../configs/handleConfig';
import userSchema from '../models/userSchema';
import bcrypt from 'bcrypt';
import { signAccessToken } from '../jwt';

class AuthController {
  public async signUp(req: Request, res: Response) {
    const { email, password, confirmPassword, firstName, lastName } = req.body as ISignUpRequest;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return handleConfig.response.badRequest(res);
    }

    if (password !== confirmPassword) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const emailExist = await userSchema.findOne({ email });

      if (emailExist) {
        return handleConfig.response.badRequest(res, 'Email already exist!');
      }

      const hash = await bcrypt.hash(password, 12);

      await userSchema.create({
        email,
        password: hash,
        firstName,
        lastName,
        role: ERole.ADMIN,
      });

      return res.json({
        message: 'Sign up successfully!',
      });
    } catch (error) {
      return handleConfig.response.error(res);
    }
  }

  public async signIn(req: Request, res: Response) {
    const { email, password } = req.body as ISignInRequest;

    if (!email || !password) {
      return handleConfig.response.badRequest(res);
    }

    try {
      const userExist = await userSchema.findOne({ email });

      if (!userExist) {
        return handleConfig.response.badRequest(res, 'Email or password is not correct!');
      }

      const match = await bcrypt.compare(password, userExist.password);

      if (!match) {
        return handleConfig.response.badRequest(res, 'Email or password is not correct!');
      }

      const accessToken = await signAccessToken(userExist._id);

      return handleConfig.response.success(res, 'Sign in successfully!', 'data', { role: userExist.role, accessToken });
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
