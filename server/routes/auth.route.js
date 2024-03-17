
import express from "express";
const router = express.Router();

import { verifyJwtToken } from "../middlewares/auth.middleware.js"

import {
    login,
    logout,
    signup,
    changePassword,
    resetPassword,
    verifyOtp,
    resendOtp,
    getUserData,
} from "../controllers/auth.controller.js";
import User from "../models/user.model.js";




router.route("/login").post(login);

router.route("/signup").post(signup);

router.route("/verify-otp").post(verifyOtp);

router.route("/getUserData").get(verifyJwtToken, getUserData);

router.route("/verify-token").get(
    verifyJwtToken,
    async (req, res) => {
        if (!req.user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Token verification failed",
                    data: null
                }
            );
        }

        const loggedInUser = await User
            .findById(req.user?.id)
            .select("fullName userName email profileImg");

        if (!loggedInUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found",
                    data: null
                }
            );
        }

        return res.status(201).json(
            {
                success: true,
                message: "Token Verified",
                data: loggedInUser
            }
        )

    }
);

router.route("/logout").post(verifyJwtToken, logout);

router.route("/resend-otp").post(resendOtp);

router.route("/change-password").patch(changePassword);

router.route("/reset-password").patch(verifyJwtToken, resetPassword);



export default router;
