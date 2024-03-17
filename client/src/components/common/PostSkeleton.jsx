import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const PostSkeleton = () => {
    return (

        <div className='w-full  gap-5 flex flex-row border-b-2 pb-10 border-[white]/[0.2] justify-center p-5 items-start'>

            <div className='w-[70px] h-[70px]'>
                <Skeleton
                    sx={{ bgcolor: 'grey.900' }}
                    animation="wave" variant="circular" width={60} height={60} />
            </div>


            <div className='flex w-full flex-col gap-5 items-start justify-start'>

                <Skeleton
                    animation="wave" variant="text" width={"100%"} sx={{ fontSize: '1rem', bgcolor: 'grey.900' }} />

                <Skeleton sx={{ bgcolor: 'grey.900' }}
                    animation="wave" variant="rectangular" width={"100%"} height={100} />

            </div>

        </div >
    )
}

export default PostSkeleton;