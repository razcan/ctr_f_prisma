'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import { useEventListener } from 'primereact/hooks';



const LoginPage = () => {

    const useMyContext = () => useContext(MyContext);
    const { userName, setUserName } = useMyContext();
    const { userId, setUserId } = useMyContext();
    const { picture, setPicture } = useMyContext();
    const { userRoles, setUserRoles } = useMyContext();
    const { isLoggedIn, setIsLoggedIn } = useMyContext();
    const { nrOfTasks, setNrOfTasks } = useMyContext();


    const [pressed, setPressed] = useState(false);
    const [value, setValue] = useState('');

    const onKeyDown = (e) => {
        setPressed(true);


        if (e.code === 'Enter') {
            Login()
        }
        // setValue(e.key);
    };
    const [bindKeyDown, unbindKeyDown] = useEventListener({
        type: 'keydown',
        listener: (e) => {
            onKeyDown(e);
        }
    });

    useEffect(() => {
        bindKeyDown();

        return () => {
            unbindKeyDown();
        };
    }, [bindKeyDown, unbindKeyDown]);

    // console.log("roles: ", userRoles)

    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });


    const [username, setUserNameLocal] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState([]);
    const toast = useRef<any>(null);
    const [visible, setVisible] = useState(true);

    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , login
    } = useMyContext();





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

    const GetPicture = async (Id: any) => {

        const picture = await fetch(`${Backend_BASE_URL}/nomenclatures/user/${Id}`).then(res => res.json())
        if (picture.picture == 'default.jpeg') {
            setPicture([])
        } else {
            setPicture(picture.picture)
        }

    }

    const GetUserTasks = async (Id: any) => {

        const tasks = await fetch(`${Backend_BASE_URL}/contracts/usertask/${Id}`).then(res => res.json())

        const nrOfTasks: number = tasks.length > 0 ? tasks.length : 0

        setNrOfTasks(nrOfTasks)

        return nrOfTasks
    }


    function getInitials(name) {
        const words = name.split(" ");
        const initials = words.map(word => word.charAt(0).toUpperCase()).join("");
        return initials;
    }

    const Login = async () => {

        try {
            const response = await axios.post(`${Backend_BASE_URL}/auth/login`, { username, password });

            setToken(response.data)
            setUserId(response.data.userid);

            const initialsUN = getInitials(username);

            setUserName(initialsUN);
            GetPicture(response.data.userid);
            GetUserTasks(response.data.userid);

            // Remove the item from local storage
            sessionStorage.removeItem("token");
            // Store token in local storage
            sessionStorage.setItem("token", JSON.stringify(response.data));
            // Read token from local storage
            const myStoredItem: any = sessionStorage.getItem('token');
            const rez = JSON.parse(myStoredItem);
            setIsLoggedIn(true)
            showSuccess();
            router.push('/')

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


    return (
        <MyProvider>
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
                                <div className="text-900 text-3xl font-medium mb-3">Conectare</div>
                                {/* <span className="text-600 font-medium">Sign in to continue</span> */}
                            </div>

                            <div>

                                <div>
                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Utilizator
                                    </label>
                                    <InputText id="email1" type="text"
                                        placeholder="Utilizator" className="w-full md:w-30rem mb-5"
                                        style={{ padding: '1rem' }} onChange={(e) => setUserNameLocal(e.target.value)} />

                                    <label htmlFor="parola" className="block text-900 font-medium text-xl mb-2">
                                        Parola
                                    </label>
                                </div>

                                <Password inputId="parola" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    feedback={false}
                                    placeholder="Parola"
                                    toggleMask
                                    className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    {/* <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div> */}
                                    <a className="font-medium no-underline ml-2 text-right cursor-pointer"
                                        style={{ color: 'var(--primary-color)' }}
                                        href='/auth/forgotten'
                                    >
                                        Ai uitat parola?
                                    </a>
                                    {/* /auth/forgotten */}
                                </div>
                                <Button label="Sign In" className="w-full p-3 text-xl" onClick={Login}></Button>
                                <Button icon="pi pi-arrow-left" label="Mergi la HomePage" text onClick={() => router.push('/')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyProvider>
    );
};

export default LoginPage;
