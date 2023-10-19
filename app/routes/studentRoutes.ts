import { Router } from 'express';

import StudentController from '../controllers/studentController';
import { verifyToken } from '../middlewares/auth';

const studentRoutes = (router: Router) => {
  router.post('/students', verifyToken, StudentController.createStudent);
  router.get('/students', verifyToken, StudentController.getStudents);
  router.get('/students/:studentId', verifyToken, StudentController.getStudentById);
  router.patch('/students/:studentId', verifyToken, StudentController.updateStudent);
  router.delete('/students/:studentId', verifyToken, StudentController.deleteStudent);
};

export default studentRoutes;
