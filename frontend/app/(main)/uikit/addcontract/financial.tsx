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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

export default function Financial() {

    const [financialVisible, setfinancialVisible] = useState(false);

    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);


    const item2 = [
        { code: "1", name: "Servicii chirie", valoare: "200 EUR", interval: "Lunar" },
        { code: "2", name: "Tarif de administrare", valoare: "400 EUR", interval: "Trimestrial" }
    ]

    //header
    // obiect contract (de adaug unitati de masura), 
    //valoare ctr, valoare lunara ctr, Valuta, Curs Valutar, Modalitate Plata/Incasare, Interval facturare, Interval facturare(saptamanal, lunar,trimestrial,semestrail,bilunar,anual,etape), 
    //detalii
    //Cantitate facturata, Zi factura, 
    //Nr zile scadente, Procent penalitate pe zi, Scadentar - Import - Generare / Facturi - Import Adaugare template, prel automata cc ch
    //nr ctr alg automat - bifa - id - sau o tabela aux
    // milestone de facturare
    //scrisoare garantie bncara - valoare , nr ,data ,  observatii


    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item")
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItems(item)
            })
    }

    useEffect(() => {
        fetchItemsData()
    }, [])

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">


                    <Button label="Adauga" icon="pi pi-external-link" onClick={() => setfinancialVisible(true)} />


                    <DataTable className='pt-2' value={item2} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="code" header="Code"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="valoare" header="valoare"></Column>
                        <Column field="interval" header="interval"></Column>
                    </DataTable>


                    <Dialog header="Detalii Financiare" visible={financialVisible} maximizable style={{ width: '60vw' }} onHide={() => setfinancialVisible(false)}>
                        <div className="card">
                            <div className="grid">
                                <div className="col-3">
                                    <div className="field col-12 md:col-3">
                                        <label htmlFor="item">Obiect de contract</label>
                                        <Dropdown id="item" filter value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>
                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="ent_email">Email Responsabil</label>
                                        <InputText disabled id="ent_email" type="text" />
                                    </div>
                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="ent_phone">Telefon Responsabil</label>
                                        <InputText disabled id="ent_phone" keyfilter="int" type="text" />
                                    </div>
                                    <div className="field-checkbox col-12 md:col-3">
                                        <Checkbox id="default" checked={true}></Checkbox>
                                        <label htmlFor="default" className="ml-2">Reprezentant Legal</label>
                                    </div>
                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="ent_legal_person">Banca</label>
                                        <InputText disabled id="ent_legal_person" type="text" />
                                    </div>
                                </div>

                                <div className="col-3">
                                    <div className="field col-12 md:col-3">
                                        <label htmlFor="item">Obiect de contract</label>
                                        <Dropdown id="item" filter value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>
                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="ent_email">Email Responsabil</label>
                                        <InputText disabled id="ent_email" type="text" />
                                    </div>
                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="ent_phone">Telefon Responsabil</label>
                                        <InputText disabled id="ent_phone" keyfilter="int" type="text" />
                                    </div>
                                    <div className="field-checkbox col-12 md:col-3">
                                        <Checkbox id="default" checked={true}></Checkbox>
                                        <label htmlFor="default" className="ml-2">Reprezentant Legal</label>
                                    </div>
                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="ent_legal_person">Banca</label>
                                        <InputText disabled id="ent_legal_person" type="text" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}