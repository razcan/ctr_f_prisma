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
import router from 'next/router';

const CashFlow = ({ executeFunction }: any) => {

    const [CashFlowSelected, setCashFlowSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);
    const toast = useRef<undefined | null | any>(null);
    const [categorySelected, setCategorySelected] = useState('');
    const [category, setCategory] = useState('');

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


    const fetchCategData = () => {
        fetch(`${Backend_BASE_URL}/contracts/category`
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
        fetchCategData();

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
                label: 'Categorii Contracte',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/category`
                    return (
                        <Link href={url}>Categorii Contracte</Link>
                    )

                }
            },

            ]
        )

    }, []);




    const addCategory = async () => {

        interface Category {
            name: string,
        }

        let toAdd: Category = {
            name: category
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post(`${Backend_BASE_URL}/contracts/category`,
                    toAdd
                );
                showSuccess(`Categoria ${toAdd.name} a fost adaugata!`)
                fetchCategData()
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugata categoria! ${error}'`)
            }
        }
        else showError('Categoria trebuie sa contina minim 3 caractere!')

    }



    const showErrorLogin = () => {
        toast.current.show({ severity: 'error', summary: 'You are not logged in!', detail: 'You are not logged in!', life: 3000 });
    }

    const deleteCategorySelected = async (event: any) => {
        const session: any = localStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken) {
            const jwtTokenf = jwtToken.access_token;
            const response = await fetch(`${Backend_BASE_URL}/contracts/category/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json',
                },

            })

            if (!response.ok) {
                const res = `HTTP error! Status: ${response.status}`
                if (response.status == 401) {
                    router.push('/login')
                }
                //  throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.ok) {
                fetchCategData();
                setVisible(false);
            }
        }
        else {
            showErrorLogin()
            setTimeout(() => {
                setVisible(false)
                router.push('/login')

            }, 1000);


        }
    }

    const deleteCategory = (event: any) => {
        setCategorySelected(event)
    }

    return (
        <div className='card'>

            <div className="field col-12  md:col-3">
                <span className="p-float-label">
                    <InputText id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                    <label htmlFor="category">Adauga o categorie</label>
                </span>
            </div>
            <div className='p-2'><Button label="Adauga" onClick={addCategory} /></div>

            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }}
                onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti categoria ({categorySelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteCategorySelected(categorySelected)

                            }} />
                        </div>
                        {/* <div className='col-1'></div> */}
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
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {
                        deleteCategory(e.value)
                        setVisible(true)
                    }
                }
            >
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div >
    );
}

export default CashFlow;
