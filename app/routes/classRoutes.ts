import { Router } from "express";
import ClassController from "../controllers/classController";

const classRoutes = (router: Router) => {
  router.post("/class", ClassController.createClass);
  router.get("/class", ClassController.getClasses);
};

export default classRoutes;
