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
import * as XLSX from 'xlsx';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'
import axios, { AxiosRequestConfig } from 'axios';



export default function History() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));

    const [logs, setLogs] = useState('');

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();





    const fetchContent = async () => {

        const session = localStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `${Backend_BASE_URL}/nomenclatures/executeAuditPartner/${Id}`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    setLogs(response.data);
                })
                .catch(function (error) {
                    // if (response.status === 401) {
                    // }
                    router.push(`${Frontend_BASE_URL}/auth/login`)

                    console.log(error);
                });
        }
        // const response = await fetch(`http://localhost:3000/nomenclatures/executeAuditPartner/${Id}`).then(res => res.json())
        // setLogs(response);
    }

    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }

    }, [])

    useEffect(() => {
        fetchContent()
    }, [])

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };

    function subtractDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    const StartBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(new Date(subtractDays(rowData.start_date, 1)));
        return <span>{formattedDate}</span>;
    };

    const EndBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(new Date(subtractDays(rowData.end_date, 1)));
        return <span>{formattedDate}</span>;
    };

    const SignBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(new Date(subtractDays(rowData.sign_date, 1)));
        return <span>{formattedDate}</span>;
    };

    const CompletionBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(new Date(subtractDays(rowData.completion_date, 1)));
        return <span>{formattedDate}</span>;
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

    const data_modificareTemplate = (rowData: any) => {
        const formattedDate = formatDateHour(rowData.data_modificare);
        return <span>{formattedDate}</span>;
    };

    const formatDateHour = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false // 24-hour format
        };

        return date.toLocaleDateString('ro-Ro', options);
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
                        <Column field="data_modificare" sortable header="data_modificare" body={data_modificareTemplate}></Column>
                        <Column field="contract_number" header="contract_number"></Column>
                        <Column field="nume_partener" header="nume_partener"></Column>
                        <Column field="nume_entitate" header="nume_entitate"></Column>
                        <Column field="stare" sortable header="stare"></Column>
                        <Column field="starewf" sortable header="stare wf"></Column>
                        <Column field="nume_categorie" sortable header="nume_categorie"></Column>
                        <Column field="departament" header="departament"></Column>
                        <Column field="locatie" sortable header="locatie"></Column>
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