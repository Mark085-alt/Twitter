import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        messageTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        messageFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        message: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
