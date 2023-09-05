import { Router } from 'express';

import { verifyToken } from '../middlewares/auth';
import AuthController from '../controllers/authController';

const authRoutes = (router: Router) => {
  router.post('/auth/signUp', AuthController.signUp);
  router.post('/auth/signIn', AuthController.signIn);
  router.get('/auth/getMe', verifyToken, AuthController.getMe);
};

export default authRoutes;
