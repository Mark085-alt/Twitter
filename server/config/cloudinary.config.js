import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnection = () => {
    try {

        cloudinary.config(
            {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            }
        );

        console.log("Cloudinary connection etablished ");

    } catch (error) {
        console.log("Cloudinary connection failed");
        console.log(error)
    }
}