
"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
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
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

const DocumentSeries = () => {

    const [seriesSelected, setSeriesSelected] = useState(0);
    const [visible, setVisible] = useState(false);
    const [add_visible, setAdd_visible] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [start, setStart] = useState(0);
    const [final, setFinal] = useState(0);
    const [actual, setActual] = useState(0);

    const toast = useRef<undefined | null | any>(null);
    const [data, setData] = useState([]);
    const [series, setseries] = useState('');

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId, selectedEntity
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

    const allDocumentType = [
        { id: 1, name: "Facturi Vanzare" },
        { id: 2, name: "Contracte Clienti" },
    ]

    const getDocumentType = (id: number) => {
        return allDocumentType.find((obj) => obj.id === id);
    };



    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];

        if (!fields.start_number) {
            errors.push("Trebuie sa selectati un numar de start!");
        }

        if (!fields.final_number) {
            errors.push("Trebuie sa selectati un numar de final!");
        }

        if (fields.final_number < fields.start_number) {
            errors.push("Numarul de final nu are cum sa fie mai mic decat nr. de start!");
        }

        if (fields.final_number < fields.last_number || fields.start_number > fields.last_number) {
            errors.push("Numarul actual nu este intre numarul de start si cel de final!");
        }

        if (!fields.documentTypeId) {
            errors.push("Trebuie sa selectati un tip de document!");
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };

    const addseries = async () => {

        const toAdd = {
            entityId: selectedEntity ? parseInt(selectedEntity.id) : null,
            updatedByUserId: parseInt(userId),
            documentTypeId: selectedDocumentType ? selectedDocumentType.id : null,
            series: series,
            start_number: parseInt(start),
            final_number: parseInt(final),
            last_number: parseInt(actual),
            isActive: isActive
        }

        const validationResult = validateForm(toAdd);
        if (!validationResult.isValid) {
            showMessage('error', 'Eroare', validationResult.errors)
        } else {
            try {

                if (seriesSelected.id > 0) {
                    try {
                        const response = await axios.patch(`${Backend_BASE_URL}/nomenclatures/documentseries/${seriesSelected.id}`,
                            toAdd
                        );
                        showSuccess(`Seria ${toAdd.series} a fost adaugata!`)
                        setAdd_visible(false);
                        setVisible(false);
                        fetchSeriesData();
                        setseries('');
                        setStart(0);
                        setFinal(0);
                        setActual(0);
                        setIsActive(true);
                        setSelectedDocumentType(0);

                    } catch (error) {
                        showError("Eroare adaugare serie")
                    }

                }
                else {
                    try {
                        const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/documentseries`,
                            toAdd
                        );
                        showSuccess(`Seria ${toAdd.series} a fost adaugata!`)
                        setseries('');
                        setAdd_visible(false);
                        setVisible(false);
                        setSeriesSelected(0);
                        console.log('series added:', response.data);
                    } catch (error) {
                        showError("Eroare adaugare serie")
                    }
                }

            } catch (error) {
                showError(`Nu a putut fi adaugata seria! ${error}'`)
            }
        }
    }


    useEffect(() => {
        setSeriesSelected(seriesSelected);
    }, [seriesSelected]);

    const [products, setProducts] = useState(data.slice(0, 12));
    // const [products, setProducts] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);

    const fetchSeriesData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/documentseries`
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
        fetchSeriesData();

        setBreadCrumbItems(
            [{
                label: 'Acasa',
                template: () => <Link href="/">Acasa</Link>
            },
            {
                label: 'Nomenclatoare',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/documentseries`
                    return (
                        <Link href={url}>Nomenclatoare</Link>
                    )

                }
            },
            {
                label: 'Serii Documente',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/documentseries`
                    return (
                        <Link href={url}>Serii Documente</Link>
                    )

                }
            },

            ]
        )
    }, []);

    const deleteseries = (event: any) => {
        setSeriesSelected(event)
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


    const statusTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" checked={rowData.isActive}></Checkbox>
            </div>
        );
    };

    const documentTemplate = (rowData: any) => {
        const result = getDocumentType(rowData.documentTypeId)
        return (
            <div className="flex align-items-center gap-2">
                {result.name}
            </div>
        );
    };


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
                                                setSeriesSelected(0);

                                                setAdd_visible(true)


                                                setseries('');
                                                setStart(0);
                                                setFinal(0);
                                                setActual(0);
                                                setIsActive(true);
                                                setSelectedDocumentType(0);

                                            }} /></div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <main className="p-flex-grow-1" style={{
                            height: '80%', overflow: 'auto'
                        }}>
                            <div className="p-d-flex p-ai-center p-jc-center" style={{ minHeight: '100%' }}>


                                <Dialog header="Adaugare Serie Documente"
                                    visible={add_visible}
                                    modal style={{ width: '70%' }}
                                    onHide={() => {
                                        setAdd_visible(false);
                                        setSeriesSelected(0);
                                    }
                                    }>

                                    <div className="grid pt-5">
                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="series" type="text" value={series} onChange={(e) => setseries(e.target.value)} />
                                                <label htmlFor="series">Serie </label>
                                            </span>
                                        </div>

                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="start" type="number" value={start} onChange={(e) => setStart(e.target.value)} />
                                                <label htmlFor="start">Start </label>
                                            </span>
                                        </div>


                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="final" type="number" value={final} onChange={(e) => setFinal(e.target.value)} />
                                                <label htmlFor="final">Final </label>
                                            </span>
                                        </div>

                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="actual" type="number" value={actual} onChange={(e) => setActual(e.target.value)} />
                                                <label htmlFor="actual">Actual </label>
                                            </span>
                                        </div>


                                        <div className="field col-12 md:col-3">

                                            <label htmlFor="selectedDocumentType">Tip Document</label>
                                            <Dropdown id="selectedDocumentType" filter
                                                value={selectedDocumentType}
                                                onChange={(e) => {
                                                    setSelectedDocumentType(e.target.value)
                                                }}
                                                options={allDocumentType}
                                                optionLabel="name"
                                                placeholder="Select One">

                                            </Dropdown>

                                        </div>

                                        <div className="field-checkbox col-12 md:col-1">
                                            <Checkbox id="isActive" onChange={e => setIsActive(e.checked)}
                                                checked={isActive}
                                            ></Checkbox>
                                            <label htmlFor="isActive" className="ml-2">Activa</label>
                                        </div>



                                        <div className='col-1'>
                                            <Button label="Salveaza" severity="success" onClick={() => addseries()} />
                                        </div>

                                    </div>

                                </Dialog>


                                <Dialog header={`Editare Serie Documente`} visible={visible} modal
                                    style={{ width: '70%' }}
                                    onHide={() => {
                                        setVisible(false)
                                        setSeriesSelected(0);
                                        setAdd_visible(false);
                                    }}>
                                    <div className="grid pt-5">
                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="series" type="text" value={series} onChange={(e) => setseries(e.target.value)} />
                                                <label htmlFor="series">Serie </label>
                                            </span>
                                        </div>

                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="start" type="number" value={start} onChange={(e) => setStart(e.target.value)} />
                                                <label htmlFor="start">Start </label>
                                            </span>
                                        </div>


                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="final" type="number" value={final} onChange={(e) => setFinal(e.target.value)} />
                                                <label htmlFor="final">Final </label>
                                            </span>
                                        </div>

                                        <div className="field col-12  md:col-2">
                                            <span className="p-float-label">
                                                <InputText id="actual" type="number" value={actual} onChange={(e) => setActual(e.target.value)} />
                                                <label htmlFor="actual">Actual </label>
                                            </span>
                                        </div>


                                        <div className="field col-12 md:col-3">

                                            <label htmlFor="selectedDocumentType">Tip Document</label>
                                            <Dropdown id="selectedDocumentType" filter
                                                // value={selectedDocumentType}
                                                value={getDocumentType(selectedDocumentType)}
                                                onChange={(e) => {
                                                    setSelectedDocumentType(e.target.value)
                                                }}
                                                options={allDocumentType}
                                                optionLabel="name"
                                                placeholder="Select One">

                                            </Dropdown>

                                        </div>

                                        <div className="field-checkbox col-12 md:col-1">
                                            <Checkbox id="isActive" onChange={e => setIsActive(e.checked)}
                                                checked={isActive}
                                            ></Checkbox>
                                            <label htmlFor="isActive" className="ml-2">Activa</label>
                                        </div>



                                        <div className='col-1'>
                                            <Button label="Salveaza" severity="success" onClick={() => addseries()} />
                                        </div>

                                    </div>

                                </Dialog>

                                <DataTable
                                    value={products}
                                    filters={filters}
                                    globalFilterFields={['series'
                                    ]} header={header}


                                    onSelectionChange={
                                        (e) => {

                                            setSeriesSelected(e.value[0]);
                                            setseries(e.value[0].series);
                                            setStart(e.value[0].start_number);
                                            setFinal(e.value[0].final_number);
                                            setActual(e.value[0].last_number);
                                            setIsActive(e.value[0].isActive);
                                            setSelectedDocumentType(e.value[0].documentTypeId);
                                            setVisible(true);

                                        }}
                                    size="small" stripedRows
                                    tableStyle={{ minWidth: '50rem' }}
                                    sortMode="multiple"
                                    selectionMode="radiobutton"
                                >
                                    <Column hidden field="id" header="Code"></Column>
                                    <Column sortable field="series" header="Serie"></Column>
                                    <Column sortable field="start_number" header="Start"></Column>
                                    <Column sortable field="final_number" header="Name"></Column>
                                    <Column sortable field="last_number" header="Name"></Column>
                                    <Column sortable field="documentTypeId" header="Tip" body={documentTemplate}  ></Column>
                                    <Column sortable field="isActive" header="Activ" style={{ width: '10vh' }} body={statusTemplate}></Column>

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

export default DocumentSeries;

