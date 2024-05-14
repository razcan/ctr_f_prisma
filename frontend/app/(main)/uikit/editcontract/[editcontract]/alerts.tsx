'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
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
// import ReactQuill, { Quill } from 'react-quill';
// import "react-quill/dist/quill.snow.css";
import { Tag } from 'primereact/tag';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'

export default function Alerts() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));
    const [alerts, setAlerts] = useState([]);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();


    //it should replace with ctrid 
    const fetchContent = async () => {
        const response = await fetch(`${Backend_BASE_URL}/alerts/contractId/${Id}`).then(res => res.json())
        setAlerts(response);

    }

    useEffect(() => {
        fetchContent()
    }, [])


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

    const statusTemplate = (item) => {
        return <Tag value={item.isActive} severity={getSeverity(item.isActive)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item) {
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
                <div className='card'>
                    Alerte
                    <DataTable value={alerts} tableStyle={{ minWidth: '50rem' }}
                    // paginator rows={10} rowsPerPageOptions={[10, 20, 30, 40, 100]} sortMode="multiple"
                    >
                        <Column hidden field="id" header="id"></Column>
                        <Column field="alertname" sortable header="Denumire"></Column>
                        <Column field="datetoBeSent" sortable header="Data transmitere alerta" body={datetoBeSentTemplate} ></Column>
                        <Column field="subject" header="Subiect"></Column>
                        <Column field="nrofdays" header="Nr. zile" body={nrofdaysTemplate}></Column>
                        <Column field="isActive" header="Activa" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                    </DataTable>
                </div>
            </div>
        </div >
    );
}