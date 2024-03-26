'use client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
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
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { ProgressBar } from 'primereact/progressbar';
import { Slider } from 'primereact/slider';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from "primereact/radiobutton";
import { PickList } from 'primereact/picklist';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

export default function Tasks() {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, postWithToken, GetUserTasks,
        userId, nrOfTasks, setNrOfTasks, patchWithToken } = useMyContext();

    const [users, setUsers] = useState([]);
    const router = useRouter();
    const [conditions, setConditions] = useState([]);
    const [arrLength, setArrLength] = useState(0);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [cashflows, setCashflow] = useState([]);
    const [costcenters, setCostCenter] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedCashflow, setSelectedCashflow] = useState([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState([]);
    const [approveInParalel, setApproveInParalel] = useState(true);
    const [selUsers, setSelUsers] = useState([]);
    const [selectedProcessType, setSelectedProcessType] = useState('');

    const posibleFilters = [
        { name: 'Centru Cost' },
        { name: 'Departament' },
        { name: 'Categorie' },
        { name: 'Cashflow' }
    ];



    const process_type = [
        { name: 'Paralel' },
        { name: 'Secvential' }
    ];

    const priorities = [
        { name: 'Importanță Maximă' },
        { name: 'Foarte Importantă' },
        { name: 'Normală' }
    ];

    const fetchCategoriesData = () => {
        fetch("http://localhost:3000/contracts/category")
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })
    }

    const fetchCashFlow = () => {
        fetch("http://localhost:3000/contracts/cashflownom")
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchCostCenter = () => {
        fetch("http://localhost:3000/contracts/costcenter")
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }

    const fetchDepartmentsData = () => {
        fetch("http://localhost:3000/contracts/department")
            .then(response => {
                return response.json()
            })
            .then(departments => {
                setDepartments(departments)
            })
    }

    useEffect(() => {
        fetchCategoriesData()
        fetchDepartmentsData()
        fetchCostCenter()
        fetchCashFlow()

    }, [])


    const getSourceName = (name) => {
        if (name == 'Departament') {
            return { name: 'departments' }
        }
        else if (name == 'Centru Cost') {
            return { name: 'costcenters' }
        }
        else if (name == 'Cashflow') {
            return { name: 'cashflows' }
        }
        else if (name == 'Categorie') {
            return { name: 'categories' }
        }
        else
            return { name: 'categories' }

    }


    const addConditions = () => {
        setConditions(
            [...conditions,
            {
                filter: null,
                filterValue: null,
                source: { name: '' }
            }]
        )

        setArrLength(conditions.length)
    }


    const handleDropdown1Change = (index, value) => {
        const newFormData = [...conditions];
        newFormData[index].filter = value;
        const sursa = getSourceName(value.name);
        if (sursa === undefined) {
            newFormData[index].source = ''
        }
        else {
            newFormData[index].source = sursa;
        }
        setConditions(newFormData);
    };


    const handleDropdown2Change = (index, value) => {
        const newFormData = [...conditions];
        newFormData[index].filterValue = value;
        setConditions(newFormData);
    };

    const removeField = (index) => {
        const newFormData = conditions.filter((_, i) => i !== index);
        setConditions(newFormData);
        setArrLength(arrLength - 1)
    };


    const getSourceOptions = (sourceName) => {
        switch (sourceName) {
            case 'categories':
                return categories;
            case 'costcenters':
                return costcenters;
            case 'cashflows':
                return cashflows;
            case 'departments':
                return departments;
            default:
                return [];
        }
    };



    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);


    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.name}</span>
                </div>
            </div>
        );
    };




    const fetchUsers = async () => {
        try {
            const data = await fetchWithToken('nomenclatures/susers', { method: 'GET' });
            setUsers(data)

        } catch (error) {
            if (error.message === 'No token found.') {
                router.push(`${Backend_BASE_URL}/auth/login`);
            } else {
                console.error(error.message);
            }
        }
    };


    //trebuie adusi utilizatorii in loc de persoane, in functie de entitatea cu care suntem logati

    useEffect(() => {
        fetchUsers()
    }, [])


    const StatusDateTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.statusDate);
        return <span>{formattedDate}</span>;
    };

    const DueDateTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.due);
        return <span>{formattedDate}</span>;
    };

    const CreatedDateTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.createdAt);
        return <span>{formattedDate}</span>;
    };

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };

    return (
        <div className="grid">

            <div className="col-12">
                <Card title="Seteaza conditii">
                    {conditions.length === 0 ?
                        <Button label="Adauga" icon="pi pi-plus" onClick={addConditions} />
                        : null
                    }

                    {conditions.map((field, index) => (
                        <div key={index} >

                            <div className="grid">
                                <div className="col-1 pt-4">
                                    Daca
                                </div>
                                <div className="col-2">
                                    <Dropdown
                                        value={field.filter}
                                        onChange={(e) => {
                                            handleDropdown1Change(index, e.value)
                                        }}
                                        options={posibleFilters}
                                        optionLabel="name"
                                        placeholder="Selecteaza conditie"
                                        className="w-full md:w-14rem"
                                    // className="w-full md:w-24rem"
                                    />

                                </div>
                                <div className="col-3 pt-4 pl-8 pr-4">
                                    este egla cu
                                </div>
                                <div className="col-3">
                                    <Dropdown id="value"
                                        filter showClear
                                        value={field.filterValue}
                                        onChange={(e) => {
                                            handleDropdown2Change(index, e.value)
                                        }}
                                        options={getSourceOptions(field.source.name)}
                                        optionLabel="name"
                                        className="w-full md:w-14rem"
                                        placeholder="Select One">
                                    </Dropdown>
                                </div>
                                <div className="col-2">
                                    {/* <Button icon="pi pi-minus" severity="danger" onClick={() => removeField(index)} /> */}
                                    <Button icon="pi pi-minus" rounded text severity="danger" onClick={() => removeField(index)} aria-label="Sterge" />

                                    {index == arrLength ?
                                        <Button icon="pi pi-plus" rounded text severity="success" onClick={addConditions} aria-label="Adauga" />
                                        : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            <div className="col-12">
                <Card title="Asignat">


                    <div className="field col-12 md:col-3">
                        <label htmlFor="">Asignat catre</label>
                        <MultiSelect value={selUsers} onChange={(e) => {
                            setSelUsers(e.value)
                            setSource(e.value)
                            // console.log(e.value)
                        }}
                            options={users} optionLabel="name"
                            display="chip"
                            placeholder="Utilizator" maxSelectedLabels={5} />
                    </div>
                    <Divider />
                    <div className="flex flex-wrap gap-3">

                        <div>Trebuie aprobat de:</div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="anyone" name="anyone" value={false} onChange={(e) => setApproveInParalel(e.value)} checked={approveInParalel === false} />
                            <label htmlFor="anyone" className="ml-2">Oricine</label>
                        </div>

                        <div className="flex align-items-center">
                            <RadioButton inputId="everyone" name="everyone" value={true} onChange={(e) => setApproveInParalel(e.value)} checked={approveInParalel === true} />
                            <label htmlFor="everyone" className="ml-2">Toti</label>
                        </div>
                    </div>
                    <Divider />

                    {approveInParalel ?
                        <div>
                            <label htmlFor="anyone">Tip aprobare:</label>
                            <Dropdown value={selectedProcessType}
                                onChange={(e) => {
                                    setSelectedProcessType(e.value)
                                    console.log(selectedProcessType)
                                }
                                }
                                options={process_type} optionLabel="name"
                                placeholder="Tip aprobare" className="w-full md:w-14rem" />
                        </div>
                        : null}
                    <Divider />

                    {selectedProcessType.name == 'Secvential' ?
                        <div className="field col-6">
                            <div>Ordinea in care trebuie aprobat</div>
                            <br></br>
                            <PickList dataKey="id" source={source} target={target}
                                onChange={onChange} itemTemplate={itemTemplate}
                                // breakpoint="1280px"
                                sourceHeader="Disponibil" targetHeader="Ordinea"
                                sourceStyle={{ height: '10%' }}
                                targetStyle={{ height: '10%' }} />
                        </div>
                        : null}

                </Card>
            </div>

            <div className="col-12">
                <Card title="Rejectat">
                    <Button label="Adauga flux aprobare" />
                </Card>
            </div>


            <div className="col-12">
                <Card title="Actiune">
                    <Button label="Adauga flux aprobare" />
                </Card>
            </div>


        </div >

    );
}