import mongoose from "mongoose";

const additionalDetailsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        coverImg: {
            type: String
        },
        bio: {
            type: String
        },
        city: {
            type: String
        },
        link: {
            type: String
        },
        dob: {
            type: String,
        },
        phoneNo: {
            type: Number,
        },
        gender: {
            enum: ["Male", "Female", "Others"],
            type: String
        }
    }
);


const AdditionalDetails = mongoose.model("AdditionalDetails", additionalDetailsSchema);
export default AdditionalDetails;