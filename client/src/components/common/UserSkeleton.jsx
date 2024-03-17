import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const UserSkeleton = () => {
    return (

        <div className='w-full  gap-2 pt-1 px-5 flex flex-row border-b-2 border-[white]/[0.2] justify-center items-start'>

            <div className='w-[70px] h-[70px]'>
                <Skeleton
                    sx={{ bgcolor: 'grey.900' }}
                    animation="wave" variant="circular" width={60} height={60} />
            </div>

            <div className='flex w-full pt-2 flex-col gap-2 items-start justify-center'>

                <Skeleton
                    animation="wave" variant="text" width={200} sx={{ fontSize: '10px', bgcolor: 'grey.900' }} />

                <Skeleton sx={{ fontSize: '10px', bgcolor: 'grey.900' }}
                    animation="wave" variant="text" width={150} />

            </div>

        </div >
    )
}

export default UserSkeleton;