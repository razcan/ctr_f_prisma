'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
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

export default function Financial() {

    const [item, setItem] = useState([]);
    const [allitems, setAllItems] = useState([]);
    const [allBillingFrequency, setAllBillingFrequency] = useState([]);
    const [allCurrency, setAllCurrency] = useState([]);

    const fetchTypeData = () => {
        fetch("http://localhost:3000/contracts/contractItems/1")
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItem(item)
            })
    }

    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item").then(response => { return response.json() })
            .then(item => { setAllItems(item) })
    }

    const fetchAllCurrencies = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

    const fetchAllBillingFrequency = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/billingfrequency`).then(res => res.json())
        setAllBillingFrequency(response);
    }


    const getItemJson = (id: number) => {
        const item = allitems.find((obj) => obj.id === id);
        console.log(item)
    };

    const getBillScheduleJson = (id: number) => {
        return allBillingFrequency.find((obj) => obj.id === id);
    };

    const getCurrencyJson = (id: number) => {
        return allCurrency.find((obj) => obj.id === id);
    };


    // const currencyTemplate = () => {
    //     return getCurrencyJson(item[0].itemid);
    // };

    console.log(item)


    useEffect(() => {
        fetchTypeData(),
            fetchItemsData(),
            fetchAllCurrencies(),
            fetchAllBillingFrequency()
    }, [])

    // console.log(allBillingFrequency)
    // console.log(allitems)
    // console.log(allCurrency)

    const x = getItemJson(1)
    const y = getCurrencyJson(1)
    const z = getBillScheduleJson(3)

    const itemTemplate = (item) => {
        return <Tag value={getItemJson(1)}></Tag>;
    };

    const router = useRouter();

    const goToDetails = () => {
        router.push('/uikit/addcontract/financialdetails');
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Button label="Adauga" icon="pi pi-external-link" onClick={() => goToDetails()} />

                    <DataTable className='pt-2' value={item} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="id"></Column>
                        <Column field="itemid" header="itemid"
                            body={itemTemplate}
                            style={{ width: '5vh' }} ></Column>
                        <Column field="billingFrequencyid" header="billingFrequencyid"></Column>
                        <Column field="currencyid" header="currencyid"
                        // body={currencyTemplate} 
                        ></Column>
                        <Column field="currencyValue" header="currencyValue"></Column>
                        <Column field="active" header="active"></Column>
                    </DataTable>

                </div>
            </div>
        </div>
    );
}