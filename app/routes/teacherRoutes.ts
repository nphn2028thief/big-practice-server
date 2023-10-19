import { Router } from 'express';

import TeacherController from '../controllers/teacherController';
import { verifyToken } from '../middlewares/auth';

const teacherRoutes = (router: Router) => {
  router.post('/teachers', verifyToken, TeacherController.createTeacher);
  router.get('/teachers', verifyToken, TeacherController.getTeachers);
  router.get('/teachers/:teacherId', verifyToken, TeacherController.getTeacherById);
  router.patch('/teachers/:teacherId', verifyToken, TeacherController.updateTeacher);
  router.delete('/teachers/:teacherId', verifyToken, TeacherController.deleteTeacher);
};

export default teacherRoutes;
