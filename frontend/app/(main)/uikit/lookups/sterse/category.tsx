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
import router from 'next/router';
import { MyContext } from '../../../../layout/context/myUserContext';

const Category = ({ executeFunction }: any) => {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();


    const showErrorLogin = () => {
        toast.current.show({ severity: 'error', summary: 'You are not logged in!', detail: 'You are not logged in!', life: 3000 });
    }

    const deleteCategorySelected2 = async (event: any) => {
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
                // const x = response.status
                //  showError(res)
                if (response.status == 401) {
                    // setVisible(true)
                    router.push('/login')
                }
                //  throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (response.ok) {
                // console.log('Delete successful');
                router.push('/admin');
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


    const [categorySelected, setCategorySelected] = useState('');
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

    const deleteCategorySelected = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/category/${event.id}`);
            console.log('category deleted:', response.data);
            executeFunction((prevKey: number) => prevKey + 1)
            showSuccess(`Categoria ${event.name} a fost stearsa`)

        } catch (error) {
            console.error('Eroare la stergerea categoriei:', error);
            showError('Categoria nu a putut fi stearsa!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setCategorySelected(categorySelected);
    }, [categorySelected]);


    const { isLoading, error, data } = useQuery({
        queryKey: ['contractsData'],
        queryFn: () =>
            fetch('${Backend_BASE_URL}/contracts/category').then(res => res.json()),
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


    const deleteCategory = (event: any) => {
        setCategorySelected(event)
    }

    return (
        <div>
            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

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

            <DataTable value={data} size="small" stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} sortMode="multiple"
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

export default Category;