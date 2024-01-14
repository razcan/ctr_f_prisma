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

// Code,Denumire,Tip(client,furnizor,entitate - radio button), email, stare, Nr. reg com, Cod fiscal,Note,
// IBAN(banca/iban/implicit), adresa,tip adresa(comerciala/corespondenta/sociala), vizibilitate entitate /persoane de contact(nume,telefon,email,functie,reprezentant legal)
const Partner = ({ executeFunction }: any) => {

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [fiscal_code, setFiscalCode] = useState('');
    const [email, setEmail] = useState('');
    const [commercial_reg, setCommercialReg] = useState('');
    const [remarks, setRemarks] = useState('');
    const [selectedStatusType, setStatusType] = useState('');
    const [selectedType, setType] = useState('');

    //  const [persons, setPersons] = useState([]);

    const persons: any[] = [
        { name: "Vasile Petre", phone: "01234342", email: "a@a.com", position: "Director vanzari", legal_rep: "NU" },
        { name: "Maria Atanase", phone: "01434343", email: "b@b.com", position: "Director general", legal_rep: "DA" },
    ];



    interface DropdownItem {
        name: string;
        code: string;
    }

    const statusType: DropdownItem[] = [
        { name: "Activ", code: "01" },
        { name: "Inactiv", code: "02" }
    ];

    const Type: DropdownItem[] = [
        { name: "Client", code: "01" },
        { name: "Furnizor", code: "02" },
        { name: "Entitate", code: "03" }
    ];

    const isLegalRepresent: DropdownItem[] = [
        { name: "Da", code: "Da" },
        { name: "Nu", code: "Nu" }
    ];



    const toast = useRef<undefined | null | any>(null);

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



    return (
        // <div>
        //     <div>aici un tabel pe care se da click sa se adauga parteneri/form -- mai intai un form modal</div>
        // </div >
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
                            <Dropdown id="state" value={selectedStatusType} onChange={(e) => setStatusType(e.value)} options={statusType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Tip</label>
                            <Dropdown id="state" value={selectedType} onChange={(e) => setType(e.value)} options={Type} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-6">
                            <label htmlFor="number">Note</label>
                            <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={1} cols={30} />
                        </div>
                    </div>
                </div>
                <div className="card">
                    Persoane
                    <div className="p-fluid formgrid grid pt-2">
                        <div className="field col-12  md:col-3">
                            <label htmlFor="name">Nume</label>
                            <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-2">
                            <label htmlFor="fiscal_code">Telefon</label>
                            <InputText id="fiscal_code" type="text" value={fiscal_code} onChange={(e) => setFiscalCode(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-2">
                            <label htmlFor="commercial_reg">Email</label>
                            <InputText id="commercial_reg" type="text" value={commercial_reg} onChange={(e) => setCommercialReg(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="state">Reprezentat Legal</label>
                            <Dropdown id="state" value={selectedStatusType} onChange={(e) => setStatusType(e.value)} options={isLegalRepresent} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="state">Rol</label>
                            <Dropdown id="state" value={selectedStatusType} onChange={(e) => setStatusType(e.value)} options={statusType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-1 pt-4"
                        // style={{ height: "2px", width: "2px" }}
                        >

                            <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga" />

                        </div>

                        <div className="field col-12">
                            <DataTable value={persons} >
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
            </div>
        </div>
        //persoane de contact(nume,telefon,email,functie,reprezentant legal)
    );
}

export default Partner;
