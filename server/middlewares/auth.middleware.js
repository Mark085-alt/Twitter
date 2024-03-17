import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const verifyJwtToken = async (req, res, next) => {
    try {

        if (req.path === '/fetch-posts') {
            // Skip token verification for /fetch-posts endpoint
            return next();
        }

        const token = req.cookies?.TwitterAccessToken ||
            req.body.token ||
            req.header("Authorization")?.replace("bearer ", "");

        if (!token) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Token not found",
                    data: null
                }
            )
        }

        const isTokenVerified = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

        if (!isTokenVerified) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Token is not valid",
                    data: null
                }
            )
        }

        const user = await User
            .findById(isTokenVerified._id)
            .select("-password -refreshToken");

        req.user = user;

        next();


    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server is failed to verify the token ,Please try again",
                error: error.message,
                data: null
            }
        )
    }
}