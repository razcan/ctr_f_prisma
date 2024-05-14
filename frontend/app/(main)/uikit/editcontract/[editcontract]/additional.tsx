'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import router from 'next/router';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'

// numar versiune, tip act aditional, nr act aditional, data act ad, 

export default function AddContract() {

    const [selection, setSelection] = useState();
    const [additionals, setAdditionals] = useState<any>([]);
    const router = useRouter();
    const [selectedContract, setselectedContract] = useState(null);
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));



    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { isAdditional, setIsAdditional } = useMyContext();


    const gotoAddAddtionalAct = () => {
        setIsAdditional(true);
        router.push(`/uikit/editcontract/editcontract/addaddionals/add/ctr?Id=${Id}&addId=${0}`);
    }

    const fetchContent = async () => {
        setIsAdditional(true);
        const response = await fetch(`http://localhost:3000/contracts/additionals/${Id}`).
            then(res => res.json())
        setAdditionals(response);

    }

    const editContract = (id: any) => {
        setIsAdditional(true);
        router.push(`/uikit/editcontract/aa?Id=${id}`);
    }

    useEffect(() => {
        fetchContent()
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


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="col-2 md:col-2 ">
                        <Button label="Adauga act aditional" onClick={gotoAddAddtionalAct} />
                    </div>

                    {
                        additionals.length > 0 ?
                            <DataTable value={additionals} tableStyle={{ minWidth: '50rem' }}
                                stripedRows paginator rows={10}
                                rowsPerPageOptions={[10, 20, 30, 40, 100]} sortMode="multiple"
                                selectionMode="single"
                                selection={selectedContract} onSelectionChange={(e) => {
                                    editContract(e.value.id)
                                }}
                            >
                                <Column hidden field="id" header="Id"></Column>
                                <Column field="number" header="Numar"></Column>
                                <Column field="status.name" header="Stare"></Column>
                                <Column field="start" header="Start" dataType='date' sortable body={StartBodyTemplate} ></Column>
                                <Column field="end" header="Final" dataType='date' sortable body={EndBodyTemplate}></Column>
                                <Column field="remarks" header="Detalii Contract"></Column>
                            </DataTable>
                            : null}

                </div>

            </div>
        </div>


    );
}