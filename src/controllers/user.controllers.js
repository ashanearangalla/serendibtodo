import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required and cannot be empty");
    }

    
});