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
import { Calendar } from 'primereact/calendar';

export default function ExchangeRates() {

    const toast = useRef(null);
    const router = useRouter();
    const [all_exchangeRates, setAll_exchangeRates] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [visible, setVisible] = useState(false);
    const [start, setStartDate] = useState(new Date());
    const [end, setEndDate] = useState(new Date());
    const [currency, setCurrency] = useState([]);
    const [allCurrency, setAllCurrency] = useState([]);
    const [filteredCurrency, setFilteredCurrency] = useState([]);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const fetchAllCurrencies = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

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

    function getFormatDate(date): string {
        const today = new Date(date);
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is 0
        const day = today.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setGlobalFilterValue(value);
    };



    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    {/* <InputIcon className="pi pi-search" /> */}
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Valuta" />
                </IconField>
            </div>
        );
    };

    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];

        if (fields[0] && fields[0] == "NaN-NaN-NaN") {
            errors.push("Trebuie sa setati o valoare pentru campul Data Start!");
        }
        if (fields[1] && fields[1] == "NaN-NaN-NaN") {
            errors.push("Trebuie sa setati o valoare pentru campul Data Final!");
        }
        if (!fields[2] || fields[2].trim() === '') {
            errors.push("Trebuie sa setati o valuta!");
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }

    const showWarn = (detail) => {
        toast.current.show({
            severity: 'warn', summary: 'Atentie',
            detail: detail, life: 3000
        });
    }

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
                url: `${Backend_BASE_URL}/nomenclatures/exchangerates/${currentDate}`
                ,
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

    const fetchAllFilteredExchngeRates = async (startdate, enddate, currencycode) => {
        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        const wff: never[] | Record<string, any> = [];
        wff.push(startdate)
        wff.push(enddate)
        wff.push(currencycode)

        const validationResult = validateForm(wff);


        if (!validationResult.isValid) {
            showWarn(validationResult.errors)
        }

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/nomenclatures/exchangeratesbet/${startdate}/${enddate}/${currencycode}`
                ,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    setFilteredCurrency(response.data);
                })
                .catch(function (error) {
                    // if (response.status === 401) {
                    // }
                    setFilteredCurrency([]);
                    router.push('http://localhost:5500/auth/login')

                    console.log(error);
                });
        }
    }

    const getCurrencyFiltered = async () => {
        const rezult = fetchAllFilteredExchngeRates(getFormatDate(start), getFormatDate(end), currency.code);
    }

    useEffect(() => {
        fetchAllExchngeRAtes(),
            fetchAllCurrencies()
    }, [])

    const showHistoryRates = async () => {
        setVisible(true)
    }

    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="pl-3" >
                        <Button label="Istoric" onClick={showHistoryRates} />
                    </div>


                    <Dialog header="Istoric curs valutar" maximizable
                        visible={visible} onHide={
                            () => {
                                setVisible(false)
                                setFilteredCurrency([])
                                setStartDate(new Date());
                                setEndDate(new Date());
                                setCurrency([]);
                            }
                        }>
                        <div className='card'>
                            <div className="grid">
                                <Toast ref={toast} />
                                <div className="p-fluid formgrid grid pt-2">

                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Data Start
                                        </label>
                                        <Calendar id="start" value={start} onChange={(e) => setStartDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                    </div>
                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Data Final
                                        </label>
                                        <Calendar id="end" value={end} onChange={(e) => setEndDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                    </div>
                                    <div className="field col-12 md:col-3">
                                        <label htmlFor="currency">Valuta</label>
                                        <Dropdown id="currency" filter showClear value={currency} onChange={(e) => setCurrency(e.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                                    </div>

                                    <div className="field col-12 md:col-3 pt-4">
                                        <Button label="Afiseaza" onClick={getCurrencyFiltered} />
                                    </div>

                                    <div className="field col-12 md:col-12">
                                        {filteredCurrency.length > 1 ?
                                            <DataTable value={filteredCurrency}
                                                filterDisplay="row"
                                                filters={filters}
                                                globalFilterFields={['name']}
                                                stripedRows tableStyle={{ minWidth: '50rem' }}
                                                sortMode="multiple"
                                                // showGridlines
                                                paginator rows={10} rowsPerPageOptions={[10, 20, 50, 100]}
                                                selectionMode="single"
                                            >
                                                <Column sortable field="date" header="Data"></Column>
                                                <Column sortable field="name" header="Valuta"></Column>
                                                <Column sortable field="amount" header="Curs"></Column>
                                                <Column sortable field="multiplier" header="Multiplicator"></Column>
                                            </DataTable>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Dialog>

                    <div className="p-fluid formgrid grid p-3">
                        <div className="field col-12">
                            {all_exchangeRates.length > 1 ?
                                <DataTable value={all_exchangeRates}
                                    filterDisplay="row"
                                    filters={filters}
                                    globalFilterFields={['name']} header={header}
                                    stripedRows tableStyle={{ minWidth: '50rem' }}
                                    sortMode="multiple"
                                    // showGridlines
                                    paginator rows={10} rowsPerPageOptions={[10, 20, 50, 100]}
                                    selectionMode="single"
                                >
                                    <Column sortable field="date" header="Data"></Column>
                                    <Column sortable field="name" header="Valuta"></Column>
                                    <Column sortable field="amount" header="Curs"></Column>
                                    <Column sortable field="multiplier" header="Multiplicator"></Column>
                                </DataTable>
                                : null}
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

