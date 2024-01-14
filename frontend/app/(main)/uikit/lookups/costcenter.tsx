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


const CostCenter = ({ executeFunction }: any) => {

    const [CostCenterSelected, setCostCenterSelected] = useState('');
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


    const deleteCostCenterSelected = async (event: any) => {
        try {
            const response = await axios.delete(`http://localhost:3000/contracts/costcenter/${event.id}`);
            console.log('costcenter deleted:', response.data);
            executeFunction((prevKey: number) => prevKey + 1)
            showSuccess(`Centrul de cost/profit ${event.name} a fost sters`)

        } catch (error) {
            console.error('Eroare la stergerea centrului de cost/profit:', error);
            showError('Centrul de cost/profit nu a putut fi sters!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setCostCenterSelected(CostCenterSelected);
    }, [CostCenterSelected]);


    const { isLoading, error, data } = useQuery({
        queryKey: ['contractsData'],
        queryFn: () =>
            fetch('http://localhost:3000/contracts/costcenter').then(res => res.json()),
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


    const deleteCostCenter = (event: any) => {
        setCostCenterSelected(event)
    }

    return (
        <div>
            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '24rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti centrul de cost ({CostCenterSelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteCostCenterSelected(CostCenterSelected)

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
                        deleteCostCenter(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default CostCenter;
