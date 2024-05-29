"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { MyContext } from '../../../../../layout/context/myUserContext';
import { InputText } from 'primereact/inputtext';
import Link from 'next/link';


const Department = ({ executeFunction }: any) => {

    const [departmentSelected, setDepartmentSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);
    const [data, setData] = useState([]);
    const [departament, setDepartament] = useState('');

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { setBreadCrumbItems } = useContext(MyContext);


    const showSuccess = (message: any) => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
        }
    }

    const showError = (message: any) => {
        if (toast.current) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    }

    const addDepartment = async () => {

        interface Department {
            name: string,
        }

        let toAdd: Department = {
            name: departament
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post(`${Backend_BASE_URL}/contracts/department`,
                    toAdd
                );
                showSuccess(`Departmentul ${toAdd.name} a fost adaugat!`)
                setDepartament('');
                fetchDepData();
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat departamentul! ${error}'`)
            }
        }
        else showError('Departamentul trebuie sa contina minim 3 caractere!')

    }


    const deleteDepartmentSelected = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/department/${event.id}`);
            console.log('departament deleted:', response.data);
            fetchDepData();
            showSuccess(`Departamentul ${event.name} a fost sters`)

        } catch (error) {
            console.error('Eroare la stergerea departamentului:', error);
            showError('Departamentul nu a putut fi sters!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setDepartmentSelected(departmentSelected);
    }, [departmentSelected]);


    const fetchDepData = () => {
        fetch(`${Backend_BASE_URL}/contracts/department`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setData(data)
            })
    }

    useEffect(() => {
        fetchDepData();

        setBreadCrumbItems(
            [{
                label: 'Acasa',
                template: () => <Link href="/">Acasa</Link>
            },
            {
                label: 'Nomenclatoare',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups`
                    return (
                        <Link href={url}>Nomenclatoare</Link>
                    )

                }
            },
            {
                label: 'Departamente',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/department`
                    return (
                        <Link href={url}>Departamente</Link>
                    )

                }
            },

            ]
        )

    }, []);

    const deleteDepartment = (event: any) => {
        setDepartmentSelected(event)
    }

    return (
        <div className='card'>
            <div>
                <div className="field col-12  md:col-3">
                    <span className="p-float-label">
                        <InputText id="departament" type="text" value={departament} onChange={(e) => setDepartament(e.target.value)} />
                        <label htmlFor="departament">Departament </label>
                    </span>
                </div>
                <div className='p-2'><Button label="Adauga" onClick={addDepartment} /></div>
            </div>

            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti departamentul ({departmentSelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteDepartmentSelected(departmentSelected)

                            }} />
                        </div>
                        <div className='col-1 pl-4'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            <DataTable value={data} size="small" stripedRows
                tableStyle={{ minWidth: '50rem' }} paginator
                rows={15} rowsPerPageOptions={[15, 30, 45]} sortMode="multiple"
                selectionMode="radiobutton"
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {
                        deleteDepartment(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default Department;
