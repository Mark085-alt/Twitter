import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const ChatSkeleton = () => {
    const temp = [1, 2, 3, 4, 5];

    return (

        <div className='w-full  gap-2 p-5 flex flex-col  justify-center items-start'>

            {
                temp.map((value, index) => (
                    <div
                        key={value + index}
                        className='flex flex-col gap-5 w-full'
                    >
                        <div className='w-full flex justify-start'>
                            <Skeleton sx={{ fontSize: '20px', bgcolor: 'grey.900' }}
                                animation="wave" variant="text" width={250} />
                        </div>
                        <div className='w-full flex justify-end'>
                            <Skeleton sx={{ fontSize: '20px', bgcolor: 'grey.900' }}
                                animation="wave" variant="text" width={250} />
                        </div>

                    </div>
                ))
            }





        </div >
    )
}

export default ChatSkeleton;