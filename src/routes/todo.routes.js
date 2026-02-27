import { Router } from "express";
import { addTodo, getTodoById, getTodos } from "../controllers/todo.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/add").post(verifyJWT, addTodo);
router.route("/").get(verifyJWT, getTodos);
router.route("/:id").get(verifyJWT, getTodoById);



export default router;