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


interface Infos {


    contractid: string;
    tiptranzactie: string;
    partener: string;
    entitate: string;
    numarcontract: string;
    start: string;
    final: string;
    descrierecontract: string;
    cashflow: string;
    data: string;
    procentplusbnr: string;
    procentpenalitate: string;
    nrzilescadente: string;
    articol: string;
    cantitate: string;
    pretunitarinvaluta: string;
    valoareinvaluta: string;
    valuta: string;
    cursvalutar: string;
    valoareron: string;
    platitincasat: string;
    facturat: string;

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
    const [currency, setCurrency] = useState([]);
    const [contractStatus, setContractStatus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [selMultiselectEntity, setSelMultiselect] = useState([]);
    const [selMultiselectDepartment, setSelMultiselectDepartment] = useState([]);
    const [selMultiselectPartner, setselMultiselectPartner] = useState([]);
    const [selMultiselectItem, setselMultiselectItem] = useState([]);
    const [selMultiselectCurrency, setselMultiselectCurrency] = useState([]);

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
                url: `${Backend_BASE_URL}/contracts/cashflowreport`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    console.log(response.data)
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
        const formattedDate = formatDate(rowData.start);
        return <span>{formattedDate}</span>;
    };

    const EndBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.final);
        return <span>{formattedDate}</span>;
    };

    const DateBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.data);
        return <span>{formattedDate}</span>;
    };

    useEffect(() => {

        const entity_data = selMultiselectEntity.map(partner => partner.name)
        const partners_data = selMultiselectPartner.map(partner => partner.name)
        const items_data = selMultiselectItem.map(items => items.name)
        const currency_data = selMultiselectCurrency.map(currency => currency.code)


        // Apply filters whenever filter values change
        const filtered = data.filter(infos => {
            const match =
                (
                    (entity_data.length === 0 || entity_data.some(entity => infos.entitate.includes(entity))) &&
                    (partners_data.length === 0 || partners_data.some(partner => infos.partener.includes(partner))) &&
                    (items_data.length === 0 || items_data.some(item => infos.articol.includes(item))) &&
                    (currency_data.length === 0 || currency_data.some(currency => infos.valuta.includes(currency))) &&
                    infos.numarcontract.toLowerCase().includes(numarFilter.toLowerCase())
                );
            return match;
        }
        );
        setFilteredData(filtered)


    }, [data, departmentFilter, categoryFilter, entitateFilter, partenerFilter, TipContractFilter,
        numarFilter, statusFilter, costcenterFilter, ctrTypeFilter, resppartFilter, respentFilter,
        selMultiselectEntity, selMultiselectDepartment, selMultiselectPartner,
        selMultiselectItem, selMultiselectCurrency
    ]);


    const tableStyle = {
        fontFamily: '"Arial", sans-serif', // Specify your desired font
        fontSize: '12px', // Example: Set font size
        fontWeight: 'lighter',
    };


    const fetchStatusData = () => {
        fetch("http://localhost:3000/nomenclatures/contractstatus")
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractStatus(status)
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

    const fetchCurrencies = () => {
        fetch("http://localhost:3000/nomenclatures/allcurrencies")
            .then(response => {
                return response.json()
            })
            .then(currency => {
                setCurrency(currency)
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



    useEffect(() => {

        fetchContracts(),
            fetchCurrencies(),
            fetchItemsData(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchStatusData()
    }, []);

    // artciol, valuta, tip incasare/plata


    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(filtreddata);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'scadentar');
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
        setselMultiselectPartner([])
        setselMultiselectCurrency([])
        setselMultiselectItem([])
        setNumarFilter('')
    }



    return (
        <MyProvider>

            <div className="grid p-fluid">
                <div className="col-12">

                    <div className="card">


                        <div className="field col-12  md:col-12">
                            <MultiSelect value={selMultiselectEntity} onChange={(e) => {
                                setSelMultiselect(e.value)
                            }}
                                options={entity} optionLabel="name"
                                display="chip"
                                placeholder="Entitate" maxSelectedLabels={5} />
                        </div>


                        <div className="field col-12  md:col-12">
                            <MultiSelect value={selMultiselectPartner} onChange={(e) => {
                                setselMultiselectPartner(e.value)
                            }}
                                options={partner} optionLabel="name"
                                display="chip"
                                placeholder="Partener" maxSelectedLabels={5} />
                        </div>

                        <div className="field col-12  md:col-12">
                            <MultiSelect value={selMultiselectItem} onChange={(e) => {
                                setselMultiselectItem(e.value)
                            }}
                                options={item} optionLabel="name"
                                display="chip"
                                placeholder="Articol" maxSelectedLabels={5} />
                        </div>


                        <div className="field col-12  md:col-12">
                            <MultiSelect value={selMultiselectCurrency} onChange={(e) => {
                                setselMultiselectCurrency(e.value)
                            }}
                                options={currency} optionLabel="code"
                                display="chip"
                                placeholder="Valuta" maxSelectedLabels={5} />
                        </div>


                        <div className="field col-12  md:col-12">
                            <span className="p-float-label">
                                <InputText id="Numar" value={numarFilter} onChange={(e) => setNumarFilter(e.target.value)} />
                                <label htmlFor="Numar" className='pt-1'>Numar Ctr.</label>
                            </span>
                        </div>

                    </div>




                    <div className="col-12">
                        <div className="card">
                            <Button type="button" icon="pi pi-file-excel" severity="Secondary" rounded onClick={exportExcel} data-pr-tooltip="XLS" />

                            <DataTable value={filtreddata}
                                stripedRows
                                tableStyle={{ minWidth: '50rem' }}
                                style={tableStyle}
                                size='small'
                                paginator rows={8}
                                rowsPerPageOptions={[5, 10, 20, 50, 100]} sortMode="multiple"
                                selectionMode="single">

                                <Column field="contractid" hidden header="contractid"></Column>
                                <Column field="tiptranzactie" header="TipTranzactie" sortable></Column>
                                <Column field="start" header="Start" dataType='date' sortable body={StartBodyTemplate} ></Column>
                                <Column field="final" header="Final" dataType='date' sortable body={EndBodyTemplate}></Column>
                                <Column field="data" header="Data" dataType='date' sortable body={DateBodyTemplate}  ></Column>
                                <Column field="partener" header="Partener" dataType='date' sortable></Column>
                                <Column field="entitate" header="Entitate" dataType='date' sortable></Column>
                                <Column field="numarcontract" header="NrContract" sortable></Column>
                                <Column field="descrierecontract" header="ScurtaDescriere" sortable></Column>
                                <Column field="cashflow" header="Cashflow" sortable></Column>
                                <Column field="procentplusbnr" header="procentplusbnr" sortable></Column>
                                <Column field="procentpenalitate" header="Procentpenalitate" sortable></Column>
                                <Column field="nrzilescadente" header="Nrzilescadente" sortable></Column>
                                <Column field="articol" header="Articol" sortable></Column>
                                <Column field="cantitate" header="Cantitate" sortable></Column>
                                <Column field="pretunitarinvaluta" header="Pretunitarinvaluta" sortable></Column>
                                <Column field="valoareinvaluta" header="Valoareinvaluta" sortable></Column>
                                <Column field="valuta" header="Valuta " sortable></Column>
                                <Column field="cursvalutar" header="Cursvalutar" sortable></Column>
                                <Column field="valoareron" header="Valoareron" sortable></Column>
                                <Column field="platitincasat" header="Platitincasat" sortable></Column>
                                <Column field="facturat" header="Facturat " sortable></Column>


                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

        </MyProvider>
    );
}

export default Report;
