'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from 'primereact/editor';
import axios from 'axios';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import { ProgressSpinner } from 'primereact/progressspinner';

const queryClient = new QueryClient();


interface DropdownItem {
    name: string;
    code: string;
}

interface Contract {
    number?: number,
    type?: string,
    partner?: string,
    status?: string,
    start?: Date,
    end?: Date,
    sign?: Date,
    completion?: Date,
    remarks?: string,
    category?: string
}

const FormLayoutDemo = () => {

    const router = useRouter();
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);

    const [number, setNumber] = useState(null);
    const [partner, setPartner] = useState(null);
    const [type, setType] = useState(null);
    const [start, setStartDate] = useState(null);
    const [end, setEndDate] = useState(null);
    const [sign, setSignDate] = useState(null);
    const [completion, setCompletionDate] = useState(null);
    const [remarks, setRemarks] = useState(null);
    const [status, setStatus] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    const [cashflows, setCashflow] = useState([]);
    const [selectedCashflow, setSelectedCashflow] = useState([]);

    const [costcenters, setCostCenter] = useState([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState([]);

    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

    const [entity, setEntity] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState([]);

    const [automaticRenewalValue, setAutomaticRenewal] = useState<any>(false);

    const [ent_name, setEnt_name] = useState(null);
    const [ent_email, setEnt_email] = useState(null);
    const [ent_phone, setEnt_phone] = useState(null);
    const [ent_legal_person, setEnt_legal_person] = useState(null);
    const [ent_iban, setEnt_IBAN] = useState(null);
    const [ent_address, setEnt_Address] = useState(null);

    const [party_name, setParty_name] = useState(null);
    const [party_email, setParty_email] = useState(null);
    const [party_phone, setParty_phone] = useState(null);
    const [party_legal_person, setParty_legal_person] = useState(null);
    const [party_iban, setParty_IBAN] = useState(null);
    const [party_address, setParty_Address] = useState(null);

    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'In lucru', code: 'Draft' },
            { name: 'Asteapta aprobarea', code: 'Pending Approval' },
            { name: 'In curs de revizuire', code: 'Under Review' },
            { name: 'Aprobat', code: 'Approved' },
            { name: 'In executie', code: 'Executed' },
            { name: 'Activ', code: 'Active' },
            { name: 'Expirat', code: 'Expired' },
            { name: 'Finalizat', code: 'Terminated' },
            { name: 'Reinnoit', code: 'Renewed' },
            { name: 'Modificat', code: 'Amended' },
            { name: 'Inchis inainte de termen', code: 'Cancelled' },
            { name: 'Contestat', code: 'Disputed' },
        ],
        []
    );

    const contractType: DropdownItem[] = [
        { name: "Contracte de Vanzare-Cumparare", code: "01" },
        { name: "Contracte de Inchiriere", code: "02" },
        { name: "Contracte de Servicii", code: "03" },
        { name: "Contracte de Parteneriat", code: "04" },
        { name: "Contracte de Colaborare", code: "05" },
        { name: "Contracte de Constructie", code: "06" },
        { name: "Contracte de Licentiere", code: "07" },
        { name: "Contracte de Franciza", code: "08" },
        { name: "Contracte de Imprumut", code: "09" },
        { name: "Contracte de Agent", code: "10" },
        { name: "Contracte de Dezvoltare Software", code: "11" },
        { name: "Contracte de Asigurare", code: "12" },
        { name: "Contracte Imobiliare", code: "13" },
        { name: "Contracte de Mentenanta", code: "14" },
        { name: "Contracte Abonament", code: "15" },
    ];


    const fetchCategoriesData = () => {
        fetch("http://localhost:3000/contracts/category")
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
                // setProducts(coins)
                // console.log(coins)
            })
    }


    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item")
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItems(item)
            })
    }


    const fetchCashFlow = () => {
        fetch("http://localhost:3000/contracts/cashflow")
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchEntity = () => {
        fetch("http://localhost:3000/contracts/entity")
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
    }

    const fetchCostCenter = () => {
        fetch("http://localhost:3000/contracts/costcenter")
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }


    const fetchDepartmentsData = () => {
        fetch("http://localhost:3000/contracts/department")
            .then(response => {
                return response.json()
            })
            .then(departments => {
                setDepartments(departments)
                // setProducts(coins)
                // console.log(coins)
            })
    }

    useEffect(() => {
        fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchItemsData(),
            fetchEntity(),
            fetchCostCenter(),
            fetchCashFlow()
    }, [])



    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home',
            command: () => {
                router.push('/uikit/input');
            }
        },
        { label: 'Acte Aditionale', icon: 'pi pi-chart-line' },
        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        { label: 'Documente Atasate', icon: 'pi pi-inbox' },
        { label: 'Flux aprobare', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Istoric', icon: 'pi pi-fw pi-table' },
        { label: 'Alerte', icon: 'pi pi-fw pi-mobile' }
    ];

    useEffect(() => {
        setDropdownItem(dropdownItems['']);
    }, [dropdownItems]);


    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    const saveContract = async () => {
        // console.log(number, partner, start, end, completion, sign, type, remarks, status)
        let addedContract: Contract = {
            number: number,
            type: type,
            partner: partner,
            status: status.name,
            start: (start ? start.toISOString() : null),
            end: (end ? end.toISOString() : null),
            sign: (sign ? sign.toISOString() : null),
            completion: (completion ? completion.toISOString() : null),
            remarks: remarks,
            category: selectedCategory.name,
            item: selectedItem.name,
            cashflow: selectedCashflow.name,
            departament: selectedDepartment.name,
            entity: selectedEntity.name,
            costcenter: selectedCostCenter.name
        }

        try {
            const response = await axios.post('http://localhost:3000/contracts',
                addedContract
                // number, partner, start, end, completion, sign, type, remarks, status
            );

            console.log('Contract added:', response.data);
        } catch (error) {
            console.error('Error creating contract:', error);
        }

    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="field lg:col-12 xs:col-3 md:col-12">
                        <TabMenu model={items} />
                    </div>

                    <div className="p-fluid formgrid grid pt-2">

                        <Accordion className="field lg:col-12 xs:col-3 md:col-12" multiple
                        // activeIndex={[0]}
                        >
                            <AccordionTab
                                header={
                                    <span className="flex align-items-center gap-2 w-full">
                                        Entitate: {selectedEntity.name}
                                    </span>
                                }

                            >
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="entity">Entitate</label>
                                                <Dropdown id="entity" value={selectedEntity} onChange={(e) => setSelectedEntity(e.value)} options={entity} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_name">Nume Responsabil</label>
                                                <InputText id="ent_name" type="text" value={ent_name} onChange={(e) => setEnt_name(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_email">Email Responsabil</label>
                                                <InputText id="ent_email" type="text" value={ent_email} onChange={(e) => setEnt_email(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_phone">Telefon Responsabil</label>
                                                <InputText id="ent_phone" keyfilter="int" type="text" value={ent_phone} onChange={(e) => setEnt_phone(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_legal_person">Reprezentant Legal</label>
                                                <InputText id="ent_legal_person" type="text" value={ent_legal_person} onChange={(e) => setEnt_legal_person(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_iban">IBAN</label>
                                                <InputText id="ent_iban" type="text" value={ent_iban} onChange={(e) => setEnt_IBAN(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-6">
                                                <label htmlFor="number">Adresa</label>
                                                <InputTextarea value={ent_address} onChange={(e) => setEnt_Address(e.target.value)} rows={1} cols={30} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </AccordionTab>
                            <AccordionTab header={
                                <span className="flex align-items-center gap-2 w-full">
                                    Partener: {partner}
                                </span>
                            }>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="partner">Partner</label>
                                                <InputText id="partner" type="text" value={partner} onChange={(e) => setPartner(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_name">Nume Responsabil</label>
                                                <InputText id="party_name" type="text" value={party_name} onChange={(e) => setParty_name(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_email">Email Responsabil</label>
                                                <InputText id="party_email" type="text" value={party_email} onChange={(e) => setParty_email(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_phone">Telefon Responsabil</label>
                                                <InputText id="party_phone" keyfilter="int" type="text" value={party_phone} onChange={(e) => setParty_phone(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_legal_person">Reprezentant Legal</label>
                                                <InputText id="party_legal_person" type="text" value={party_legal_person} onChange={(e) => setParty_legal_person(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_iban">IBAN</label>
                                                <InputText id="party_iban" type="text" value={party_iban} onChange={(e) => setParty_IBAN(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-6">
                                                <label htmlFor="party_address">Adresa</label>
                                                <InputTextarea value={party_address} onChange={(e) => setParty_Address(e.target.value)} rows={1} cols={30} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </AccordionTab>
                        </Accordion>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="number">Numar</label>
                            <InputText id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Tip</label>
                            <Dropdown id="state" value={type} onChange={(e) => setType(e.value)} options={contractType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Stare</label>
                            <Dropdown id="state" value={status} onChange={(e) => setStatus(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="category">Categorie</label>
                            <Dropdown id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categories} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Data Start
                            </label>
                            <Calendar id="buttondisplay" value={start} onChange={(e) => setStartDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Data Final
                            </label>
                            <Calendar id="buttondisplay" value={end} onChange={(e) => setEndDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Data Semnare
                            </label>
                            <Calendar id="buttondisplay" value={sign} onChange={(e) => setSignDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Inchis la data
                            </label>
                            <Calendar id="buttondisplay" value={completion} onChange={(e) => setCompletionDate(e.value)} showIcon />
                        </div>


                        <div className="field col-12 md:col-3">
                            <label htmlFor="department">Departament</label>
                            <Dropdown id="department" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.value)} options={departments} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="item">Obiect de contract</label>
                            <Dropdown id="item" value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="costcenter">Centru de cost&profit</label>
                            <Dropdown id="costcenter" value={selectedCostCenter} onChange={(e) => setSelectedCostCenter(e.value)} options={costcenters} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cashflow">CashFlow</label>
                            <Dropdown id="cashflow" value={selectedCashflow} onChange={(e) => setSelectedCashflow(e.value)} options={cashflows} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <div className="field-checkbox">
                                <Checkbox onChange={e => setAutomaticRenewal(e.checked)} checked={automaticRenewalValue}></Checkbox>
                                <label htmlFor="auto_renewal">Prelungire Automata</label>
                            </div>
                        </div>

                        <div className="field col-12 md:col-12">
                            <label htmlFor="cashflow">Note</label>
                            <Editor value={remarks} onTextChange={(e) => setRemarks(e.htmlValue)}
                                className='max-w-screen' style={{ height: '220px' }}
                            />
                        </div>
                    </div>
                    <Button label="Salveaza" onClick={saveContract} />
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;
