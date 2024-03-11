'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import { Editor } from 'primereact/editor';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { Tag } from 'primereact/tag';



export default function Alerts() {

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [internal_emails, setInternal_emails] = useState('');
    const [nrofdays, setNrofdays] = useState();
    const [param, setParam] = useState('');
    const [isActivePartner, setIsActivePartner] = useState(false);
    const [isActivePerson, setIsActivePerson] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState([]);


    // const alerts = [
    //     { Denumire: "Expirare Contract", Recurenta: "30 de zile inainte de data finalizare", Subiect: "Va expira contractul", Activa: "True" },
    //     { Denumire: "Contract inchis inainte de termen", Recurenta: "In data inchiderii", Subiect: "A fost inchis contractul", Activa: "True" },
    //     { Denumire: "Modificare Contract", Recurenta: "In data nodificarii", Subiect: "Modificare Contract", Activa: "True" }
    // ]

    // const fetchContent = async () => {
    //     const response = await fetch(`http://localhost:3000/nomenclatures/executeAuditPartner/${4}`).then(res => res.json())
    //     //treb modificat pe id de ctr
    //     setLogs(response);
    // }

    const fetchAlertsData = () => {
        fetch("http://localhost:3000/alerts")
            .then(response => {
                // console.log(response);
                return response.json()
            })
            .then(alerts => {
                setAlerts(alerts)
            })
    }

    useEffect(() => {
        fetchAlertsData()
    }, [])


    //     setari alerte,
    //         alerte prestabilite in functie de data de expirare
    //             in ecranul de ctr, se vor vedea doar cand se vor transmite urmatoarele alerte prestabilite
    //             in ecranul de alerte, un buton de afisare trimise sau ce urmeaza a fi trimise
    //o lista de alerte predefinite
    // 9.meniu setari alerte(expira inainte cu n zile, s - a inchis inainte de termen, s - a schimbat resp ctr, nu a ajuns factura, modificat stare/ctr, facturi nesosite/emise)
    // de facut o tabela in care se genereaza toate alertele la nivel de contract ContractAlertSchedule( ContractId, AlertId,IsActive,Status, AlertDate, Subject, ScheduleDate( 2 days before... ) )
    //generarea de alerte la nivel de ctr se face prin serviciu

    const saveAlert = async () => {
        // console.log("Alerta:", name, isActive, subject, text, internal_emails, nrofdays, param, isActivePartner, isActivePerson)

        interface Alert {
            name: String,
            isActive: Boolean,
            subject: String,
            text: String,
            internal_emails: String,
            nrofdays: Number,
            param: String,
            isActivePartner: Boolean,
            isActivePerson: Boolean
        }

        let Alert: Alert = {
            name: name,
            isActive: isActive,
            subject: subject,
            text: text,
            internal_emails: internal_emails,
            nrofdays: nrofdays,
            param: param,
            isActivePartner: isActivePartner,
            isActivePerson: isActivePerson
        }

        try {
            const response = await axios.patch(`http://localhost:3000/alerts/${selectedAlert.id}`,
                Alert
            );
            setVisible(false)
            setSelectedAlert([])
            console.log('Alert edited:', response.data);
        } catch (error) {
            console.error('Error editing alert:', error);
        }
    }


    const statusTemplate = (item) => {
        return <Tag value={item.isActive} severity={getSeverity(item.isActive)}></Tag>;
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
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    Config  Alerte


                    <div className="card">
                        <DataTable value={alerts} tableStyle={{ minWidth: '50rem' }}
                            selectionMode="single" selection={selectedAlert} onSelectionChange={(e) => {
                                setSelectedAlert(e.value),
                                    setName(e.value.name), setIsActive(e.value.isActive), setSubject(e.value.subject), setText(e.value.text), setInternal_emails(e.value.internal_emails),
                                    setNrofdays(e.value.nrofdays), setParam(e.value.param), setIsActivePartner(e.value.isActivePartner), setIsActivePerson(e.value.isActivePerson),
                                    setVisible(true)
                            }}>
                            <Column hidden field="id" header="Id"></Column>
                            <Column field="name" header="Denumire"></Column>
                            <Column field="nrofdays" header="Recurenta(zile)"></Column>
                            <Column field="subject" header="Subiect"></Column>
                            <Column field="internal_emails" header="Catre"></Column>
                            <Column field="isActive" header="Activa" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                        </DataTable>
                    </div>

                    {/* <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} /> */}

                    <Dialog header="Configurare Alerta" visible={visible} style={{ width: '60vw' }} onHide={() => setVisible(false)}>
                        <div className='card'>
                            <div className="grid">
                                <div className="col-12">
                                    <div className="p-fluid formgrid grid pt-2">

                                        <div className="field col-12  md:col-6">
                                            <label htmlFor="nume">Nume</label>
                                            <InputText id="nume" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled />
                                            {/* va fi spre ex Expirare Contract  si nu poate fi modificata*/}
                                        </div>

                                        <div className="field col-12  md:col-6">
                                            <label htmlFor="Subiect">Subiect</label>
                                            <InputText id="Subiect" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="intern">Adrese email interne(separate cu ";")</label>
                                            <InputText id="intern" type="text" value={internal_emails} onChange={(e) => setInternal_emails(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="extern">Nr. Zile Inainte de Parametru</label>
                                            {/* <InputText id="extern" type="int" keyfilter="int" value={nrofdays} onChange={(e) => setNrofdays(e.target.value)} /> */}
                                            <InputNumber value={nrofdays} onValueChange={(e) => setNrofdays(e.value)} min={0} max={31} />
                                        </div>

                                        <div className="field col-12 md:col-3">
                                            <label className="font-bold block mb-2">
                                                Parametru
                                            </label>
                                            <InputText id="data" type="text" value={param} onChange={(e) => setParam(e.target.value)} disabled />
                                            {/* ca si la name va veni din db "Data Final Contract"  si nu poate fi modificata*/}
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <Checkbox id="active" onChange={e => setIsActive(e.checked)}
                                                checked={isActive}
                                            ></Checkbox>
                                            <label htmlFor="active" className="ml-2">Activa</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-3">
                                            <Checkbox id="activeforpartner" onChange={e => setIsActivePartner(e.checked)}
                                                checked={isActivePartner}
                                            ></Checkbox>
                                            <label htmlFor="active" className="ml-2">Trimite la adresa Partener</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-3">
                                            <Checkbox id="activeforperson" onChange={e => setIsActivePerson(e.checked)}
                                                checked={isActivePerson}
                                            ></Checkbox>
                                            <label htmlFor="active" className="ml-2">Trimite la adrese persoane de contact Partener</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-6">
                                            <InputTextarea value={"@@NumarContract, @@DataContract,@@DataFinal, @@Partener, @@Entitate, @@ScurtaDescriere"} rows={3} cols={60} />
                                            <label className="ml-2">Lista Placeholdere ce pot fi folosite in Continut Alerta</label>
                                        </div>

                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="cashflow">Continut alerta:</label>
                                            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)}
                                                className='max-w-screen' style={{ height: '160px' }}
                                            />
                                        </div>

                                    </div>
                                    <Button label="Salveaza" onClick={saveAlert} />
                                </div>
                            </div>
                        </div>
                    </Dialog>

                </div>
            </div>
        </div >
    );
}