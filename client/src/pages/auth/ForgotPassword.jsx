import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { IoMail } from "react-icons/io5";
import { sendOtpToEmail } from "../../services/authService.js";
import toast from "react-hot-toast";
import Spinner from '../../components/common/Spinner.jsx';

const ForgotPassword = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState();

    const navigate = useNavigate();

    const sumbitHandler = async (data) => {

        setIsLoading(true);

        await sendOtpToEmail(data.email)
            .then(() => {
                toast.success("Otp send successful");
                navigate("/auth/verify-otp", {
                    state: {
                        email: data.email,
                        from: "FORGOT"
                    }
                });
            })
            .catch((error) => {

                console.log(error);

                toast.error(error?.response?.data?.message);
                console.log("ERROR FORGOT PASSWORD SENDING EMAIL : ", error);
            })
            .finally(() => {
                setIsLoading(false)
            })
    };


    return (
        <>
            {
                isLoading ? (
                    <Spinner />
                ) : (
                    <div className='h-screen overflow-auto w-full bg-black flex justify-center items-center'>
                        <div className='bg-[white]/[0.09] m-5 flex flex-col justify-center items-center gap-4 rounded-xl px-5 py-10 sm:px-10 sm:py-14 shadow-xl shadow-[white]/[0.15]'>


                            <p className='text-white text-4xl font-bold'>Forgot Password</p >
                            <p className='text-[white]/[0.5] font-semibold text-lg'>Enter email for verification code</p>

                            <div className='w-full my-5'>
                                <div className=' placeholder:text-[white]/[0.45] focus-within:border-blue-500 border-2 border-[white]/[0.18] rounded-md flex gap-2 justify-center pl-3 items-center text-white font-semibold bg-black w-[300px] sm:w-[400px]'
                                >

                                    <IoMail className='text-[white]/[0.5] text-2xl ' />
                                    <input
                                        type="email"
                                        required
                                        name='email'
                                        {...register(
                                            "email",
                                            {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                    message: "Please enter valid email address"
                                                }
                                            }
                                        )
                                        }
                                        placeholder='Enter email address'
                                        className='w-full text-xl outline-none bg-transparent py-3 px-3'
                                    />
                                </div>

                                {
                                    errors.email &&
                                    <p className='text-red-500 text-sm font-bold mt-2'>{errors.email?.message}</p>
                                }
                            </div>

                            <div className='mt-5'>
                                <button onClick={handleSubmit(sumbitHandler)} className='text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-lg px-20 py-3 font-bold text-lg'>Send OTP</button>
                            </div>

                            <div className='flex gap-1 justify-center items-center'>

                                <p className='text-[white]/[0.7] font-semibold text-lg'>Don't have an account yet?</p>

                                <Link
                                    className='text-blue-400 my-5 text-lg font-semibold hover:underline transition-all duration-300 ease-in-out'
                                    to="/auth/signup"
                                >Register</Link>
                            </div>

                        </div >
                    </div >
                )
            }
        </>

    )
}

export default ForgotPassword