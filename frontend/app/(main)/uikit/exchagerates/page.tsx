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
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import axios, { AxiosRequestConfig } from 'axios';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';


export default function ExchangeRates() {

    const toast = useRef(null);
    const router = useRouter();
    const [all_exchangeRates, setAll_exchangeRates] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });


    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, userRoles, setUserRoles
        // ,
        // setUserRoles 
    } = useMyContext();

    function getCurrentDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is 0
        const day = today.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue('');
    };


    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    useEffect(() => {
        initFilters();
    }, []);



    const fetchAllExchngeRAtes = async () => {

        const currentDate = getCurrentDate();

        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/nomenclatures/exchangerates/${currentDate}`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    setAll_exchangeRates(response.data);
                })
                .catch(function (error) {
                    // if (response.status === 401) {
                    // }
                    setAll_exchangeRates([]);
                    router.push('http://localhost:5500/auth/login')

                    console.log(error);
                });
        }
    }



    useEffect(() => {
        fetchAllExchngeRAtes()
    }, [])

    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">


                    <div className="p-fluid formgrid grid p-3">



                        <div className="field col-12">
                            <DataTable value={all_exchangeRates}
                                filterDisplay="row"
                                // showGridlines
                                globalFilterFields={['name']} header={header}
                                paginator rows={10} rowsPerPageOptions={[10, 20, 50, 100]}
                                tableStyle={{ minWidth: '50rem' }}
                                selectionMode="single"
                            >
                                <Column sortable field="date" header="Data"></Column>
                                <Column sortable field="name" header="Cod"></Column>
                                <Column sortable field="amount" header="Curs"></Column>

                                <Column sortable field="multiplier" header="Multiplicator"></Column>
                            </DataTable>

                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

