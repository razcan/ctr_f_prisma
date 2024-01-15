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
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext"
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'


const queryClient = new QueryClient();

// Code,Denumire,Tip(client,furnizor,entitate - radio button), email, stare, Nr. reg com, Cod fiscal,Note,
// IBAN(banca/iban/implicit), adresa,tip adresa(comerciala/corespondenta/sociala), vizibilitate entitate /persoane de contact(nume,telefon,email,functie,reprezentant legal)
const Partner = () => {

    // console.log("id ruta : ", params)
    const pathname = usePathname()
    const partnerid = useSearchParams().get("partnerid")


    const [name, setName] = useState<any>('');
    const [fiscal_code, setFiscalCode] = useState<any>('');
    const [email, setEmail] = useState<any>('');
    const [commercial_reg, setCommercialReg] = useState('');
    const [remarks, setRemarks] = useState<any>('');
    const [selectedStatusType, setStatusType] = useState<any>([]);
    const [selectedType, setType] = useState<any>('');
    const [selectedPerson, setSelectedPerson] = useState<any>([]);
    const [visiblePerson, setVisiblePerson] = useState<any>('');

    const [persons, setPersons] = useState('');



    const [person_name, setPerson_name] = useState('');
    const [person_phone, setPerson_phone] = useState('');
    const [person_email, setPerson_email] = useState('');
    const [person_legalrepresent, setPerson_legalrepresent] = useState('');
    const [person_role, setPerson_role] = useState('');


    interface DropdownItem {
        name: string;
        code: string;
    }

    const statusType: DropdownItem[] = [
        { name: "Activ", code: "01" },
        { name: "Inactiv", code: "02" }
    ];

    const getstatusType = (status: string) => {
        return statusType.find((obj) => obj.name === status);
    };


    const Type: DropdownItem[] = [
        { name: "Client", code: "01" },
        { name: "Furnizor", code: "02" },
        { name: "Entitate", code: "03" }
    ];

    const getType = (status: string) => {
        return Type.find((obj) => obj.name === status);
    };

    const isLegalRepresent: DropdownItem[] = [
        { name: "Da", code: "Da" },
        { name: "Nu", code: "Nu" }
    ];


    const fetchPartnerDetails = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/partners/${partnerid}`).then(res => res.json().then(res => {
            setPersons(res.Persons);
            setName(res.name);
            setFiscalCode(res.fiscal_code);
            setCommercialReg(res.commercial_reg);
            setStatusType(getstatusType(res.state));
            setType(getType(res.type));
            setEmail(res.email);
            setRemarks(res.remarks);

        })
        )
    }

    useEffect(() => {
        fetchPartnerDetails()
    }, [])



    interface Person {
        name: string,
        phone?: string,
        email?: string,
        legalrepresent: string,
        role?: string,
        partner: any
    }

    const sendPersonData = async () => {
        let addPerson: Person = {
            name: person_name,
            phone: person_phone,
            email: person_email,
            legalrepresent: person_legalrepresent.name,
            role: person_role,
            partner: {
                "create":
                {
                    name: name,
                    fiscal_code: fiscal_code,
                    commercial_reg: commercial_reg,
                    state: selectedStatusType.name,
                    type: selectedType.name,
                    email: email,
                    remarks: remarks
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:3000/nomenclatures/persons',
                addPerson
            );
            console.log('Partner added:', response.data);
        } catch (error) {
            console.error('Error creating partner:', error);
        }
    }

    interface Partner {
        name: string,
        fiscal_code?: string,
        commercial_reg?: string,
        state: string,
        type: string,
        email?: string,
        remarks?: string
    }

    const sendPartnerData = async () => {
        //  console.log(name, fiscal_code, email, commercial_reg, remarks, selectedStatusType, selectedType)
        let addPartner: Partner = {
            name: name,
            fiscal_code: fiscal_code,
            commercial_reg: commercial_reg,
            state: selectedStatusType.name,
            type: selectedType.name,
            email: email,
            remarks: remarks
        }

        try {
            const response = await axios.post('http://localhost:3000/nomenclatures/partners',
                addPartner
            );
            console.log('Person added:', response.data);
        } catch (error) {
            console.error('Error creating person:', error);
        }
    }



    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div>Date Generale</div>
                    <div className="p-fluid formgrid grid pt-2">
                        <div className="field col-12  md:col-3">
                            <label htmlFor="name">Nume</label>
                            <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="fiscal_code">Cod Fiscal</label>
                            <InputText id="fiscal_code" type="text" value={fiscal_code} onChange={(e) => setFiscalCode(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="commercial_reg">Nr. Reg. Comertului</label>
                            <InputText id="commercial_reg" type="text" value={commercial_reg} onChange={(e) => setCommercialReg(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Status</label>
                            <Dropdown id="state"
                                value={selectedStatusType}
                                onChange={(e) => setStatusType(e.value)}
                                options={statusType}
                                optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="type">Tip</label>
                            <Dropdown id="type"
                                value={selectedType}
                                onChange={(e) => setType(e.value)} options={Type} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-6">
                            <label htmlFor="remarks">Note</label>
                            <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={1} cols={30} />
                        </div>
                    </div>
                </div>
                <div className="card">
                    Persoane
                    <div className="p-fluid formgrid grid pt-2">

                        <div className="field col-12 md:col-1 pt-4">

                            <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga" onClick={() => setVisiblePerson(true)} />

                        </div>

                        <div className="field col-12">
                            <Dialog header="Persoana" visible={visiblePerson} style={{ width: '30vw' }} onHide={() => setVisiblePerson(false)}>
                                <div className="card">
                                    <div className="p-fluid formgrid grid pt-2">
                                        <div className="field col-12 md:col-12 pt-4">
                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="name">Nume</label>
                                                <InputText id="name" type="text" value={person_name} onChange={(e) => setPerson_name(e.target.value)} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="phone">Telefon</label>
                                                <InputText id="phone" type="text" value={person_phone} onChange={(e) => setPerson_phone(e.target.value)} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="email">Email</label>
                                                <InputText id="email" type="text" value={person_email} onChange={(e) => setPerson_email(e.target.value)} />
                                            </div>

                                            <div className="field col-12 md:col-12">
                                                <label htmlFor="legalrepresent">Reprezentat Legal</label>
                                                <Dropdown id="legalrepresent" value={person_legalrepresent} onChange={(e) => setPerson_legalrepresent(e.value)} options={isLegalRepresent} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-12">
                                                <label htmlFor="role">Rol</label>
                                                <InputText id="role" type="text" value={person_role} onChange={(e) => setPerson_role(e.target.value)} />
                                            </div>
                                            <div className='p-3 field col-2 md:col-2'>
                                                <div className='grid'>
                                                    <div className='flex flex-wrap justify-content-left gap-3'>
                                                        <Button label="Salveaza" severity="success" onClick={sendPersonData} />
                                                        <Button label="Stege" severity="danger" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                            <DataTable value={persons} selectionMode="single"
                                selection={selectedPerson} onSelectionChange={(e) => {
                                    setSelectedPerson(e.value)
                                    setVisiblePerson(true)
                                }}>
                                <Column field="name" header="Nume"></Column>
                                <Column field="phone" header="Telefon"></Column>
                                <Column field="email" header="Email"></Column>
                                <Column field="position" header="Rol"></Column>
                                <Column field="legal_rep" header="Reprezentant Legal"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div className="card">
                    Adrese
                </div>
                <div className="card">
                    Conturi bancare
                </div>
                <div className="card">
                    Vizibilitate
                </div>
                <div className='card'>
                    <div className='flex flex-wrap justify-content-left gap-3'>
                        <Button label="Salveaza" severity="success" onClick={sendPartnerData} />
                        <Button label="Stege" severity="danger" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Partner;
