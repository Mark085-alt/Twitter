import React, { lazy } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
const Landing = lazy(() => import('../pages/Landing'));
const FeatureSidebar = lazy(() => import('./common/FeaturSidebar'));
const TrendingSidebar = lazy(() => import('./common/TrendingSidebar'));
const MobileNavbar = lazy(() => import("./MobileNavbar"));

const ProtectedRoutes = () => {
    const userAuth = useSelector(state => state.auth.user);
    const { pathname } = useLocation();

    const isChatPage = pathname.startsWith('/chat/');

    return (
        userAuth ?
            <div className='justify-between relative h-screen overflow-hidden w-full items-start flex flex-row'>

                <div className='lg:block hidden'>
                    <FeatureSidebar />
                </div>
                <div className='border-r-2 h-screen w-full border-white/[0.15] xl:border-none'>
                    <Outlet />
                </div>
                <div className='xl:block hidden'>
                    <TrendingSidebar />
                </div>

                {
                    !isChatPage && (
                        <div className='fixed lg:hidden block left-0 bottom-0 w-full'>
                            <MobileNavbar />
                        </div>
                    )
                }

            </div>
            : <Landing />
    )
}

export default ProtectedRoutes;