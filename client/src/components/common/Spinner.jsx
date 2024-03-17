import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Spinner() {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <CircularProgress />
        </div>
    );
}