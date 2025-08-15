import express from "express";
import dotenv from "dotenv";
import DbConnect from "./DB/DbConnect.js";
import authRouter from "./rout/authUser.js";
import messageRouter from "./rout/messageRoute.js";
import cookieParser from "cookie-parser";
import userRouter from "./rout/userRoute.js";

const app = express();
dotenv.config();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.listen(3000, () => {
  DbConnect();
  console.log("Server is running on the port 3000");
});
