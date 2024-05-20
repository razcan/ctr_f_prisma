'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { text } from 'stream/consumers';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ToggleButton } from 'primereact/togglebutton';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'
import axios, { AxiosRequestConfig } from 'axios';
import { Tag } from 'primereact/tag';
import Link from 'next/link';




export default function ForgottenPassword() {


    const router = useRouter();
    const searchParams = useSearchParams()
    const uuid = searchParams.get("uuid");

    const toast = useRef(null);
    const [password, setPassword] = useState('**');
    const [repassword, setRePassword] = useState('**');
    const [userData, setUserData] = useState('**');

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();



    const saveNewPass = async () => {
        try {
            const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/forgotpass/${uuid}`,
                password
            );
            console.log('Password changed:', response.data);
        } catch (error) {
            console.error('Error password changing:', error);
        }
    }

    useEffect(() => {
    }, [])


    useEffect(() => {
    }, [])



    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="col-12">
                        <div className="p-fluid formgrid grid pt-2">

                            <Toast ref={toast}></Toast>



                            <div className="field col-12  md:col-4">
                                <label htmlFor="password">Parola</label>
                                <Password value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="field col-12  md:col-4">
                                <label htmlFor="repassword">Confirmare Parola</label>
                                <Password value={repassword} feedback={false} onChange={(e) => setRePassword(e.target.value)} />
                            </div>



                        </div>

                        <div className='pt-4'>
                            <div className='grid'>
                                <div className='col-3 '>
                                    <Button label="Salveaza" severity="success" onClick={saveNewPass} />
                                </div>
                            </div>
                        </div>



                    </div>

                </div>
            </div>
        </div>
    );
};
