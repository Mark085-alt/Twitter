import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Notification from "../models/notification.model.js";
import AdditionalDetails from "../models/additionalDetails.model.js";
import { uploadFileToCloudinary } from "../utils/fileUploader.js"
import { createChat } from "./chat.controller.js";


// ******************************** FOLLOW OPERATIONS ***********************************

export const userFollow = async (req, res) => {
    try {
        const userId = req.user?._id;  // Current user's ID
        const { anotherUserId } = req.params; // ID of the user to follow/unfollow

        // Check if the current user is already following the other user
        const user = await User.findById(userId);
        const anotherUser = await User.findById(anotherUserId);

        if (!user || !anotherUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                data: null
            });
        }

        const isAlreadyFollowed = user.following.includes(anotherUserId);

        if (isAlreadyFollowed) {
            // Unfollow the user
            await Promise.all([
                User.findByIdAndUpdate(userId, { $pull: { following: anotherUserId } }),
                User.findByIdAndUpdate(anotherUserId, { $pull: { followers: userId } })
            ]);

            // delete the chat if it exists
            await Chat.findOneAndDelete(
                {
                    users: {
                        $all: [userId, anotherUserId]
                    }
                }
            );

        } else {
            // Follow the user

            // create notification
            await Notification.create(
                {
                    messageTo: anotherUserId,
                    messageFrom: userId,
                    message: "followed you"
                }
            );


            // push user into another user list
            await Promise.all([
                User.findByIdAndUpdate(userId, { $addToSet: { following: anotherUserId } }),
                User.findByIdAndUpdate(anotherUserId, { $addToSet: { followers: userId } })
            ]);

            // if another user also follow me and now i am also follow him so create chat
            const isAnotherUserFollowUser = anotherUser.following.includes(userId);

            if (isAnotherUserFollowUser) {
                await createChat(userId, anotherUserId);
            }

        }

        // Populate and return the updated user and another user
        const updatedUser = await User
            .findById(anotherUserId)
            .select("fullName email userName additionalDetails profileImg following followers posts createdAt")
            .populate("additionalDetails")
            .populate("following", ["fullName", "userName", "profileImg"])
            .populate("followers", ["fullName", "userName", "profileImg"])
            .exec();

        return res.status(200).json({
            success: true,
            data: { updatedUser },
            isFollow: !isAlreadyFollowed,
            message: "Follow/Unfollow operation successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server failed to process the request. Please try again.",
            error: error.message,
            success: false,
            data: null
        });
    }
}


export const getAllConnectedUsers = async (req, res) => {
    try {

        const userId = req?.user?._id;


        const currentUser = await User.findById(userId);

        const following = currentUser.following;

        const connectedUsers = await User.find({
            _id: { $in: following }, // Users whom the current user follows
            followers: userId // Users who are following the current user
        })
            .select("fullName userName profileImg");


        return res.status(201).json(
            {
                success: true,
                data: connectedUsers,
                message: "Fetch user by search successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user by search,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find({});

        return res.status(201).json(
            {
                success: true,
                data: users,
                message: "Fetch all user successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch all user,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const fetchSearches = async (req, res) => {
    try {

        // $regex is used to perform a regular expression search.
        // $options: 'i' ensures that the search is case-insensitive.
        // $or operator is used to match documents where at least one of the conditions inside it is true.

        const { value } = req.query;

        const users = await User.find({
            $or: [
                { userName: { $regex: value, $options: 'i' } },
                { fullName: { $regex: value, $options: 'i' } }
            ]
        })
            .select("fullName userName profileImg")
            .limit(10);


        return res.status(201).json(
            {
                success: true,
                data: users,
                message: "Fetch user by search successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user by search,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const getUserDataById = async (req, res) => {
    try {

        const { userId } = req.params;

        const existedUser = await User
            .findById(userId)
            .select("fullName email userName profileImg ")
            .exec();

        if (!existedUser) {
            return res.status(404).json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                }
            )
        }

        return res.status(201).json(
            {
                success: true,
                data: existedUser,
                message: "Fetch user details by id successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user details by id,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}

export const getUserDetailsByUsername = async (req, res) => {
    try {

        const userName = req.params.username;

        const existedUser = await User
            .findOne({ userName })
            .select("fullName email userName additionalDetails profileImg following followers posts createdAt")
            .populate("additionalDetails")
            .populate("following", ["fullName", "userName", "profileImg"])
            .populate("followers", ["fullName", "userName", "profileImg"])
            .exec();

        const len = existedUser.posts.length;
        existedUser.posts = [];


        if (!existedUser) {
            return res.status(404).json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                }
            )
        }

        return res.status(201).json(
            {
                success: true,
                data: { existedUser, postLength: len },
                message: "Fetch user details by username successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user details by username,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const updateUserDetails = async (req, res) => {
    try {

        const userId = req?.user?._id;

        const {
            fullName,
            city,
            link,
            dob,
            gender,
            phoneNo,
            bio
        } = req.body;

        const file = req.files?.profileImg;

        const existedUser = await User
            .findById(userId);

        const existedAdditionlDetails = await AdditionalDetails
            .findById(existedUser.additionalDetails);

        if (!existedUser || !existedAdditionlDetails) {
            return res.status(404).json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                }
            )
        }

        const fieldsToUpdate = {
            city,
            link,
            dob,
            gender,
            phoneNo,
            bio
        };

        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (value !== undefined) {
                existedAdditionlDetails[key] = value;
            }
        });

        if (file) {
            const imageRes = await uploadFileToCloudinary(file);
            existedUser.profileImg = imageRes.secure_url;
        }

        if (fullName) {
            existedUser.fullName = fullName;
        }

        await existedUser.save();
        await existedAdditionlDetails.save();

        return res.status(201).json(
            {
                success: true,
                data: null,
                message: "Update user details successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to update user details,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


// TODO: update -> remove calls
export const updateUserCoverImage = async (req, res) => {
    try {

        const userId = req?.user?._id;

        const { post } = req.files;

        const existedUser = await User
            .findById(userId);

        const existedAdditionlDetails = await AdditionalDetails
            .findById(existedUser.additionalDetails);


        if (!existedUser || !existedAdditionlDetails) {
            return res.status(404).json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                }
            )
        }

        const imageRes = await uploadFileToCloudinary(post);

        existedAdditionlDetails.coverImg = imageRes.secure_url;

        await existedAdditionlDetails.save();

        const user = await User
            .findById(userId)
            .select("fullName email userName additionalDetails profileImg following followers posts createdAt")
            .populate("additionalDetails")
            .populate("following", ["fullName", "userName", "profileImg"])
            .populate("followers", ["fullName", "userName", "profileImg"])
            .exec();

        return res.status(201).json(
            {
                success: true,
                data: user,
                message: "Update user cover image  successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to update user cover image,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}
