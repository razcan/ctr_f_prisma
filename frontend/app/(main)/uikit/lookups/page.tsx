"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
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
import { UserContext, UserContextProvider, AuthUser, UserContextType, ThemeContext, ThemeContextType } from '../../../../layout/context/appcontext'
import { AppContext, AppProvider } from '../../../../layout/context/app2Context'
import { Toast } from 'primereact/toast';
import Category from './category';
import Department from './department';
import CashFlow from './cashflow';
import Item from './item';
import CostCenter from './costcenter';
import Type from './type';
import Partner from './partner';
import Location from './location';

const queryClient = new QueryClient();

const LookupsPage = () => {

    const [category, setCategory] = useState('');
    const [categoryIndex, setCategoryIndex] = useState<number>(0);

    const [location, setLocation] = useState('');
    const [locationIndex, setLocationIndex] = useState<number>(0);

    const [departament, setDepartament] = useState('');
    const [departamentIndex, setDepartamentIndex] = useState<number>(0);

    const [cashflow, setCashFlow] = useState('');
    const [cashflowIndex, setCashflowIndex] = useState<number>(0);

    const [costcenter, setCostCenter] = useState('');
    const [costcenterIndex, setCostCenterIndex] = useState<number>(0);

    const [item, setItem] = useState('');
    const [itemIndex, setItemIndex] = useState<number>(0);

    const [entity, setEntity] = useState('');
    const [entityIndex, setEntityIndex] = useState<number>(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    const [theme, setTheme] = useState<ThemeContextType>("light");
    const [activeMenu, setActiveMenu] = useState('');
    const toast = useRef(null);


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

    useEffect(() => {
        setTheme("blue")
    }, []);


    const items = [
        { label: 'Parteneri', icon: 'pi pi-fw pi-mobile' },
        { label: 'Departamente', icon: 'pi pi-list' },
        { label: 'CashFlow', icon: 'pi pi-inbox' },
        { label: 'Obiecte de contract', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Centre Cost/Profit', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Categorii', icon: 'pi pi-chart-line' },
        { label: 'Tip Contracte', icon: 'pi pi-fw pi-table' },
        { label: 'Locatii', icon: 'pi pi-fw pi-table' },

    ];

    const addCategory = async () => {

        interface Category {
            name: string,
        }

        let toAdd: Category = {
            name: category
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post('http://localhost:3000/contracts/category',
                    toAdd
                );
                showSuccess(`Categoria ${toAdd.name} a fost adaugata!`)
                setCategoryIndex((prevKey: number) => prevKey + 1);
                setCategory('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugata categoria! ${error}'`)
            }
        }
        else showError('Categoria trebuie sa contina minim 3 caractere!')

    }

    const addLocation = async () => {

        interface Location {
            name: string,
        }

        let toAdd: Location = {
            name: location
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post('http://localhost:3000/contracts/location',
                    toAdd
                );
                showSuccess(`Locatia ${toAdd.name} a fost adaugata!`)
                setLocationIndex((prevKey: number) => prevKey + 1);
                setLocation('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugata locatia! ${error}'`)
            }
        }
        else showError('Locatia trebuie sa contina minim 3 caractere!')

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

                const response = await axios.post('http://localhost:3000/contracts/department',
                    toAdd
                );
                showSuccess(`Departmentul ${toAdd.name} a fost adaugat!`)
                setDepartamentIndex((prevKey: number) => prevKey + 1);
                setDepartament('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat departamentul! ${error}'`)
            }
        }
        else showError('Departamentul trebuie sa contina minim 3 caractere!')

    }

    const addCashFlow = async () => {

        interface CashFlow {
            name: string,
        }

        let toAdd: CashFlow = {
            name: cashflow
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post('http://localhost:3000/contracts/cashflow',
                    toAdd
                );
                showSuccess(`Linia de cashflow ${toAdd.name} a fost adaugata!`)
                setCashflowIndex((prevKey: number) => prevKey + 1);
                setCashFlow('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat linia de cashflow ! ${error}'`)
            }
        }
        else showError('Linia de cashflow trebuie sa contina minim 3 caractere!')

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

                const response = await axios.post('http://localhost:3000/contracts/item',
                    toAdd
                );
                showSuccess(`Obiectul de contract ${toAdd.name} a fost adaugat!`)
                setItemIndex((prevKey: number) => prevKey + 1);
                setItem('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat obiectul de contract! ${error}'`)
            }
        }
        else showError('Obiectul de contract trebuie sa contina minim 3 caractere!')

    }

    const addCostCenter = async () => {

        interface CostCenter {
            name: string,
        }

        let toAdd: CostCenter = {
            name: costcenter
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post('http://localhost:3000/contracts/costcenter',
                    toAdd
                );
                showSuccess(`Centrul de cost/profit ${toAdd.name} a fost adaugat!`)
                setCostCenterIndex((prevKey: number) => prevKey + 1);
                setCostCenter('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugat centrul de cost/profit! ${error}'`)
            }
        }
        else showError('Centrul de cost/profit trebuie sa contina minim 3 caractere!')
    }

    const addEntity = async () => {

        interface Entity {
            name: string,
        }

        let toAdd: Entity = {
            name: entity
        }

        if (toAdd.name.length > 2) {
            try {

                const response = await axios.post('http://localhost:3000/contracts/entity',
                    toAdd
                );
                showSuccess(`Entitatea ${toAdd.name} a fost adaugata!`)
                setEntityIndex((prevKey: number) => prevKey + 1);
                setEntity('');
                // console.log('category added:', response.data);
            } catch (error) {
                showError(`Nu a putut fi adaugata entitatea! ${error}'`)
            }
        }
        else showError('Entitatea trebuie sa contina minim 3 caractere!')
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={theme}>
                <AppContext.Provider value={{ activeMenu, setActiveMenu }}>

                    <div className="grid">
                        <div className="col-12">
                            <div className="card">
                                <Toast ref={toast} />
                                <h5>Nomenclatoare</h5>
                                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                            </div>
                            <div className="card">

                                {activeIndex === 0 ?

                                    <div>
                                        <div className='pt-4'>
                                            <Partner />
                                        </div>
                                    </div>

                                    : null
                                }

                                {activeIndex === 1 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="departament" type="text" value={departament} onChange={(e) => setDepartament(e.target.value)} />
                                                <label htmlFor="departament">Departament </label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addDepartment} /></div>
                                        <div className='pt-4'>
                                            <Department
                                                key={departamentIndex}
                                                executeFunction={setDepartamentIndex} />
                                        </div>
                                    </div>
                                    : null
                                }

                                {activeIndex === 2 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="cashflow" type="text" value={cashflow} onChange={(e) => setCashFlow(e.target.value)} />
                                                <label htmlFor="cashflow">Cashflow </label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addCashFlow} /></div>
                                        <div className='pt-4'>
                                            <CashFlow
                                                key={cashflowIndex}
                                                executeFunction={setCashflowIndex} />
                                        </div>
                                    </div>
                                    : null
                                }
                                {activeIndex === 3 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="item" type="text" value={item} onChange={(e) => setItem(e.target.value)} />
                                                <label htmlFor="item">Obiecte de contract </label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addItem} /></div>
                                        <div className='pt-4'>
                                            <Item
                                                key={itemIndex}
                                                executeFunction={setItemIndex} />
                                        </div>
                                    </div>
                                    : null
                                }
                                {activeIndex === 4 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="costcenter" type="text" value={costcenter} onChange={(e) => setCostCenter(e.target.value)} />
                                                <label htmlFor="costcenter">Centre de cost&profit</label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addCostCenter} /></div>
                                        <div className='pt-4'>
                                            <CostCenter
                                                key={costcenterIndex}
                                                executeFunction={setCostCenterIndex} />
                                        </div>
                                    </div>
                                    : null
                                }
                                {activeIndex === 6 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="costcenter" type="text" value={entity} onChange={(e) => setEntity(e.target.value)} />
                                                <label htmlFor="costcenter">Tip Contracte</label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addEntity} /></div>
                                        <div className='pt-4'>
                                            <Type
                                                key={entityIndex}
                                                executeFunction={setEntityIndex} />
                                        </div>
                                    </div>
                                    : null
                                }
                                {activeIndex === 5 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                                                <label htmlFor="category">Adauga o categorie</label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addCategory} /></div>
                                        <div className='pt-4'>
                                            <Category
                                                key={categoryIndex}
                                                executeFunction={setCategoryIndex} />
                                        </div>
                                    </div>

                                    : null
                                }
                                {activeIndex === 7 ?
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <span className="p-float-label">
                                                <InputText id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                                                <label htmlFor="location">Adauga o locatie</label>
                                            </span>
                                        </div>
                                        <div className='pt-2'><Button label="Adauga" onClick={addLocation} /></div>
                                        <div className='pt-4'>
                                            <Location
                                                key={locationIndex}
                                                executeFunction={setLocationIndex} />
                                        </div>
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

export default LookupsPage;
