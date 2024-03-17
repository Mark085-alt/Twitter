import React from 'react'
import { useNavigate } from "react-router-dom"
import { RxCross1 } from "react-icons/rx";

const ShowUsersList = ({ title, accounts, setShowFollowers }) => {
    const navigate = useNavigate();

    return (
        <div>
            <div className='fixed flex justify-center items-center w-screen left-0 top-0 z-50 bg-black/[0.6] h-screen'>
                <div className='flex relative min-h-[300px] min-w-[300px] bg-[#2f2c2c] gap-1 rounded-md p-5 flex-col justify-start items-start'>
                    <span onClick={() => setShowFollowers(null)} className=' text-white right-2 absolute top-2 cursor-pointer text-2xl'>
                        <RxCross1 />
                    </span>

                    <div className='w-full border-b-2 pb-3 border-white/[0.3]'>
                        <p className='text-white text-center font-bold text-2xl'>{title}</p>
                    </div>

                    <div className='flex w-full pt-3 flex-col gap-2 text-white '>

                        {
                            accounts?.length > 0 ? (
                                accounts.map((account) => (
                                    <div
                                        key={account._id}
                                        className='flex cursor-pointer hover:bg-white/[0.1] transition-all duration-300 ease-in-out rounded-full p-1 w-full justify-start items-center gap-3'
                                    >
                                        <div>
                                            <img
                                                src={account.profileImg}
                                                alt={account.userName}
                                                className='h-12 w-12 rounded-full object-cover'
                                            />
                                        </div>
                                        <div onClick={() => {
                                            setShowFollowers(null);
                                            navigate(`/profile/${account.userName}`);
                                        }}
                                            className='flex flex-col text-sm overflow-hidden text-white/[0.8] justify-normal items-start'>
                                            <p className='font-bold'>{account.fullName}</p>
                                            <p >@{account.userName}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    No user found
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ShowUsersList