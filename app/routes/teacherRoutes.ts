import { Router } from 'express';

import TeacherController from '../controllers/teacherController';

const teacherRoutes = (router: Router) => {
  router.post('/teachers', TeacherController.createTeacher);
  router.get('/teachers', TeacherController.getTeachers);
  router.patch('/teachers/:teacherId', TeacherController.updateTeacher);
  router.delete('/teachers/:teacherId', TeacherController.deleteTeacher);
};

export default teacherRoutes;
