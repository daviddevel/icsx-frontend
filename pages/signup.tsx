/* eslint-disable @next/next/no-img-element */
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { LayoutContext } from '../layout/context/layoutcontext';
import { Page } from '../types/types';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import useStore from "../src/store";
import FormInput from "../src/components/FormInput";
import { toast } from "react-toastify";
import AppConfig from "../layout/AppConfig";
import { useSignup } from "../src/hooks/auth/useSignup";

const registerSchema = object({
    name: string().min(1, "Full name is required").max(100),
    username: string().min(1, "Username is required").max(100),
    email: string()
        .min(1, "Email address is required")
        .email("Email Address is invalid"),
    password: string()
        .min(1, "Password is required")
        .min(7, "Password must be more than 7 characters")
        .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
});
export type RegisterInput = TypeOf<typeof registerSchema>;

const Signup: Page = () => {
    const { signup } = useSignup();
    const store = useStore();
    const methods = useForm<RegisterInput>({resolver: zodResolver(registerSchema),});

    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    const {
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful },
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const registerUser = async (data: RegisterInput) => {
        try {
            store.setRequestLoading(true);
            const response =  signup(data);
            console.log(data);
            store.setRequestLoading(false);
            toast.success('Success! You have successfully registered an account.', {
                position: "top-center",
                autoClose: 5000,
            });
            router.push('/login');
        } catch (error: any) {
            store.setRequestLoading(false);
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            toast.error('Registration error!', {
                position: "top-center",
                autoClose: 5000,
            })
        }
    }
    const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
        console.log("I was called");
        registerUser(values);
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`${contextPath}/layout/images/csx_logo.png`} alt="Image" className="mb-3" />
                            <Divider />
                            <div className="text-900 text-3xl font-medium mb-3">Sign Up</div>
                            <span className="text-600 font-medium">Register an account to get started!</span>
                        </div>
                        <div>
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmitHandler)} className="p-fluid">
                                    <span className="p-input-icon-right">
                                        <FormInput placeholder="*Full Name" name="name" /></span>
                                        <FormInput placeholder="*Username" name="username" />
                                        <FormInput placeholder="*Email" name="email" type="email" />
                                        <FormInput placeholder="*Password" name="password" type="password" />
                                        <FormInput
                                            placeholder="*Confirm Password"
                                            name="passwordConfirm"
                                            type="password"
                                        />
                                    <Button
                                        loading={store.requestLoading}
                                        label="Register"
                                        className="w-full p-3 text-xl" 
                                        type="submit">
                                    </Button>
                                    <div>
                                    <Divider />
                                        <span className="block">
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-ct-blue-600">
                                                Login here
                                            </Link>
                                        </span>
                                    </div>
                                </form>
                            </FormProvider>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

Signup.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default Signup;
