'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import { Tag } from 'primereact/tag';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'
import axios, { AxiosRequestConfig } from 'axios';



export default function Financial() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");
    const [item, setItem] = useState([]);
    const [allitems, setAllItems] = useState([]);
    const [allBillingFrequency, setAllBillingFrequency] = useState([]);
    const [allCurrency, setAllCurrency] = useState([]);
    const [selectedContractItem, setSelectedContractItem] = useState(null);
    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();


    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }

    }, [])



    const fetchTypeData = () => {

        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${Backend_BASE_URL}/contracts/contractItems/${Id}`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    setItem(response.data)
                })
                .catch(function (error) {
                    router.push(`${Frontend_BASE_URL}/auth/login`)
                    console.log(error);
                });
        }

        // fetch(`http://localhost:3000/contracts/contractItems/${Id}`)
        //     .then(response => {
        //         return response.json()
        //     })
        //     .then(item => {
        //         setItem(item)
        //     })

    }

    useEffect(() => {
        fetchTypeData()
    }, [])

    const addContractItem = () => {
        router.push(`/uikit/editcontract/editcontract/financialdetails/add/ctr?Id=${Id}`);
        // router.push('/uikit/addcontract/financialdetails');
    }

    // http://localhost:3000/contracts/contractItemsDetails/95

    const statusTemplate = (item) => {
        return <Tag value={item.active} severity={getSeverity(item)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item.active) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    const editContractItem = (id: any) => {
        router.push(`/uikit/editcontract/editcontract/financialdetails/edit/ContractItemId?Id=${id}&ctrId=${Id}`);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Button label="Adauga" icon="pi pi-external-link"
                        onClick={() => addContractItem()} />
                    {
                        item.length > 0 ?
                            < DataTable
                                className='pt-2'
                                key="id"
                                value={item} tableStyle={{ minWidth: '50rem' }}
                                stripedRows
                                sortMode="multiple"
                                selectionMode="single"
                                selection={selectedContractItem}
                                onSelectionChange={(e) => {
                                    setSelectedContractItem(e.value),
                                        editContractItem(e.value.id)
                                }}
                            >
                                <Column hidden field="id" header="id"></Column>
                                <Column field="item.name" header="Articol"></Column>
                                <Column field="frequency.name" header="Perioada"></Column>
                                <Column field="currency.code" header="Valuta"></Column>
                                <Column field="currencyValue" header="Pret"></Column>
                                <Column field="active" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                            </DataTable>
                            : null}
                </div>
            </div>
        </div >
    );
}