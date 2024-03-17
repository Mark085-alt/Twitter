import { v2 as cloudinary } from "cloudinary"



export const uploadFileToCloudinary = async (post) => {
    try {

        const options = {
            folder: process.env.CLOUDINARY_FOLDER_NAME,
            resource_type: "auto"
        }

        return await cloudinary.uploader.upload(post.tempFilePath, options);

    } catch (error) {
        console.log("Error uploading to cloudinary: ", error)
        throw new Error(error);
    }
}

export const uploadMultipleFilesToCloudinary = async (posts) => {
    return Promise.all(posts.map((post) => {
        return uploadFileToCloudinary(post); // Make sure to return the promise
    }))
        .then((values) => {
            return values; // Return the values from the resolved promise
        })
        .catch((err) => {
            console.error("Error uploading files:", err);
            throw err; // Rethrow the error to propagate it
        });
}
