"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'

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

    const [selectedContract, setselectedContract] = useState(null);
    const [data, setData] = useState([]);
    const [metaKey, setMetaKey] = useState(true);

    const editContract = (id: any) => {
        router.push(`/uikit/editcontract/ctr?Id=${id}`);
    }

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

    const fetchContracts = () => {
        fetch("http://localhost:3000/contracts")
            .then(response => {
                return response.json()
            })
            .then(contract => {
                setData(contract)
            })
    }

    useEffect(() => {
        fetchContracts()
    }, [])


    const router = useRouter()

    const StartBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.start);
        return <span>{formattedDate}</span>;
    };
    const EndBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.start);
        return <span>{formattedDate}</span>;
    };

    return (
        <div>

            <DataTable value={data} stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={12} rowsPerPageOptions={[6, 12, 24, 48, 100]} sortMode="multiple"
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
                <Column field="status.name" header="Status" sortable></Column>
                <Column field="type.name" header="Tip" sortable></Column>
                <Column field="Category.name" header="Categorie" sortable></Column>

            </DataTable>
        </div>
    );
}

export default ContractListPage;
