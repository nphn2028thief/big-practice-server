import { Router } from 'express';

import authRoutes from './authRoutes';
import subjectRoutes from './subjectRoutes';
import classRoutes from './classRoutes';
import teacherRoutes from './teacherRoutes';
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
