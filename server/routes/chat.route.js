import express from "express";

const router = express.Router();
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import {
    findChat,
    userChats,
} from "../controllers/chat.controller.js";


router.use(verifyJwtToken);


// ************************** CHAT *****************************

router.route("/").get(userChats);
router.route("/find/:userId").get(findChat);

export default router;