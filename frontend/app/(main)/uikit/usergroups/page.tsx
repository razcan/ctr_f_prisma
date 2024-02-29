'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams } from 'next/navigation'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';




export default function HeaderContract({ setContractId }: any) {

    const router = useRouter();
    const [entity, setEntity] = useState();

    const fetchEntity = () => {
        fetch("http://localhost:3000/nomenclatures/entity")
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
    }


    useEffect(() => {
        fetchEntity()
    }, [])


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="col-12">
                        <div className="p-fluid formgrid grid p-3">

                            Grupuri
                            <div className="field col-12 md:col-3">

                            </div>

                            <div className="field col-12  md:col-3">
                                <Button label="Salveaza" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
