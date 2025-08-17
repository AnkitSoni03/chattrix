import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";
import User from "../Models/useModel.js";


// User Registration
export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, password, gender, profilepic } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl,
        });

        await newUser.save();
        jwtToken(newUser._id, res);

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            gender: newUser.gender,
            profilepic: newUser.profilepic,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// User Login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist, please register first" });
        }

        const comparedPassword = bcrypt.compareSync(password, user.password);
        if (!comparedPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            gender: user.gender,
            profilepic: user.profilepic,
            message: "User logged in successfully"
        });

    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// User Logout
export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
