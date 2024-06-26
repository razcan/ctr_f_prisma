'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';

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
// import "react-quill/dist/quill.snow.css";
import { Tag } from 'primereact/tag';
import { Slider } from 'primereact/slider';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import Link from 'next/link';

export default function Alerts() {

    const [fields, setFields] = useState([]);

    const [AvailableOrderList, setAvailableOrderList] = useState([]);
    const [AvailableFieldList, setAvailableFieldList] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [order, setOrder] = useState('');
    const existingorder: any[] = [];
    const existingfields: any[] = [];
    const [isAdmin, setIsAdmin] = useState(0);
    const toast = useRef<any>(null);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();
    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);

    const router = useRouter()

    const showInfo = () => {
        toast.current.show({
            severity: 'info', summary: 'Detalii Campuri',
            detail: 'Campurile ce contin in denumire Int sunt de tip numar(ex: 5), cele ce contin String, sunt de tip text(ex: "numar act" iar cele ce contin Date, sunt de tip Data(ex: 2024-01-04))', life: 5000
        });
    }


    const checkUserRole = () => {
        const session = localStorage.getItem('token');

        if (!session) {
            router.push('/');
            return false;
        }

        try {
            const jwtToken = JSON.parse(session);
            const roles = jwtToken.roles;
            if (!roles || !Array.isArray(roles)) {
                router.push('/');
                return false;
            }
            return roles.includes('Administrator');
        } catch (error) {
            router.push('/');
            console.error('Error parsing token:', error);
            return false;
        }
    }


    const showError = () => {
        router.push(`${Frontend_BASE_URL}/auth/access`);
    }


    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`);
        } else {
            const ck = checkUserRole();
            if (!ck) {
                showError();
            }
        }

        setBreadCrumbItems(
            [{
                label: 'Home',
                template: () => <Link href="/">Home</Link>
            },
            {
                label: 'Informatii dinamice',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/dynamicInfo`
                    return (
                        <Link href={url}>Informatii dinamice</Link>
                    )

                }
            }]
        );

    }, [])


    const allFields = [
        { name: 'dffInt1', type: 'Int' },
        { name: 'dffInt2', type: 'Int' },
        { name: 'dffInt3', type: 'Int' },
        { name: 'dffInt4', type: 'Int' },
        { name: 'dffString1', type: 'String' },
        { name: 'dffString2', type: 'String' },
        { name: 'dffString3', type: 'String' },
        { name: 'dffString4', type: 'String' },
        { name: 'dffDate1', type: 'Date' },
        { name: 'dffDate2', type: 'Date' }
    ];


    // const allTypes = [
    //     { name: 'Numar' },
    //     { name: 'Text' },
    //     { name: 'Data' }
    // ];

    const orderList = [
        { name: 1 },
        { name: 2 },
        { name: 3 },
        { name: 4 },
        { name: 5 },
        { name: 6 },
        { name: 7 },
        { name: 8 },
        { name: 9 },
        { name: 10 }
    ];


    const addDynamicField = async () => {

        fields.map(field => {
            existingorder.push(field.fieldorder)
        })

        const availableOrderList: ((prevState: never[]) => never[]) | number[] = []
        orderList.map(av => {
            const x = existingorder.includes(av.name)
            if (!x) {
                const add = { name: av.name }
                availableOrderList.push(add);
            }
            setAvailableOrderList(availableOrderList)
        }
        )

        fields.map(field => {
            existingfields.push(field.fieldname)
        })


        const availableFieldsList: ((prevState: never[]) => never[]) | number[] = []

        allFields.map(av => {
            const x = existingfields.includes(av.name)
            if (!x) {
                const add = { name: av.name, type: av.type }
                availableFieldsList.push(add);
            }
            setAvailableFieldList(availableFieldsList)

        }
        )
        setVisible(true)
    }

    const fetchDynamicFields = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/dynamicfield`).then(res => res.json())
        setFields(response);

    }


    useEffect(() => {
        fetchDynamicFields()


    }, [])


    const saveInfo = async () => {
        // console.log(name, type, selectedField, order)

        interface Fields {
            fieldlabel: String,
            fieldorder: String,
            fieldname: String,
            fieldtype: String
        }

        let ToAdd: Fields = {
            fieldlabel: name,
            fieldorder: order.name,
            fieldname: selectedField.name,
            fieldtype: selectedField.type
        }



        try {
            const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/dynamicfield`,
                ToAdd
            );
            console.log('Field edited:', response.data);
            fetchDynamicFields();
            setVisible(false)
        } catch (error) {
            console.error('Error editing field:', error);
        }
    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <Toast ref={toast} />
                    <Button label="Adauga" onClick={addDynamicField} />

                    <DataTable value={fields} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="fieldname" header="Denumire Tehnica Camp"></Column>
                        <Column field="fieldlabel" header="Nume camp"></Column>
                        <Column field="fieldorder" header="Ordine"></Column>
                    </DataTable>

                    <Dialog header="Configureaza Informatii Dinamice" maximizable visible={visible} style={{ width: '40vw' }} onHide={() => setVisible(false)}>
                        <div className='card'>
                            <div className="grid">
                                <div className="col-12">
                                    <div className="p-fluid formgrid grid pt-2">

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="nume">Denumire Camp Aplicatie</label>
                                            <InputText id="nume" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>

                                        {/* <div className="field col-12 md:col-12">
                                            <label htmlFor="type">Tip date</label>
                                            <Dropdown id="type" filter showClear
                                                value={type} onChange={(e) => setType(e.value)}
                                                options={allTypes} optionLabel="name"
                                                placeholder="Select One"></Dropdown>
                                        </div> */}

                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="type">Denumire Camp Tehnic</label>
                                            <Dropdown id="type" filter showClear
                                                value={selectedField} onChange={(e) => setSelectedField(e.value)}
                                                options={AvailableFieldList} optionLabel="name"
                                                placeholder="Select One"></Dropdown>
                                            <Button label="Info" severity="info" text raised onClick={showInfo} />
                                        </div>



                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="type">Ordine</label>
                                            <Dropdown id="type" filter showClear
                                                value={order} onChange={(e) => setOrder(e.value)}
                                                options={AvailableOrderList} optionLabel="name"
                                                placeholder="Select One"></Dropdown>
                                        </div>


                                    </div>
                                </div>

                            </div>
                            <Button label="Salveaza" onClick={saveInfo} />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div >
    );
}