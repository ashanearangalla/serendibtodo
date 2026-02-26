import { asyncHandler } from "../utils/asyncHandler";

const addTodo = asyncHandler(async (req, res) => {
    const {title} = req.body;

    if(!title || title.trim() === "") {
        throw new ApiError(400, "Title is required and cannot be empty");
    }

    
})