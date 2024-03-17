import { jsonRequest } from "./http-common.js";


export const signup = async (data) => {
    return await jsonRequest.post("/auth/signup", data);
}


export const login = async (data) => {
    return await jsonRequest.post("/auth/login", data);
}


export const verifyToken = async () => {
    return await jsonRequest.get("/auth/verify-token");
}


export const getUserData = async () => {
    return await jsonRequest.get("/auth/getUserData");
}


export const logout = async (data) => {
    return await jsonRequest.post("/auth/logout", data);
}


export const verifyOtp = async (data) => {
    return await jsonRequest.post("/auth/verify-otp", data);
}


export const sendOtpToEmail = async (data) => {
    return await jsonRequest.post("/auth/resend-otp", { email: data });
}


// this one  is for reset password
export const resetPassword = async (data) => {
    return await jsonRequest.patch("/auth/reset-password", { email: data });
}


// this one is for forgot password
export const changePassword = async (data) => {
    return await jsonRequest.patch("/auth/change-password", data);
}