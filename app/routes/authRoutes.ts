import { Router } from 'express';
import AuthController from '../controllers/authController';
import { verifyToken } from '../middlewares/auth';

const authRoutes = (router: Router) => {
  router.post('/auth/signUp', AuthController.signUp);
  router.post('/auth/signIn', AuthController.signIn);
  router.get('/auth/getMe', verifyToken, AuthController.getMe);
};

export default authRoutes;
