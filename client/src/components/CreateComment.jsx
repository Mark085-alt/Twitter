import React, { useState, useEffect, useRef } from 'react'
import Spinner from "../components/common/TransparencySpinner.jsx"
import { RxCross1 } from "react-icons/rx";
import CreatePost from "./CreatePost.jsx";
import { getPostTime } from "../utils/getTime.js";
import { useNavigate } from "react-router-dom"


const CreateComment = ({ post, setCommentBoxOpen }) => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    return (
        <div className='fixed top-0 px-5 bg-black/[0.35] flex justify-center items-center left-0 z-30 text-white w-screen h-screen'>
            {

                loading ?
                    <Spinner /> :
                    <div className='w-[500px] relative shadow-lg border-[1px] border-white shadow-white/[0.2] bg-black rounded-lg'>

                        {/* cross icon */}
                        <span onClick={() => setCommentBoxOpen(false)} className='text-white text-2xl absolute cursor-pointer top-3
                        right-2 '>
                            <RxCross1 />
                        </span>


                        <div className='flex w-full gap-2 p-5 justify-start items-start'>

                            {/* left part for image and bar  */}
                            <div className='flex flex-col justify-start gap-3 items-center h-full'>
                                {/* user profile image */}
                                <div className='rounded-full h-12 w-12 overflow-hidden'>
                                    <img src={post.user.profileImg} className='h-full w-full rounded-full object-contain' alt="userImage" />
                                </div>
                                <span className=' w-[2px] rounded-full bg-white'> </span>
                            </div>

                            {/* right paart for description and user details */}
                            <div className='flex flex-col h-full gap-2 justify-start items-start'>

                                {/* user info */}
                                <div className='flex items-center justify-center gap-1'>
                                    <span className='text-white font-bold hover:underline cursor-pointer'>{post?.user?.fullName}</span>

                                    <span className='text-[white]/[0.5] font-light cursor-pointer'>@{post?.user?.userName}</span>

                                    <div className='bg-[white]/[0.5] rounded-full h-[3px] w-[3px]'></div>

                                    <span className='text-[white]/[0.5] font-light '>
                                        {getPostTime(post?.createdAt)}</span>
                                </div>

                                {/* post descritpion */}
                                <div className='text-white text-lg '>
                                    {post?.description}
                                </div>

                                {/* replying to  */}
                                <div>
                                    <p className='  text-blue-400 '>replying to @
                                        <span
                                            onClick={() => {
                                                navigate(`/profile/${post?.user?.userName}`)
                                            }}
                                            className='cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out hover:underline'>{post?.user?.userName}</span></p>
                                </div>
                            </div>

                        </div>

                        {/* createPost */}
                        <div className='w-full '>
                            <CreatePost setIsLoading={setLoading} setCommentBoxOpen={setCommentBoxOpen} type={"Comment"} postId={post._id} />
                        </div>

                    </div>
            }
        </div >
    )
}

export default CreateComment