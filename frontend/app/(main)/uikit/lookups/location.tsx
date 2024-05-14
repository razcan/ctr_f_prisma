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


const Location = ({ executeFunction }: any) => {

    const [locationSelected, setLocationSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);
    const [rowClick, setRowClick] = useState(true);

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


    const deleteSelectedLocation = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/location/${event.id}`);
            executeFunction((prevKey: number) => prevKey + 1)
            showSuccess(`Locatia ${event.name} a fost stearsa`)

        } catch (error) {
            console.error('Eroare la stergerea locatiei:', error);
            showError('Locatia nu a putut fi stearsa!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setLocationSelected(locationSelected);
    }, [locationSelected]);


    const { isLoading, error, data } = useQuery({
        queryKey: ['locationData'],
        queryFn: () =>
            fetch(`${Backend_BASE_URL}/contracts/location`).then(res => res.json()),
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


    const deleteLocation = (event: any) => {
        setLocationSelected(event)
    }

    return (
        <div>
            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti obiectul de contract ({locationSelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteSelectedLocation(locationSelected)

                            }} />
                        </div>
                        <div className='col-1 pl-4'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            <DataTable value={data} size="small" stripedRows
                tableStyle={{ minWidth: '50rem' }}
                paginator rows={5} rowsPerPageOptions={[5, 10, 15]}
                dataKey="id"
                sortMode="multiple"
                // selectionMode="radiobutton"
                selectionMode={rowClick ? null : 'radiobutton'}
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {
                        deleteLocation(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>

        </div >
    );
}

export default Location;
