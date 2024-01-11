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
import { UserContext, UserContextProvider, AuthUser, UserContextType, ThemeContext, ThemeContextType } from '../../../../layout/context/appcontext'
import { AppContext, AppProvider } from '../../../../layout/context/app2Context'


const queryClient = new QueryClient();



const LookupsPage = () => {

    const [user, setUser] = useState<AuthUser>({
        email: "vasile",
        name: "petre"
    })

    const [category, setCategory] = useState('');
    const [departament, setDepartament] = useState('');
    const [cashflow, setCashFlow] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const [categoryIndex, setCategoryIndex] = useState<number>(0);
    const [theme, setTheme] = useState<ThemeContextType>("light");
    const [activeMenu, setActiveMenu] = useState('xxx');


    useEffect(() => {
        setTheme("blue")
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

            setCategoryIndex((prevKey: number) => prevKey + 1);
            console.log('category added:', response.data);
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={theme}>
                <AppContext.Provider value={{ activeMenu, setActiveMenu }}>

                    <div className="grid">
                        <div className="col-12">
                            <div className="card">
                                <h5>Lookup Page {activeMenu}</h5>
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
                </AppContext.Provider>
            </ThemeContext.Provider>
        </QueryClientProvider>
    );
};

const Category = () => {

    const appContext = useContext(AppContext);
    // console.log('appContext:', appContext)

    // const { activeMenu, setActiveMenu } = useContext(AppContext);

    // const x = MyContextProvider();

    const themeContext = useContext(ThemeContext);
    // console.log('themeContext:', themeContext)


    const [categorySelected, setCategorySelected] = useState('');
    const [visible, setVisible] = useState(false);

    const deleteCategorySelected = async (event: any) => {
        try {
            const response = await axios.delete(`http://localhost:3000/contracts/category/${event.id}`);
            // setCategoryIndex((prevKey: number) => prevKey + 1);
            console.log('category deleted:', response.data);
        } catch (error) {
            console.error('Error deleting category:', error);
        }


        http://localhost:3000/contracts/category/12
        setVisible(false)
    }

    useEffect(() => {
        setCategorySelected(categorySelected);
    }, [categorySelected]);


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
        //confirm2(event)
    }

    // const activeza = () => {
    //     setActiveMenu('Test')
    //}

    return (
        <div>
            {/* <ConfirmDialog /> */}

            <Dialog visible={visible} modal style={{ width: '30rem' }} onHide={() => setVisible(false)}>

                <span className="font-bold white-space-nowrap">Doriti sa stergeti categoria ({categorySelected.name}) ?</span>
                <div className='pt-4'>
                    <div className='grid'>
                        <div className='col-1 '>
                            <Button label="Da" severity="danger" onClick={() => {
                                deleteCategorySelected(categorySelected)

                            }} />
                        </div>
                        {/* <div className='col-1'></div> */}
                        <div className='col-1 pl-6'>
                            <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                        </div>
                    </div>
                </div>
            </Dialog>
            {/* 
            <div className="card">

                <DataTable value={data} cellSelection selectionMode="single" selection={selectedCell}
                    size="small" stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} sortMode="multiple"
                    onSelectionChange={(e) => setSelectedCell(e.value)} >
                    <Column field="id" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column header="Sterge" body={statusBodyTemplate}></Column>
                </DataTable>
            </div> */}
            {/* <DataTable value={products} cellSelection selectionMode="single" selection={selectedCell}
                onSelectionChange={(e) => setSelectedCell(e.value)} metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}> */}
            {/* <div>Active Menu {activeMenu}</div> */}

            {/* <Button label="Modifica context" icon="pi pi-check" size="small" onClick={activeza} /> */}
            {/* concluzia este ca acest context trebuie folosit pentru pasarea datelor de la o componenta catre totii copii componente - de anaizat daca poate fi folosit ca variabila globala */}

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

export default LookupsPage;
