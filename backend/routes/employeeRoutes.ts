import express from "express";
import {
  getAllEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
  createEmployee,
} from "../controllers/employeeController.ts";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployee);
router.put("/:id", updateEmployee);
router.get("/:id", getEmployee);
router.delete("/:id", deleteEmployee);

export default router;
