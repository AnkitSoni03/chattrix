// import React, { useEffect, useState,useRef  } from 'react'
// import userConversation from '../../Zustans/useConversation';
// import { useAuth } from '../../context/AuthContext';
// import { TiMessages } from "react-icons/ti";
// import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
// import axios from 'axios';
// import { useSocketContext } from '../../context/SocketContext';
// import notify from '../../assets/sound/notification.mp3';

// const MessageContainer = ({ onBackUser }) => {
//     const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
//     const {socket} = useSocketContext();
//     const { authUser } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const [sending , setSending] = useState(false);
//     const [sendData , setSnedData] = useState("")
//     const lastMessageRef = useRef();

//     useEffect(()=>{
//       socket?.on("newMessage",(newMessage)=>{
//         const sound = new Audio(notify);
//         sound.play();
//         setMessage([...messages,newMessage])
//       })

//       return ()=> socket?.off("newMessage");
//     },[socket,setMessage,messages])

//     useEffect(()=>{
//         setTimeout(()=>{
//             lastMessageRef?.current?.scrollIntoView({behavior:"smooth"})
//         },100)
//     },[messages])

//     useEffect(() => {
//         const getMessages = async () => {
//             setLoading(true);
//             try {
//                 const get = await axios.get(`/api/message/${selectedConversation?._id}`);
//                 const data = await get.data;
//                 if (data.success === false) {
//                     setLoading(false);
//                     console.log(data.message);
//                 }
//                 setLoading(false);
//                 setMessage(data);
//             } catch (error) {
//                 setLoading(false);
//                 console.log(error);

//             }
//         }

//         if (selectedConversation?._id) getMessages();
//     }, [selectedConversation?._id, setMessage])
//     console.log(messages);

//     const handelMessages=(e)=>{
//         setSnedData(e.target.value)
//       }

//     const handelSubmit=async(e)=>{
//         e.preventDefault();
//         setSending(true);
//         try {
//             const res =await axios.post(`/api/message/send/${selectedConversation?._id}`,{messages:sendData});
//             const data = await res.data;
//             if (data.success === false) {
//                 setSending(false);
//                 console.log(data.message);
//             }
//             setSending(false);
//             setSnedData('')
//             setMessage([...messages,data])
//         } catch (error) {
//             setSending(false);
//             console.log(error);
//         }
//     }

//     return (
//         <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
//         {selectedConversation === null ? (
//           <div className='flex items-center justify-center w-full h-full'>
//             <div className='px-4 text-center text-2xl text-gray-950 font-semibold 
//             flex flex-col items-center gap-2'>
//               <p className='text-2xl'>Welcome!!👋 {authUser.username}😉</p>
//               <p className="text-lg">Select a chat to start messaging</p>
//               <TiMessages className='text-6xl text-center' />
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className='flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12'>
//               <div className='flex gap-2 md:justify-between items-center w-full'>
//                 <div className='md:hidden ml-1 self-center'>
//                   <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1
//                    self-center'>
//                     <IoArrowBackSharp size={25} />
//                   </button>
//                 </div>
//                 <div className='flex justify-between mr-2 gap-2'>
//                   <div className='self-center'>
//                     <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic} />
//                   </div>
//                   <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
//                     {selectedConversation?.username}
//                   </span>
//                 </div>
//               </div>
//             </div>
      
//             <div className='flex-1 overflow-auto'>
//               {loading && (
//                 <div className="flex w-full h-full flex-col items-center justify-center 
//                 gap-4 bg-transparent">
//                   <div className="loading loading-spinner"></div>
//                 </div>
//               )}
//               {!loading && messages?.length === 0 && (
//                 <p className='text-center text-white items-center'>Send a message to 
//                 start Conversation</p>
//               )}
//               {!loading && messages?.length > 0 && messages?.map((message) => (
//                 <div className='text-white' key={message?._id} ref={lastMessageRef}>
//                   <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
//                     <div className='chat-image avatar'></div>
//                     <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-sky-600' : ''

//                     }`}>
//                       {message?.message}
//                     </div>
//                     <div className="chat-footer text-[10px] opacity-80">
//                       {new Date(message?.createdAt).toLocaleDateString('en-IN')}
//                       {new Date(message?.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute:
//                          'numeric' })}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <form onSubmit={handelSubmit} className='rounded-full text-black'>
//             <div className='w-full rounded-full flex items-center bg-white'>
//               <input value={sendData} onChange={handelMessages} required id='message' type='text' 
//               className='w-full bg-transparent outline-none px-4 rounded-full'/>
//               <button type='submit'>
//                 {sending ? <div className='loading loading-spinner'></div>:
//                 <IoSend size={25}
//                 className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1'/>
//                 }
//               </button>
//             </div>
//             </form>
//           </>
//         )}
//       </div>
//     )
// }

