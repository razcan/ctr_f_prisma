"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

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

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [metaKey, setMetaKey] = useState(true);
    console.log(selectedProduct)

    // can use the useQuery hook here
    const { isLoading, error, data } = useQuery({
        queryKey: ['contractsData'],
        queryFn: () =>
            fetch('http://localhost:3000/contracts').then(res => res.json()),
    });

    if (isLoading) return (
        <ProgressSpinner
            style={{ width: "100px", height: "100px" }}
            strokeWidth="4"
            fill="var(--surface-ground)"
            animationDuration=".5s"
        />
    );

    if (error) return 'An error has occurred: ' + error.message;

    return (
        <div>

            <DataTable value={data} stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={12} rowsPerPageOptions={[6, 12, 24, 48, 100]} sortMode="multiple"
                selectionMode="single" selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)} dataKey="id" metaKeySelection={metaKey}
            >
                <Column field="id" header="id"></Column>
                <Column field="number" header="number" sortable></Column>
                <Column field="partner" header="partner" sortable></Column>
                <Column field="status" header="status" sortable></Column>
                <Column field="remarks" header="remarks" sortable></Column>
            </DataTable>
        </div>
    );
}

export default ContractListPage;
