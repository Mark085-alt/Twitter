import express from "express";

const router = express.Router();
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import {
    getUserDetailsByUsername,
    updateUserDetails,
    userFollow,
    updateUserCoverImage,
    fetchSearches,
    getAllConnectedUsers,
    getUserDataById,
    getAllUsers,
} from "../controllers/user.contoller.js";



router.route("/getUserDetailsByUsername/:username").get(getUserDetailsByUsername);
router.route("/getUserDataById/:userId").get(getUserDataById);
router.route("/updateUserDetails").patch(verifyJwtToken, updateUserDetails);
router.route("/fetch-users").get(fetchSearches);
router.route("/fetch-all-users").get(getAllUsers);
router.route("/userFollowHandler/:anotherUserId").patch(verifyJwtToken, userFollow);
router.route("/updateUserCoverImage").post(verifyJwtToken, updateUserCoverImage);
router.route("/get-all-connected-user").get(verifyJwtToken, getAllConnectedUsers);


export default router;