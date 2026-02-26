import { Router } from "express";
import { addTodo } from "../controllers/todo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/add").post(verifyJWT, addTodo);

export default router;