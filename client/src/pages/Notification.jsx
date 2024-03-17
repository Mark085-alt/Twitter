import React, { useEffect, useState } from 'react'
import { fetchNotification } from "../services/postService.js";
import Spinner from "../components/common/Spinner.jsx";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";


const Notification = () => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetchNotification()
      .then(({ data }) => {
        setData(data.data);
      }).catch((err) => {
        console.log("ERROR: ", err);
      })
      .finally(() => setLoading(false));

  }, []);


  return (
    <div className='w-full h-screen'>
      {
        loading ? (
          <Spinner />
        ) : (
          <div className='w-full h-full overflow-scroll pb-14'>
            {
              data.length > 0 ? (
                data?.map((notification) => (
                  <div
                    key={notification._id}
                    className='flex p-5 justify-start border-b-2 border-[white]/[0.2] w-full gap-3 items-start'
                  >
                    {/* for icon */}
                    <div>
                      <span className='text-blue-500 text-2xl'>
                        <FaUserAlt />
                      </span>
                    </div>

                    {/* user details */}
                    <div className='w-full gap-2 flex flex-col justify-normal items-start'>
                      {/* user profile image */}
                      <div className='overflow-hidden h-10 w-10'>
                        <img
                          src={notification.messageFrom?.profileImg}
                          alt="profilePic"
                          className='w-full h-full object-cover overflow-hidden rounded-full'
                        />
                      </div>

                      {/*  message */}
                      <div className='flex  text-white justify-center items-center gap-2'>
                        <Link to={`/profile/${notification.messageFrom.userName}`} className='font-bold hover:underline transition-all duration-300 ease-in-out'>{notification.messageFrom?.userName}</Link>
                        <p className=''>{notification.message}</p>
                      </div>

                    </div>

                  </div>
                ))

              ) : (
                <div className='w-full py-20'>
                  <p className='text-4xl text-center text-white font-bold'>No notification found</p>
                </div>
              )
            }
          </div>
        )
      }
    </div >
  )
}

export default Notification