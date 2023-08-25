import { Router } from "express";
import SubjectController from "../controllers/subjectController";

const subjectRoutes = (router: Router) => {
  router.post("/subjects", SubjectController.createSubject);
  router.get("/subjects", SubjectController.getSubjects);
};

export default subjectRoutes;
