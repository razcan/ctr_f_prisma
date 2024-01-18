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
import Person from './person'

const queryClient = new QueryClient();

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
    const [personIndex, setPersonIndex] = useState<number>(0);

    const [persons, setPersons] = useState('');


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


    const fetchPartnerDetails = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/partners/${partnerid}`).then(res => res.json().then(res => {
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
                    <Person
                        params={partnerid}
                        key={personIndex}
                        setPersonIndex={setPersonIndex}

                    />
                </div>
                <div className="card">
                    Adrese
                    <PartnerAddress
                        params={partnerid}
                        key={personIndex}
                        setpersonIndex={setPersonIndex}
                    />
                </div>
                <div className="card">
                    Conturi bancare
                    <PartnerBank
                        params={partnerid}
                        key={personIndex}
                        setpersonIndex={setPersonIndex}
                    />
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
