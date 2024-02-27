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

export default function Financial() {

    const [item, setItem] = useState([]);
    const [value, updateValue] = useState(0);

    const fetchTypeData = () => {
        fetch(`http://localhost:3000/contracts/contractItems/${value}`)
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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Button label="Adauga" icon="pi pi-external-link" onClick={() => goToDetails()} />

                    {item.length > 0 ?
                        <DataTable className='pt-2' value={item} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="id" header="Code"></Column>
                            <Column field="itemid" header="Name"></Column>
                            <Column field="billingFrequencyid" header="valoare"></Column>
                            <Column field="currencyid" header="interval"></Column>
                            <Column field="currencyValue" header="currencyValue"></Column>
                            <Column field="active" header="active"></Column>
                        </DataTable>
                        : null}

                </div>
            </div>
        </div>
    );
}