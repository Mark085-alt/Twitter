import React, { useEffect, useRef, useState } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import Post from '../components/Post.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { fetchFeeds, fetchFollowingPosts } from "../services/postService.js";
import TransparencySpinner from '../components/common/TransparencySpinner.jsx';
import PostSkeleton from '../components/common/PostSkeleton.jsx';
import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import logo from "/logo.png"
import { useSelector } from "react-redux"
import Sidebar from "../components/common/FeaturSidebar.jsx"
import { RxCross1 } from "react-icons/rx";

const navLinks = [
    "For you",
    "Following",
];


const Home = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [allPosts, setAllPosts] = useState([]);
    const [isSkeleton, setIsSkeleton] = useState(false);
    const scrollDiv = useRef(null);
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const userState = useSelector(state => state.auth.user);

    const [option, setOption] = useState(navLinks[0]);



    async function fetchMoreData(currIndex) {

        setIsSkeleton(true);

        let func;

        switch (option) {

            case "For you":
                func = fetchFeeds;
                break;

            case "Following":
                func = fetchFollowingPosts;
                break;

            default:
                func = fetchFeeds;
                break;
        }

        func(currIndex)
            .then(({ data }) => {
                setAllPosts((prevItems) => [...prevItems, ...data.data]);
                setIndex(currIndex + 1);
                data?.data?.length === 10 ? setHasMore(true) : setHasMore(false);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsSkeleton(false));
    }


    useEffect(() => {
        // setIndex(0);
        setAllPosts([]);
        // setHasMore(true);
        fetchMoreData(0);
    }, [option]);


    return (
        <div className='w-full'>
            <div className='flex w-full relative flex-col justify-start items-center bg-black'>

                {/* Spinner */}
                {
                    isLoading &&
                    <TransparencySpinner />
                }

                {
                    openCreatePost && (
                        <div className='absolute z-10 bg-black/[0.6] w-screen h-screen flex justify-center items-center'>
                            <div className='relative max-w-[350px] sm:max-w-[500px]'>
                                <span onClick={() => setOpenCreatePost(false)} className='text-white absolute right-2 top-1 text-2xl'>
                                    <MdOutlineClose />
                                </span>
                                <CreatePost type={"Post"} setIsLoading={setIsLoading} />
                            </div>
                        </div>
                    )
                }

                {
                    showSidebar && (
                        <div className='w-full z-[100] bg-black/[0.3] absolute justify-start items-start flex'>
                            <div className='w-[300px] relative pl-5 bg-black transition-transform duration-1000 transform translate-x-0'>
                                <Sidebar />
                                <span
                                    onClick={() => setShowSidebar(false)}
                                    className='text-white transition-all duration-200 ease-in-out cursor-pointer hover:bg-white/[0.3] p-2 rounded-full text-2xl right-5 absolute top-5'
                                >
                                    <RxCross1 />
                                </span>
                            </div>
                        </div>
                    )
                }

                {/* navbar */}
                <div className={`sticky top-0 w-full backdrop-blur-2xl border-b-2 border-[white]/[0.19]  `}>

                    {/* mobile navbar */}
                    <div className='w-full lg:hidden px-4 pt-2 flex flex-row justify-between items-center'>

                        <div onClick={() => setShowSidebar(true)} className='w-10 cursor-pointer h-10 overflow-hidden'>
                            <img
                                src={userState.profileImg}
                                alt="profile"
                                className='w-full h-full object-contain rounded-full'
                            />
                        </div>

                        <div className='h-6  overflow-hidden'>
                            <img
                                src={logo}
                                alt="logo"
                                className='object-contain h-full w-auto'
                            />
                        </div>

                        <div className='cursor-pointer p-2 hover:bg-white/[0.2] rounded-full transition-all duration-200 ease-in-out'>
                            <span className='text-white text-2xl'>
                                <IoSettingsOutline />
                            </span>
                        </div>
                    </div>

                    {/* follow and following */}
                    <div className='flex flex-row justify-between w-full '>
                        {
                            navLinks?.map((navlink, index) => (
                                <div
                                    key={index}
                                    className='flex w-full hover:bg-[white]/[0.1] pt-3 transition-all duration-200 ease-in-out  cursor-pointer justify-center items-center flex-row gap-2'
                                    onClick={() => {
                                        setOption(navlink)
                                    }}
                                >
                                    <div className='flex flex-col gap-2 justify-center items-center'>
                                        <p className={` transition-all duration-300 ease-in-out ${option === navlink ? "text-white font-bold" : "text-[white]/[0.4] font-semibold"} `}>{navlink}</p>
                                        <span className={`bg-blue-400 transition-all duration-200 ease-in-out w-full h-1 rounded-full ${option === navlink ? "block" : "hidden"} `} />
                                    </div>
                                </div >
                            ))
                        }


                        <div className='hover:bg-[white]/[0.1] lg:flex hidden  transition-all duration-300 ease-in-out text-xl mx-2 text-white px-3 rounded-full  justify-center items-center cursor-pointer '>
                            <IoSettingsOutline />
                        </div>

                    </div >
                </div >


                {/* Feeds */}
                <div ref={scrollDiv} className='h-[calc(100vh-100px)] w-full bg-black overflow-y-auto' >
                    {
                        isSkeleton ? (
                            <div className='flex flex-col justify-start gap-5 items-center' >
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                            </div>
                        ) : (
                            <>

                                {
                                    option === "For you" &&
                                    <div>
                                        <CreatePost type={"Post"} setIsLoading={setIsLoading} />
                                    </div>
                                }


                                <div className='w-full flex pb-14 mt-5 flex-col gap-5 justify-start items-start'>

                                    {
                                        allPosts.length > 0 ? (
                                            allPosts.map((post) => (
                                                <Post key={post?._id} post={post} />
                                            ))
                                        ) : (
                                            <div className='w-full mt-10'>
                                                <p className='text-white text-center text-4xl font-bold'>No post found</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }

                </div >


                {/* Create post button */}
                <button onClick={() => { setOpenCreatePost(true) }} className='fixed lg:hidden right-5 bottom-16 rounded-full bg-blue-500 p-2 sm:p-4 shadow-md shadow-black ' >
                    <span className=' text-white text-4xl '>
                        <MdOutlineAdd />
                    </span>
                </button >

            </div >
        </div >
    );
}

export default Home;