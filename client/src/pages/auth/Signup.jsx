import { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form"
import xLogo from "/logo.png"
import { FiEyeOff, FiEye } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom"
import Spinner from "../../components/common/Spinner.jsx"
import { signup } from "../../services/authService.js";
import toast from "react-hot-toast"


const Signup = () => {

    const [showPass, setShowPass] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const onSubmit = async (data) => {

        setIsLoading(true);

        await signup(data)
            .then(() => {
                toast.success("Signup successful");
                navigate("/auth/verify-otp", {
                    state: {
                        email: data.email,
                        from: "SIGNUP"
                    }
                });
            })
            .catch((error) => {

                console.log(error)

                // redirect to verify email
                if (error?.response?.status === 415) {
                    navigate("/auth/verify-otp", { state: data.email });
                    return;
                }

                toast.error(error?.response?.data?.message);
                console.log("ERROR SIGNUP : ", error)
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
                    <FormProvider
                        {...register}
                    >
                        <div className='h-screen justify-center py-20 overflow-auto flex items-center bg-black w-full'
                        >
                            <div
                                className='flex justify-start p-5 mt-10 w-[400px] text-[white]/[0.4] items-center flex-col gap-7'
                            >

                                <div className='w-[30px]'>
                                    <img src={xLogo} className='' alt="x-logo" />
                                </div>

                                <div className='w-full'>
                                    <p className='text-3xl text-center text-white font-bold'>Create your account</p>
                                </div>

                                {/* full name */}
                                <div className='w-full'>
                                    <input
                                        type="text"
                                        name='fullName'
                                        {
                                        ...register("fullName",
                                            {
                                                required: "Fullname is required",
                                            }
                                        )
                                        }
                                        placeholder='Enter your full name'
                                        className='bg-black text-white w-full text-xl placeholder:text-white/[0.4] transition-all duration-200 ease-in-out focus-within:border-blue-500 outline-none px-3 py-3 rounded-md border-2 border-gray-800'
                                    />
                                    {
                                        errors.fullName &&
                                        <p className='text-red-600 mt-2 text-sm font-bold'>{errors.fullName?.message}</p>
                                    }
                                </div>

                                {/* username */}
                                <div className='w-full'>
                                    <input
                                        type="text"
                                        name='userName'
                                        {
                                        ...register("userName",
                                            {
                                                required: "Username is required",
                                            }
                                        )
                                        }
                                        placeholder='Enter your user name'
                                        className='bg-black text-white w-full text-xl placeholder:text-white/[0.4] transition-all duration-200 ease-in-out focus-within:border-blue-500 outline-none px-3 py-3 rounded-md border-2 border-gray-800'
                                    />
                                    {
                                        errors.userName &&
                                        <p className='text-red-600 mt-2 text-sm font-bold'>{errors.userName?.message}</p>
                                    }
                                </div>

                                {/* email */}
                                <div className='w-full'>
                                    <input
                                        type="email"
                                        name='email'
                                        {
                                        ...register("email",
                                            {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                    message: "Please enter a valid email address"
                                                }
                                            }
                                        )
                                        }
                                        placeholder='Enter your email address'
                                        className='bg-black text-white w-full text-xl placeholder:text-white/[0.4] transition-all duration-200 ease-in-out focus-within:border-blue-500 outline-none px-3 py-3 rounded-md border-2 border-gray-800'
                                    />
                                    {
                                        errors.email &&
                                        <p className='text-red-600 mt-2 text-sm font-bold'>{errors.email?.message}</p>
                                    }
                                </div>

                                {/* password */}
                                <div className='w-full '>
                                    <div className='relative'>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            name='password'
                                            {
                                            ...register("password",
                                                {
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Password should be at-least 6 characters"
                                                    }
                                                }
                                            )
                                            }
                                            placeholder='Enter your password'
                                            className='bg-black text-white w-full text-xl placeholder:text-white/[0.4] transition-all duration-200 ease-in-out focus-within:border-blue-500 outline-none px-3 py-3 rounded-md border-2 border-gray-800'
                                        />

                                        {/* eye */}
                                        <button
                                            onClick={() => {
                                                setShowPass(!showPass)
                                            }}
                                            className=' text-lg absolute right-4 top-[50%] -translate-y-[50%]'
                                        >
                                            {
                                                showPass ? <FiEyeOff /> : <FiEye />
                                            }
                                        </button>

                                        {/* forgot password */}
                                        <div className='w-full justify-end flex items-start mt-1'>
                                            <Link
                                                to="/auth/forgot-password-email"
                                                className='text-blue-400 hover:text-blue-500 font-semibold hover:underline transition-all duration-300 ease-in-out'
                                            >Forgot password</Link>
                                        </div>

                                    </div>

                                    {/* error mesage */}
                                    {
                                        errors.password &&
                                        <p className='text-red-600 mt-2 text-sm font-bold'>{errors.password?.message}</p>
                                    }
                                </div>

                                {/* button */}
                                <div className='w-full mt-5'>
                                    <button
                                        onClick={handleSubmit(onSubmit)}
                                        className='bg-black hover:bg-blue-500 transition-all duration-300 ease-in-out hover:border-blue-500 w-full text-lg  font-semibold py-2 rounded-full text-white border-2 border-gray-500'
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                <div className='flex flex-col gap-2 mt-3 justify-center items-center'>
                                    <p className='text-lg font-semibold text-white'>If you have already an account</p>
                                    <Link
                                        to="/auth/login"
                                        className="text-blue-400 font-semibold hover:underline hover:text-blue-500 transition-all duration-300 ease-in-out"
                                    >Login</Link>
                                </div>

                            </div>

                        </div>


                    </FormProvider >
                )
            }

        </>

    )
}

export default Signup;