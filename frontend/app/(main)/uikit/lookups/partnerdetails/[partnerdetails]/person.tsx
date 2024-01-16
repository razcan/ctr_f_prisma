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
import PartnerAddress from './address'
import PartnerBank from './bank'

const Person = ({ params }: any) => {
    const partnerid = params[0]

    const [persons, setPersons] = useState('');
    const [person_name, setPerson_name] = useState('');
    const [person_phone, setPerson_phone] = useState('');
    const [person_email, setPerson_email] = useState('');
    const [person_legalrepresent, setPerson_legalrepresent] = useState('');
    const [person_role, setPerson_role] = useState('');
    const [visiblePerson, setVisiblePerson] = useState<any>('');
    const [selectedPerson, setSelectedPerson] = useState<any>([]);


    const isLegalRepresent: DropdownItem[] = [
        { name: "Da", code: "Da" },
        { name: "Nu", code: "Nu" }
    ];

    const fetchPersons = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/persons/${partnerid}`).then(res => res.json().then(res => {
            setPersons(res);
            setPerson_name(res.name)
            setPerson_phone(res.phone);
            setPerson_email(res.email);
            setPerson_legalrepresent(res.legalrepresent);
            setPerson_role(res.role);
        })
        )
    }
    useEffect(() => {
        fetchPersons()
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
                "connect":
                {
                    id: parseInt(partnerid)
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:3000/nomenclatures/persons',
                addPerson
            );
            console.log('Partner added:', response.data);

            setVisiblePerson(false)
            setPerson_email('')
            setPerson_legalrepresent('')
            setPerson_name('');
            setPerson_role('');
            setPerson_phone('');
        } catch (error) {
            console.error('Error creating partner:', error);
        }
    }

    const LegalrepresentTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                {rowData.legalrepresent === "Da" ? <Checkbox id="default" checked={true}></Checkbox> : <Checkbox id="default" checked={false}></Checkbox>}
            </div>
        );
    };


    return (
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
                    <Column field="role" header="Rol"></Column>
                    <Column header="Reprezentant Legal" style={{ width: '10vh' }} body={LegalrepresentTemplate} />
                    {/* <Column field="legalrepresent" header="Reprezentant Legal"></Column> */}
                </DataTable>
            </div>
        </div>
    )

}
export default Person;