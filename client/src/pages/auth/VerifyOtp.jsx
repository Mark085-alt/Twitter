import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom"
import OTPInput, { ResendOTP } from "otp-input-react";
import {
    verifyOtp,
    sendOtpToEmail
} from "../../services/authService.js"
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner.jsx";


const VerifyOtp = () => {

    const { register, handleSubmit } = useForm();

    const [timer, setTimer] = useState(30);

    const { pathname, } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();

    const { email, from } = location.state;
    console.log(location.state);

    // const otp = ["", "", "", "", ""];

    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        setTimeout(() => {
            changeTime(timer - 1);
        }, 1000);
    }, [pathname]);


    function changeTime(time) {
        if (time >= 0) {
            setTimer(time)
            setTimeout(() => {
                changeTime(time - 1);
            }, 1000)
        }
    }


    const onSumbit = async (data) => {

        setIsLoading(true);

        const otp = Object.values(data).join("");


        await verifyOtp({ otp, email })
            .then(() => {

                toast.success("Otp verified successfully!");

                if (from === "SIGNUP") {
                    navigate("/auth/login");

                } else {
                    navigate("/auth/forgot-password-change-password",
                        {
                            state: email
                        }
                    );
                }

            }).catch((err) => {
                toast.error(err?.response?.data?.message);
            })
            .finally(() => {
                setIsLoading(false)
            });
    }


    async function resendOtpHandler() {

        setIsLoading(true);

        await sendOtpToEmail(email)
            .then(() => {
                toast.success("Otp resend!");
                changeTime(30);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }


    return (
        <>
            {
                isLoading ? (
                    <Spinner />
                ) : (
                    <div className='h-screen overflow-auto w-full bg-black flex justify-center items-center'>

                        <div className='flex flex-col bg-[white]/[0.09] shadow-lg shadow-[white]/[0.2] p-4 sm:px-10 py-10 sm:py-20 rounded-lg justify-center items-center gap-14'>

                            {/* details/description */}
                            <div className='flex flex-col justify-center items-center gap-5'>
                                <p className='text-white text-4xl font-bold'>Verify OTP</p>
                                <p className='text-[white]/[0.5] min-w-[200px] max-w-[350px] sm:max-w-[500px] text-center font-semibold text-base'>To verify your OTP (One-Time-Password), Please enter 5 digits otp code that has been sent to your email address.</p>
                            </div>

                            {/* form */}
                            <div>
                                <div
                                    className='flex  flex-col justify-center items-center gap-16'
                                >
                                    <OTPInput
                                        OTPLength={5}
                                        disabled={false}
                                        autoFocus={true}
                                        otpType="number"
                                        value={otp}
                                        onChange={setOtp}
                                        inputClassName={"outline-none shadow-sm shadow-white/[0.3] focus-within:border-blue-400 border-2 border-black rounded-md bg-black text-white text-xl p-2"}
                                    />

                                    {/* buttons */}
                                    < div className='w-full flex flex-col-reverse gap-5 sm:flex-row justify-between items-center' >
                                        {/* resend otp */}
                                        <div>

                                            {
                                                timer > 0 ? (
                                                    <p
                                                        className=' text-sm font-semibold text-blue-500'
                                                    >Send otp after:  <span>{timer}</span>
                                                    </p>

                                                ) : (

                                                    <button
                                                        onClick={resendOtpHandler}
                                                        className='text-base font-semibold text-blue-500 hover:underline transition-all duration-300 ease-in-out'
                                                    >
                                                        Resend OTP
                                                    </button>

                                                )
                                            }

                                        </div >

                                        {/* verfiy otp */}
                                        <button
                                            onClick={handleSubmit(onSumbit)}
                                            className='text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-lg px-20 py-3 font-bold text-lg'
                                        >
                                            Verify
                                        </button >

                                    </div >
                                </div >
                            </div>

                        </div>
                    </div>
                )
            }
        </>


    )
}

export default VerifyOtp;