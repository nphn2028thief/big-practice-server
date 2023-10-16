import { Router } from 'express';

import ClassController from '../controllers/classController';
import { verifyToken } from '../middlewares/auth';

const classRoutes = (router: Router) => {
  router.post('/classes', verifyToken, ClassController.createClass);
  router.get('/classes', verifyToken, ClassController.getClasses);
};

export default classRoutes;
