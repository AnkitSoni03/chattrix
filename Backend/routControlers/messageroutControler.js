import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._conditions._id;

    // Find or create conversation
    let chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    // New message create
    const newMessage = new Message({
      senderId,
      reciverId,
      message: messages,
      conversationId: chats._id,
    });

    if (newMessage) {
      chats.messages.push(newMessage._id);
    }

    await Promise.all([chats.save(), newMessage.save()]);

    // SOCKET.IO function 
    const reciverSocketId = getReciverSocketId(reciverId);

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }
    const senderSocketId = getReciverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).send(newMessage);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
    console.log(`error in sendMessage ${error}`);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: reciverId } = req.params;
    const senderId = req.user._conditions._id;

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("messages");

    if (!chats) return res.status(200).send([]);

    const message = chats.messages;
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
    console.log(`error in getMessages ${error}`);
  }
};
