import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findByPk(decodedToken.id);

        if (!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }

        req.user = user;

        next();
    }
    catch (error) {
        throw new ApiError(401, error.message || "Unauthorized: Invalid token");
    }
});