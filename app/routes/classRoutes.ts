import { Router } from 'express';
import ClassController from '../controllers/classController';

const classRoutes = (router: Router) => {
  router.post('/classes', ClassController.createClass);
  router.get('/classes', ClassController.getClasses);
};

export default classRoutes;
