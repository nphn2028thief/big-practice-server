import { Router } from "express";
import authRoutes from "./authRoutes";
import subjectRoutes from "./subjectRoutes";
import teacherRoutes from "./teacherRoutes";
import classRoutes from "./classRoutes";

const router = Router();

const routes = () => {
  authRoutes(router);
  subjectRoutes(router);
  classRoutes(router);
  teacherRoutes(router);
  return router;
};

export default routes;
