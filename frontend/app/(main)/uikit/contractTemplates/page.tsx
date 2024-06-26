'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
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
// import ReactQuill, { Quill } from 'react-quill';
// import "react-quill/dist/quill.snow.css";
// import 'primeflex/primeflex.scss';
import "../../../../node_modules/primeflex/primeflex.scss"
import { Tag } from 'primereact/tag';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import Link from 'next/link';


export default function Alerts() {

    const router = useRouter()
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [text, setText] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState([]);
    const [type, setType] = useState();
    const [contractType, setContractType] = useState([]);
    const [templates, setTemplates] = useState([]);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();
    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);

    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`);
        }
        setBreadCrumbItems(
            [{
                label: 'Home',
                template: () => <Link href="/">Home</Link>
            },
            {
                label: 'Modele Contracte',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/contractTemplates`
                    return (
                        <Link href={url}>Modele Contracte</Link>
                    )

                }
            }]
        );

    }, [])


    const placeholders = [
        {
            name: 'ContractNumber',
        },
        {
            name: 'SignDate',
        },
        {
            name: 'StartDate',
        },
        {
            name: 'FinalDate',
        },
        {
            name: 'PartnerName',
        },
        {
            name: 'EntityName',
        },
        {
            name: 'ShortDescription',
        },
        {
            name: 'PartnerAddress',
        },
        {
            name: 'PartnerStreet',
        },
        {
            name: 'PartnerCity',
        },
        {
            name: 'PartnerCounty',
        },
        {
            name: 'PartnerCountry',
        },
        {
            name: 'PartnerBank',
        },
        {
            name: 'PartnerBranch',
        },
        {
            name: 'PartnerIban',
        },
        {
            name: 'PartnerCurrency',
        },
        {
            name: 'PartnerPerson',
        },
        {
            name: 'PartnerEmail',
        },
        {
            name: 'PartnerPhone',
        },
        {
            name: 'PartnerRole',
        },
        {
            name: 'EntityAddress',
        },
        {
            name: 'EntityStreet',
        },
        {
            name: 'EntityCity',
        },
        {
            name: 'EntityCounty',
        },
        {
            name: 'EntityCountry',
        },
        {
            name: 'EntityBranch',
        },
        {
            name: 'EntityIban',
        },
        {
            name: 'EntityCurrency',
        },
        {
            name: 'EntityPerson',
        },
        {
            name: 'EntityEmail',
        },
        {
            name: 'EntityPhone',
        },
        {
            name: 'EntityRole',
        },
        {
            name: 'Type',
        },
        {
            name: 'PartnerComercialReg',
        },
        {
            name: 'PartnerFiscalCode',
        },
        {
            name: 'EntityFiscalCode',
        },
        {
            name: 'EntityComercialReg',
        },
    ]

    const fetchTypeData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contracttype`)
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })
    }


    const fetchTemplatesData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contracttemplates`)
            .then(response => {
                return response.json()
            })
            .then(templates => {
                setTemplates(templates)
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

        const response = await axios.delete(`${Backend_BASE_URL}/nomenclatures/contracttemplates/${selectedTemplate.id}`);
        setVisible(false)
        setSelectedTemplate([])
        fetchTemplatesData()
    }


    const saveContracttemplate = async () => {

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
                const response = await axios.patch(`${Backend_BASE_URL}/nomenclatures/contracttemplates/${selectedTemplate.id}`,
                    template
                );

            }
            else {
                const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/contracttemplates`,
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
    const statusTemplate = (item) => {
        return <Tag value={item.active} severity={getSeverity(item)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item.active) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };

    //tabel - denumire template, tip contract, activ, id -- header
    //detalii - texteditor, lista placeholdere, salveaza, 

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div className="card">
                        <Button label="Adauga" onClick={addContracttemplate} />
                        {templates.length > 0 ?
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
                                <Column field="name" header="Denumire Model"></Column>
                                <Column field="contractType.name" header="Tip Contract(la care se aplica)"></Column>
                                {/* <Column field="active" header="Activa"></Column> */}
                                <Column field="active" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                            </DataTable>
                            : null}


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

                                            <DataTable value={placeholders} tableStyle={{ minWidth: '10vh' }}
                                                scrollable scrollHeight="40vh"
                                            >
                                                <Column field="name" header=""></Column>
                                            </DataTable>
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