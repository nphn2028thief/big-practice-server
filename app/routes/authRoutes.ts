import { Router } from 'express';
import AuthController from '../controllers/authController';
import { verifyToken } from '../middlewares/auth';

const authRoutes = (router: Router) => {
  router.post('/auth/signup', AuthController.signUp);
  router.post('/auth/signin', AuthController.signIn);
  router.get('/auth/getMe', verifyToken, AuthController.getMe);
  router.patch('/auth/updateMe', AuthController.updateMe);
};

export default authRoutes;
