import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        isComment: {
            type: Boolean,
            default: false,
        },
        postUrls: [
            {
                type: String
            }
        ],
        views: {
            type: Number,
            default: 0,
        },
        usersWhoView: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        description: {
            type: String,
        },
        duration: {
            type: Number,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                likedAt: {
                    type: Date,
                    default: null
                }
            }
        ],
        bookmarks: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                markedAt: {
                    type: Date,
                    default: null
                }
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;