// export default MessageContainer



















import React, { useEffect, useState, useRef } from 'react'
import userConversation from '../../Zustans/useConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext';
import notify from '../../assets/sound/notification.mp3';

const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
    const { socket } = useSocketContext();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSnedData] = useState("")
    const lastMessageRef = useRef();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const sound = new Audio(notify);
            sound.play();
            setMessage([...messages, newMessage])
        })

        return () => socket?.off("newMessage");
    }, [socket, setMessage, messages])

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }, [messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`/api/message/${selectedConversation?._id}`);
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
        }

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessage])

    const handelMessages = (e) => {
        setSnedData(e.target.value)
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { messages: sendData });
            const data = await res.data;
            if (data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSnedData('')
            setMessage([...messages, data])
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    }

    return (
        <div className='md:min-w-[500px] h-[99%] flex flex-col'>
            {selectedConversation === null ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='px-6 text-center flex flex-col items-center gap-6'>
                        <div className="bg-slate-700/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/30">
                            <TiMessages className='text-8xl text-teal-400 mb-4 mx-auto' />
                            <p className='text-2xl font-bold text-white mb-2'>
                                Welcome! 👋 <span className="text-teal-400">{authUser.username}</span> 😉
                            </p>
                            <p className="text-lg text-slate-300">Select a chat to start messaging</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className='flex items-center gap-3 bg-slate-700/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-600/30 mb-4'>
                        <div className='md:hidden'>
                            <button 
                                onClick={() => onBackUser(true)} 
                                className='bg-slate-600/50 hover:bg-slate-500/50 backdrop-blur-sm rounded-xl px-2 py-2 text-white transition-colors duration-200 border border-slate-500/30'>
                                <IoArrowBackSharp size={20} />
                            </button>
                        </div>
                        <div className='flex items-center gap-3 flex-1'>
                            <div className="relative">
                                <img 
                                    className='rounded-full w-10 h-10 md:w-12 md:h-12 cursor-pointer object-cover ring-2 ring-teal-500/50' 
                                    src={selectedConversation?.profilepic} 
                                    alt="User avatar"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className='text-white font-semibold text-lg'>
                                    {selectedConversation?.username}
                                </h3>
                                <p className="text-slate-400 text-sm">Online</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className='flex-1 overflow-auto px-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent'>
                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center gap-4">
                                <div className="bg-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30">
                                    <div className="loading loading-spinner text-teal-400"></div>
                                    <p className="text-slate-300 mt-2">Loading messages...</p>
                                </div>
                            </div>
                        )}
                        {!loading && messages?.length === 0 && (
                            <div className="flex w-full h-full items-center justify-center">
                                <div className="bg-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 text-center">
                                    <p className='text-slate-300'>Send a message to start the conversation</p>
                                </div>
                            </div>
                        )}
                        {!loading && messages?.length > 0 && messages?.map((message) => (
                            <div className='mb-4' key={message?._id} ref={lastMessageRef}>
                                <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                                    <div className='chat-image avatar'></div>
                                    <div className={`chat-bubble border shadow-lg ${
                                        message.senderId === authUser._id 
                                            ? 'bg-teal-600 border-teal-500/30 text-white' 
                                            : 'bg-slate-700/70 border-slate-600/30 text-white backdrop-blur-sm'
                                    }`}>
                                        {message?.message}
                                    </div>
                                    <div className="chat-footer text-xs opacity-70 text-slate-400">
                                        {new Date(message?.createdAt).toLocaleDateString('en-IN')} {' '}
                                        {new Date(message?.createdAt).toLocaleTimeString('en-IN', { 
                                            hour: 'numeric', 
                                            minute: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="mt-4">
                        <form onSubmit={handelSubmit} className=''>
                            <div className='flex items-center gap-3 bg-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-2'>
                                <input 
                                    value={sendData} 
                                    onChange={handelMessages} 
                                    required 
                                    id='message' 
                                    type='text'
                                    className='flex-1 bg-transparent outline-none px-4 py-3 text-white placeholder-slate-400'
                                    placeholder="Type a message..."
                                />
                                <button 
                                    type='submit' 
                                    className='bg-teal-600 hover:bg-teal-700 rounded-xl p-3 text-white transition-colors duration-200 disabled:opacity-50'
                                    disabled={sending}>
                                    {sending ? 
                                        <div className='loading loading-spinner w-5 h-5'></div> :
                                        <IoSend size={20} />
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    )
}

export default MessageContainer