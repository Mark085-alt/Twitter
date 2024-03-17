import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import AdditionalDetails from "../models/additionalDetails.model.js";
import bcrypt from "bcrypt";
import { mailSender } from "../utils/mailSender.js";


// HELPER FUNCTIONS----------------------->>

// cookies options
const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
};


const generateRandomOtp = () => {
    // Generate a random number between 10000 and 99999
    const otp = Math.floor(Math.random() * 90000) + 10000;
    return otp.toString();
}


const sendMail = async (email) => {
    try {

        const otp = generateRandomOtp();

        const createdOtp = await Otp.create(
            {
                email,
                otp,
            }
        );

        const subject = "Verify your Email";

        // send otp
        const mailRes = await mailSender(email, subject, otp);

        if (!mailRes) {
            return false;
        }

        return true;

    } catch (error) {

        console.log("Error when send mail: ", error);
        return false;

    }
}


const generateRefreshAndAccessToken = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        return null;
    }

    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}



// CONTROLLERS-------------------------------->>

export const signup = async (req, res) => {
    try {

        //  fetched data from body
        const {
            email,
            userName,
            fullName,
            password,
        } = req.body;

        // validation
        if (!email || !password || !userName || !fullName) {
            return res.status(401).json(
                {
                    success: false,
                    data: null,
                    message: "All fields are required"
                }
            )
        }

        // check user is exist or not with email or username
        const existedUser = await User.findOne(
            {
                $or: [{ email }, { userName }]
            }
        );

        // user exist with isVerified as false
        if (existedUser && !existedUser?.isVerified) {
            return res.status(415).json(
                {
                    success: false,
                    data: email,
                    message: "User is already exist with email, Please verify your email",
                }
            )
        }

        // user exist with isVerified as true
        if (existedUser && existedUser?.isVerified) {
            return res.status(401).json(
                {
                    success: false,
                    data: null,
                    message: "User is already exist with email or username"
                }
            )
        }

        // hashed the password
        const hashedPass = await bcrypt.hash(password, 10);

        // GenerateRandomOtp and send otp through email
        const mailResult = await sendMail(email);

        if (!mailResult) {
            return res.status(500).json(
                {
                    success: false,
                    data: null,
                    message: "Mail failed"
                }
            )
        }

        // creating additional details
        const additionalDetails = await AdditionalDetails.create(
            {
                coverImg: undefined,
                dob: undefined,
                phoneNo: undefined,
                gender: undefined
            }
        );

        const imageUrl = `https://ui-avatars.com/api/?name=${fullName}`

        const createdUser = await User.create(
            {
                email,
                userName,
                fullName,
                profileImg: imageUrl,
                password: hashedPass,
                additionalDetails,
                socketId: null,
            }
        );

        if (!createdUser) {
            return res.status(501).json(
                {
                    success: false,
                    data: null,
                    message: "Server failed to register the user,try again later",
                }
            )
        }

        return res.status(201).json(
            {
                success: true,
                data: null,
                message: "User registed successfully"
            }
        )

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to register the user,try again later",
                error: error.message
            }
        )
    }
}


export const verifyOtp = async (req, res) => {
    try {

        const { otp, email } = req.body;

        // check user is exist or not with email
        const existedUser = await User.findOne({ email });

        // user not exist 
        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not exist with this email, Please signup first",
                }
            )
        }

        // find the latest otp
        const latestOtp = await Otp.find({ email })
            .sort({ expiresAt: -1 })
            .limit(1);

        // verify the otp
        if (latestOtp.length <= 0) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "Otp not found, Please resend the otp",
                }
            )
        }

        // verify the otp
        if (otp !== latestOtp[0].otp) {
            return res.status(400).json(
                {
                    success: false,
                    data: null,
                    message: "Otp is not correct",
                }
            )
        }

        // et isVerified as true
        existedUser.isVerified = true;

        // save the changes in db
        await existedUser.save();


        return res.status(201).json(
            {
                success: true,
                data: null,
                message: "Your email has been verified,Please login",
            }
        );

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to verify otp ,try again later",
                error: error.message
            }
        )
    }
}


export const resendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        // check user is exist or not with email
        const existedUser = await User.findOne({ email });

        // user not exist
        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not exist with this email, Please signup first",
                }
            )
        }

        const isOtpSend = await sendMail(email);

        if (!isOtpSend) {
            return res.status(501).json(
                {
                    success: false,
                    data: null,
                    message: "Server failed to resend otp ,try again later",
                }
            )
        }


        return res.status(201).json(
            {
                success: true,
                data: null,
                message: "Otp has been sent successfully",
            }
        );

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to resend otp ,try again later",
                error: error.message
            }
        )
    }
}


