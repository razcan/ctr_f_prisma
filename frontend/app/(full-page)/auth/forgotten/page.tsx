/* eslint-disable @next/next/no-img-element */
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



const LogoutPage = () => {

    const useMyContext = () => useContext(MyContext);
    const { Backend_BASE_URL } = useMyContext();

    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const toast = useRef<any>(null);
    const [email, setEmail] = useState(true);

    const showSuccess = () => {
        toast.current.show(
            { severity: 'success', summary: 'Success', detail: 'Emailul de resetare a fost transmis!', life: 2000 }
        );
        setTimeout(() => {
            router.push('/auth/login');
            // console.log("Delayed for 1 second.");
        }, 1000);
    }


    const showError = () => {
        toast.current.show(
            { severity: 'error', summary: 'Error', detail: 'Adresa de email nu este definita pentru niciun utilizator!', life: 2000 }
        );

    }

    const checkUser = async () => {
        try {
            const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/checkuser`,
                { email });

            if (response.data === 'Exist') {
                showSuccess();

                const add_request = await axios.post(`${Backend_BASE_URL}/nomenclatures/forgotpass`,
                    { email });

                console.log(add_request);

            } else {
                showError();
            }

        } catch (error) {

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
                                <div className="text-900 text-3xl font-medium mb-3">Recuperare parola</div>
                            </div>
                            <div>

                                <div className="pl-3">
                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Utilizator
                                    </label>
                                    <InputText id="email1" type="text"
                                        placeholder="Adresa de email utilizator"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full md:w-30rem mb-5"
                                        style={{ padding: '1rem' }}
                                    />


                                </div>

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">

                                </div>
                                <Button label="Trimite" className="w-full p-3 text-xl" onClick={checkUser}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyProvider>
    );
};

export default LogoutPage;
