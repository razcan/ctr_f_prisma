
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


const Item = ({ executeFunction }: any) => {

    const [ItemSelected, setItemSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);
    const [data, setData] = useState([]);
    const [item, setItem] = useState('');

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


    const deleteItemSelected = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/item/${event.id}`);
            console.log('item deleted:', response.data);
            fetchItemData();
            showSuccess(`Obiectul de contract ${event.name} a fost sters`)

        } catch (error) {
            console.error('Eroare la stergerea obiectului de contract:', error);
            showError('Obiectul de contract nu a putut fi sters!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setItemSelected(ItemSelected);
    }, [ItemSelected]);

    useEffect(() => {
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
                    const url = `${Frontend_BASE_URL}/uikit/reports`
                    return (
                        <Link href={url}>Articole</Link>
                    )

                }
            },

            ]
        )
    }, []);

    const fetchItemData = () => {
        fetch(`${Backend_BASE_URL}/contracts/item`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setData(data)
            })
    }

    useEffect(() => {
        fetchItemData();
    }, []);


    const deleteItem = (event: any) => {
        setItemSelected(event)
    }

    const addItem = async () => {

        interface Item {
            name: string,
        }

        let toAdd: Item = {
            name: item
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post(`${Backend_BASE_URL}/contracts/item`,
                    toAdd
                );
                showSuccess(`Obiectul de contract ${toAdd.name} a fost adaugat!`)
                fetchItemData();
                setItem('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat obiectul de contract! ${error}'`)
            }
        }
        else showError('Obiectul de contract trebuie sa contina minim 3 caractere!')

    }

    return (
        <div className='card'>

            <div>
                <div className="field col-12  md:col-3">
                    <span className="p-float-label">
                        <InputText id="item" type="text" value={item} onChange={(e) => setItem(e.target.value)} />
                        <label htmlFor="item">Obiecte de contract </label>
                    </span>
                </div>
                <div className='p-2'><Button label="Adauga" onClick={addItem} /></div>
            </div>

            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti obiectul de contract ({ItemSelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteItemSelected(ItemSelected)

                            }} />
                        </div>
                        <div className='col-1 pl-4'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            <DataTable value={data} size="small" stripedRows tableStyle={{ minWidth: '50rem' }}
                paginator rows={15} rowsPerPageOptions={[15, 30, 45]} sortMode="multiple"
                selectionMode="radiobutton"
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {
                        deleteItem(e.value)
                        setVisible(true)
                    }}>
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default Item;
