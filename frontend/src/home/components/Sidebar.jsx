import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustans/useConversation';
import { useSocketContext } from '../../context/SocketContext';

// Logout Modal Component
const LogoutModal = ({ username, onConfirm, onCancel }) => {
    const [input, setInput] = useState("");

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-gray-900 rounded-2xl shadow-lg w-96 p-6 text-white">
                <h2 className="text-xl font-semibold text-center mb-4">Confirm Logout</h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                    Type <span className="font-bold text-sky-400">{username}</span> to logout
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
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
    const { onlineUser, socket } = useSocketContext();

    const [showLogout, setShowLogout] = useState(false); // 👈 modal state

    const nowOnline = chatUser.map((user) => (user._id));
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setNewMessageUsers(newMessage)
        })
        return () => socket?.off("newMessage");
    }, [socket, messages])

    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])

    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    //  logout with modal
    const handelLogOut = async () => {
        setShowLogout(true);
    };

    const confirmLogout = async () => {
        setLoading(true)
        try {
            const logout = await axios.post('/api/auth/logout')
            const data = logout.data;
            if (data?.success === false) {
                setLoading(false)
                console.log(data?.message);
            }
            toast.info(data?.message)
            localStorage.removeItem('chattrix')
            setAuthUser(null)
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };

    return (
        <div className="h-full w-auto px-3 py-2 bg-[#0d1117] rounded-2xl shadow-lg border border-gray-800 text-white">
            {/* Search + Profile */}
            <div className="flex justify-between items-center gap-2">
                <form onSubmit={handelSearchSubmit} className="flex items-center w-full bg-[#1c1f26] rounded-full px-3 shadow-md border border-gray-700">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type="text"
                        className="px-2 py-2 w-full bg-transparent outline-none text-sm text-gray-300"
                        placeholder="Search user..."
                    />
                    <button className="p-2 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:scale-110 transition">
                        <FaSearch size={16} />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className="h-12 w-12 rounded-full border-2 border-sky-500 hover:scale-110 transition cursor-pointer"
                />
            </div>

            <div className="divider border-t border-gray-700 my-3"></div>

            {/* Search Results */}
            {searchUser?.length > 0 ? (
                <>
                    <div className="h-[70%] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600">
                        {searchUser.map((user, index) => (
                            <div key={user._id} onClick={() => handelUserClick(user)}
                                className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer hover:bg-sky-700/40 transition ${selectedUserId === user?._id ? 'bg-sky-600/40' : ''}`}>
                                <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                    <div className="w-12 rounded-full ring-2 ring-sky-500">
                                        <img src={user.profilepic} alt="user.img" />
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="font-semibold text-gray-200">{user.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button onClick={handSearchback} className="bg-sky-600 hover:bg-sky-700 transition text-white rounded-full p-2">
                            <IoArrowBackSharp size={22} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="h-[70%] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600">
                        {chatUser.length === 0 ? (
                            <div className="flex flex-col items-center text-gray-400 text-sm mt-10">
                                <h1 className="text-lg text-yellow-400 font-bold">Why are you Alone!! 🤔</h1>
                                <p>Search username to start chatting</p>
                            </div>
                        ) : (
                            chatUser.map((user, index) => (
                                <div key={user._id} onClick={() => handelUserClick(user)}
                                    className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer hover:bg-sky-700/40 transition ${selectedUserId === user?._id ? 'bg-sky-600/40' : ''}`}>
                                    <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                        <div className="w-12 rounded-full ring-2 ring-teal-500">
                                            <img src={user.profilepic} alt="user.img" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className="font-semibold text-gray-200">{user.username}</p>
                                    </div>
                                    {newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id && (
                                        <div className="rounded-full bg-green-600 text-xs font-semibold text-white px-2 py-1">+1</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 px-1">
                        <button onClick={handelLogOut} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition">
                            <BiLogOut size={20} /> <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </>
            )}

            {/* Logout Modal */}
            {showLogout && (
                <LogoutModal
                    username={authUser.username}
                    onConfirm={confirmLogout}
                    onCancel={() => setShowLogout(false)}
                />
            )}
        </div>
    )
}

export default Sidebar
