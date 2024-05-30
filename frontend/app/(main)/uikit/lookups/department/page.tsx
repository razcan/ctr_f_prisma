"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { MyContext } from '../../../../../layout/context/myUserContext';
import { InputText } from 'primereact/inputtext';
import Link from 'next/link';
import { Paginator } from 'primereact/paginator';
import { FilterMatchMode } from 'primereact/api';

const Department = ({ executeFunction }: any) => {

    const [departmentSelected, setDepartmentSelected] = useState(0);
    const [visible, setVisible] = useState(false);
    const [add_visible, setAdd_visible] = useState(false);

    const toast = useRef<undefined | null | any>(null);
    const [data, setData] = useState([]);
    const [departament, setDepartament] = useState('');

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

    const addDepartment = async () => {

        interface Department {
            name: string,
        }

        let toAdd: Department = {
            name: departament
        }

        if (toAdd.name.length > 2) {
            try {

                if (departmentSelected.id > 0) {
                    const response = await axios.patch(`${Backend_BASE_URL}/contracts/department/${departmentSelected.id}`,
                        toAdd
                    );
                    showSuccess(`Departmentul ${toAdd.name} a fost adaugat!`)
                    setDepartament('');
                    fetchDepData();
                    setAdd_visible(false);
                    setVisible(false);
                    setDepartmentSelected(0);
                    console.log('departament added:', response.data);
                }
                else {
                    const response = await axios.post(`${Backend_BASE_URL}/contracts/department`,
                        toAdd
                    );
                    showSuccess(`Departmentul ${toAdd.name} a fost adaugat!`)
                    setDepartament('');
                    fetchDepData();
                    setAdd_visible(false);
                    setVisible(false);
                    setDepartmentSelected(0);
                    console.log('departament added:', response.data);
                }

            } catch (error) {
                showError(`Nu a putut fi adaugat departamentul! ${error}'`)
            }
        }
        else showError('Departamentul trebuie sa contina minim 3 caractere!')

    }


    const deleteDepartmentSelected = async (event: any) => {
        try {
            const response = await axios.delete(`${Backend_BASE_URL}/contracts/department/${event.id}`);
            console.log('departament deleted:', response.data);
            fetchDepData();
            showSuccess(`Departamentul ${event.name} a fost sters`)

        } catch (error) {
            console.error('Eroare la stergerea departamentului:', error);
            showError('Departamentul nu a putut fi sters!')
        }
        setVisible(false)
    }

    useEffect(() => {
        setDepartmentSelected(departmentSelected);
    }, [departmentSelected]);

    const [products, setProducts] = useState(data.slice(0, 12));
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);

    const fetchDepData = () => {
        fetch(`${Backend_BASE_URL}/contracts/department`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setData(data)
                setProducts(data.slice(0, 12));
            })
    }



    useEffect(() => {
        fetchDepData();

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
                label: 'Departamente',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/department`
                    return (
                        <Link href={url}>Departamente</Link>
                    )

                }
            },

            ]
        )

    }, []);

    const deleteDepartment = (event: any) => {
        setDepartmentSelected(event)
    }



    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        const newProducts = data.slice(event.first, event.first + event.rows);
        setProducts(newProducts);
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    {/* <i className="pi pi-search" /> */}
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange}
                        placeholder="Cautare"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();


    return (

        <div className="grid">
            <Toast ref={toast} position="top-right" />
            <div className="col-12">
                <div className="card">
                    <div className="p-d-flex p-flex-column" style={{ height: '80vh' }}>
                        <header className="p-flex-none" style={{ height: '10%' }}>
                            <div className="p-d-flex p-ai-center p-jc-center"
                                style={{ height: '100%' }}>
                                <div className='grid'>



                                    <div className="field col-12  md:col-3">
                                        <div className='p-2'><Button label="Adauga"
                                            onClick={() => {
                                                setDepartmentSelected(0);
                                                setDepartament('');
                                                setAdd_visible(true)

                                            }} /></div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <main className="p-flex-grow-1" style={{
                            height: '80%', overflow: 'auto'
                        }}>
                            <div className="p-d-flex p-ai-center p-jc-center" style={{ minHeight: '100%' }}>


                                <Dialog header="Adaugare Departament"
                                    visible={add_visible}
                                    modal style={{ width: '50rem' }}
                                    onHide={() => {
                                        setAdd_visible(false);
                                        setDepartmentSelected(0);
                                    }
                                    }>

                                    <div className="field col-12  md:col-3">
                                        <span className="p-float-label">
                                            <InputText id="departament" type="text" value={departament} onChange={(e) => setDepartament(e.target.value)} />
                                            <label htmlFor="departament">Departament </label>
                                        </span>
                                    </div>

                                    <div className='col-1'>
                                        <Button label="Salveaza" severity="success" onClick={() => addDepartment()} />
                                    </div>

                                </Dialog>


                                <Dialog header={`Editare Departament`} visible={visible} modal
                                    style={{ width: '40rem' }}
                                    onHide={() => {
                                        setVisible(false)
                                        setDepartmentSelected(0);
                                        setAdd_visible(false);
                                    }}>
                                    <div className='grid'>
                                        <div className="col-5 p-2">
                                            <label htmlFor="number">Departament</label>
                                            <InputText id="number" type="text" value={departament} onChange={(e) => {
                                                setDepartament(e.target.value)

                                            }} />
                                        </div>

                                        <div className='col-3 pt-4'>
                                            <Button label="Salveaza" severity="success" onClick={() => {
                                                setVisible(false)
                                                addDepartment()
                                            }
                                            } autoFocus />
                                        </div>

                                        <div className='col-3 pt-4'>
                                            <Button label="Sterge" severity="danger" onClick={() => {
                                                deleteDepartmentSelected(departmentSelected)

                                            }} />
                                        </div>
                                    </div>

                                </Dialog>

                                <DataTable value={products}


                                    filters={filters}
                                    globalFilterFields={['name', 'id', 'code'
                                    ]} header={header}


                                    onSelectionChange={
                                        (e) => {
                                            deleteDepartment(e.value[0])
                                            setDepartmentSelected(e.value[0])

                                            setVisible(true)
                                            setDepartament(e.value[0].name)
                                        }}
                                    size="small" stripedRows
                                    tableStyle={{ minWidth: '50rem' }}
                                    sortMode="multiple"
                                    selectionMode="radiobutton"
                                >
                                    <Column sortable field="id" header="Code"></Column>
                                    <Column sortable field="name" header="Name"></Column>
                                </DataTable>

                            </div>
                        </main>
                        <footer className="p-flex-none" style={{ height: '10%' }}>
                            <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
                                <Paginator
                                    first={first}
                                    rows={rows}
                                    totalRecords={data.length}
                                    onPageChange={onPageChange}
                                    rowsPerPageOptions={[12, 24, 50]}
                                />
                            </div>
                        </footer>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Department;
