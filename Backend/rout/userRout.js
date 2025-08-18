import express from 'express'
import { getUserBySearch, getCorrentChatters } from '../routControlers/userhandlerControler.js'
import isLogin from '../middleware/isLogin.js'
const router = express.Router()

router.get('/search',isLogin,getUserBySearch);

router.get('/currentchatters',isLogin,getCorrentChatters)

export default router