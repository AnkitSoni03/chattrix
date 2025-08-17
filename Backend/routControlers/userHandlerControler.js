import Conversation from "../Models/conversationModel.js";
import User from "../Models/useModel.js";

// 🔎 Search Users
export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;  // ✅ FIXED

    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserID },
        },
      ],
    })
      .select("-password")
      .select("email");

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// 👥 Get Current Chatters
export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id;  // ✅ FIXED

    const currenTChatters = await Conversation.find({
      participants: currentUserID,
    }).sort({
      updatedAt: -1,
    });

    if (!currenTChatters || currenTChatters.length === 0) {
      return res.status(200).send([]);
    }

    // Collect all participants except current user
    const partcipantsIDS = currenTChatters.reduce((ids, conversation) => {
      const otherParticipents = conversation.participants.filter(
        (id) => id.toString() !== currentUserID.toString()
      );
      return [...ids, ...otherParticipents];
    }, []);

    // Remove duplicates
    const uniqueParticipantIDs = [...new Set(partcipantsIDS.map(id => id.toString()))];

    // Fetch user details
    const users = await User.find({ _id: { $in: uniqueParticipantIDs } })
      .select("-password")
      .select("-email");

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
