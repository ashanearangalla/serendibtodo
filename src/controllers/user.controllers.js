import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { Op } from "sequelize";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required and cannot be empty");
    }

    const existedUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

    if (existedUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }


    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
    username: username.toLowerCase(),
    email,
    password: hashedPassword,
    });

    // 🔹 Remove password from response
  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User registered successfully"));

});

export { registerUser };