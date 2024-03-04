/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const LoginPage = () => {
    // const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });


    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState([]);
    const toast = useRef<any>(null);
    const [visible, setVisible] = useState(true);
    const [AvatarUser, setAvatar] = useState('avatar-1709367075603-462599146.svg')

    const showSuccess = () => {
        toast.current.show(
            { severity: 'success', summary: 'Success', detail: 'You are now connected', life: 1000 }
        );

        setTimeout(() => {
            setVisible(false)
            router.push('/');
            // console.log("Delayed for 1 second.");
        }, 1000);
    }

    const showError = () => {
        toast.current.show(
            { severity: 'error', summary: 'Error', detail: 'Invalid Username or Password!', life: 1000 }
        );

    }

    const Login = async () => {

        try {
            const response = await axios.post(`http://localhost:3000/auth/login`, { username, password });


            setToken(response.data)

            // Remove the item from local storage
            sessionStorage.removeItem("token");
            // Store token in local storage
            sessionStorage.setItem("token", JSON.stringify(response.data));
            // Read token from local storage
            const myStoredItem: any = sessionStorage.getItem('token');
            const rez = JSON.parse(myStoredItem);

            showSuccess();
            router.push('/')

            //de seatat poza de profil langa login

            //data la care expira token
            //  console.log(rez.expire_date_token)
            // router.push('/');
            //expire_date_token

        } catch (error) {
            // Handle errors
            localStorage.removeItem("token");
            showError();
            console.error('Error submitting :', error);
        }
    }

    const fetchUserById = async (Id) => {
        const response = await fetch(`http://localhost:3000/nomenclatures/user/${Id}`).then(res => res.json())
        setAvatar(response.picture)
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <Toast ref={toast} />
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                            <div className="text-900 text-3xl font-medium mb-3">Logare in aplicatie</div>
                            {/* <span className="text-600 font-medium">Sign in to continue</span> */}
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Utilizator
                            </label>
                            <InputText id="email1" type="text" placeholder="Utilizator" className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }} onChange={(e) => setUserName(e.target.value)} />

                            <label htmlFor="parola" className="block text-900 font-medium text-xl mb-2">
                                Parola
                            </label>
                            <Password inputId="parola" value={password}
                                onChange={(e) => setPassword(e.target.value)} placeholder="Parola"
                                toggleMask
                                className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                {/* <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div> */}
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Ai uitat parola?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={Login}></Button>
                            <Button icon="pi pi-arrow-left" label="Mergi la HomePage" text onClick={() => router.push('/')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
