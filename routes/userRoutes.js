import express from "express";
import {
  createUser,
  deleteUser,
  getalluser,
  updateUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getalluser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
