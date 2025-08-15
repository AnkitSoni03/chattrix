import mongoose from 'mongoose';


const DbConnect = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URI )
        console.log("Connected to database")
    } catch (error) {
        console.error("Error connecting to database:", error)
    }
}

export default DbConnect;