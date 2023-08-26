import { Router } from 'express';
import authRoutes from './authRoutes';
import subjectRoutes from './subjectRoutes';
import teacherRoutes from './teacherRoutes';
import classRoutes from './classRoutes';
import studentRoutes from './studentRoutes';

const router = Router();

const routes = () => {
  authRoutes(router);
  subjectRoutes(router);
  classRoutes(router);
  teacherRoutes(router);
  studentRoutes(router);
  return router;
};

export default routes;
