import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        profileImg: {
            type: String,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdditionalDetails"
        },
        socketId: {
            type: String
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        liked: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],
        bookmarked: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],
        refreshToken: {
            type: String
        },
        accessToken: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName,
        },
        process.env.JWT_ACCESS_TOKEN,
        {
            expiresIn: "1d"
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.JWT_REFRESH_TOKEN,
        {
            expiresIn: "10d"
        }
    )
}


const User = mongoose.model("User", userSchema);

export default User;