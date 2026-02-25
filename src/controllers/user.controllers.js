import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { Op } from "sequelize";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
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

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] }
    });

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));

  } catch (error) {
    console.log("User Creation failed",error);
    throw new ApiError(500, "User creation failed");
  }

  

});

const loginUser = asyncHandler(async (req, res) => {
  
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required and cannot be empty");
  }

  const user = await User.findOne({
    where:
    { email }
  })

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User logged in successfully"));
})

export { registerUser, loginUser };