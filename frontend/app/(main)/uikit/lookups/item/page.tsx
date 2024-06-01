
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
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';


const Item = ({ executeFunction }: any) => {

    const [ItemSelected, setItemSelected] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef<undefined | null | any>(null);
    const [data, setData] = useState([]);
    const [toEdit, setToEdit] = useState(0);
    const [allVAT, setAllVAT] = useState<any>([]);
    const [allMeasuringUnit, setAllMeasuringUnit] = useState();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [barCode, setBarCode] = useState('');
    const [vat, setVAT] = useState([]);
    const [description, setDescription] = useState('');
    const [measuringUnit, setMeasuringUnit] = useState('');
    const [isStockable, setIsStockable] = useState(false);
    const [categories, setCategories] = useState([]);
    const [itemIsActive, setItemIsActive] = useState<boolean>(true);


    const [selectedName, setSelectedName] = useState('');
    const [selectedcode, setSelectedCode] = useState('');
    const [selectedBarCode, setSelectedBarCode] = useState('');
    const [selectedVat, setSelectedVAT] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedMeasuringUnit, setSelectedMeasuringUnit] = useState();
    const [selectedIsStockable, setSelectedIsStockable] = useState(false);
    const [selectedItemIsActive, setSelectedItemIsActive] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState([]);



    const fetchCategoriesData = () => {
        fetch(`${Backend_BASE_URL}/contracts/category`)
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })

    }

    const fetchAllVAT = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/vatquota`).then(res => res.json())
        setAllVAT(response);
    }

    const fetchAllMeasuringUnit = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/measuringunit`).then(res => res.json())
        setAllMeasuringUnit(response);
    }


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


    // const deleteItemSelected = async (event: any) => {
    //     try {
    //         const response = await axios.delete(`${Backend_BASE_URL}/contracts/item/${event.id}`);
    //         console.log('item deleted:', response.data);
    //         fetchItemData();
    //         showSuccess(`Obiectul de contract ${event.name} a fost sters`)

    //     } catch (error) {
    //         console.error('Eroare la stergerea obiectului de contract:', error);
    //         showError('Obiectul de contract nu a putut fi sters!')
    //     }
    //     setVisible(false)
    // }

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
                label: 'Articole',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/item`
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
        fetchCategoriesData();
        fetchAllVAT();
        fetchAllMeasuringUnit();
    }, []);


    const deleteItem = (event: any) => {
        setItemSelected(event)
    }

    const editItem = async () => {


        let toAdd = {
            name: selectedName,
            code: selectedcode,
            barCode: selectedBarCode,
            description: selectedDescription,
            vatId: selectedVat.id,
            measuringUnitid: selectedMeasuringUnit.id,
            isStockable: selectedIsStockable,
            isActive: selectedItemIsActive,
            classificationId: selectedCategory.id,
            userId: userId
        }
        setVisible(true);

        try {

            const response = await axios.patch(`${Backend_BASE_URL}/contracts/item/${toEdit}`,
                toAdd
            );
            showSuccess(`Obiectul de contract ${toAdd.name} a fost adaugat!`)
            fetchItemData();
            setVisible(false);
            console.log('category added:', response.data);
        } catch (error) {
            showError(`Nu a putut fi adaugat obiectul de contract! ${error}'`)
        }

    }


    const addItem = async () => {

        setToEdit(0);

        interface Item {
            name: string,
            code: string,
            barCode: string,
            description: string,
            vatId: number,
            measuringUnitid: number,
            isStockable: Boolean,
            isActive: Boolean,
            classificationId: number,
            userId: Number
        }

        let toAdd: Item = {
            name: name,
            code: code,
            barCode: barCode,
            description: description,
            vatId: vat.id,
            measuringUnitid: measuringUnit.id,
            isStockable: isStockable,
            isActive: itemIsActive,
            classificationId: selectedCategory.id,
            userId: userId
        }
        setVisible(true);

        try {

            const response = await axios.post(`${Backend_BASE_URL}/contracts/item`,
                toAdd
            );
            showSuccess(`Obiectul de contract ${toAdd.name} a fost adaugat!`)
            fetchItemData();
            setVisible(false);
            // console.log('category added:', response.data);
        } catch (error) {
            showError(`Nu a putut fi adaugat obiectul de contract! ${error}'`)
        }

    }

    const statusTemplate = (item) => {
        return <Tag value={item.status} severity={getSeverity(item.status)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    }

    return (
        <div className='card'>

            <div>
                <div className='p-2'><Button label="Adauga" onClick={() => setVisible(true)} /></div>
            </div>

            {/* <ConfirmDialog /> */}
            <Toast ref={toast} />
            <Dialog header="Editare articol" visible={visible} modal style={{ width: '40rem' }}
                onHide={() => setVisible(false)}>

                {toEdit > 0 ?
                    <div className='card'>
                        <div className="grid">
                            <Toast ref={toast} />
                            <div className="p-fluid formgrid grid pt-2">

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="name">Denumire</label>
                                    <InputText id="name" type="text" value={selectedName} onChange={(e) => setSelectedName(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="cod">Cod Articol</label>
                                    <InputText id="cod" type="text" value={selectedcode} onChange={(e) => setSelectedCode(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="description">Cod bare</label>
                                    <InputText id="description" type="text" value={selectedBarCode} onChange={(e) => setSelectedBarCode(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="description">Descriere</label>
                                    <InputText id="description" type="text" value={selectedDescription} onChange={(e) => setSelectedDescription(e.target.value)} />
                                </div>


                                <div className="field col-12 md:col-6">
                                    <label htmlFor="category">Categorie</label>
                                    <Dropdown id="category" showClear filter value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.value)} options={categories}
                                        optionLabel="name" placeholder="Select One"></Dropdown>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <label htmlFor="vatquota">TVA</label>
                                    <Dropdown id="vatquota" filter showClear value={selectedVat} onChange={(e) => {
                                        setSelectedVAT(e.value)
                                    }
                                    } options={allVAT} optionLabel="VatCode" placeholder="Select One"></Dropdown>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <label htmlFor="measuringUnit">Unitate de masura</label>
                                    <Dropdown id="measuringUnit" filter showClear
                                        value={selectedMeasuringUnit} onChange={(e) => setSelectedMeasuringUnit(e.value)}
                                        options={allMeasuringUnit} optionLabel="name"
                                        placeholder="Select One"></Dropdown>
                                </div>

                                <div className="field col-12 md:col-12 pt-3">
                                    <div className="field-checkbox pt-3">
                                        <Checkbox id="auto_renewal" name="auto_renewal"
                                            onChange={e => setSelectedItemIsActive(e.checked)} checked={selectedItemIsActive}></Checkbox>
                                        <label htmlFor="auto_renewal">Activ</label>
                                    </div>
                                </div>

                                <div className="field col-12 md:col-12">
                                </div>

                                <div className='col-4'>
                                    <Button label="Salveaza" severity="success"
                                        onClick={() => {
                                            setVisible(false);
                                            editItem();
                                        }} autoFocus />
                                </div>

                            </div>
                        </div>
                    </div>

                    :

                    <div className='card'>
                        <div className="grid">
                            <Toast ref={toast} />
                            <div className="p-fluid formgrid grid pt-2">

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="name">Denumire</label>
                                    <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="cod">Cod Articol</label>
                                    <InputText id="cod" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="description">Cod bare</label>
                                    <InputText id="description" type="text" value={barCode} onChange={(e) => setBarCode(e.target.value)} />
                                </div>

                                <div className="field col-12  md:col-12">
                                    <label htmlFor="description">Descriere</label>
                                    <InputText id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>


                                <div className="field col-12 md:col-6">
                                    <label htmlFor="category">Categorie</label>
                                    <Dropdown id="category" showClear filter value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.value)} options={categories}
                                        optionLabel="name" placeholder="Select One"></Dropdown>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <label htmlFor="vatquota">TVA</label>
                                    <Dropdown id="vatquota" filter showClear value={vat} onChange={(e) => {
                                        setVAT(e.value)
                                    }
                                    } options={allVAT} optionLabel="VatCode" placeholder="Select One"></Dropdown>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <label htmlFor="measuringUnit">Unitate de masura</label>
                                    <Dropdown id="measuringUnit" filter showClear value={measuringUnit}
                                        onChange={(e) => {
                                            setMeasuringUnit(e.value);

                                        }

                                        } options={allMeasuringUnit} optionLabel="name" placeholder="Select One"></Dropdown>
                                </div>

                                <div className="field col-12 md:col-12 pt-3">
                                    <div className="field-checkbox pt-3">
                                        <Checkbox id="auto_renewal" name="auto_renewal"
                                            onChange={e => setItemIsActive(e.checked)} checked={itemIsActive}></Checkbox>
                                        <label htmlFor="auto_renewal">Activ</label>
                                    </div>
                                </div>

                                <div className="field col-12 md:col-12">
                                </div>

                                <div className='col-4'>
                                    <Button label="Salveaza" severity="success"
                                        onClick={() => {
                                            setVisible(false);
                                            addItem();
                                        }} autoFocus />
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </Dialog>

            <DataTable value={data} size="small" stripedRows tableStyle={{ minWidth: '50rem' }}
                paginator rows={15} rowsPerPageOptions={[15, 30, 45]} sortMode="multiple"
                selectionMode="radiobutton"
                // cellSelection selectionMode="single"
                onSelectionChange={
                    (e) => {

                        setToEdit(e.value[0].id)
                        setVisible(true)
                        setSelectedName(e.value[0].name);
                        setSelectedCode(e.value[0].code);
                        setSelectedBarCode(e.value[0].barCode);
                        setSelectedVAT(e.value[0].vat);
                        setSelectedDescription(e.value[0].description);
                        setSelectedMeasuringUnit(e.value[0].measuringUnit);
                        setSelectedIsStockable(e.value[0].isStockable);
                        setSelectedItemIsActive(e.value[0].isActive);
                        setSelectedCategory(e.value[0].classification)

                    }}>
                <Column field="id" header="Id" sortable></Column>
                <Column field="name" header="Nume" sortable></Column>
                <Column field="code" header="Cod" sortable></Column>
                <Column field="description" header="Cod" sortable></Column>
                <Column field="measuringUnit.name" header="UM" sortable></Column>
                <Column field="isActive" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                {/* <Column selectionMode="single" header="Sterge" headerStyle={{ width: '3rem' }}></Column> */}
            </DataTable>
        </div >
    );
}

export default Item;
