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

    const router = useRouter()



    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }

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


    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };

    // const fetchContracts_old = async () => {
    //     const session: any = sessionStorage.getItem('token');
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

        const session = sessionStorage.getItem('token');
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
                    router.push('http://localhost:5500/auth/login')

                    console.log(error);
                });
        }
    }

    // const fetchContracts = async () => {
    //     try {
    //         const data = await fetchWithToken('contracts', { method: 'GET' });
    //         setData(data);
    //     } catch (error) {
    //         if (error.message === 'No token found.') {
    //             setData([]);
    //             router.push('http://localhost:5500/auth/login');
    //         } else {
    //             console.error(error.message);
    //         }
    //     }
    // };




    useEffect(() => {
        fetchContracts()
    }, [])



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
        router.push(`/uikit/editcontract/ctr?Id=${id}`);

    }

    const addContract = () => {
        setIsPurchasing(false)
        router.push(`/uikit/addcontract/ctr?Id=${0}`)
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
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
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
                    globalFilterFields={['number', 'partner.name', 'entity.name', 'type.name', 'status.name', 'start', 'Category.name']} header={header}
                    stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={10} rowsPerPageOptions={[10, 20, 30, 40, 100]} sortMode="multiple"
                    selectionMode="single" selection={selectedContract} onSelectionChange={(e) => {
                        setselectedContract(e.value),
                            editContract(e.value.id)
                    }} dataKey="id" metaKeySelection={metaKey}>
                    <Column field="id" header="Id"></Column>
                    <Column field="number" header="Numar" sortable></Column>
                    <Column field="start" header="Start" dataType='date' sortable body={StartBodyTemplate} ></Column>
                    <Column field="end" header="Final" dataType='date' sortable body={EndBodyTemplate}></Column>
                    <Column field="entity.name" header="Entitate" sortable></Column>
                    <Column field="partner.name" header="Partener" sortable></Column>
                    <Column field="status.name" header="Status" sortable></Column>
                    <Column field="type.name" header="Tip" sortable></Column>
                    <Column field="Category.name" header="Categorie" sortable></Column>

                </DataTable>
            </div>
        </MyProvider>
    );
}

export default ContractListPage;
