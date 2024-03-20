"use client"

import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from 'primereact/button';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';


interface Car {
    make: string;
    model: string;
    price: number;
}

interface Infos {
    tipcontract: string;
    number: string;
    start_date: Date;
    end_date: Date;
    sign_date: Date;
    completion_date: Date;
    remarks: string;
    partner_name: string;
    entity_name: string;
    automatic_renewal: string;
    status_name: string;
    cashflow_name: string;
    category_name: string;
    contract_type_name: string;
    department_name: string;
    cost_center_name: string;
    partner_person_name: string;
    partner_person_role: string;
    partner_person_email: string;
    entity_person_name: string;
    entity_person_role: string;
    entity_person_email: string;
    partner_address: string;
    entity_address: string;
    partner_bank: string;
    partner_currency: string;
    partner_iban: string;
    entity_bank: string;
    entity_currency: string;
    entity_iban: string;
}

const queryClient = new QueryClient();



function Report() {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing } = useMyContext();


    const [filtreddata, setFilteredData] = useState<Infos[]>([]);
    const [data, setData] = useState<Infos[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [departmentFilter, setDepartmentFilter] = useState<string>('');
    const [partenerFilter, setPartenerFilter] = useState<string>('');
    const [entitateFilter, setEntitateFilter] = useState<string>('');
    const [TipContractFilter, setTipContractFilter] = useState<string>('');
    const [numarFilter, setNumarFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [costcenterFilter, setCostCenterFilter] = useState<string>('');
    const [ctrTypeFilter, setCtrTypeFilter] = useState<string>('');
    const [resppartFilter, setRespPartFilter] = useState<string>('');
    const [respentFilter, setRespEntFilter] = useState<string>('');


    const fetchContracts = async () => {

        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/contracts/generalreport`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    // setAll_users(response.data);
                    setData(response.data);
                    setFilteredData(response.data);
                    console.log(response.data);
                })
                .catch(function (error) {
                    // if (response.status === 401) {
                    // }
                    setData([]);
                    console.log(error);
                });
        }
    }

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        // const date = new Date(dateString);
        // const options = { year: 'numeric', month: 'short', day: 'numeric' };
        // return date.toLocaleDateString('ro-Ro', options);

        const date = new Date(dateString);
        const formattedDate = date.toISOString().slice(0, 10);
        return date
    };



    const StartBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.start);
        return <span>{formattedDate}</span>;
    };

    // const EndBodyTemplate = (rowData: any) => {
    //     const formattedDate = formatDate(rowData.end);
    //     return <span>{formattedDate}</span>;
    // };

    // const SignBodyTemplate = (rowData: any) => {
    //     const formattedDate = formatDate(rowData.sign);
    //     return <span>{formattedDate}</span>;
    // };

    // const CompletionBodyTemplate = (rowData: any) => {
    //     const formattedDate = formatDate(rowData.completion_date);
    //     return <span>{formattedDate}</span>;
    // };

    useEffect(() => {
        fetchContracts()
    }, []);

    useEffect(() => {
        // Apply filters whenever filter values change
        const filtered = data.filter(infos =>
            infos.department_name.toLowerCase().includes(departmentFilter.toLowerCase()) &&
            infos.partner_name.toLowerCase().includes(partenerFilter.toLowerCase()) &&
            infos.entity_name.toLowerCase().includes(entitateFilter.toLowerCase()) &&
            infos.category_name.toLowerCase().includes(categoryFilter.toLowerCase()) &&
            infos.tipcontract.toLowerCase().includes(TipContractFilter.toLowerCase()) &&
            infos.number.toLowerCase().includes(numarFilter.toLowerCase()) &&
            infos.status_name.toLowerCase().includes(statusFilter.toLowerCase()) &&
            infos.cost_center_name.toLowerCase().includes(costcenterFilter.toLowerCase()) &&
            infos.contract_type_name.toLowerCase().includes(ctrTypeFilter.toLowerCase()) &&
            infos.partner_person_name.toLowerCase().includes(resppartFilter.toLowerCase()) &&
            infos.entity_person_name.toLowerCase().includes(respentFilter.toLowerCase())
        );
        setFilteredData(filtered);
    }, [data, departmentFilter, categoryFilter, entitateFilter, partenerFilter, TipContractFilter,
        numarFilter, statusFilter, costcenterFilter, ctrTypeFilter, resppartFilter, respentFilter
    ]);


    //raport 1 contract general - filtre(informatii generale -acte aditionale ) - export excel 
    //raport 2 informatii financiare - filtre(date financiare - ) - export excel 

    const tableStyle = {
        fontFamily: '"Arial", sans-serif', // Specify your desired font
        fontSize: '12px', // Example: Set font size
        fontWeight: 'lighter' // Example: Set font weight
    };


    return (
        <MyProvider>
            <div className="grid p-fluid input-demo">

                <div className="col-2">
                    <div className="card">

                        <div className="grid p-fluid">
                            <Tag severity="secondary" value="Filtre:"></Tag>

                            <div className='pt-4'>
                                <label>Entitate:</label>
                                <input type="text" value={entitateFilter} onChange={e => setEntitateFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Partener:</label>
                                <input type="text" value={partenerFilter} onChange={e => setPartenerFilter(e.target.value)} />
                            </div>

                            <div>
                                <label>Departament:</label>
                                <input type="text" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Categorie:</label>
                                <input type="text" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} />
                            </div>

                            <div>
                                <label>Centru Cost:</label>
                                <input type="text" value={costcenterFilter} onChange={e => setCostCenterFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Numar:</label>
                                <input type="text" value={numarFilter} onChange={e => setNumarFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Stare:</label>
                                <input type="text" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Tip Contract:</label>
                                <input type="text" value={ctrTypeFilter} onChange={e => setCtrTypeFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Model:</label>
                                <input type="text" value={TipContractFilter} onChange={e => setTipContractFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Resp Partener:</label>
                                <input type="text" value={resppartFilter} onChange={e => setRespPartFilter(e.target.value)} />
                            </div>
                            <div>
                                <label>Resp Entitate:</label>
                                <input type="text" value={respentFilter} onChange={e => setRespEntFilter(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-10 md:col-10">
                    <div className="card">

                        <DataTable value={filtreddata}
                            stripedRows
                            // tableStyle={{ minWidth: '50rem' }} 
                            style={tableStyle}
                            paginator rows={5}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]} sortMode="multiple"
                            selectionMode="single">

                            <Column field="tipcontract" header="TipContract"></Column>
                            <Column field="number" header="Numar" sortable></Column>
                            <Column field="start_date" header="Start" dataType='date' sortable  ></Column>
                            <Column field="end_date" header="Final" dataType='date' sortable></Column>
                            <Column field="sign_date" header="Semnat" dataType='date' sortable   ></Column>
                            <Column field="completion_date" header="Inchis" dataType='date' sortable ></Column>
                            <Column field="remarks" header="Descriere" dataType='date' sortable></Column>
                            <Column field="automatic_renewal" header="ReinnoireAutomata" dataType='date' sortable></Column>
                            <Column field="entity_name" header="Entitate" sortable></Column>
                            <Column field="partner_name" header="Partener" sortable></Column>
                            <Column field="status_name" header="Status" sortable></Column>
                            <Column field="cashflow_name" header="CashFlow" sortable></Column>
                            <Column field="category_name" header="Categorie" sortable></Column>
                            <Column field="department_name" header="Departament" sortable></Column>
                            <Column field="cost_center_name" header="CentruCost" sortable></Column>
                            <Column field="contract_type_name" header="Model" sortable></Column>
                            <Column field="partner_person_name" header="NumeResponsabilPartener" sortable></Column>
                            <Column field="partner_person_role" header="RolResponsabilPartener" sortable></Column>
                            <Column field="partner_person_email" header="EmailResponsabilPartener " sortable></Column>
                            <Column field="entity_person_name" header="NumeResponsabilEntitate" sortable></Column>
                            <Column field="entity_person_role" header="RolResponsabilEntitate" sortable></Column>
                            <Column field="entity_person_email" header="EmaiResponsabilEntitate" sortable></Column>
                            <Column field="partner_address" header="AdresaPartener " sortable></Column>
                            <Column field="entity_address" header="AdresaEntitate " sortable></Column>
                            <Column field="partner_bank" header="BancaPartener " sortable></Column>
                            <Column field="partner_iban" header="IBANPartener " sortable></Column>
                            <Column field="entity_bank" header="BancaEntitate " sortable></Column>
                            <Column field="entity_iban" header="IBANEntitate " sortable></Column>

                        </DataTable>
                    </div>
                </div>
            </div>
        </MyProvider>
    );
}

export default Report;
