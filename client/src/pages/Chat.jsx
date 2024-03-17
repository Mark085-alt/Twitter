import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { PiVideoCameraFill } from "react-icons/pi";
import { MdAddCall } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";
import { getMessages, addMessage } from "../services/chatService.js";
import { format } from "timeago.js"
import InputEmoji from "react-input-emoji";
import { io } from "socket.io-client"
import ChatSkeleton from '../components/common/ChatSkeleton.jsx';
import { getUserDetailsByUsername } from '../services/userService.js';
const BASE_URL = import.meta.env.VITE_SERVER_IO_URL;


const Chat = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const textAreaRef = useRef();
    const chatId = location.pathname.split("/").at(-2);
    const socket = useRef();
    const scroll = useRef();

    const [inputText, setInputText] = useState("")
    const [loading, setLoading] = useState(false);
    const [sendMessages, setSendMessages] = useState(null);
    const [recieveMessages, setRecieveMessages] = useState(null);

    const currentUser = useSelector(state => state.auth.user);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [disabled, setDisabled] = useState(false);



    // SocketIo implementation
    useEffect(() => {

        socket.current = io(BASE_URL);
        socket.current.emit("add-user", currentUser._id);

        socket.current.on("get-active-users", (activeUsers) => {
            setOnlineUsers(activeUsers);
        })

    }, [currentUser]);


    // Get user profile from database
    useEffect(() => {
        setLoading(true);

        const username = location.pathname.split("/").at(-1);

        getUserDetailsByUsername(username)
            .then(({ data }) => {
                setUserData(data.data?.existedUser);
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
            .finally(() => setLoading(false));

    }, [chatId]);


    // Get old Chat Message from database
    useEffect(() => {
        setLoading(true);
        getMessages(chatId)
            .then(({ data }) => {
                setMessages(data.data);
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
            .finally(() => setLoading(false))
    }, [chatId]);


    // Send messages to socket server
    useEffect(() => {
        if (sendMessages !== null) {
            socket.current.emit("send-message", sendMessages);
        }
    }, [sendMessages]);


    // recieve messages from socket server
    useEffect(() => {
        socket.current.on("recieve-message", (data) => {
            setRecieveMessages(data);
        });
    }, []);


    // for auto growing textarea
    useEffect(() => {
        if (textAreaRef.current) {

            // We need to reset the height momentarily to get the correct scrollHeight for the textarea
            textAreaRef.current.style.height = "0px";
            let scrollHeight = textAreaRef.current.scrollHeight;

            // Check if scrollHeight exceeds the maximum height
            if (scrollHeight > 150) {
                textAreaRef.current.style.height = "150px"; // Set height to maximum
                textAreaRef.current.style.overflowY = "scroll"; // Enable vertical scrollbar
            } else {
                // Set the height of the textarea to match its content
                textAreaRef.current.style.height = scrollHeight + "px";
                textAreaRef.current.style.overflowY = "hidden"; // Hide vertical scrollbar
            }

        }
    }, [inputText]);


    // Function for sending message
    const sendMessageHandler = async () => {

        if (inputText.trim().length <= 0) {
            return;
        }

        setDisabled(true);

        const payload = {
            chatId,
            sender: currentUser._id,
            content: inputText
        };

        addMessage(payload)
            .then(({ data }) => {
                setMessages([...messages, data.data]);
                setInputText("");
            }).catch((err) => {
                console.log("ERROR : ", err)
            })
            .finally(() => setDisabled(false));

        // Send message to socket server
        setSendMessages({ ...payload, userId: userData._id });
    };



    // recieve message
    useEffect(() => {

        if (recieveMessages !== null && recieveMessages.chatId === chatId) {
            setMessages([...messages, recieveMessages]);
        }

    }, [recieveMessages]);



    // scroll to the last message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div>
            <div className='w-full h-screen relative overflow-hidden'>

                {/* navbar */}
                <div className='w-full sticky top-0 pl-5 pr-2 py-1 border-b-2 border-white/[0.2] flex justify-between items-center bg-black'>

                    {/* for user details */}
                    <div className='flex gap-5'>
                        {/* profile image */}
                        <div className='h-14 w-14 overflow-hidden'>
                            <img
                                className='h-full w-full object-contain rounded-full'
                                src={userData?.profileImg}
                                alt={userData?.fullName}
                            />
                        </div>

                        {/* name */}
                        <div className='flex flex-col justify-center font-semibold items-start'>
                            <p className='text-white'>{userData?.fullName}</p>
                            <p onClick={() => navigate(`/profile/${userData?.userName}`)} className='text-white/[0.5] cursor-pointer hover:underline'>{userData?.userName}</p>
                        </div>
                    </div>

                    {/* for features */}
                    <div className='flex justify-center items-center gap-6'>
                        {/* calling features */}
                        <div className='flex gap-4 justify-center text-2xl items-center text-white/[0.9]'>

                            <abbr
                                className='cursor-pointer rounded-full transition-all duration-200 ease-in-out  p-2 hover:bg-white/[0.15]'

                                title="Video call">
                                <span >
                                    <PiVideoCameraFill />
                                </span>
                            </abbr>

                            <abbr
                                className='cursor-pointer rounded-full transition-all duration-200 ease-in-out  p-2 hover:bg-white/[0.15]'
                                title="Voice call"
                            >
                                <span >
                                    <MdAddCall />
                                </span>
                            </abbr>
                        </div>

                        {/* other options */}
                        <abbr
                            className='cursor-pointer text-xl transition-all duration-200 ease-in-out rounded-full p-2 hover:bg-white/[0.15] text-white/[0.9]'
                            title='More options'>
                            <HiDotsVertical />
                        </abbr>
                    </div>

                </div>

                <div className='w-full h-[calc(100vh-150px)]' >
                    {
                        loading ? (
                            <ChatSkeleton />
                        ) : (
                            <div className='w-full h-[calc(100vh-150px)] flex overflow-y-auto flex-col gap-5 p-5 text-white'>
                                {
                                    messages?.map((message) => (
                                        <div
                                            key={message._id}
                                            ref={scroll}
                                            className={`flex w-full ${message.sender === currentUser._id ? "justify-end pl-5" : "justify-start pr-5"} items-center`}
                                        >
                                            {/* message/content */}
                                            <div className='px-3 relative py-2 rounded-md bg-white/[0.2]'>
                                                {/* <span className='bg-white/[0.2] absolute -right-2 h-5 w-5 rotate-45 top-1'></span> */}
                                                <p className='text-white/[0.8] text-base'>{message.content}</p>
                                                <p className='text-white/[0.5] text-xs'>{format(message.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }

                </div>


                {/* footer */}
                <div className=' px-5  bg-black w-full border-t-2 border-white/[0.2] sticky bottom-0 pt-3 pb-5 gap-5 flex justify-between items-start'>

                    <div className='w-full'>
                        <textarea
                            type="text"
                            rows={1}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            ref={textAreaRef}
                            className='w-full  rounded-md bg-white/[0.2] text-white placeholder:text-white/[0.25] resize-none px-3 py-1 text-lg font-semibold outline-none'
                            placeholder='Send messages'
                        />
                    </div>

                    <div>
                        <button disabled={disabled} onClick={sendMessageHandler} className='flex bg-blue-500 text-white font-semibold rounded-full px-5 py-1 transition-all duration-200 ease-in-out gap-2 justify-center hover:shadow-sm hover:shadow-white items-center text-lg'>
                            <span>Send</span>
                            <span>
                                <MdSend />
                            </span>
                        </button>
                    </div>

                </div>

            </div>
        </div >
    );
}

export default Chat;