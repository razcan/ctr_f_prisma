'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


// numar versiune, tip act aditional, nr act aditional, data act ad, 

export default function AddContract() {

    const [selection, setSelection] = useState();
    const [additionals, setAdditionals] = useState();

    http://localhost:5500/uikit/editcontract/ctr?Id=1

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="col-2 md:col-2 ">
                        <Button label="Adauga act aditional" />
                    </div>

                    <DataTable value={additionals} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="code" header="Numar"></Column>
                        <Column field="name" header="Data"></Column>
                        <Column field="category" header="Data Start"></Column>
                        <Column field="quantity" header="Data Final"></Column>
                        <Column field="quantity" header="Data Semnare"></Column>
                    </DataTable>

                </div>

            </div>
        </div>


    );
}