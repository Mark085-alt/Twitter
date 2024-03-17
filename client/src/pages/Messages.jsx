import { useEffect, useState } from 'react';
import Spinner from "../components/common/Spinner.jsx";
import { useSelector } from "react-redux"
import { getAllChats } from "../services/chatService.js"
import { useNavigate } from "react-router-dom"

const Messages = () => {

    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [allChats, setAllChats] = useState([]);
    const [allData, setAllData] = useState([]);
    const userState = useSelector(state => state.auth.user);
    const navigate = useNavigate();


    useEffect(() => {
        setLoading(true);
        getAllChats()
            .then(({ data }) => {
                setAllData(data.data);
                setAllChats(data.data);
            })
            .catch((err) => { console.log("ERROR: ", err) })
            .finally(() => { setLoading(false) })
    }, []);


    useEffect(() => {

        if (searchValue.trim().length > 0) {

            const searchedData = allData.map((chat) => {

                // find the opposit or receiver user
                const receiverUser = chat.users.find(user => user._id !== userState._id);

                // then compare
                if (receiverUser && (receiverUser.userName.toLowerCase().includes(searchValue.toLowerCase()) || receiverUser.fullName.toLowerCase().includes(searchValue.toLowerCase()))) {
                    return chat;
                }
            })
                .filter(chat => chat !== undefined);

            setAllChats(searchedData);

        } else {
            setAllChats(allData);
        }

    }, [searchValue]);


    return (
        <div>
            {
                loading ? (
                    <Spinner />
                ) : (
                    <div className='w-full '>

                        {/* navbar */}
                        <div className='flex flex-row gap-5 justify-between items-center bg-black border-b-2 border-white/[0.2] p-3 w-full'>

                            <div className='w-full'>
                                <input
                                    type="text"
                                    className='w-full outline-none bg-transparent font-semibold text-lg px-4 rounded-full py-2 text-white/[0.8] focus-within:border-blue-400 border-2 border-white/[0.3] transition-all duration-300 ease-in-out'
                                    placeholder='Search users'
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* users */}
                        <div className='flex flex-col pb-14'>
                            {
                                allChats.length > 0 ? (
                                    allChats.map((chats) => (
                                        <button
                                            key={chats._id}
                                            onClick={() => navigate(`/chat/${chats._id}/${chats.users[0]._id === userState._id ? chats.users[1].userName : chats.users[0].userName}`)}
                                            className='flex border-b-2 border-white/[0.2] cursor-pointer w-full hover:bg-white/[0.1] transition-all duration-300 ease-in-out justify-start gap-3 p-2 items-center'
                                        >
                                            {/* user-image */}
                                            <div className='h-12 w-12 ml-2'>
                                                <img src={chats.users[0]._id === userState._id ? chats.users[1].profileImg : chats.users[0].profileImg} className=' w-full h-full object-contain rounded-full' alt="user-profile" />
                                            </div>

                                            {/* user name */}
                                            <div className='flex flex-col text-white justify-start items-start'>
                                                <p className='font-bold'>{chats.users[0]._id === userState._id ? chats.users[1].fullName : chats.users[0].fullName}</p>
                                                <p className='text-white/[0.5] font-light'>@{chats.users[0]._id === userState._id ? chats.users[1].userName : chats.users[0].userName}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className='w-full mt-10'>
                                        <p className='text-white text-center font-bold text-4xl {
                                }'>No chat found</p>
                                    </div>
                                )
                            }
                        </div>
                    </div >
                )
            }

        </div >
    )
}

export default Messages