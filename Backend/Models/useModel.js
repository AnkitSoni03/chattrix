import mongoose from "mongoose";


const useSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : [true, "Full name is required"],
    },
    username :{
        type : String,                              
        required : [true, "Username is required"],
        unique: true,
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        unique : true,
    },
    gender : {
        type : String,
        enum : ["male", "female", "other"],
        required : [true, "Gender is required"],
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    profilepic : {
        type: String,
        required: true,
        default: "",
    }
},
{
    timestamps: true
});


const User = mongoose.model("User", useSchema);
export default User;