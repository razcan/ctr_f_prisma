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
import Link from 'next/link';



const queryClient = new QueryClient();

const ContractListPage = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <div className="grid">
                <div className="col-12">
                    <div className="card">

                        <Contracts />
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
};

function Contracts() {



    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);
    const rows = 12;
    const rowsPerPageOptions = [12, 20, 30, 40, 100]


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
                label: 'Contracte Clienti',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/customercontracts`
                    return (
                        <Link href={url}>Contracte Clienti</Link>
                    )

                }
            }]
        )

    }, [])


    const [selectedContract, setselectedContract] = useState(null);
    const [data, setData] = useState([]);
    const [metaKey, setMetaKey] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    // can use the useQuery hook here
    // const { isLoading, error, data } = useQuery({
    //     queryKey: ['contractsData'],
    //     queryFn: () =>
    //         fetch('http://localhost:3000/contracts').then(res => res.json()),
    // });

    // if (isLoading) return (
    //     <ProgressSpinner
    //         style={{ width: "100px", height: "100px" }}
    //         strokeWidth="4"
    //         fill="var(--surface-ground)"
    //         animationDuration=".5s"
    //     />
    // );

    // if (error) return 'An error has occurred: ' + error.message;


    // const fetchContracts_old = async () => {
    //     const session: any = localStorage.getItem('token');
    //     const jwtToken = JSON.parse(session);

    //     if (jwtToken) {
    //         const jwtTokenf = jwtToken.access_token;
    //         const response = await fetch(`http://localhost:3000/contracts`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${jwtTokenf}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         // Assuming response.json() returns the actual data you want to set
    //         const data = await response.json();

    //         if (!response.ok) {
    //             const res = `HTTP error! Status: ${response.status}`
    //             if (response.status === 401) {
    //                 setData([]);
    //                 router.push('http://localhost:5500/auth/login')
    //             }
    //         }
    //         if (response.ok) {
    //             setData(data);
    //         }
    //     }
    // }


    const fetchContracts = async () => {

        const session = localStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/contracts/false`,
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
                })
                .catch(function (error) {
                    // if (response.status === 401) {
                    // }
                    setData([]);
                    router.push(`${Frontend_BASE_URL}/auth/login`)

                    console.log(error);
                });
        }
    }

    useEffect(() => {
        fetchContracts()
    }, [])


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
        const formattedDate = formatDate(rowData.end);
        return <span>{formattedDate}</span>;
    };

    const editContract = (id: any) => {
        setIsPurchasing(false)

        router.push(`/uikit/editcontract/ctr?Id=${id}&idxp=0`);


    }

    const addContract = () => {
        setIsPurchasing(false)
        router.push(`/uikit/addcontract/ctr?Id=${0}&idxp=0`)
    }

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange}
                    // placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();


    return (
        <MyProvider>
            <div>
                <div className='p-1'><Button label="Adauga" onClick={addContract} /></div>
                <DataTable value={data}
                    filters={filters}
                    globalFilterFields={['number', 'partner.name', 'entity.name',
                        'type.name', 'status.name', 'start', 'end', 'Category.name', 'location.name',
                        'costcenter.name', 'cashflow.name'
                    ]} header={header}
                    stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={rows} rowsPerPageOptions={rowsPerPageOptions} sortMode="multiple"
                    selectionMode="single" selection={selectedContract} onSelectionChange={(e) => {
                        setselectedContract(e.value),
                            editContract(e.value.id)
                    }} dataKey="id" metaKeySelection={metaKey}>
                    <Column hidden field="id" header="Id"></Column>
                    <Column field="number" header="Numar" sortable></Column>
                    <Column field="start" header="Start" dataType='date' sortable body={StartBodyTemplate} ></Column>
                    <Column field="end" header="Final" dataType='date' sortable body={EndBodyTemplate}></Column>
                    <Column field="entity.name" header="Entitate" sortable></Column>
                    <Column field="partner.name" header="Partener" sortable></Column>
                    <Column field="status.name" header="Stare" sortable></Column>
                    {/* <Column field="type.name" header="Tip" sortable></Column> */}
                    <Column field="Category.name" header="Categorie" sortable></Column>
                    <Column field="location.name" header="Locatie" sortable></Column>
                    <Column field="costcenter.name" header="CentruCost" sortable></Column>
                    <Column field="cashflow.name" header="Cashflow" sortable></Column>

                </DataTable>
            </div>
        </MyProvider>
    );
}

export default ContractListPage;
