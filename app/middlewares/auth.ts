import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import envConfig from '../configs/envConfig';
import handleConfig from '../configs/handleConfig';
import { IVerifyTokenData } from '../types/auth';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return handleConfig.response.unauthorized(res, 'Access denied!');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return handleConfig.response.unauthorized(res, 'Access denied!');
  }

  Jwt.verify(token, envConfig.accessTokenSecret, (err, payload) => {
    if (err?.name === 'TokenExpiredError') {
      return handleConfig.response.error(res, 'Login session has expired, please login again!', 'TokenExpiredError');
    } else if (err?.name) {
      return handleConfig.response.error(res, err.message);
    }

    const { userId } = payload as IVerifyTokenData;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return handleConfig.response.badRequest(res, 'User is not valid!');
    }

    req.userId = userId;
    next();
  });
};
