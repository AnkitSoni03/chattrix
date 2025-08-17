// import jwt from "jsonwebtoken";
// import User from "../Models/useModel.js";


// const isLogin = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt;
//         console.log(token);
//         if(!token){
//             return res.status(401).json({ message: "User Unauthorized" });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decoded) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//         const user = User.findById(decoded.userId).select("-password");
//         if(!user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//         req.user = user;
//         next();
//     }
//     catch (error) {
//         console.error("Error in isLogin middleware:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// export default isLogin;



import jwt from "jsonwebtoken";
import User from "../Models/useModel.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "User Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Await karo yaha
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user; // ab yaha actual user object hoga
    next();
  } catch (error) {
    console.error("Error in isLogin middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default isLogin;
