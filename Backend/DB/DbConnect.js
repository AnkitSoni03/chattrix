import mongoose from "mongoose";

const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected Succesfully");
    } catch (error) {
        console.log(console.error);
    }
}
 

export default dbConnect