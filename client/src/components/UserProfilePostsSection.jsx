import React, { useState, useEffect } from 'react';
import InfinitePosts from "./InfinitePosts";
import Highlights from "./Highlights";


const profileSection = [
    {
        title: "Posts",
    },
    {
        title: "Replies",
    },
    {
        title: "Highlights",
    },
    {
        title: "Media",
    },
    {
        title: "Likes",
    }
];


const UserProfilePostsSection = ({ userName }) => {


    const [option, setOption] = useState(profileSection[0]);


    return (
        <div className='w-full'>

            {/* To show different content, it's kind of navbar*/}
            <div className='flex mt-5 w-full justify-between items-center'>
                {
                    profileSection.map((set, index) => (
                        <div
                            key={set + index}
                            onClick={() => setOption(set)}
                            className=' transition-all flex flex-col pt-4 duration-300 ease-in-out cursor-pointer hover:bg-[white]/[0.1] gap-2 px-2 w-full justify-between items-center'
                        >
                            <span className={` transition-all px-1 text-[15px] duration-300 ease-in-out ${option.title === set.title ? "text-white font-semibold " : "text-[white]/[0.4]"}`}>{set.title}</span>

                            <span className={` bg-blue-400 transition-all duration-300 ease-in-out h-1 w-full rounded-full ${option.title === set.title ? "opacity-100" : " opacity-0"}`}></span>

                        </div>
                    ))
                }
            </div>

            {/* posts data */}
            <div className='w-full mt-7 mb-2 text-white'>
                {
                    option.title === "Highlights" ? (
                        <Highlights />
                    ) : (
                        <InfinitePosts
                            userName={userName}
                            option={option}
                        />
                    )
                }
            </div>
        </div>
    )
}


export default UserProfilePostsSection;


