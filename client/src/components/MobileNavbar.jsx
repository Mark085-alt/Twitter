import React from 'react';
import { MdHome } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"



const MobileNavbar = () => {

    const userState = useSelector(state => state.auth.user);

    const navIcons = [
        {
            icon: <MdHome />,
            path: "/",
            title: "home",
        },
        {
            icon: <FiSearch />,
            path: "/explore",
            title: "search",
        },
        {
            icon: <FaUser />,
            path: `/profile/${userState.userName}`,
            title: "profile",
        },
        {
            icon: <FaBell />,
            path: "/notification",
            title: "notification",
        },
        {
            icon: <FaRegEnvelope />,
            path: "/messages",
            title: "messages",
        },
    ];


    return (
        <div className='w-full'>
            <div className='bg-black justify-between items-center flex w-full px-8 py-4'>
                {
                    navIcons?.map((set, index) => (
                        <Link key={set.title + index} to={set.path}>
                            <span className='text-white text-2xl'>
                                {set.icon}
                            </span>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default MobileNavbar