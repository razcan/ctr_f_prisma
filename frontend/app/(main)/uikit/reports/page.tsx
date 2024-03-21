"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';


interface Car {
    make: string;
    model: string;
    price: number;
}

interface Infos {
    tipcontract: string;
    number: string;
    start_date: string;
    end_date: string;
    sign_date: string;
    completion_date: string;
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


    const [cashflows, setCashflow] = useState([]);
    const [costcenters, setCostCenter] = useState([]);
    const [item, setItems] = useState([]);
    const [entity, setEntity] = useState([]);
    const [partner, setPartner] = useState([]);
    const [entityPersons, setEntityPersons] = useState([]);
    const [entityBanks, setEntityBanks] = useState([]);
    const [entityAddress, setEntityAddress] = useState([]);
    const [partnerPersons, setPartnerPersons] = useState([]);
    const [partnerBanks, setPartnerBanks] = useState([]);
    const [partnerAddress, setPartnerAddress] = useState([]);
    const [contractType, setContractType] = useState([]);
    const [contractStatus, setContractStatus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState([]);

    const [selMultiselectEntity, setSelMultiselect] = useState([]);
    const [selMultiselectDepartment, setSelMultiselectDepartment] = useState([]);

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
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };



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

    useEffect(() => {
        // test()

        const partners_data = selMultiselectEntity.map(partner => partner.name)
        const departments_data = selMultiselectDepartment.map(department => department.name)
        console.log(departments_data)
        // Apply filters whenever filter values change
        const filtered = data.filter(infos => {
            const match =
                (
                    (partners_data.length === 0 || partners_data.some(entity => infos.entity_name.includes(entity))) &&
                    (departments_data.length === 0 || departments_data.some(dep => infos.department_name.includes(dep)))
                    // infos.department_name.toLowerCase().includes(departmentFilter.toLowerCase())
                );
            // console.log(`Entity Name: ${infos.entity_name}, Filtered Entities: ${filtred_ent}, Match: ${match}`);
            console.log(match)
            return match;
        }


            // infos.department_name.toLowerCase().includes(departmentFilter.toLowerCase()) &&
            // infos.partner_name.toLowerCase().includes(partenerFilter.toLowerCase()) &&

            // (filtred_ent.length === 0 || filtred_ent.some(entity => infos.entity_name.includes(entity))) &&
            // // infos.entity_name.toLowerCase().includes(entitateFilter.toLowerCase()) &&
            // infos.category_name.toLowerCase().includes(categoryFilter.toLowerCase()) &&
            // infos.tipcontract.toLowerCase().includes(TipContractFilter.toLowerCase()) &&
            // infos.number.toLowerCase().includes(numarFilter.toLowerCase()) &&
            // infos.status_name.toLowerCase().includes(statusFilter.toLowerCase()) &&
            // infos.cost_center_name.toLowerCase().includes(costcenterFilter.toLowerCase()) &&
            // infos.contract_type_name.toLowerCase().includes(ctrTypeFilter.toLowerCase()) &&
            // infos.partner_person_name.toLowerCase().includes(resppartFilter.toLowerCase()) &&
            // infos.entity_person_name.toLowerCase().includes(respentFilter.toLowerCase())
        );
        console.log(filtered)

        setFilteredData(filtered)


    }, [data, departmentFilter, categoryFilter, entitateFilter, partenerFilter, TipContractFilter,
        numarFilter, statusFilter, costcenterFilter, ctrTypeFilter, resppartFilter, respentFilter,
        selMultiselectEntity, selMultiselectDepartment
    ]);



    //raport 1 contract general - filtre(informatii generale -acte aditionale ) - export excel 
    //raport 2 informatii financiare - filtre(date financiare - ) - export excel 

    const tableStyle = {
        fontFamily: '"Arial", sans-serif', // Specify your desired font
        fontSize: '12px', // Example: Set font size
        fontWeight: 'lighter',
    };


