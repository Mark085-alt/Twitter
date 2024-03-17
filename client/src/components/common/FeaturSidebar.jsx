import React, { useState } from 'react';
import { sideFeatures } from "../../constants/SideFeatures";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { authLogout } from "../../redux/slices/authSlice.js";

const FeaturSidebar = () => {
  const userState = useSelector(state => state.auth.user)

  const [option, setoption] = useState(sideFeatures[0]?.title);
  const navigate = useNavigate();
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const dispatch = useDispatch();

  function buttonHandler(set) {

    if (set.title === "More") {

      setShowMoreOptions(!showMoreOptions);

    } else {

      setoption(set.title);
      navigate(
        set.title === "Profile" ? `${set.path}/${userState.userName}` : set.path
      );

    }




  }

  async function logoutHandler() {
    dispatch(authLogout())
  }


  return (

    <div>
      <div className='flex relative flex-col pr-10 pt-2 overflow-auto pb-5 h-screen border-r-2 border-[white]/[0.15] justify-start items-start gap-1'>

        <div className='cursor-pointer p-4 transition-all ease-in-out duration-200 hover:bg-[white]/[0.1] rounded-full'>
          <img
            src={logo}
            className="h-7 w-auto  object-contain"
          />
        </div>

        <div className='flex relative flex-col pt-2 justify-start items-start gap-[5px]'>

          {
            sideFeatures?.map((set) => (
              <div
                key={set.title}
              >
                <div
                  onClick={() => buttonHandler(set)}
                  className='flex text-white gap-4 pl-3 pr-7 py-2 transition-all duration-300 ease-in-out hover:bg-[white]/[0.1] rounded-full cursor-pointer justify-start items-center'
                >
                  <span className='text-2xl'>{set.icon}</span>
                  <span className={`text-xl transition-all duration-200 ease-in-out ${option === set.title ? "font-bold" : ""}`}>{set.title}</span>
                </div>

              </div>
            ))
          }

          <div className={`bg-[#3a3636] transition-all duration-300 ease-in-out p-3 font-semibold rounded-lg w-full absolute bottom-12  ${showMoreOptions ? " block" : "hidden"} `}>

            <button
              onClick={logoutHandler}
              className='text-white hover:bg-black  pl-3 pr-5 py-2 transition-all duration-300 ease-in-out rounded-full '>Logout</button>

          </div>

        </div>

      </div>
    </div >
  )
}

export default FeaturSidebar