'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import { Editor } from 'primereact/editor';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
// import 'primeflex/primeflex.scss';
import "../../../../node_modules/primeflex/primeflex.scss"

export default function Alerts() {

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [text, setText] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState([]);
    const [type, setType] = useState();
    const [contractType, setContractType] = useState([]);
    const [templates, setTemplates] = useState([]);

    const fetchTypeData = () => {
        fetch("http://localhost:3000/nomenclatures/contracttype")
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })
    }


    const fetchTemplatesData = () => {
        fetch("http://localhost:3000/nomenclatures/contracttemplates")
            .then(response => {
                console.log(response);
                return response.json()
            })
            .then(templates => {
                setTemplates(templates)
                console.log(templates)
            })
    }

    useEffect(() => {
        fetchTypeData(),
            fetchTemplatesData()
    }, [])

    const addContracttemplate = async () => {
        setVisible(true)
    }

    const deleteContracttemplate = async () => {

        const response = await axios.delete(`http://localhost:3000/nomenclatures/contracttemplates/${selectedTemplate.id}`);
        setVisible(false)
        setSelectedTemplate([])
        fetchTemplatesData()
    }


    const saveContracttemplate = async () => {

        console.log(selectedTemplate.id)

        interface ContractTemplate {
            name: String,
            active: Boolean,
            contractTypeId: Number,
            notes: String,
            content: String
        }

        let template: ContractTemplate = {
            name: name,
            active: isActive,
            contractTypeId: type ? type.id : null,
            notes: notes,
            content: text
        }

        try {

            if (selectedTemplate.id > 0) {
                console.log("se editeaza")
                const response = await axios.patch(`http://localhost:3000/nomenclatures/contracttemplates/${selectedTemplate.id}`,
                    template
                );

            }
            else {
                const response = await axios.post(`http://localhost:3000/nomenclatures/contracttemplates`,
                    template
                );
                console.log('Alert edited:', response.data);
            }


            setVisible(false)
            setSelectedTemplate([])
            fetchTemplatesData()

        } catch (error) {
            console.error('Error editing alert:', error);
        }
    }


    //tabel - denumire template, tip contract, activ, id -- header
    //detalii - texteditor, lista placeholdere, salveaza, 

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    Modele de Contract
                    <div className="card">
                        <Button label="Adauga" onClick={addContracttemplate} />
                        <DataTable className='pt-2'
                            value={templates}
                            tableStyle={{ minWidth: '50rem' }}
                            selectionMode="single"
                            selection={selectedTemplate}
                            onSelectionChange={(e) => {
                                setSelectedTemplate(e.value),
                                    setIsActive(e.value.active),
                                    setText(e.value.content),
                                    setName(e.value.name),
                                    setType(e.value.contractType)
                                setVisible(true)
                            }}>
                            {/* <Column hidden field="id" header="Id"></Column> */}
                            <Column field="id" header="Id"></Column>
                            <Column field="name" header="Denumire"></Column>
                            <Column field="contractType.name" header="Tip Contract"></Column>
                            <Column field="active" header="Activa"></Column>
                        </DataTable>
                    </div>

                    {/* <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} /> */}

                    <Dialog header="Configureaza Model Contract" maximizable visible={visible} style={{ width: '80vw' }} onHide={() => setVisible(false)}>
                        <div className='card'>
                            <div className="grid">
                                <div className="col-3">
                                    <div className="p-fluid formgrid grid pt-2">

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="nume">Nume</label>
                                            <InputText id="nume" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>

                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="type">Tip</label>
                                            <Dropdown id="type" filter showClear value={type} onChange={(e) => setType(e.value)} options={contractType} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <Checkbox id="active" onChange={e => setIsActive(e.checked)}
                                                checked={isActive}
                                            ></Checkbox>
                                            <label htmlFor="active" className="ml-2">Activ</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <label className="ml-2">Lista Placeholdere ce pot fi folosite in template Contract</label>
                                        </div>
                                        <div className="field-checkbox col-12 md:col-12">

                                            <InputTextarea value={"@@NumarContract, @@DataContract,@@DataFinal, @@Partener, @@Entitate, @@ScurtaDescriere"}
                                                rows={12} cols={60} style={{ height: '40vh' }} />
                                        </div>
                                    </div>
                                </div>



                                <div className="col-9">
                                    <div className="p-fluid formgrid grid pt-2">
                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="cashflow">Continut contract:</label>
                                            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)}
                                                className='min-w-full min-h-full'
                                                //  style={{ height: '486px' }}
                                                style={{ height: '60vh' }}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button label="Salveaza" onClick={saveContracttemplate} />
                            <Button label="Sterge" onClick={deleteContracttemplate} severity="danger" />
                        </div>

                    </Dialog>

                </div>
            </div>
        </div >
    );
}