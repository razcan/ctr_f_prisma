"use client"

import React, { useContext, useEffect, useState } from 'react';
import { Editor } from "primereact/editor";
import { TabMenu } from 'primereact/tabmenu';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Context } from '../../../../layout/context/appcontext'
import { ContextProvider } from '../../../../layout/context/appprovider'


const queryClient = new QueryClient();

const LookupsPage = () => {

    const categorySelected = useContext(Context);


    const [category, setCategory] = useState('');
    const [departament, setDepartament] = useState('');
    const [cashflow, setCashFlow] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const [categoryIndex, setCategoryIndex] = useState<any>(0);



    useEffect(() => {

    }, []);

    // useEffect(() => {
    //     checkActiveIndex();
    // }, [checkActiveIndex]);

    const items = [
        { label: 'Categorie', icon: 'pi pi-chart-line' },
        { label: 'Departament', icon: 'pi pi-list' },
        { label: 'CashFlow', icon: 'pi pi-inbox' },
        { label: 'Articol calculatie', icon: 'pi pi-list' },
        { label: 'Centru Cost/Profit', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Entitati', icon: 'pi pi-fw pi-table' },
        { label: 'Tip Partener', icon: 'pi pi-fw pi-mobile' },
        { label: 'Obiecte de contract', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Status', icon: 'pi pi-fw pi-table' }
    ];

    const addCategory = async () => {

        interface Category {
            name: string,
        }

        let toAdd: Category = {
            name: category
        }

        try {

            const response = await axios.post('http://localhost:3000/contracts/category',
                toAdd
            );

            setCategoryIndex((prevKey: any) => prevKey + 1);
            console.log('category added:', response.data);
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>Lookup Page</h5>
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    </div>
                    <div className="card">

                        {activeIndex === 0 ?
                            <div>
                                <div className="field col-12  md:col-3">
                                    <span className="p-float-label">
                                        <InputText id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                                        <label htmlFor="category">Adauga o categorie</label>
                                    </span>
                                </div>
                                <div className='pt-2'><Button label="Adauga" onClick={addCategory} /></div>
                                <div className='pt-4'>
                                    <Category key={categoryIndex} />
                                </div>
                            </div>
                            : null
                        }

                        {activeIndex === 1 ?
                            <div>
                                <div className="field col-12  md:col-3">
                                    <label htmlFor="departament">Departament </label>
                                    <InputText id="departament" type="text" value={departament} onChange={(e) => setDepartament(e.target.value)} />
                                </div>
                                <div><Button label="Adauga" /></div>
                            </div>
                            : null
                        }

                        {activeIndex === 2 ?
                            <div>
                                <div className="field col-12  md:col-3">
                                    <label htmlFor="cashflow">Cashflow </label>
                                    <InputText id="cashflow" type="text" value={cashflow} onChange={(e) => setCashFlow(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-3"><Button label="Adauga" /></div>

                            </div>
                            : null
                        }


                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
};

const Category = () => {

    const [visible, setVisible] = useState(false);
    const [categorySelected, setCategorySelected] = useState(false);
    // can use the useQuery hook here
    const { isLoading, error, data } = useQuery({
        queryKey: ['contractsData'],
        queryFn: () =>
            fetch('http://localhost:3000/contracts/category').then(res => res.json()),
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
        setVisible(true)
        setCategorySelected(event)
    }

    const deleteCategorySelected = (event: any) => {
        console.log("voi sterge ", event)
    }

    return (
        <div>
            <Dialog visible={visible} modal style={{ width: '50rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti categoria {categorySelected.name}?</span>

                <Button label="Da" severity="success" onClick={() => deleteCategorySelected(categorySelected.id)} />
                <Button label="Nu" severity="danger" onClick={() => setVisible(false)} autoFocus />

            </Dialog>
            {/* <DataTable value={products} cellSelection selectionMode="single" selection={selectedCell}
                onSelectionChange={(e) => setSelectedCell(e.value)} metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}> */}

            <DataTable value={data} size="small" stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} sortMode="multiple"
                selectionMode="radiobutton"
                onSelectionChange={(e) => deleteCategory(e.value)}
            >
                <Column field="id" header="Cod" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                {/* <Column field="verified" header="Sterge" dataType="boolean" body={verifiedBodyTemplate} /> */}
                <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column>
            </DataTable>
        </div>
    );
}

export default LookupsPage;
