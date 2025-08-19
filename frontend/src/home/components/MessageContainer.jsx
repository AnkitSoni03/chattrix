import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend, IoAttach } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/sound/notification.mp3";

const emojis = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "😇",
  "🙂",
  "🙃",
  "😐",
  "😑",
  "😶",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "😴",
  "😌",
  "😛",
  "😜",
  "😝",
  "🤤",
  "😒",
  "😓",
  "😔",
  "😕",
  "🙁",
  "☹️",
  "😖",
  "😞",
  "😟",
  "😤",
  "😢",
  "😭",
  "😦",
  "😧",
  "😨",
  "😩",
  "🤯",
  "😬",
  "😰",
  "😱",
  "🥵",
  "🥶",
  "😳",
  "🤪",
  "😵",
  "😡",
  "😠",
  "🤬",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😇",
  "🥳",
  "🥴",
  "🥺",
  "🤠",
  "🤡",
  "🤥",
  "🤫",
  "🤭",
  "🧐",
  "🤓",
  "😈",
  "👿",
  "👹",
  "👺",
  "💀",
  "👻",
  "👽",
  "🤖",
  "💩",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "👍",
  "👎",
  "👊",
  "✊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🙏",
  "💪",
  "🤝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💌",
  "💘",
  "💝",
  "💟",
  "💔",
  "🔥",
  "✨",
  "🎉",
  "🎊",
  "🎈",
];

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showTime, setShowTime] = useState({});
  const lastMessageRef = useRef();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage([...messages, newMessage]);
    });
    return () => socket?.off("newMessage");
  }, [socket, setMessage, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);

  const handelMessages = (e) => setSendData(e.target.value);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { messages: sendData }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessage([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  const toggleTime = (id) => {
    setShowTime((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const addEmoji = (emoji) => {
    setSendData((prev) => prev + emoji);
    setShowEmoji(false);
  };

  return (
    <div className="md:min-w-[500px] h-[100%] flex flex-col py-3 bg-transparent rounded-2xl border border-gray-900">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-gray-200 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome!!👋 {authUser.username} 😉</p>
            <p className="text-lg text-gray-400">
              Select a chat to start messaging
            </p>
            <TiMessages className="text-6xl text-sky-500" />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center bg-sky-900 to-teal-500 px-3 rounded-xl py-2 shadow-md">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white text-gray-900 rounded-full p-1 shadow hover:scale-105 transition"
                >
                  <IoArrowBackSharp size={22} />
                </button>
              </div>

              {/* Profile Picture with Online Status */}
              <div className="relative">
                <img
                  className="rounded-full w-8 h-8 md:w-10 md:h-10 border-2 border-white"
                  src={selectedConversation?.profilepic}
                />

                {/* Online Status Indicator - Only show if user is online */}
                {selectedConversation?.isOnline && (
                  <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 md:h-3 md:w-3 bg-green-500 border-2 border-white rounded-full">
                    <div className="absolute inset-0.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              <span className="text-white font-bold text-sm md:text-lg">
                {selectedConversation?.username}
              </span>
            </div>
          </div>
          
          <div className="divider border-t border-gray-700 my-3"></div>

          {/* Messages */}
          <div className="flex-1 overflow-auto px-2 py-3 scrollbar-thin scrollbar-thumb-sky-600">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4">
                <div className="loading loading-spinner text-sky-400"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center text-gray-400">
                Send a message to start conversation
              </p>
            )}
            {!loading &&
              messages?.length > 0 &&
              messages?.map((message) => (
                <div key={message?._id} ref={lastMessageRef}>
                  <div
                    className={`flex ${
                      message.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      onClick={() => toggleTime(message._id)}
                      className={`cursor-pointer max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-md text-sm transition transform active:scale-95
                      ${
                        message.senderId === authUser._id
                          ? "bg-sky-900 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      <p>{message?.message}</p>
                      {showTime[message._id] && (
                        <div className="text-[10px] opacity-70 mt-1 text-right">
                          {new Date(message?.createdAt).toLocaleTimeString(
                            "en-IN",
                            { hour: "numeric", minute: "numeric" }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Input */}
          <form onSubmit={handelSubmit} className="px-2 mt-2">
            <div className="flex items-center gap-2 bg-[#1c1f26] border border-gray-700 rounded-full px-3 py-1 shadow-md">
              {/* Attachment icon */}
              <button
                type="button"
                className="text-gray-400 hover:text-sky-400 transition"
              >
                <IoAttach size={22} />
              </button>

              {/* Emoji picker */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="text-gray-400 hover:text-yellow-400 transition"
                >
                  <BsEmojiSmile size={22} />
                </button>

                {showEmoji && (
                  <div className="absolute bottom-12 left-0 bg-gray-900 border border-gray-700 rounded-xl p-3 grid grid-cols-6 gap-2 shadow-lg w-52 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                    {emojis.map((e, i) => (
                      <button
                        key={i}
                        onClick={() => addEmoji(e)}
                        className="text-xl hover:scale-125 transition transform"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                value={sendData}
                onChange={handelMessages}
                required
                type="text"
                placeholder="Type a message..."
                className="w-full bg-transparent text-sm text-gray-200 outline-none px-1"
              />

              {/* Voice (UI only) */}
              <button
                type="button"
                className="text-gray-400 hover:text-red-400 transition"
              >
                <MdKeyboardVoice size={22} />
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center rounded-full bg-sky-900 p-2 hover:scale-110 transition"
              >
                {sending ? (
                  <div className="loading loading-spinner text-white"></div>
                ) : (
                  <IoSend
                    size={20}
                    className="text-sky-900 bg-white rounded-full p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
