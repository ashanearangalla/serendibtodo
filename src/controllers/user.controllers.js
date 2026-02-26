import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Op } from "sequelize";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAcessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validate: false});

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation failed", error);
    throw new ApiError(500, "Token generation failed");
  }
}


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

  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user.id);

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] }
  });

 if(!loggedInUser) {
        throw new ApiError(500, "Something went wrong when logging in user");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

   return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json( new ApiResponse(
            200, 
           { user: loggedInUser},
           "User logged in successfully"
        ));
})

export { registerUser, loginUser };