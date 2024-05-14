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
import * as XLSX from 'xlsx';
import Link from 'next/link';

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
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);


    const router = useRouter()


    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }

        setBreadCrumbItems(
            [{
                label: 'Home',
                template: () => <Link href="/">Home</Link>
            },
            {
                label: 'Raport general',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/reports`
                    return (
                        <Link href={url}>Raport general</Link>
                    )

                }
            }]
        )

    }, [])


    const [cashflows, setCashflow] = useState([]);
    const [costcenters, setCostCenter] = useState([]);
    const [item, setItems] = useState([]);
    const [entity, setEntity] = useState([]);
    const [partner, setPartner] = useState([]);
    const [contractType, setContractType] = useState([]);
    const [contractStatus, setContractStatus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [selMultiselectEntity, setSelMultiselect] = useState([]);
    const [selMultiselectDepartment, setSelMultiselectDepartment] = useState([]);
    const [selMultiselectPartner, setselMultiselectPartner] = useState([]);
    const [selMultiselectCostcenter, setselMultiselectCostcenter] = useState([]);
    const [selMultiselectCategory, setselMultiselectCategory] = useState([]);
    const [selMultiselectStatus, setselMultiselectStatus] = useState([]);
    const [selMultiselectModel, setselMultiselectModel] = useState([]);

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

        const entity_data = selMultiselectEntity.map(partner => partner.name)
        const departments_data = selMultiselectDepartment.map(department => department.name)
        const partners_data = selMultiselectPartner.map(partner => partner.name)
        const costcenters_data = selMultiselectCostcenter.map(costcenter => costcenter.name)
        const category_data = selMultiselectCategory.map(category => category.name)
        const status_data = selMultiselectStatus.map(status => status.name)
        const model_data = selMultiselectModel.map(model => model.name)

        // Apply filters whenever filter values change
        const filtered = data.filter(infos => {
            const match =
                (
                    (entity_data.length === 0 || entity_data.some(entity => infos.entity_name.includes(entity))) &&
                    (partners_data.length === 0 || partners_data.some(partner => infos.partner_name.includes(partner))) &&
                    (costcenters_data.length === 0 || costcenters_data.some(costcenter => infos.cost_center_name.includes(costcenter))) &&
                    (status_data.length === 0 || status_data.some(status => infos.status_name.includes(status))) &&
                    (category_data.length === 0 || category_data.some(category => infos.category_name.includes(category))) &&
                    (model_data.length === 0 || model_data.some(model => infos.contract_type_name.includes(model))) &&
                    (departments_data.length === 0 || departments_data.some(dep => infos.department_name.includes(dep))) &&
                    infos.number.toLowerCase().includes(numarFilter.toLowerCase()) &&
                    infos.tipcontract.toLowerCase().includes(TipContractFilter.toLowerCase()) &&
                    infos.partner_person_name.toLowerCase().includes(resppartFilter.toLowerCase()) &&
                    infos.entity_person_name.toLowerCase().includes(respentFilter.toLowerCase())
                );
            return match;
        }
        );
        setFilteredData(filtered)


    }, [data, departmentFilter, categoryFilter, entitateFilter, partenerFilter, TipContractFilter,
        numarFilter, statusFilter, costcenterFilter, ctrTypeFilter, resppartFilter, respentFilter,
        selMultiselectEntity, selMultiselectDepartment, selMultiselectPartner, selMultiselectCostcenter,
        selMultiselectCategory, selMultiselectStatus, selMultiselectModel
    ]);

    const tableStyle = {
        fontFamily: '"Arial", sans-serif', // Specify your desired font
        fontSize: '12px', // Example: Set font size
        fontWeight: 'lighter',
    };


    const fetchTypeData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contracttype`)
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })

    }

    const fetchStatusData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contractstatus`)
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractStatus(status)
            })

    }


    const fetchCategoriesData = () => {
        fetch(`${Backend_BASE_URL}/contracts/category`)
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })

    }

    const fetchEntity = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/entity`)
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
    }

    const fetchPartners = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/partners`)
            .then(response => {
                return response.json()
            })
            .then(partner => {
                setPartner(partner)
            })
    }


    const fetchItemsData = () => {
        fetch(`${Backend_BASE_URL}/contracts/item`)
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItems(item)
            })
    }


    const fetchCashFlow = () => {
        fetch(`${Backend_BASE_URL}/contracts/cashflow`)
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchCostCenter = () => {
        fetch(`${Backend_BASE_URL}/contracts/costcenter`)
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }


    const fetchDepartmentsData = () => {
        fetch(`${Backend_BASE_URL}/contracts/department`)
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


    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(filtreddata);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'raport');
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

    const clearAllFilters = () => {
        setSelMultiselect([])
        setSelMultiselectDepartment([])
        setselMultiselectPartner([])
        setselMultiselectCostcenter([])
        setselMultiselectCategory([])
        setselMultiselectStatus([])
        setselMultiselectModel([])
        setTipContractFilter('')
        setNumarFilter('')
    }

    return (
        <MyProvider>
            <div className="grid p-fluid input-demo">



                <div className="col-12" >
                    <div className="card" >

                        <div className='grid'>
                            <div className="col-2">

                                <div className="field col-12  md:col-12 pt-7">
                                    <MultiSelect style={tableStyle} value={selMultiselectEntity} onChange={(e) => {
                                        setSelMultiselect(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={entity} optionLabel="name"
                                        display="chip"
                                        placeholder="Entitate" maxSelectedLabels={5} />
                                </div>


                                <div className="field col-12  md:col-12">
                                    <MultiSelect style={tableStyle} value={selMultiselectPartner} onChange={(e) => {
                                        setselMultiselectPartner(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={partner} optionLabel="name"
                                        display="chip"
                                        placeholder="Partener" maxSelectedLabels={5} />
                                </div>


                                <div className="field col-12  md:col-12">
                                    <MultiSelect style={tableStyle} value={selMultiselectDepartment} onChange={(e) => {
                                        setSelMultiselectDepartment(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={departments} optionLabel="name"
                                        display="chip"
                                        placeholder="Departament" maxSelectedLabels={5} />
                                </div>


                                <div className="field col-12  md:col-12">
                                    <MultiSelect style={tableStyle} value={selMultiselectCategory} onChange={(e) => {
                                        setselMultiselectCategory(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={categories} optionLabel="name"
                                        display="chip"
                                        placeholder="Categorie" maxSelectedLabels={5} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <MultiSelect style={tableStyle} value={selMultiselectCostcenter} onChange={(e) => {
                                        setselMultiselectCostcenter(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={costcenters} optionLabel="name"
                                        display="chip"
                                        placeholder="Centru Cost" maxSelectedLabels={5} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <MultiSelect style={tableStyle} value={selMultiselectStatus} onChange={(e) => {
                                        setselMultiselectStatus(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={contractStatus}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="Stare" maxSelectedLabels={5} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <MultiSelect style={tableStyle} value={selMultiselectModel} onChange={(e) => {
                                        setselMultiselectModel(e.value)
                                        // console.log(e.value)
                                    }}
                                        options={contractType}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="Model" maxSelectedLabels={5} />
                                </div>

                                <div className="col-12 pt-2">
                                    <span className="p-float-label">
                                        <InputText id="Numar" value={numarFilter} onChange={(e) => setNumarFilter(e.target.value)} />
                                        <label style={tableStyle} htmlFor="Numar" className='pt-1'>Numar</label>
                                    </span>
                                </div>


                                <div className="col-12 pt-4">
                                    <span className="p-float-label">
                                        <InputText id="Model" value={TipContractFilter} onChange={(e) => setTipContractFilter(e.target.value)} />
                                        <label style={tableStyle} htmlFor="Model">Tip Contract</label>
                                    </span>
                                </div>

                                {/* <Button icon="pi pi-times" rounded text severity="danger" aria-label="Delete" onClick={clearAllFilters} data-pr-tooltip="XLS" /> */}


                            </div>
                            <div className="col-10">
                                <Button type="button" icon="pi pi-file-excel" severity="Secondary" rounded onClick={exportExcel} data-pr-tooltip="XLS" />

                                <DataTable value={filtreddata}
                                    stripedRows
                                    tableStyle={{ minWidth: '50rem' }}
                                    style={tableStyle}
                                    size='small'
                                    paginator rows={10}
                                    rowsPerPageOptions={[20, 50, 100]} sortMode="multiple"
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
                                    {/* <Column field="partner_address" header="AdresaPartener " sortable></Column>
                            <Column field="entity_address" header="AdresaEntitate " sortable></Column> */}
                                    <Column field="partner_bank" header="BancaPartener " sortable></Column>
                                    <Column field="partner_iban" header="IBANPartener " sortable></Column>
                                    <Column field="entity_bank" header="BancaEntitate " sortable></Column>
                                    <Column field="entity_iban" header="IBANEntitate " sortable></Column>

                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MyProvider>
    );
}

export default Report;
