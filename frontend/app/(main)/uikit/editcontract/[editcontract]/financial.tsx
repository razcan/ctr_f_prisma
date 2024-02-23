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

    useEffect(() => {
        fetchTypeData()
    }, [])

    const router = useRouter();

    const goToDetails = () => {
        router.push('/uikit/addcontract/financialdetails');
    }

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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Button label="Adauga" icon="pi pi-external-link" onClick={() => goToDetails()} />

                    <DataTable className='pt-2' value={item} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="id"></Column>
                        <Column field="item.name" header="Articol"></Column>
                        <Column field="frequency.name" header="Perioada"></Column>
                        <Column field="currency.code" header="Valuta"></Column>
                        <Column field="currencyValue" header="Valoare"></Column>
                        <Column field="active" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                    </DataTable>

                </div>
            </div>
        </div>
    );
}