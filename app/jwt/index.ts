import Jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import envConfig from '../configs/envConfig';

export const signAccessToken = async (userId: mongoose.Types.ObjectId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };

    const accessSecret: Jwt.Secret = envConfig.accessTokenSecret;

    const options: Jwt.SignOptions = {
      expiresIn: '2h',
    };

    Jwt.sign(payload, accessSecret, options, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token);
    });
  });
};
