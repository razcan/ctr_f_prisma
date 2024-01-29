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

function addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

interface DropdownItem {
    name: string;
    code: string;
}


interface Contract {
    number?: number,
    typeId?: number,
    statusId?: number,
    start?: Date,
    end?: Date,
    sign?: Date,
    completion?: Date,
    remarks?: string,
    categoryId?: number,
    departmentId?: number,
    cashflowId?: number,
    itemId?: number,
    costcenterId?: number,
    automaticRenewal: boolean,
    // contract: any,
    partnersId: number,
    entityId: number,
    partnerpersonsId: number,
    entitypersonsId: number,
    entityaddressId: number,
    partneraddressId: number,
    entitybankId: number,
    partnerbankId: number
}

const FormLayoutDemo = () => {

    const router = useRouter();
    // const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const [contractStatus, setContractStatus] = useState([]);
    const [number, setNumber] = useState(null);
    const [type, setType] = useState(null);
    const [contractType, setContractType] = useState([]);
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
    const [partner, setPartner] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState([]);
    const [persons, setPersons] = useState([]);

    const [partnerdetails, setPartnerdetails] = useState([]);
    const [entitydetails, setEntitydetails] = useState([]);

    // const [selectedCostCenter, setSelectedCostCenter] = useState([]);

    const [automaticRenewalValue, setAutomaticRenewal] = useState<any>(false);

    const [ent_name, setEnt_name] = useState(null);
    const [ent_email, setEnt_email] = useState(null);
    const [ent_phone, setEnt_phone] = useState(null);
    const [ent_legal_person, setEnt_legal_person] = useState(null);
    const [ent_iban, setEnt_IBAN] = useState(null);
    const [ent_address, setEnt_Address] = useState(null);
    const [ent_bank, setEnt_bank] = useState(null);
    const [ent_role, setEnt_role] = useState(null);
    const [ent_id, setEnt_id] = useState();



    const [party_name, setParty_name] = useState(null);
    const [party_email, setParty_email] = useState(null);
    const [party_phone, setParty_phone] = useState(null);
    const [party_legal_person, setParty_legal_person] = useState(null);
    const [party_iban, setParty_IBAN] = useState(null);
    const [party_address, setParty_Address] = useState(null);
    const [party_role, setParty_role] = useState(null);
    const [party_bank, setParty_bank] = useState(null);
    const [party_id, setParty_id] = useState();


    // const dropdownItems: DropdownItem[] = useMemo(
    //     () => [
    //         { name: 'In lucru', code: 'Draft' },
    //         { name: 'Asteapta aprobarea', code: 'Pending Approval' },
    //         { name: 'In curs de revizuire', code: 'Under Review' },
    //         { name: 'Aprobat', code: 'Approved' },
    //         { name: 'In executie', code: 'Executed' },
    //         { name: 'Activ', code: 'Active' },
    //         { name: 'Expirat', code: 'Expired' },
    //         { name: 'Finalizat', code: 'Terminated' },
    //         { name: 'Reinnoit', code: 'Renewed' },
    //         { name: 'Modificat', code: 'Amended' },
    //         { name: 'Inchis inainte de termen', code: 'Cancelled' },
    //         { name: 'Contestat', code: 'Disputed' },
    //     ],
    //     []
    // );

    // const contractType: DropdownItem[] = [
    //     { name: "Contracte de Vanzare-Cumparare", code: "01" },
    //     { name: "Contracte de inchiriere", code: "02" },
    //     { name: "Contracte de servicii", code: "03" },
    //     { name: "Contracte de parteneriat", code: "04" },
    //     { name: "Contracte de colaborare", code: "05" },
    //     { name: "Contracte de constructie", code: "06" },
    //     { name: "Contracte de licentiere", code: "07" },
    //     { name: "Contracte de franciză", code: "08" },
    //     { name: "Contracte de imprumut", code: "09" },
    //     { name: "Contracte de agent", code: "10" },
    //     { name: "Contracte de dezvoltare Software", code: "11" },
    //     { name: "Contracte de asigurare", code: "12" },
    //     { name: "Contracte imobiliare", code: "13" },
    //     { name: "Contracte de mentenanta", code: "14" },
    //     { name: "Contracte abonament", code: "15" },
    //     { name: "Contract de schimb", code: "16" },
    //     { name: "Contract de furnizare de produse", code: "17" },
    //     { name: "Contract de report", code: "18" },
    //     { name: "Contract de antrepriză", code: "19" },
    //     { name: "Contract de asociere în participație", code: "20" },
    //     { name: "Contract de transport", code: "21" },
    //     { name: "Contract de mandat", code: "22" },
    //     { name: "Contract de comision", code: "23" },
    //     { name: "Contract de consignație", code: "24" },
    //     { name: "Contract de agenție", code: "25" },
    //     { name: "Contract de intermediere", code: "26" },
    //     { name: "Contract de depozit", code: "27" },
    //     { name: "Contract de închiriere", code: "28" },
    //     { name: "Contract de cont curent", code: "29" },
    //     { name: "Contract de cont curent bancar", code: "30" },
    //     { name: "Contract de asigurare", code: "31" },
    //     { name: "Contract de rentă viageră", code: "32" },
    //     { name: "Contract de joc și pariu", code: "33" },
    //     { name: "Contract de donație", code: "34" },
    //     { name: "Contract de fiducie", code: "35" },
    //     { name: "Contract de leasing", code: "36" },
    //     { name: "Contract de factoring", code: "37" },

    // ];


    const fetchTypeData = () => {
        fetch("http://localhost:3000/nomenclatures/contracttype")
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })

    }

    const fetchStatusData = () => {
        fetch("http://localhost:3000/nomenclatures/contractstatus")
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractStatus(status)
            })

    }



    const fetchCategoriesData = () => {
        fetch("http://localhost:3000/contracts/category")
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })

    }

    const fetchEntity = () => {
        fetch("http://localhost:3000/nomenclatures/entity")
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
    }

    const fetchPartners = () => {
        fetch("http://localhost:3000/nomenclatures/partners")
            .then(response => {
                return response.json()
            })
            .then(partner => {
                setPartner(partner)
            })
    }




    const fetchPartnersDetailsData = (partnerId: number) => {
        fetch(`http://localhost:3000/nomenclatures/partnersdetails/${partnerId}`)
            .then(response => {
                return response.json()
            })
            .then(partnerdetails => {
                setPartnerdetails(partnerdetails[0])
            })
    }

    const fetchEntityDetailsData = (entityId: number) => {
        fetch(`http://localhost:3000/nomenclatures/entitydetails/${entityId}`)
            .then(response => {
                return response.json()
            })
            .then(entitydetails => {
                setEntitydetails(entitydetails[0])
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

    // const fetchEntity = () => {
    //     fetch("http://localhost:3000/contracts/entity")
    //         .then(response => {
    //             return response.json()

    //         })
    //         .then(entity => {
    //              setEntity(entity)
    //             // console.log('response')
    //         })
    // }

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
            })
    }

    useEffect(() => {
        fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchItemsData(),
            // fetchEntity(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData()
        // fetchPartnersDetailsData()
    }, [])

    // auto filter by selectedEntity - nume resp, banca, pers
    // useEffect(() => {

    // }, [selectedEntity])


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

    // useEffect(() => {
    //     setDropdownItem(dropdownItems['']);
    // }, [dropdownItems]);


    const saveContract = async () => {
        // console.log(number, partner, start, end, completion, sign, type, remarks, status)
        let addedContract: Contract = {
            number: number,
            typeId: type.id,
            // partner: partner,
            statusId: status.id,
            start: (start ? addOneDay(start) : null),
            end: (end ? addOneDay(end) : null),
            sign: (sign ? addOneDay(sign) : null),
            completion: (completion ? addOneDay(completion) : null),
            remarks: remarks,
            categoryId: selectedCategory.id,
            departmentId: selectedDepartment.id,
            cashflowId: selectedCashflow.id,
            itemId: selectedItem.id,
            costcenterId: selectedCostCenter.id,
            automaticRenewal: automaticRenewalValue,
            // contract: selectedItem,
            partnersId: selectedPartner.id,
            entityId: selectedEntity.id,
            partnerpersonsId: party_id,
            entitypersonsId: ent_id,
            entityaddressId: ent_address.id,
            partneraddressId: party_address.id,
            entitybankId: ent_iban.id,
            partnerbankId: party_iban.id
        }
        // console.log(addedContract);

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
                            activeIndex={[0, 1]}
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
                                                <Dropdown id="entity" value={selectedEntity}
                                                    onChange={(e) => {
                                                        setSelectedEntity(e.value)
                                                        // fetchPartnersDetailsData(e.value.id)
                                                        fetchEntityDetailsData(e.value.id)
                                                        console.log(e.value)
                                                    }}
                                                    options={entity}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="entity">Nume Responsabil</label>
                                                <Dropdown id="entity" value={ent_name}
                                                    onChange={(e) => {
                                                        setEnt_id(e.target.value.id)
                                                        setEnt_name(e.target.value.name)
                                                        setEnt_email(e.target.value.email)
                                                        setEnt_phone(e.target.value.phone)
                                                        setEnt_legal_person(e.target.value.legalrepresent)
                                                        setEnt_role(e.target.value.role)
                                                    }
                                                    }
                                                    options={entitydetails.Persons}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_email">Rol</label>
                                                <InputText disabled id="ent_email" type="text" value={ent_role} />
                                            </div>

                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_email">Email Responsabil</label>
                                                <InputText disabled id="ent_email" type="text" value={ent_email} onChange={(e) => setEnt_email(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_phone">Telefon Responsabil</label>
                                                <InputText disabled id="ent_phone" keyfilter="int" type="text" value={ent_phone} onChange={(e) => setEnt_phone(e.target.value)} />
                                            </div>
                                            <div className="field-checkbox col-12 md:col-3">
                                                <Checkbox id="default" checked={ent_legal_person}></Checkbox>
                                                <label htmlFor="default" className="ml-2">Reprezentant Legal</label>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_legal_person">Banca</label>
                                                <InputText disabled id="ent_legal_person" type="text" value={ent_bank} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_iban">IBAN</label>
                                                <Dropdown id="entity" value={ent_iban}
                                                    onChange={(e) => {
                                                        setEnt_IBAN(e.target.value)
                                                        setEnt_bank(e.target.value.bank)
                                                    }
                                                    }
                                                    options={entitydetails.Banks}
                                                    optionLabel="iban" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="number">Adresa</label>
                                                <Dropdown id="entity" value={ent_address}
                                                    onChange={(e) => {
                                                        setEnt_Address(e.target.value)
                                                    }
                                                    }
                                                    options={entitydetails.Address}
                                                    optionLabel="completeAddress" placeholder="Select One"></Dropdown>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </AccordionTab>
                            <AccordionTab header={
                                <span className="flex align-items-center gap-2 w-full">
                                    Partener: {selectedPartner.name}
                                </span>
                            }>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="partner">Partner</label>
                                                <Dropdown id="entity" value={selectedPartner}
                                                    onChange={(e) => {
                                                        setSelectedPartner(e.value)
                                                        fetchPartnersDetailsData(e.value.id)
                                                        console.log(e.value)
                                                    }}
                                                    options={partner}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_name">Nume Responsabil</label>
                                                <Dropdown id="entity" value={party_name}
                                                    onChange={(e) => {
                                                        setParty_id(e.target.value.id)
                                                        setParty_name(e.target.value)
                                                        setParty_email(e.target.value.email)
                                                        setParty_phone(e.target.value.phone)
                                                        setParty_legal_person(e.target.value.legalrepresent)
                                                        setParty_role(e.target.value.role)
                                                    }
                                                    }
                                                    options={partnerdetails.Persons}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_email">Rol</label>
                                                <InputText disabled id="ent_email" type="text" value={party_role} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_email">Email Responsabil</label>
                                                <InputText disabled id="party_email" type="text" value={party_email} onChange={(e) => setParty_email(e.target.value)} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_phone">Telefon Responsabil</label>
                                                <InputText disabled id="party_phone" keyfilter="int" type="text" value={party_phone} onChange={(e) => setParty_phone(e.target.value)} />
                                            </div>
                                            <div className="field-checkbox col-12 md:col-3">
                                                <Checkbox id="default" checked={party_legal_person}></Checkbox>
                                                <label htmlFor="default" className="ml-2">Reprezentant Legal</label>

                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_legal_person">Banca</label>
                                                <InputText disabled id="ent_legal_person" type="text" value={party_bank} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_iban">IBAN</label>
                                                <Dropdown id="party" value={party_iban}
                                                    onChange={(e) => {
                                                        setParty_IBAN(e.target.value)
                                                        setParty_bank(e.target.value.bank)
                                                    }
                                                    }
                                                    options={partnerdetails.Banks}
                                                    optionLabel="iban" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="number">Adresa</label>
                                                <Dropdown id="entity" value={party_address}
                                                    onChange={(e) => {
                                                        setParty_Address(e.target.value)
                                                    }
                                                    }
                                                    options={partnerdetails.Address}
                                                    optionLabel="completeAddress" placeholder="Select One"></Dropdown>

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
                            <Dropdown id="state" value={status} onChange={(e) => setStatus(e.value)} options={contractStatus} optionLabel="name" placeholder="Select One"></Dropdown>
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