export const login = async (req, res) => {

    try {

        const {
            emailOrUsername,
            password
        } = req.body;

        // validation the fields
        if (!emailOrUsername || !password) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "All fields are required",
                }
            )
        }

        // check user is exist or not
        const existedUser = await User.findOne(
            {
                $or: [{ email: emailOrUsername }, { userName: emailOrUsername }]
            }
        );

        // if not
        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not registered with us, please signup first",
                }
            )
        }

        // check user is verified or not
        if (existedUser && !existedUser.isVerified) {
            return res.status(401).json(
                {
                    success: false,
                    data: null,
                    message: "User is not verified,Please verify your email",
                }
            )
        }

        // verify password
        const comparedPass = await bcrypt.compare(password, existedUser.password);

        // if not
        if (!comparedPass) {
            return res.status(409).json(
                {
                    success: false,
                    data: null,
                    message: "Password is incorrect",
                }
            )
        }

        // create token
        const { refreshToken, accessToken } = await
            generateRefreshAndAccessToken(existedUser._id);


        const loggedInUser = await User
            .findById(existedUser._id)
            .select("fullName userName email profileImg");


        // send response
        res
            .status(200)
            .cookie("TwitterAccessToken", accessToken, options)
            .cookie("TwitterRefreshToken", refreshToken, options)
            .json(
                {
                    success: true,
                    data: { loggedInUser, accessToken },
                    message: "User logged in successfully",
                }
            );

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to login the user ,try again later",
                error: error.message
            }
        )
    }
}


export const getUserData = async (req, res) => {
    try {

        const userId = req.user?._id;

        const user = await User
            .findById(userId)
            .select("fullName userName email profileImg");

        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not found",
                }
            )
        }


        return res
            .status(201)
            .json(
                {
                    success: true,
                    data: user,
                    message: "Get user data successfully",
                }
            );

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to get user data ,try again later",
                error: error.message
            }
        )
    }
}


export const logout = async (req, res) => {
    try {

        const userId = req.user?._id;

        const user = await User.findByIdAndUpdate(
            {
                _id: userId
            },
            {
                refreshToken: undefined
            },
            {
                new: true
            }
        )

        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    data: null,
                    message: "User not fouind",
                }
            )
        }


        return res
            .status(201)
            .clearCookie("TwitterAccessToken", options)
            .clearCookie("TwitterRefreshToken", options)
            .json(
                {
                    success: true,
                    data: null,
                    message: "User logged out successfully",
                }
            );

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to logout user ,try again later",
                error: error.message
            }
        )
    }
}


export const changePassword = async (req, res) => {
    try {

        const { newPassword, email, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: "All fields are required",
                    data: null
                }
            )
        }


        if (newPassword !== confirmPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: "New password and confirm password must be same",
                    data: null
                }
            )
        }

        const existedUser = await User.findOne({ email });

        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Usr not found",
                    data: null
                }
            )
        }

        // hash the password
        const hashedPass = await bcrypt.hash(newPassword, 10);

        // replace and save the changes
        existedUser.password = hashedPass;
        await existedUser.save();

        // find updatedUser
        const user = await User.findById(existedUser._id);

        // send email
        const subject = "Password changed Successfully";
        await mailSender(user.email, subject, subject)


        return res.status(201).json(
            {
                success: true,
                data: null,
                message: "Password changed successfully",
            }
        )

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to changed the password ,try again later",
                error: error.message
            }
        )
    }
}


export const resetPassword = async (req, res) => {
    try {

        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user?._id;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: "All fields are required",
                    data: null
                }
            )
        }


        if (newPassword !== confirmPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: "New password and confirm password must be same",
                    data: null
                }
            )
        }

        const existedUser = await User.findById(userId);

        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Usr not found",
                    data: null
                }
            )
        }


        const isPaswordVerified = await bcrypt.compare(oldPassword, existedUser.password);

        if (!isPaswordVerified) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Pasword is not verified or same",
                    data: null
                }
            )
        }

        if (newPassword === oldPassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Old password and new password can't be same",
                    data: null
                }
            )
        }

        // hash the password
        const hashedPass = await bcrypt.hash(newPassword, 10);

        // replace and save the changes
        existedUser.password = hashedPass;
        await existedUser.save();

        // find updatedUser
        const user = await User.findById(userId);

        // send email
        const subject = "Password Reset Successfully";
        await mailSender(user.email, subject, subject)

        // return response
        return res.status(201).json(
            {
                success: true,
                data: user,
                message: "Password reset successfully",
            }
        )

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to reset password,try again later",
                error: error.message
            }
        )
    }
}


export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

        if (!decoded) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Refresh token is not valid",
                    data: null
                }
            )
        }

        // Fetch user details based on the refresh token
        const existedUser = await User.findById(decoded._id);

        if (!existedUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found",
                    data: null
                }
            )
        }

        // return response
        return res.status(201).json(
            {
                success: true,
                data: existedUser,
                message: "Refresh access token successfully",
            }
        )

    } catch (error) {
        return res.status(501).json(
            {
                success: false,
                data: null,
                message: "Server failed to refresh access token,try again later",
                error: error.message
            }
        )
    }
}

