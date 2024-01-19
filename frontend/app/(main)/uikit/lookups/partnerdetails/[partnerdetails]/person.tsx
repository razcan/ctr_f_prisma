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

const Person = ({ params, setPersonIndex }: any) => {
    const partnerid = params[0]

    const [persons, setPersons] = useState('');
    const [person_name, setPerson_name] = useState('');
    const [person_phone, setPerson_phone] = useState('');
    const [person_email, setPerson_email] = useState('');
    const [person_legalrepresent, setPerson_legalrepresent] = useState(false);
    const [person_role, setPerson_role] = useState('');
    const [visiblePerson, setVisiblePerson] = useState<any>('');
    const [selectedPerson, setSelectedPerson] = useState<any>([]);
    const [selectedDefault, setSelectedDefault] = useState<any>(true);


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
        legalrepresent?: boolean,
        role?: string,
        partner: any
    }

    const AddPersonData = () => {
        // setSelectedPerson(null)

        setPerson_email('')
        setPerson_legalrepresent(false)
        setPerson_name('');
        setPerson_role('');
        setPerson_phone('');

        setVisiblePerson(true)
    }

    const sendPersonData = async () => {
        if (selectedPerson.id) {
            //update
            let addPerson: Person = {
                name: person_name,
                phone: person_phone,
                email: person_email,
                legalrepresent: person_legalrepresent,
                role: person_role,
                partner: {
                    "connect":
                    {
                        id: parseInt(partnerid)
                    }
                }
            }
            try {
                const response = await axios.patch(`http://localhost:3000/nomenclatures/persons/${selectedPerson.id}`,
                    addPerson
                );
                setPersonIndex((prevKey: number) => prevKey + 1);
                setVisiblePerson(false)

                console.log('Person updated:', response.data);
            }
            catch (error) {
                console.error('Error updating person:', error);
            }
        }
        else {
            //create

            let addPerson: Person = {
                name: person_name,
                phone: person_phone,
                email: person_email,
                legalrepresent: person_legalrepresent,
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

                setPersonIndex((prevKey: number) => prevKey + 1);
                setVisiblePerson(false)

                setPerson_email('')
                setPerson_legalrepresent(false)
                setPerson_name('');
                setPerson_role('');
                setPerson_phone('');
            } catch (error) {
                console.error('Error creating partner:', error);
            }
        }

    }

    const deletePersonData = async () => {

        try {
            const response = await axios.delete(`http://localhost:3000/nomenclatures/persons/${selectedPerson.id}`,
                setPersonIndex((prevKey: number) => prevKey + 1)
            );
        } catch (error) {
            console.error('Error deleting person:', error);
        }

    }

    const LegalrepresentTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" checked={rowData.legalrepresent}></Checkbox>
            </div>
        );
    };


    return (
        <div className="p-fluid formgrid grid pt-2">
            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga" onClick={() => AddPersonData()} />
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

                                <div className="field-checkbox col-12 md:col-12">
                                    <Checkbox id="legalrepresent" onChange={e => setPerson_legalrepresent(e.checked)}
                                        checked={person_legalrepresent}
                                    // checked={person_legalrepresent === "false" ? false : true}
                                    ></Checkbox>
                                    <label htmlFor="legalrepresent" className="ml-2">Reprezentat Legal</label>
                                </div>

                                <div className="field col-12 md:col-12">
                                    <label htmlFor="role">Rol</label>
                                    <InputText id="role" type="text" value={person_role} onChange={(e) => setPerson_role(e.target.value)} />
                                </div>
                                <div className='p-3 field col-2 md:col-2'>
                                    <div className='grid'>
                                        <div className='flex flex-wrap justify-content-left gap-3'>
                                            <Button label="Salveaza" severity="success" onClick={sendPersonData} />
                                            <Button label="Sterge" severity="danger" onClick={deletePersonData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <DataTable value={persons} selectionMode="single"
                    sortField="id"
                    //sortOrder={-1} //desc
                    sortOrder={1} //cres
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                    selection={selectedPerson} onSelectionChange={(e) => {
                        setSelectedPerson(e.value)
                        setPerson_name(e.value.name)
                        setPerson_phone(e.value.phone)
                        setPerson_email(e.value.email)
                        setPerson_role(e.value.role)
                        setPerson_legalrepresent(e.value.legalrepresent)
                        setVisiblePerson(true)
                    }}>
                    <Column field="id" header="Cod"></Column>
                    <Column field="name" header="Nume"></Column>
                    <Column field="phone" header="Telefon"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="role" header="Rol"></Column>
                    <Column header="Reprezentant Legal" style={{ width: '10vh' }} body={LegalrepresentTemplate} />
                </DataTable>
            </div>
        </div>
    )

}
export default Person;