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
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';


const Type = ({ executeFunction }: any) => {

    const [typeSelected, settypeSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);
    const [data, setData] = useState([]);
    const [type, setType] = useState('');

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


    const deletetypeSelected = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/type/${event.id}`);
            console.log('contract type deleted:', response.data);
            fetchtypeData();
            showSuccess(`Tipul de contract ${event.name} a fost sters`);

        } catch (error) {
            console.error('Eroare la stergerea tipului de contract:', error);
            showError('Tipul de contract nu a putut fi sters!')
        }
        setVisible(false)
    }

    useEffect(() => {
        settypeSelected(typeSelected);
    }, [typeSelected]);


    const fetchtypeData = () => {
        fetch(`${Backend_BASE_URL}/contracts/type`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setData(data)
            })
    }

    useEffect(() => {
        fetchtypeData();

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
                label: 'Tipuri Contracte',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/type`
                    return (
                        <Link href={url}>Tipuri Contracte</Link>
                    )

                }
            },

            ]
        )

    }, []);

    const addContractType = async () => {

        interface ContractType {
            name: string,
        }

        let toAdd: ContractType = {
            name: type
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post(`${Backend_BASE_URL}/contracts/type`,
                    toAdd
                );
                showSuccess(`Entitatea ${toAdd.name} a fost adaugata!`)
                setType('');
                fetchtypeData();
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat! ${error}'`)
            }
        }
        else showError('Tipul trebuie sa contina minim 3 caractere!')
    }

    const deleteType = (event: any) => {
        settypeSelected(event)
    }

    return (
        <div className='card'>
            <div className="field col-12  md:col-3">
                <span className="p-float-label">
                    <InputText id="costcenter" type="text" value={type} onChange={(e) => setType(e.target.value)} />
                    <label htmlFor="costcenter">Tip Contracte</label>
                </span>
            </div>
            <div className='p-2'><Button label="Adauga" onClick={addContractType} /></div>

            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti tipul de contract ({typeSelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deletetypeSelected(typeSelected)

                            }} />
                        </div>
                        <div className='col-1 pl-4'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            <DataTable value={data} size="small" stripedRows
                tableStyle={{ minWidth: '50rem' }} paginator rows={15}
                rowsPerPageOptions={[15, 30, 45]} sortMode="multiple"
                selectionMode="radiobutton"
                onSelectionChange={
                    (e) => {
                        deleteType(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default Type;
