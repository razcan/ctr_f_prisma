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


const Location = ({ executeFunction }: any) => {

    const [locationSelected, setLocationSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);
    const [rowClick, setRowClick] = useState(true);
    const [data, setData] = useState([]);
    const [location, setLocation] = useState('');

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


    const deleteSelectedLocation = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/location/${event.id}`);
            fetchLocationData();
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


    const fetchLocationData = () => {
        fetch(`${Backend_BASE_URL}/contracts/location`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setData(data)
            })
    }

    useEffect(() => {
        fetchLocationData();

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
                label: 'Locatii',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/location`
                    return (
                        <Link href={url}>Locatii</Link>
                    )

                }
            },

            ]
        )

    }, []);


    const addLocation = async () => {

        interface Location {
            name: string,
        }

        let toAdd: Location = {
            name: location
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post(`${Backend_BASE_URL}/contracts/location`,
                    toAdd
                );
                showSuccess(`Locatia ${toAdd.name} a fost adaugata!`);
                fetchLocationData();
                setLocation('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugata locatia! ${error}'`)
            }
        }
        else showError('Locatia trebuie sa contina minim 3 caractere!')

    }


    const deleteLocation = (event: any) => {
        setLocationSelected(event)
    }

    return (
        <div className='card'>
            <div className="field col-12  md:col-3">
                <span className="p-float-label">
                    <InputText id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <label htmlFor="location">Adauga o locatie</label>
                </span>
            </div>
            <div className='p-2'><Button label="Adauga" onClick={addLocation} /></div>

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
