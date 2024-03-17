import express from "express";

const router = express.Router();
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

import { addMessage, getMessages } from "../controllers/message.controller.js";

// router.use(verifyJwtToken);


// ****************** MESSAGE *****************


router.route("/add-message").post(addMessage);
router.route("/:chatId").get(getMessages);



export default router;