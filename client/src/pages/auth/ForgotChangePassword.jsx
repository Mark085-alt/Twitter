import React, { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom"
import { changePassword } from "../../services/authService.js";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner.jsx";


const ForgotChangePassword = () => {


    const { register, handleSubmit, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state;

    const onSubmit = async (data) => {

        setIsLoading(true);

        await changePassword({ ...data, email })
            .then(() => {
                toast.success("Password changed successfully");
                navigate("/auth/login");
            })
            .catch((error) => {

                console.log(error)
                toast.error(error?.response?.data?.message);
                console.log("ERROR PASSWORD CHANGE : ", error)
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
                        <div className='min-h-screen w-full bg-black flex justify-center items-center'>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='flex flex-col  w-[500px] bg-[white]/[0.09] shadow-lg shadow-[white]/[0.2] px-10 py-20 rounded-lg justify-center items-center gap-14'
                            >

                                {/* details/description */}
                                <p className='text-white text-4xl font-bold'>Change Password</p>

                                {/*new password */}
                                <div className='w-full '>
                                    <input
                                        type="text"
                                        name='newPassword'
                                        {
                                        ...register("newPassword",
                                            {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password should be at-least 6 characters"
                                                }
                                            }
                                        )
                                        }
                                        placeholder='Enter your new password'
                                        className='bg-black text-white w-full text-xl placeholder:text-white/[0.4] transition-all duration-200 ease-in-out focus-within:border-blue-500 outline-none px-3 py-3 rounded-md border-2 border-gray-800'
                                    />

                                    {/* error mesage */}
                                    {
                                        errors.newPassword &&
                                        <p className='text-red-600 mt-2 text-sm font-bold'>{errors.newPassword?.message}</p>
                                    }
                                </div>


                                {/* confirm pasword */}
                                <div className='w-full '>
                                    <input
                                        type="text"
                                        name='confirmPassword'
                                        {
                                        ...register("confirmPassword",
                                            {
                                                required: "Confirm password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Confirm password should be at-least 6 characters"
                                                }
                                            }
                                        )
                                        }
                                        placeholder='Enter your confirm password'
                                        className='bg-black text-white w-full text-xl placeholder:text-white/[0.4] transition-all duration-200 ease-in-out focus-within:border-blue-500 outline-none px-3 py-3 rounded-md border-2 border-gray-800'
                                    />

                                    {/* error mesage */}
                                    {
                                        errors.confirmPassword &&
                                        <p className='text-red-600 mt-2 text-sm font-bold'>{errors.confirmPassword?.message}</p>
                                    }
                                </div>

                                <div className='mt-5'>
                                    <button type="submit" className='text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ease-in-out rounded-lg px-20 py-3 font-bold text-lg'>Change Password</button>
                                </div>

                            </form>

                        </div>


                    </FormProvider >
                )
            }
        </>

    )
}

export default ForgotChangePassword;