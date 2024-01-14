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


const Entity = ({ executeFunction }: any) => {

    const [EntitySelected, setEntitySelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);

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


    const deleteEntitySelected = async (event: any) => {
        try {
            const response = await axios.delete(`http://localhost:3000/contracts/entity/${event.id}`);
            console.log('departament deleted:', response.data);
            executeFunction((prevKey: number) => prevKey + 1)
            showSuccess(`Entitatea ${event.name} a fost stearsa`)

        } catch (error) {
            console.error('Eroare la stergerea entitatii:', error);
            showError('Entitatea nu a putut fi stearsa!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setEntitySelected(EntitySelected);
    }, [EntitySelected]);


    const { isLoading, error, data } = useQuery({
        queryKey: ['contractsData'],
        queryFn: () =>
            fetch('http://localhost:3000/contracts/entity').then(res => res.json()),
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


    const deleteEntity = (event: any) => {
        setEntitySelected(event)
    }

    return (
        <div>
            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '24rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti entitatea ({EntitySelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteEntitySelected(EntitySelected)

                            }} />
                        </div>
                        <div className='col-1 pl-7'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            <DataTable value={data} size="small" stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} sortMode="multiple"
                selectionMode="radiobutton"
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {
                        deleteEntity(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default Entity;
