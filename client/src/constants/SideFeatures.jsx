import { MdHomeFilled } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { TbSquareForbid } from "react-icons/tb";
import logo from "/logo.png";
import { CgMoreO } from "react-icons/cg";
import { RiFileListLine } from "react-icons/ri";
import { LuBookMarked } from "react-icons/lu";


export const sideFeatures = [
    {
        title: "Home",
        icon: <MdHomeFilled />,
        path: "/",
    },
    {
        title: "Explore",
        path: "/explore",
        icon: <FiSearch />,
    },
    {
        title: "Notifications",
        path: "/notification",
        icon: <IoNotifications />
    },
    {
        title: "Messages",
        path: "/messages",
        icon: <IoMailOutline />
    },
    {
        title: "Bookmarks",
        path: "/bookmarks",
        icon: <LuBookMarked />
    },
    {
        title: "Grok",
        path: "/grok",
        icon: <TbSquareForbid />
    },
    {
        title: "Lists",
        path: "/lists",
        icon: <RiFileListLine />
    },
    {
        title: "Communities",
        path: "/communities",
        icon: <FiUsers />
    },
    {
        title: "Premium",
        path: "/premium",
        icon: <img
            src={logo}
            className="h-5 w-auto object-contain"
        />
    },
    {
        title: "Profile",
        path: "/profile",
        icon: <FaRegUser />
    },
    {
        title: "More",
        icon: <CgMoreO />
    },
];