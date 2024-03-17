import React, { useState, useEffect, useRef } from 'react'
import { getSearchedValue } from "../services/userService.js"
import { FiSearch } from "react-icons/fi"
import { BsXCircleFill } from "react-icons/bs"
import UserAccount from "../components/UserAccount.jsx";
import UserSkeleton from "../components/common/UserSkeleton.jsx";

const Explore = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const searchBarRef = useRef(null);
    const [searchedData, setSearchedData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Handle click outside the search bar to close the results div
    const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    // Add event listener for clicks outside on component mount, remove on unmount
    useEffect(() => {
        const listener = document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', listener);
    }, []);


    useEffect(() => {

        if (searchValue.trim()) {
            setSearchLoading(true);

            getSearchedValue(searchValue)
                .then(({ data }) => {
                    setSearchedData(data.data)
                })
                .catch((err) => {
                    console.log("ERROR: ", err)
                })
                .finally(() => {
                    setSearchLoading(false);
                })
        }

    }, [searchValue]);



    return (
        <div className='mt-2 px-3'>

            <div ref={searchBarRef}
                className='relative w-full'>
                {/* Search Bar */}
                <div
                    onClick={() => {
                        if (!isOpen) {
                            setIsOpen(true);
                        }
                    }}
                    className='flex relative w-full justify-center group focus-within:border-blue-500 transition-all duration-200 ease-in-out border-2 border-transparent  items-center gap-2 bg-[#202327] rounded-full px-3'
                >
                    <span className='text-[white]/[0.2] group-focus-within:text-blue-500 text-lg'>
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder='Search'
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                        className='bg-transparent outline-none w-full  px-1 py-2  text-white placeholder:text-[white]/[0.3]'
                    />


                    {
                        searchValue &&
                        <span onClick={() => setSearchValue("")} className="text-blue-400 hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer text-xl">
                            <BsXCircleFill />
                        </span>
                    }

                </div>

                {/* Other Div */}
                {isOpen && (
                    <div
                        className='absolute z-10 bg-black max-h-[500px] overflow-auto mt-1 shadow-lg rounded-md border-[2px] border-white/[0.2] shadow-white/[0.2] w-full '
                    >
                        {
                            searchLoading ? (
                                <>
                                    <UserSkeleton />
                                    <UserSkeleton />
                                </>
                            ) : (
                                <>
                                    {
                                        searchValue.length > 0 ? (
                                            <div className='flex flex-col text-white min-h-[100px] gap-1 w-full justify-start items-start'>
                                                {
                                                    searchedData.length > 0 ? (
                                                        searchedData?.map((userData) => (
                                                            <UserAccount key={userData._id} user={userData} nextSend={false} />
                                                        ))
                                                    ) : (
                                                        <div className='text-lg p-3 text-white/[0.5]'>
                                                            <p>No user found</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <div className='text-base pb-10 w-full  px-7 pt-5 font-light text-white/[0.5]'>
                                                <p>Try searching for people, lists, or keywords</p>
                                            </div>
                                        )
                                    }
                                </>
                            )}
                    </div>

                )}
            </div>

        </div>
    )
}

export default Explore