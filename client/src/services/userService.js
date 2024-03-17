import { jsonRequest, fileUploadRequest } from "./http-common.js";


export const getUserDetailsByUsername = async (username) => {
    return await jsonRequest.get(`/user/getUserDetailsByUsername/${username}`);
}

export const getUserDataById = async (id) => {
    return await jsonRequest.get(`/user/getUserDataById/${id}`);
}


export const getSearchedValue = async (value) => {
    return await jsonRequest.get(`/user/fetch-users?value=${value}`);
}

export const updateUserDetails = async (data) => {
    return await fileUploadRequest.patch(`/user/updateUserDetails`, data);
}


export const getAllConnectedUsers = async () => {
    return await fileUploadRequest.get(`/user/get-all-connected-user`);
}


export const userFollowHandler = async (anotherUserId) => {
    return await jsonRequest.patch(`/user/userFollowHandler/${anotherUserId}`);
}


export const updateUserCoverImage = async (file) => {
    return await fileUploadRequest.post(`/user/updateUserCoverImage`, file);
}


