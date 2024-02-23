'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { Editor } from 'primereact/editor';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";

export default function Alerts() {

    const [alerts, setAlerts] = useState([]);

    //it should replace with ctrid 
    const fetchContent = async () => {
        const response = await fetch(`http://localhost:3000/alerts/contractId/${6}`).then(res => res.json())
        setAlerts(response);

    }

    useEffect(() => {
        fetchContent()
    }, [])

    console.log(alerts)

    const datetoBeSentTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.datetoBeSent);
        return <span>{formattedDate}</span>;
    };

    const nrofdaysTemplate = (rowData: any) => {
        const result = `Inainte cu ${rowData.nrofdays} zile de Data Final`
        return <span>{result}</span>;
    };

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    Alerte
                    <DataTable value={alerts} tableStyle={{ minWidth: '50rem' }}
                    // paginator rows={10} rowsPerPageOptions={[10, 20, 30, 40, 100]} sortMode="multiple"
                    >
                        <Column hidden field="id" header="id"></Column>
                        <Column field="alertname" sortable header="Denumire"></Column>
                        <Column field="datetoBeSent" sortable header="Data transmitere alerta" body={datetoBeSentTemplate} ></Column>
                        <Column field="isActive" header="Activa"></Column>
                        <Column field="subject" header="Subiect"></Column>
                        <Column field="nrofdays" header="Nr. zile" body={nrofdaysTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div >
    );
}