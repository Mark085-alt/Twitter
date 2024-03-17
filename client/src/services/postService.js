import { jsonRequest, fileUploadRequest } from "./http-common.js";


export const createPost = async (data) => {
    return await fileUploadRequest.post("/post/create-post", data);
}

export const fetchFeeds = async () => {
    return await jsonRequest.get("/post/fetch-posts");
}

export const fetchNotification = async () => {
    return await jsonRequest.get("/post/fetch-notification");
}


export const fetchFollowingPosts = async (index) => {
    return await jsonRequest.get(`/post/fetch-following-posts?index=${index}`);
}


export const bookmarkPost = async (postId) => {
    return await jsonRequest.patch(`/post/bookmarked-unbookmarked-post/${postId}`);
}

export const likePost = async (postId) => {
    return await jsonRequest.patch(`/post/like-unlike-post/${postId}`);
}

export const deletePost = async (postId) => {
    return await jsonRequest.delete(`/post/delete-post/${postId}`);
}


export const editPost = async (postId) => {
    return await jsonRequest.put(`/post/edit-post/${postId}`);
}

export const getBookmarkPosts = async () => {
    return await jsonRequest.get("/post/get-bookmark-posts");
}



export const getPostDetails = async (postId) => {
    return await jsonRequest.get(`/post/getPostDetails/${postId}`);
}



export const createComment = async (data) => {
    return await fileUploadRequest.post(`/post/create-comment`, data);
}


export const getUserPosts = async (username, index) => {
    return await jsonRequest.get(`/post/getUserPosts?index=${index}&username=${username}`);
}


export const getUserReplies = async (username, index) => {
    return await jsonRequest.get(`/post/getUserComments?index=${index}&username=${username}`);
}


export const increaseViewsOnPost = async (postId) => {
    return await jsonRequest.patch(`/post/increaseViewsOnPost/${postId}`);
}


export const getUserMediaPosts = async (username, index) => {
    return await jsonRequest.get(`/post/getUserMediaPosts?index=${index}&username=${username}`);
}


export const getUserHighlights = async (username, index) => {
    return await jsonRequest.get(`/post/getUserPosts?index=${index}&username=${username}`);
}


export const getUserLikePosts = async (username, index) => {
    return await jsonRequest.get(`/post/getUserLikedPosts?index=${index}&username=${username}`);
}