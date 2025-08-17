import express from "express";
import dotenv from "dotenv";
import DbConnect from "./DB/DbConnect.js";
import authRouter from "./rout/authUser.js";
import messageRouter from "./rout/messageRoute.js";
import cookieParser from "cookie-parser";
import userRouter from "./rout/userRoute.js";
import path from "path";

import { app,server } from "./Socket/socket.js";




const __dirname = path.resolve();

dotenv.config();


app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    DbConnect();
    console.log(`Working at ${PORT}`);
})