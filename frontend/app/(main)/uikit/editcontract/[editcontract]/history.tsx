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
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function History() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));

    const [logs, setLogs] = useState('');

    const fetchContent = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/executeAuditPartner/${Id}`).then(res => res.json())
        //treb modificat pe id de ctr
        setLogs(response);
    }

    useEffect(() => {
        fetchContent()
    }, [])

    const StartBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.start_date);
        return <span>{formattedDate}</span>;
    };

    const EndBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.end_date);
        return <span>{formattedDate}</span>;
    };

    const SignBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.sign_date);
        return <span>{formattedDate}</span>;
    };

    const CompletionBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.completion_date);
        return <span>{formattedDate}</span>;
    };

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };


    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(logs);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'loguri');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Button type="button" icon="pi pi-file-excel" severity="Secondary" rounded onClick={exportExcel} data-pr-tooltip="XLS" />

                    <DataTable value={logs} tableStyle={{ minWidth: '50rem' }}
                        paginator rows={10} rowsPerPageOptions={[10, 20, 30, 50, 100]} sortMode="multiple"
                        sortField="data_modificare"
                    >
                        <Column field="contract_id" header="contract_id"></Column>
                        <Column field="tip_modificare" sortable header="tip_modificare"></Column>
                        <Column field="data_modificare" sortable header="data_modificare"></Column>
                        <Column field="contract_number" header="contract_number"></Column>
                        <Column field="nume_partener" header="nume_partener"></Column>
                        <Column field="nume_entitate" header="nume_entitate"></Column>
                        <Column field="stare" sortable header="stare"></Column>
                        <Column field="nume_categorie" sortable header="nume_categorie"></Column>
                        <Column field="departament" header="departament"></Column>
                        <Column field="start_date" sortable header="start_date" body={StartBodyTemplate} ></Column>
                        <Column field="sign_date" sortable header="sign_date" body={SignBodyTemplate} ></Column>
                        <Column field="end_date" sortable header="end_date" body={EndBodyTemplate} ></Column>
                        <Column field="completion_date" sortable header="completion_date" body={CompletionBodyTemplate} ></Column>
                        <Column field="cashflow" header="cashflow"></Column>
                        <Column field="tip_contract" header="tip_contract"></Column>
                        <Column field="centru_cost" header="centru_cost"></Column>
                        <Column field="utilizator" header="utilizator"></Column>
                    </DataTable>

                </div>
            </div>
        </div >
    );
}