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


    const item2 = [
        { code: "1", name: "Servicii chirie", valoare: "200 EUR", interval: "Lunar" },
        { code: "2", name: "Tarif de administrare", valoare: "400 EUR", interval: "Trimestrial" }
    ]

    useEffect(() => {
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

                    <DataTable className='pt-2' value={item2} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="code" header="Code"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="valoare" header="valoare"></Column>
                        <Column field="interval" header="interval"></Column>
                    </DataTable>

                </div>
            </div>
        </div>
    );
}