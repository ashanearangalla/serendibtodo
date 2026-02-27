import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.models.js";



const addTodo = asyncHandler(async (req, res) => {
    const {title} = req.body;

    if(!title || title.trim() === "") {
        throw new ApiError(400, "Title is required and cannot be empty");
    }

    // Get logged in user ID

    const userId = req.user?.id;
    console.log("title", title);
    console.log("userID", userId);

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found in request");
    }

    // Create todo for the user
    try {
        const newTodo = await Todo.create({
            title,
            userId,
        });

        return res
        .status(201)
        .json(new ApiResponse(201, newTodo, "Todo created successfully"));


    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }

    
})

const getTodos = asyncHandler(async (req, res) => {
    // Get logged in user ID

    const userId = req.user?.id;

    if(!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found in request");
    }

        // Fetch todos for the user
    try {
        const todos = await Todo.findAll({
            where: { userId },
            order: [["createdAt", "ASC"]],

        })

        res
            .status(200)
            .json(new ApiResponse(
                200, 
                todos, 
                "Todos fetched successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
})

const getTodoById = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const todoId = req.params.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID not found in request");
    }

    try {
        const todo = await Todo.findOne({
            where: {
                id: todoId,
                userId
            }
        });

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }

        res
            .status(200)
            .json(new ApiResponse(
                200, 
                todo, 
                "Todo fetched successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

export { addTodo, getTodos, getTodoById };