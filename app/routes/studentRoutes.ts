import { Router } from 'express';
import StudentController from '../controllers/studentController';

const studentRoutes = (router: Router) => {
  router.post('/students', StudentController.createStudent);
  router.get('/students', StudentController.getStudents);
  router.patch('/students/:studentId', StudentController.updateStudent);
  router.delete('/students/:studentId', StudentController.deleteStudent);
};

export default studentRoutes;
