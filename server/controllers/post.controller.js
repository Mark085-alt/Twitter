import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { uploadFileToCloudinary, uploadMultipleFilesToCloudinary } from "../utils/fileUploader.js"

const PAGE_SIZE = 10;

// ******************************** POST CRUD OPERATIONS ***********************************

export const createPost = async (req, res) => {
    try {

        const { description } = req.body;
        const userId = req.user?._id;
        const allPosts = req.files?.post;


        if (!userId || (!allPosts && !description)) {
            return res.status(400).json(
                {
                    message: "All fields are required",
                    success: false,
                    data: null
                }
            )
        }

        const existedUser = await User.findById(userId);

        if (!existedUser) {
            return res.status(404).json(
                {
                    message: "User not found",
                    success: false,
                    data: null
                }
            )
        }

        let postUrls = [];
        let duration = null;

        if (allPosts) {

            const uploadPromises = Array.isArray(allPosts)
                ? allPosts.map(uploadFileToCloudinary)
                : [uploadFileToCloudinary(allPosts)];

            const allPostResponses = await Promise.all(uploadPromises);

            if (!allPostResponses || allPostResponses.length === 0) {
                return res.status(500).json(
                    {
                        message: "File upload failed",
                        success: false,
                        data: null
                    }
                )
            }

            postUrls = allPostResponses.map(response => response?.secure_url);
        }

        const newPost = await Post.create(
            {
                description,
                postUrls,
                duration,
                user: userId
            }
        );

        if (!newPost) {
            return res.status(404).json(
                {
                    message: "Post not created",
                    success: false,
                    data: null
                }
            )
        }

        existedUser.posts.push(newPost._id);
        await existedUser.save();

        return res.status(201).json(
            {
                success: true,
                data: newPost,
                message: "Post created successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to create post,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const fetchFollowingPosts = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { index } = req.query;

        const userFollowing = await User.findById(userId)
            .select("following");

        const followingIds = userFollowing.following?.map(user => user._id);

        const allPosts = await Post
            .find({ user: { $in: followingIds }, isComment: false })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(index * PAGE_SIZE) // Skip posts based on pagination
            .limit(PAGE_SIZE) // Limit the number of posts per page
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();


        return res.status(200).json(
            {
                success: true,
                data: allPosts,
                message: "All Posts fetch successfully"
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                message: "Server failed to fetch all posts,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        );
    }
}


export const fetchAllPosts = async (req, res) => {
    try {

        const allPosts = await Post
            .find({ isComment: false })
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();


        return res.status(200).json(
            {
                success: true,
                data: allPosts,
                message: "All Posts fetch successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch all posts,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const fetchNotifications = async (req, res) => {
    try {

        const userId = req.user._id;

        const allNotifications = await Notification
            .find({ messageTo: userId })
            .sort({ createdAt: -1 })
            .populate("messageFrom", ["profileImg", "userName", "fullName"])
            .exec();


        return res.status(200).json(
            {
                success: true,
                data: allNotifications,
                message: "All notification fetch successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch all notification,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const getUserPosts = async (req, res) => {
    try {

        const userName = req.query.username;
        const { index } = req.query;

        const existedUser = await User.findOne({ userName });

        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not found"
                }
            );
        }

        const startIndex = index * PAGE_SIZE;

        const allPosts = await Post.find(
            {
                user: existedUser._id,
                isComment: false,
            }
        )
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(PAGE_SIZE)
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();

        return res.status(200).json(
            {
                success: true,
                data: allPosts,
                message: "User Posts fetch successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user posts,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const getUserComments = async (req, res) => {
    try {
        const userName = req.query.username;
        const { index } = req.query;

        const existedUser = await User.findOne({ userName });

        if (!existedUser) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "User not found"
            });
        }

        const startIndex = index * PAGE_SIZE;

        // Fetch user's comments with populated user information
        const userComments = await Post.find({
            user: existedUser._id,
            isComment: true,
        })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(PAGE_SIZE)
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();


        // Fetch parent post for each comment
        const commentsWithParentPosts = await Promise.all(userComments.map(async (comment) => {
            const parentPost = await Post
                .findOne({ comments: { $in: [comment._id] } })
                .populate("user", ["fullName", "userName", "profileImg"])
                .exec();
            return {
                comment,
                parentPost
            };
        }));

        return res.status(200).json({
            success: true,
            data: commentsWithParentPosts,
            message: "User comments with parent posts fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server failed to fetch user comments with parent posts. Please try again.",
            error: error.message,
            success: false,
            data: null
        });
    }
}


export const getUserLikedPosts = async (req, res) => {
    try {

        const userName = req.query.username;
        const { index } = req.query;


        const existedUser = await User.findOne({ userName });

        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not found"
                }
            );
        }


        const startIndex = index * PAGE_SIZE;

        const likedPosts = await Post.find({ 'likes.user': existedUser._id })
            .sort({ 'likes.likedAt': -1 }) // Sort by likedAt timestamp in descending order
            .skip(startIndex)
            .limit(PAGE_SIZE)
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();


        return res.status(200).json(
            {
                success: true,
                data: likedPosts,
                message: "User liked Posts fetch successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user liked posts,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const getUserMediaPosts = async (req, res) => {
    try {

        const userName = req.query.username;
        const { index } = req.query;


        const existedUser = await User.findOne({ userName });

        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not found"
                }
            );
        }

        const mediaPosts = await Post.find({
            user: existedUser._id,
            postUrls: { $exists: true, $ne: [] },
            isComment: false,
        })
            .sort({ createdAt: -1 })
            .skip(index * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();
        // select: 'fullName userName profileImg', // Select only necessary fields


        return res.status(200).json(
            {
                success: true,
                data: mediaPosts,
                message: "User media Posts fetch successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch user media posts,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}

export const increaseViewsOnPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const result = await Post.findOneAndUpdate(
            { _id: postId, usersWhoView: { $ne: userId } }, // Only update if the user has not viewed the post already
            { $push: { usersWhoView: userId }, $inc: { views: 1 } },
            { new: true }
        ).lean(); // Use lean() for faster performance if you don't need mongoose models

        if (!result) {
            return res.status(201).json({
                success: false,
                message: "Post is already viewed by the user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post views increased successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server failed to increase views on post, Please try again",
            error: error.message
        });
    }
};


export const editPost = async (req, res) => {
    try {

        const { postId } = req.params;

        const existedPost = await Post.findById(postId);

        if (!existedPost) {
            return res.status(404).json(
                {
                    message: "Post not found",
                    success: false,
                    data: null
                }
            )
        }


        return res.status(200).json(
            {
                success: true,
                data: existedPost,
                message: "Post edit successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to edit the post,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const deletePost = async (req, res) => {
    try {

        const { postId } = req.params;

        // delete that post
        await Post.findByIdAndDelete(postId);

        return res.status(200).json(
            {
                success: true,
                data: null,
                message: "Post deleted successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to delete the post,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


// ******************************** POST LIKE AND BOOKMARK OPERATIONS ***********************************


export const postLikeHandler = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { postId } = req.params;

        // Find the user and the post
        const [existedUser, existedPost] = await Promise.all([
            User.findById(userId),
            Post.findById(postId)
        ]);

        if (!existedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                data: null
            });
        }

        if (!existedPost) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
                data: null
            });
        }

        // Check if the user has already liked the post
        const isLiked = existedPost.likes?.some(like => like?.user?.equals(userId));

        // Update the post's likes and user's liked posts atomically
        const update = isLiked ?
            {
                $pull: { likes: { user: userId } }, // Unlike the post and remove the post from user's liked posts
                $pullAll: { liked: [postId] } // Remove the post from user's liked posts
            } :
            {
                $push: { likes: { user: userId, likedAt: new Date() } }, // Like the post
                $addToSet: { liked: postId } // Add the post to user's liked posts
            };


        if (!isLiked && !(existedUser._id.equals(existedPost.user))) {
            await Notification.create(
                {
                    message: "liked your post",
                    messageFrom: userId,
                    messageTo: existedPost.user,
                }
            );
        }


        // Update both the post and user in a single database call
        const [updatedPost, updatedUser] = await Promise.all([
            Post.findOneAndUpdate({ _id: postId }, update, { new: true }),
            User.findOneAndUpdate({ _id: userId }, update, { new: true })
        ]);

        return res.status(200).json({
            success: true,
            isLiked: !isLiked,
            data: null,
            message: "Liked or unliked the post successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server failed to like or unlike the post. Please try again",
            error: error.message,
            success: false,
            data: null
        });
    }
};


export const bookmarkedHandler = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { postId } = req.params;

        // Find the user and the post
        const [existedUser, existedPost] = await Promise.all([
            User.findById(userId),
            Post.findById(postId)
        ]);

        if (!existedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                data: null
            });
        }

        if (!existedPost) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
                data: null
            });
        }

        // Check if the post is already bookmarked by the user
        const isBookmarked = existedPost.bookmarks?.some(bookmark => bookmark?.user?.equals(userId));

        // Update the post's bookmarks and user's bookmarked posts atomically
        const update = isBookmarked ?
            {
                $pull: { bookmarks: { user: userId } }, // Unbookmark the post and remove the post from user's bookmarks
                $pullAll: { bookmarked: [postId] } // Remove the post from user's bookmarked posts
            } :
            {
                $push: { bookmarks: { user: userId, markedAt: new Date() } }, // Bookmark the post
                $addToSet: { bookmarked: postId } // Add the post to user's bookmarked posts
            };

        // Update both the post and user in a single database call
        const [updatedPost, updatedUser] = await Promise.all([
            Post.findOneAndUpdate({ _id: postId }, update, { new: true }),
            User.findOneAndUpdate({ _id: userId }, update, { new: true })
        ]);

        return res.status(200).json({
            success: true,
            isBookmarked: !isBookmarked,
            data: null,
            message: "Bookmarked or unbookmarked the post successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server failed to bookmark or unbookmark the post. Please try again",
            error: error.message,
            success: false,
            data: null
        });
    }
};


// ******************************** POST COMMENTS OPERATIONS ***********************************


export const createComment = async (req, res) => {
    try {

        const { description, postId } = req.body;
        const userId = req.user?._id;
        const allPosts = req.files?.post;


        if (!userId || !postId || (!allPosts && !description)) {
            return res.status(400).json(
                {
                    message: "All fields are required",
                    success: false,
                    data: null
                }
            )
        }

        const existedUser = await User.findById(userId);
        const existedPost = await Post.findById(postId);

        if (!existedUser || !existedPost) {
            return res.status(404).json(
                {
                    message: "User or post not found",
                    success: false,
                    data: null
                }
            )
        }

        let postUrls = [];
        let duration = null;

        if (allPosts) {

            const uploadPromises = Array.isArray(allPosts)
                ? allPosts.map(uploadFileToCloudinary)
                : [uploadFileToCloudinary(allPosts)];

            const allPostResponses = await Promise.all(uploadPromises);

            if (!allPostResponses || allPostResponses.length === 0) {
                return res.status(500).json(
                    {
                        message: "File upload failed",
                        success: false,
                        data: null
                    }
                )
            }

            postUrls = allPostResponses.map(response => response?.secure_url);
        }

        const newPost = await Post.create(
            {
                description,
                postUrls,
                duration,
                user: userId,
                isComment: true,
            }
        );

        if (!newPost) {
            return res.status(404).json(
                {
                    message: "Post not created",
                    success: false,
                    data: null
                }
            )
        }

        await Notification.create(
            {
                message: "comment on your post",
                messageFrom: userId,
                messageTo: existedPost.user,
            }
        );

        existedPost.comments.push(newPost._id);
        await existedPost.save();

        return res.status(201).json(
            {
                success: true,
                data: null,
                message: "Comment-post created successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to create comment-post,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const existedPost = await Post
            .findById(postId)
            .populate(
                {
                    path: "comments",
                    populate: {
                        path: "user",
                        select: ["fullName", "userName", "profileImg"]
                    }
                }
            )
            .populate("user", ["fullName", "userName", "profileImg"])
            .exec();


        if (!existedPost) {
            return res.status(404).json(
                {
                    message: "Post not found",
                    success: false,
                    data: null
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                data: existedPost,
                message: "Fetched post details by id successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch post by id,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        );

    }
}


export const getBookmarkPosts = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User
            .findById(userId)
            .populate({
                path: "bookmarked",
                populate: {
                    path: "user",
                    select: "firstName userName profileImg"
                }
            })
            .exec();

        return res.status(200).json(
            {
                success: true,
                data: user.bookmarked,
                message: "Fetched bookmark posts successfully"
            }
        );

    } catch (error) {

        return res.status(500).json(
            {
                message: "Server failed to fetch bookmark posts,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}


export const createPgost = (req, res) => {
    try {


        return res.status(500).json(
            {
                success: true,
                data: [],
                message: ""
            }
        )
    } catch (error) {

        return res.status(500).json(
            {
                message: "erver failed to create post,Please try again",
                error: error.message,
                success: false,
                data: null
            }
        )
    }
}