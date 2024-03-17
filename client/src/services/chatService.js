import { jsonRequest, fileUploadRequest } from "./http-common.js";


export const getAllChats = async () => {
    return await jsonRequest.get(`/chat/`);
}

export const getMessages = async (chatId) => {
    return await jsonRequest.get(`/message/${chatId}`);
}


export const addMessage = async (payload) => {
    return await jsonRequest.post(`/message/add-message`, payload);
}



