/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../layout/AppConfig';
import { Page } from '../types/types';
import { useLogin } from "../src/hooks/auth/useLogin";
import { LayoutContext } from '../layout/context/layoutcontext';
import getConfig from 'next/config';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const Login: Page = () => {
    const { login } = useLogin();
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onSubmit = () => {
        if (!username || !password) {
            alert("Please enter information");
        } else {
            login(username, password)
                .then((res) => router.push("/"))
                .catch((e) => alert(e));
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
            <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`${contextPath}/layout/images/csx_logo.png`} alt="Image" className="mb-3" />
                            <Divider />
                            <div className="text-900 text-3xl font-medium mb-3">User Sign In</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>
                        <div>
                            <label htmlFor="username1" className="block text-900 text-xl font-medium mb-2">Username</label>
                            <InputText
                                id='username1'
                                type="text"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                                placeholder="username"
                            />
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password
                                id='password1'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleMask
                                placeholder="password"
                                feedback={false}
                                className="w-full mb-5" 
                                type="password"
                                inputClassName="w-full p-3 md:w-30rem"></Password>
                                                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    
                                </a></div>
                                <Button label="Sign In" className="w-full p-3 text-xl" onClick={onSubmit}></Button>
                        </div>
                    </div>  </div></div>
            </div>
        
    );
}

Login.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default Login;