'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
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


export default function Content() {

    const [text, setText] = useState([]);

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));
    const [wfHistory, setWFHistory] = useState([]);



    const fetchContent = async () => {
        const response = await fetch(`http://localhost:3000/contracts/getWFHistory/${Id}`).then(res => res.json())
        setWFHistory(response);
    }

    useEffect(() => {
        fetchContent()
    }, [])

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };

    const createdAt = (rowData: any) => {
        const formattedDate = formatDate(rowData.createdAt);
        return <span>{formattedDate}</span>;
    };

    const duedates = (rowData: any) => {
        const formattedDate = formatDate(rowData.duedates);
        return <span>{formattedDate}</span>;
    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">


                    <DataTable value={wfHistory} tableStyle={{ minWidth: '50rem' }}
                        paginator rows={10} rowsPerPageOptions={[10, 20, 30, 50, 100]} sortMode="multiple"
                        sortField="createdAt"
                    >
                        <Column field="workflowname" header="Denumire Flux"></Column>
                        <Column field="approvalOrderNumber" header="Numarul de ordine aprobare"></Column>
                        <Column field="stepname" header="Pas flux"></Column>
                        <Column field="createdAt" sortable header="Data Generare" body={createdAt} ></Column>
                        <Column field="duedates" sortable header="De rezolvat pana la" body={duedates} ></Column>
                        <Column field="user" header="Utilizator curent"></Column>
                        <Column field="status" header="Stare"></Column>



                    </DataTable>

                </div>
            </div>
        </div >

    );
}
