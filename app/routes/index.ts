import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

const routes = () => {
  authRoutes(router);
  return router;
};

export default routes;