    const fetchTypeData = () => {
        fetch("http://localhost:3000/nomenclatures/contracttype")
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })

    }

    const fetchStatusData = () => {
        fetch("http://localhost:3000/nomenclatures/contractstatus")
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractStatus(status)
            })

    }


    const fetchCategoriesData = () => {
        fetch("http://localhost:3000/contracts/category")
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })

    }

    const fetchEntity = () => {
        fetch("http://localhost:3000/nomenclatures/entity")
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
    }

    const fetchPartners = () => {
        fetch("http://localhost:3000/nomenclatures/partners")
            .then(response => {
                return response.json()
            })
            .then(partner => {
                setPartner(partner)
            })
    }


    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item")
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItems(item)
            })
    }


    const fetchCashFlow = () => {
        fetch("http://localhost:3000/contracts/cashflow")
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchCostCenter = () => {
        fetch("http://localhost:3000/contracts/costcenter")
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }


    const fetchDepartmentsData = () => {
        fetch("http://localhost:3000/contracts/department")
            .then(response => {
                return response.json()
            })
            .then(departments => {
                setDepartments(departments)
            })
    }


    useEffect(() => {

        fetchContracts(),
            fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchItemsData(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData()
    }, []);



    return (
        <MyProvider>
            <div className="grid p-fluid input-demo">

                <div className="col-3 md:col-3 lg:col-2 xl:col-3">
                    <div className="card" >
                        <Tag severity="secondary" value="Filtre:"></Tag>

                        <div className="grid p-fluid pt-5"
                        // style={{ height: 'calc(100vh - 13.7rem)' }}
                        // style={{ height: "100vh" }} 
                        >

                            <div className="field col-12  md:col-12">
                                <MultiSelect value={selMultiselectEntity} onChange={(e) => {
                                    setSelMultiselect(e.value)
                                    console.log(e.value)
                                }}
                                    options={entity} optionLabel="name"
                                    display="chip"
                                    placeholder="Entitate" maxSelectedLabels={5} />
                            </div>


                            <span className="col-12 p-float-label">
                                <InputText id="Partener" value={partenerFilter} onChange={(e) => setPartenerFilter(e.target.value)} />
                                <label htmlFor="Partener" className='pt-2'>Partener</label>
                            </span>



                            {/* <span className="col-12 p-float-label">
                                <InputText id="Departament" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} />
                                <label htmlFor="Departament" className='pt-2'>Departament</label>
                            </span> */}

                            <div className="field col-12  md:col-12">
                                <MultiSelect value={selMultiselectDepartment} onChange={(e) => {
                                    setSelMultiselectDepartment(e.value)
                                    console.log(e.value)
                                }}
                                    options={departments} optionLabel="name"
                                    display="chip"
                                    placeholder="Departament" maxSelectedLabels={5} />
                            </div>


                            <span className="col-12 p-float-label">
                                <InputText id="Categorie" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
                                <label htmlFor="Categorie" className='pt-2'>Categorie</label>
                            </span>

                            <span className="col-12 p-float-label">
                                <InputText id="Centru Cost" value={costcenterFilter} onChange={(e) => setCostCenterFilter(e.target.value)} />
                                <label htmlFor="Centru Cost" className='pt-2'>Centru Cost</label>
                            </span>

                            <span className="col-12 p-float-label">
                                <InputText id="Numar" value={numarFilter} onChange={(e) => setNumarFilter(e.target.value)} />
                                <label htmlFor="Numar" className='pt-2'>Numar</label>
                            </span>

                            <span className="col-12 p-float-label">
                                <InputText id="Stare" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
                                <label htmlFor="Stare" className='pt-2'>Stare</label>
                            </span>

                            <span className="col-12 p-float-label">
                                <InputText id="Tip" value={ctrTypeFilter} onChange={(e) => setCtrTypeFilter(e.target.value)} />
                                <label htmlFor="Tip" className='pt-2'>Tip</label>
                            </span>

                            <span className="col-12 p-float-label">
                                <InputText id="Model" value={TipContractFilter} onChange={(e) => setTipContractFilter(e.target.value)} />
                                <label htmlFor="Model" className='pt-2'>Model</label>
                            </span>


                            <span className="col-12 p-float-label">
                                <InputText id="Resp Partener" value={resppartFilter} onChange={(e) => setRespPartFilter(e.target.value)} />
                                <label htmlFor="Resp Partener" className='pt-2'>Resp Partener</label>
                            </span>

                            <span className="col-12 p-float-label">
                                <InputText id="Resp Entitate" value={respentFilter} onChange={(e) => setRespEntFilter(e.target.value)} />
                                <label htmlFor="Resp Entitate" className='pt-2'>Resp Entitate</label>
                            </span>

                        </div>
                    </div>
                </div>


                <div className="col-9 md:col-9 lg:col-10 xl:col-9">
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
                            <Column field="start_date" header="Start" dataType='date' sortable body={StartBodyTemplate} ></Column>
                            <Column field="end_date" header="Final" dataType='date' sortable body={EndBodyTemplate}></Column>
                            <Column field="sign_date" header="Semnat" dataType='date' sortable body={SignBodyTemplate}  ></Column>
                            <Column field="completion_date" header="Inchis" dataType='date' sortable body={CompletionBodyTemplate} ></Column>
                            <Column field="remarks" header="Descriere" dataType='date' sortable></Column>
                            <Column field="automatic_renewal" header="ReinnoireAutomata" dataType='date' sortable></Column>
                            <Column field="entity_name" header="Entitate" sortable></Column>
                            <Column field="partner_name" header="Partener" sortable></Column>
                            <Column field="status_name" header="Stare" sortable></Column>
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
