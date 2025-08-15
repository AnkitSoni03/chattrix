import express  from "express";
import isLogin from "../middleware/isLogin.js";
import { getCurrentChatters, getUserBySearch } from "../routControlers/userHandlerControler.js";

const router = express.Router();

router.get("/search", isLogin, getUserBySearch)

router.get("/currentchatter", isLogin, getCurrentChatters);


export default router;