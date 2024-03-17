import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;


export const jsonRequest = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-type": "application/json"
    },
    withCredentials: true // Include this line if you need credentials for JSON requests
});


export const fileUploadRequest = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-type": "multipart/form-data"
    },
    withCredentials: true // Include this line if you need credentials for file upload requests
});
