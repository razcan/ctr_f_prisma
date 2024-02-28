'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import router from 'next/router';


// numar versiune, tip act aditional, nr act aditional, data act ad, 

export default function AddContract() {

    const [selection, setSelection] = useState();
    const [additionals, setAdditionals] = useState();
    const router = useRouter();
    const [selectedContract, setselectedContract] = useState(null);
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));

    const gotoAddAddtionalAct = () => {
        router.push(`/uikit/editcontract/editcontract/addaddionals/add/ctr?Id=${Id}&addId=${0}`);
    }
    const fetchContent = async () => {
        const response = await fetch(`http://localhost:3000/contracts/additionals/${Id}`).
            then(res => res.json())
        setAdditionals(response);

    }

    const editContract = (id: any) => {
        router.push(`/uikit/editcontract/aa?Id=${id}`);
    }

    useEffect(() => {
        fetchContent()
    }, [])

    console.log(additionals)


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="col-2 md:col-2 ">
                        <Button label="Adauga act aditional" onClick={gotoAddAddtionalAct} />
                    </div>

                    <DataTable value={additionals} tableStyle={{ minWidth: '50rem' }}
                        stripedRows paginator rows={10}
                        rowsPerPageOptions={[10, 20, 30, 40, 100]} sortMode="multiple"
                        selectionMode="single"
                        selection={selectedContract} onSelectionChange={(e) => {
                            editContract(e.value.id)
                        }}
                    >
                        <Column field="id" header="Id"></Column>
                        <Column field="number" header="Numar"></Column>
                        <Column field="status.name" header="Stare"></Column>
                        <Column field="start" header="Data Start"></Column>
                        <Column field="end" header="Data Final"></Column>
                        <Column field="remarks" header="Detalii Contract"></Column>
                    </DataTable>

                </div>

            </div>
        </div>


    );
}