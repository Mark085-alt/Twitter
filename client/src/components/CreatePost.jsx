import React, { useState, useEffect, useRef } from 'react'
import { FiImage } from "react-icons/fi"; import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";
import { createPost as createPostApi, createComment as createCommentApi } from "../services/postService.js"
import toast from "react-hot-toast";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BiPoll } from "react-icons/bi";
import { TbCalendarTime } from "react-icons/tb";
import { GrLocation } from "react-icons/gr";
import InputEmoji from "react-input-emoji";



const CreatePost = ({ setIsLoading, type, postId, setCommentBoxOpen }) => {

    const state = useSelector(state => state.auth);

    const textAreaRef = useRef(null);
    const fileRef = useRef(null);

    const [openEmoji, setOpenEmoji] = useState(false);
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);


    // for auto growing textarea
    useEffect(() => {
        if (textAreaRef.current) {

            // We need to reset the height momentarily to get the correct scrollHeight for the textarea
            textAreaRef.current.style.height = "0px";
            let scrollHeight = textAreaRef.current.scrollHeight;

            // Check if scrollHeight exceeds the maximum height
            if (scrollHeight > 300) {
                textAreaRef.current.style.height = "300px"; // Set height to maximum
                textAreaRef.current.style.overflowY = "scroll"; // Enable vertical scrollbar
            } else {
                // Set the height of the textarea to match its content
                textAreaRef.current.style.height = scrollHeight + "px";
                textAreaRef.current.style.overflowY = "hidden"; // Hide vertical scrollbar
            }

        }
    }, [textAreaRef.current, description]);


    function fileRefHandler() {
        if (fileRef.current) {
            fileRef.current.click();
        }
    }

    function fileChangeHandler(e) {

        const temp = [...files];

        Array.from(e.target.files)
            .forEach((file) => {
                temp.push(file);
            })

        if (temp.length > 4) {
            toast.error("Please choose up to 4 photos, videos, or GIFs.",
                {
                    position: "bottom-center"
                }
            );
            return;
        }

        setFiles(temp);

    }

    function fileRemoveHandler(removingFile) {
        const temp = [...files];
        setFiles(
            temp.filter((file) => file !== removingFile)
        );
    }


    const createHandler = async () => {

        setIsLoading(true);

        const fd = new FormData();

        fd.append("description", description);

        for (const file of files) {
            fd.append("post", file, file.name);

        }

        if (type === "Post") {
            await createPostApi(fd)
                .then(() => {
                    toast.success("Post created!");
                    setDescription("");
                    setFiles([]);
                }).catch((error) => {
                    console.log("error: ", error);
                    toast.error(error.message);
                })
                .finally(() => {
                    setIsLoading(false);
                })

        } else {

            fd.append("postId", postId);

            await createCommentApi(fd)
                .then(() => {
                    toast.success("Comment created!");
                    setDescription("");
                    setFiles([]);
                    setCommentBoxOpen(false);

                }).catch((error) => {
                    console.log("error: ", error);
                    toast.error(error.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });

        }

    }

    return (
        <div className='w-full'>
            <div className='w-ful py-3 bg-black  gap-2 flex justify-between items-start px-5 border-b-2 border-[white]/[0.2]'>

                {/* user-image */}
                <div className='overflow-hidden rounded-full h-12 w-12'>
                    <img
                        src={state?.user?.profileImg}
                        alt="profile-Image"
                        className='h-full w-full rounded-full object-cover'
                    />
                </div>

                {/* other content */}
                <div className='flex flex-col mt-2 justify-start items-start w-[calc(100%-60px)]'>
                    {/* input field and image */}
                    <div className='w-full '>

                        {/* text-area */}
                        <textarea
                            id='description'
                            name='description'
                            rows={1}
                            value={description}
                            ref={textAreaRef}

                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}

                            className='w-full  bg-transparent text-white resize-none outline-none text-xl'
                            placeholder='What is happening?!'
                        />

                        {/* files */}
                        <div className='overflow-hidden'>

                            {
                                files.length > 0 &&
                                <div
                                    className='flex max-w-[600px] overflow-x-scroll gap-2 mt-7'
                                >
                                    {
                                        files?.map((file, index) => (
                                            <div className=' w-[400px] overflow-hidden relative max-h-[400px]'
                                                key={index}
                                            >
                                                {/* remove button */}
                                                <abbr title="Remove">
                                                    <span
                                                        onClick={() => {
                                                            fileRemoveHandler(file);
                                                        }}
                                                        className='absolute z-10 shadow-md shadow-black transition-all duration-300 ease-in-out text-black cursor-pointer top-3 right-3 rounded-full p-2 text-lg hover:bg-[black]/[0.8] hover:text-[white]/[0.9] bg-[white]/[0.9]'>
                                                        <RiDeleteBin5Fill />
                                                    </span>
                                                </abbr>

                                                {
                                                    file.type.includes("video") ? (
                                                        <video
                                                            controls
                                                            src={URL.createObjectURL(file)}
                                                        />
                                                    ) : (
                                                        <img
                                                            className='w-full h-full object-contain'
                                                            src={URL.createObjectURL(file)}
                                                        />
                                                    )

                                                }


                                            </div>
                                        ))
                                    }
                                </div>
                            }

                        </div>


                    </div>

                    {/* other options for image/etc and post */}
                    <div className='flex gap-2 mt-3 w-full justify-between items-center'>

                        {/* other option */}
                        <div className='flex justify-center items-center gap-1 sm:gap-5'>

                            {/* image button */}
                            <abbr
                                title='Media'
                                onClick={fileRefHandler}
                                className='text-xl cursor-pointer text-blue-400'
                            >
                                <input
                                    type="file"
                                    hidden ref={fileRef}
                                    multiple
                                    onChange={fileChangeHandler}
                                />
                                <FiImage />
                            </abbr>

                            {/* Gifs button */}
                            <abbr title="Gifs" className='text-white '>
                                <div className='text-xl cursor-pointer text-blue-400'>
                                    <HiOutlineGif />
                                </div>
                            </abbr>

                            {/* poll button */}
                            <abbr title="Polls" className='text-white '>
                                <div className='text-xl cursor-pointer text-blue-400'>
                                    <BiPoll />
                                </div>
                            </abbr>

                            {/* Emoji button */}
                            <abbr
                                title="Emoji"
                                className='text-white relative '
                            >
                                <div
                                    onClick={() => {
                                        setOpenEmoji(!openEmoji);
                                    }}
                                    className='text-xl cursor-pointer text-blue-400'>
                                    <MdOutlineEmojiEmotions />
                                </div>

                                {
                                    openEmoji &&
                                    <InputEmoji
                                        cleanOnEnter
                                        theme='dark'
                                        className="bg-white"
                                        onEnter={(e) => {
                                            console.log(e)
                                        }}
                                    />
                                }
                            </abbr>

                            {/* schedule button */}
                            <abbr title="Schedule" className='text-white '>
                                <div className='text-xl cursor-pointer text-blue-400'>
                                    <TbCalendarTime />
                                </div>
                            </abbr>

                            {/* location button */}
                            <abbr title="Location" className='text-white '>
                                <div className='text-xl cursor-pointer text-blue-400'>
                                    <GrLocation />
                                </div>
                            </abbr>


                        </div>

                        {/* post button */}
                        <div>
                            <button
                                disabled={description.trim().length === 0 && files.length === 0}
                                onClick={createHandler}
                                className='bg-blue-400 disabled:opacity-50 text-white py-2 px-10 font-bold rounded-full'
                            >Post
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div >
    );
}

export default CreatePost;