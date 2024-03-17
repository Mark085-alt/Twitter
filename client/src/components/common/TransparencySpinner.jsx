import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';


const TransparencySpinner = () => {
    return (
        <div className='w-screen h-screen bg-[black]/[0.3] z-[100] fixed flex justify-center items-center'>
            <div>
                <CircularProgress />
            </div>
        </div>
    );
}

export default TransparencySpinner