import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId,io } from "../Socket/socket.js";
// Send Message
export const sendMessage = async () => {
  try {
    const { messages } = req.body;
    const { id: receiverId } = req.params;
    const senderId  = req.user._id;

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      messages,
      conversationId: chats._id,
    });
    if (newMessage) {
      chats.messages.push(newMessage._id);
    }
    await Promise.all([chats.save(), newMessage.save()]);
    const reciverSocketId = getReciverSocketId(receiverId);
     if(reciverSocketId){
        io.to(reciverSocketId).emit("newMessage",newMessage)
     }
    res.status(200).json({ message: "Message sent successfully" });
    
  } catch (error) {
    console.error("Error in sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 


// Get Message
export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId  = req.user._id;

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }.populate("messages"),
    });
    
    if(!chats) {
      return res.status(200).send([]);
    }
    const message = chats.messages;
    res.status(200).send(message);
   
  } catch (error) {
    console.error("Error in getting message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};