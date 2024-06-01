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


const CashFlow = ({ executeFunction }: any) => {

    const [CashFlowSelected, setCashFlowSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);
    const toast = useRef<undefined | null | any>(null);

    const [cashflow, setCashFlow] = useState('');
    const [cashflowIndex, setCashflowIndex] = useState<number>(0);

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


    const deleteCashFlowSelected = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/cashflow/${event.id}`);
            console.log('Cashflow line was deleted:', response.data);
            showSuccess(`Linia de Cashflow ${event.name} a fost stearsa`);
            fetchCFData();

        } catch (error) {
            console.error('Eroare la stergerea a liniei de cashflow:', error);
            showError('Linia de Cashflow nu a putut fi stearsa!')
        }
        setVisible(false)
    }


    const fetchCFData = () => {
        fetch(`${Backend_BASE_URL}/contracts/cashflownom`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setData(data)
            })
    }

    useEffect(() => {
        setCashFlowSelected(CashFlowSelected);
    }, [CashFlowSelected]);


    useEffect(() => {
        fetchCFData();

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
                label: 'CashFlow',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/cashflow`
                    return (
                        <Link href={url}>CashFlow</Link>
                    )

                }
            },

            ]
        )

    }, []);




    const addCashFlow = async () => {

        interface CashFlow {
            name: string,
        }

        let toAdd: CashFlow = {
            name: cashflow
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post(`${Backend_BASE_URL}/contracts/cashflow`,
                    toAdd
                );
                showSuccess(`Linia de cashflow ${toAdd.name} a fost adaugata!`)
                setCashflowIndex((prevKey: number) => prevKey + 1);
                setCashFlow('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat linia de cashflow ! ${error}'`)
            }
        }
        else showError('Linia de cashflow trebuie sa contina minim 3 caractere!')

    }


    const deleteCashFlow = (event: any) => {
        setCashFlowSelected(event)
    }

    return (
        <div className='card'>

            <div>
                <div className="field col-12  md:col-3">
                    <span className="p-float-label">
                        <InputText id="cashflow" type="text" value={cashflow} onChange={(e) => setCashFlow(e.target.value)} />
                        <label htmlFor="cashflow">Cashflow </label>
                    </span>
                </div>
                <div className='p-2'><Button label="Adauga" onClick={addCashFlow} /></div>
            </div>

            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti linia de cashflow ({CashFlowSelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteCashFlowSelected(CashFlowSelected)

                            }} />
                        </div>
                        <div className='col-1 pl-4'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            <DataTable value={data} size="small"
                stripedRows tableStyle={{ minWidth: '50rem' }}
                paginator rows={15} rowsPerPageOptions={[15, 30, 45]} sortMode="multiple"
                selectionMode="radiobutton"
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {
                        deleteCashFlow(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default CashFlow;
