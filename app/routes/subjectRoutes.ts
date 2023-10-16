import { Router } from "express";

import SubjectController from "../controllers/subjectController";
import { verifyToken } from "../middlewares/auth";

const subjectRoutes = (router: Router) => {
  router.post("/subjects", verifyToken, SubjectController.createSubject);
  router.get("/subjects", verifyToken, SubjectController.getSubjects);
};

export default subjectRoutes;
