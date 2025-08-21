/* eslint-disable */

import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../Zustans/useConversation";
import { useSocketContext } from "../../context/SocketContext";

// Logout Modal Component
const LogoutModal = ({ username, onConfirm, onCancel }) => {
  const [input, setInput] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-gray-900 rounded-2xl shadow-lg w-96 p-6 text-white">
        <h2 className="text-xl font-semibold text-center mb-4">
          Confirm Logout
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Type <span className="font-bold text-sky-400">{username}</span> to
          logout
        </p>

        <input
          type="text"
          placeholder="Enter username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-sky-500 outline-none mb-4"
        />

        <div className="flex justify-between gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (input === username) onConfirm();
              else toast.error("Wrong username typed");
            }}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition flex items-center justify-center gap-2"
          >
            <BiLogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSetSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const {
    messages,
    setMessage,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const [showLogout, setShowLogout] = useState(false); // 👈 modal state

  const nowOnline = chatUser.map((user) => user._id);
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });
    return () => socket?.off("newMessage");
  }, [socket, messages]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handelUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSetSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  const handSearchback = () => {
    setSearchuser([]);
    setSearchInput("");
  };

  //  logout with modal
  const handelLogOut = async () => {
    setShowLogout(true);
  };

  const confirmLogout = async () => {
    setLoading(true);
    try {
      const logout = await axios.post("/api/auth/logout");
      const data = logout.data;
      if (data?.success === false) {
        setLoading(false);
        console.log(data?.message);
      }
      toast.info(data?.message);
      localStorage.removeItem("chattrix");
      setAuthUser(null);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full sm:w-72 md:w-80 px-2 sm:px-3 py-2 bg-[#0d1117] rounded-2xl shadow-lg border border-gray-800 text-white flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center gap-2 p-2 rounded-lg border-b border-gray-700/50 mb-3">
        {/* App Logo */}
        <div className="flex items-center gap-0">
          <img
            src="/chattrix-logo-removebg-preview-new.png"
            alt="Chattrix Logo"
            className="h-8 sm:h-10"
          />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-1 relative">
          <div className="relative cursor-pointer group">
            <img
              src={authUser?.profilepic}
              alt="Profile"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-emerald-500/70 hover:border-emerald-400 group-hover:scale-110 transition-all duration-300 object-cover"
            />

            {/* Online Dot */}
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border-2 border-gray-900 rounded-full">
              <div className="absolute inset-0.5 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <span className="text-xs font-medium text-emerald-400 max-w-[50px] sm:max-w-[60px] truncate">
            {authUser?.username}
          </span>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="mb-3">
        <form onSubmit={handelSearchSubmit} className="relative">
          <div className="relative flex items-center bg-gray-800/60 rounded-xl px-3 py-2.5 border border-gray-600/40 hover:border-sky-500/60 focus-within:border-sky-500 focus-within:bg-gray-800/80 transition-all duration-300 shadow-sm">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              className="w-full bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400 pr-10"
              placeholder="Search users..."
            />
            <button
              type="submit"
              className="absolute right-2 p-1.5 rounded-lg bg-sky-600/90 hover:bg-sky-500 text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <FaSearch size={12} />
            </button>
          </div>
        </form>
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search Results or Chat Users */}
        {searchUser?.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600 space-y-1">
              {searchUser.map((user, index) => (
                <div
                  key={user._id}
                  onClick={() => handelUserClick(user)}
                  className={`flex gap-2 sm:gap-3 items-center rounded-lg p-2 cursor-pointer hover:bg-sky-700/40 transition-all duration-200 ${
                    selectedUserId === user?._id ? "bg-sky-600/40" : ""
                  }`}
                >
                  <div className={`avatar ${isOnline[index] ? "online" : ""}`}>
                    <div className="w-10 sm:w-12 rounded-full ring-2 ring-sky-500">
                      <img src={user.profilepic} alt="user.img" />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-semibold text-gray-200 text-sm sm:text-base truncate">
                      {user.username}
                    </p>
                    <div className="divider border-gray-700 my-0"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center">
              <button
                onClick={handSearchback}
                className="bg-sky-900 hover:bg-sky-950 transition-all duration-200 text-white rounded-full p-2 shadow-sm"
              >
                <IoArrowBackSharp size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600 space-y-1">
            {chatUser.length === 0 ? (
              <div className="flex flex-col items-center text-gray-400 text-sm mt-8 sm:mt-10 px-4">
                <h1 className="text-base sm:text-lg text-yellow-400 font-bold text-center">
                  Why are you Alone!! 🤔
                </h1>
                <p className="text-center mt-1">
                  Search username to start chatting
                </p>
              </div>
            ) : (
              chatUser.map((user, index) => (
                <div
                  key={user._id}
                  onClick={() => handelUserClick(user)}
                  className={`flex gap-2 sm:gap-3 items-center rounded-lg p-2 cursor-pointer hover:bg-sky-700/40 transition-all duration-200 ${
                    selectedUserId === user?._id ? "bg-sky-600/40" : ""
                  }`}
                >
                  <div className={`avatar ${isOnline[index] ? "online" : ""}`}>
                    <div className="w-10 sm:w-12 rounded-full ring-2 ring-teal-500">
                      <img src={user.profilepic} alt="user.img" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-semibold text-gray-200 text-sm sm:text-base truncate">
                      {user.username}
                    </p>
                    <div className="divider border-gray-700 my-0"></div>
                  </div>
                  {newMessageUsers.reciverId === authUser._id &&
                    newMessageUsers.senderId === user._id && (
                      <div className="rounded-full bg-green-600 text-xs font-semibold text-white px-2 py-1 flex-shrink-0">
                        +1
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer - Logout Button (Fixed at bottom with proper spacing) */}
      <div className="border-t border-gray-700/60 pt-2 mt-2">
        <div className="px-1">
          <button
            onClick={handelLogOut}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm w-auto mx-auto"
          >
            <BiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogout && (
        <LogoutModal
          username={authUser.username}
          onConfirm={confirmLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
