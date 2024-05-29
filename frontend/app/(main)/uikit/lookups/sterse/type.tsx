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
import { MyContext } from '../../../../layout/context/myUserContext';


const Type = ({ executeFunction }: any) => {

    const [typeSelected, settypeSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();



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
            executeFunction((prevKey: number) => prevKey + 1)
            showSuccess(`Tipul de contract ${event.name} a fost sters`)

        } catch (error) {
            console.error('Eroare la stergerea tipului de contract:', error);
            showError('Tipul de contract nu a putut fi sters!')
        }
        setVisible(false)
    }

    useEffect(() => {
        settypeSelected(typeSelected);
    }, [typeSelected]);


    const { isLoading, error, data } = useQuery({
        queryKey: ['contractsData'],
        queryFn: () =>
            fetch(`${Backend_BASE_URL}/contracts/type`).then(res => res.json()),
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


    const deleteType = (event: any) => {
        settypeSelected(event)
    }

    return (
        <div>
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
            <DataTable value={data} size="small" stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} sortMode="multiple"
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
