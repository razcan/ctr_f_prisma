/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'



const LogoutPage = () => {

    const useMyContext = () => useContext(MyContext);
    const { userName, setUserName } = useMyContext();
    const { userId, setUserId } = useMyContext();
    const { picture, setPicture } = useMyContext();
    const { userRoles, setUserRoles } = useMyContext();
    const { isLoggedIn, setIsLoggedIn } = useMyContext();

    const [pressed, setPressed] = useState(false);
    const [value, setValue] = useState('');


    // console.log("roles: ", userRoles)

    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const toast = useRef<any>(null);
    const [visible, setVisible] = useState(true);

    const showSuccess = () => {
        toast.current.show(
            { severity: 'success', summary: 'Success', detail: 'You are now disconnected', life: 1000 }
        );
        setTimeout(() => {
            // setVisible(false)
            router.push('/auth/login');
        }, 2000);
    }

    const Logout = async () => {

        try {
            // sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            showSuccess()

        } catch (error) {
            localStorage.removeItem("token");
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
                                <div className="text-900 text-3xl font-medium mb-3">Deconectare</div>
                            </div>
                            <div>

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">

                                </div>
                                <Button label="Logout" className="w-full p-3 text-xl" onClick={Logout}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyProvider>
    );
};

export default LogoutPage;
