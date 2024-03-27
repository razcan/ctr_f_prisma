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
import { Messages } from 'primereact/messages';

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
    const [selectedtaskName, setselectedTaskName] = useState('');
    const [selectednotes, setselectedNotes] = useState('');
    const [selectedstatus, setselectedStatus] = useState([]);
    const [selectedstatusDate, setselectedStatusDate] = useState(new Date());
    const [allStatus, setAllStatus] = useState([])
    const [selecteddue, setselectedDue] = useState(new Date());
    const [text, setText] = useState([]);
    const [sendNotifications, setSendNotifications] = useState(true);
    const [reminderNotifications, setReminderNotifications] = useState(true);
    const msgs = useRef(null);


    const handleProcedureContentChange = (content: any) => {
        setText(content);
    };

    const posibleFilters = [
        { name: 'Centru Cost' },
        { name: 'Departament' },
        { name: 'Categorie' },
        { name: 'Cashflow' }
    ];

    const toBeResolved = [
        { name: 'La o zi dupa start flux' },
        { name: 'La 2 zile dupa start flux' },
        { name: 'La 3 zile dupa start flux' },
        { name: 'La 4 zile dupa start flux' },
        { name: 'La 5 zile dupa start flux' },
    ];

    const reminders = [
        { name: 'La data limita' },
        { name: '1 zi inainte de data limita' },
        { name: '2 zile inainte de data limita' }
    ];


    const process_type = [
        { name: 'Paralel' },
        { name: 'Secvential' }
    ];

    const priorities = [
        { name: 'Normală' },
        { name: 'Foarte Importantă' },
        { name: 'Importanță Maximă' }
    ];

    const fetchTasksStatusData = () => {
        fetch("http://localhost:3000/nomenclatures/taskStatus")
            .then(response => {
                return response.json()
            })
            .then(allStatus => {
                setAllStatus(allStatus)
            })
    }

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
        fetchTasksStatusData()

    }, [])


    const modules = {
        toolbar: {
            container: [
                [{ font: [] }, { 'size': [] }, { 'header': [1, 2, 3, 4, 5, 6] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
                [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                ],
                [{ 'direction': 'rtl' }, { 'align': [] }],
                ['link', 'image', 'clean'],
            ],
        },
        clipboard: {
            matchVisual: true,
        },
    }

    const formats = [
        'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'header', 'blockquote', 'code-block',
        'indent', 'list',
        'direction', 'align',
        'link', 'image', 'video', 'formula',
    ];



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



    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };

    const addMessages = () => {
        msgs.current.show([
            { severity: 'info', summary: 'Info:', detail: 'O sa se trimita email catre toti', sticky: true, closable: true }
        ]);
    };

    return (
        <div className="grid">

            <div className="col-12">
                <Card title="Date generale">

                    <div className="grid">
                        <span className="p-float-label field col-3">
                            <InputText id="taskName" value={selectedtaskName} onChange={(e) => setselectedTaskName(e.target.value)} />
                            <label htmlFor="taskName">Denumire</label>
                        </span>

                        <span className="p-float-label field col-5">
                            <InputText id="taskName" value={selectedtaskName} onChange={(e) => setselectedTaskName(e.target.value)} />
                            <label htmlFor="taskName">Descriere</label>
                        </span>

                        <div className="flex align-items-center col-4">
                            <Checkbox inputId="notifications"
                                onChange={e => setSendNotifications(e.checked)}
                                checked={sendNotifications} />
                            <label htmlFor="ingredient1" className="ml-2">Activ</label>
                        </div>
                    </div>


                    {/* update pe campul stare contract , email , etc */}

                </Card>
            </div>


            <div className="col-12">
                <Card title="Reguli alocare">
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
                                    este egal cu
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
                                    // console.log(selectedProcessType)
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

            {/* update pe campul stare contract , email , etc */}
            {/* <div className="col-12">
                <Card title="Actiuni dupa aprobare">
                   

                </Card>
            </div> */}


            <div className="col-12">
                <Card title="Actiuni dupa respingere">

                    <div className="flex align-items-center col-12">
                        <Checkbox inputId="notifications"
                            onChange={e => setSendNotifications(e.checked)}
                            checked={sendNotifications} />
                        <label htmlFor="ingredient1" className="ml-2">Trimite notificari catre aprobatori</label>
                    </div>

                    <div className="flex align-items-center col-12 pb-6">
                        <Checkbox inputId="reminders"
                            onChange={e => setReminderNotifications(e.checked)}
                            checked={reminderNotifications} />
                        <label htmlFor="ingredient1" className="ml-2">Trimite notificari catre responsabil contract</label>
                    </div>

                    <Button type="button" onClick={addMessages} label="Info" className="mr-2" />
                    <Messages ref={msgs} />

                    {/* bifa - se trimite mail catre toti asignati sau doar unul 
                    se schimba statusul taskului in rejected
                    doar cei care au dreptul pot sa modifice status task in ???
                    motiv rejectare
                    */}
                </Card>
            </div>


            <div className="col-12">
                <Card title="Task">
                    <div className="grid">

                        <span className="p-float-label field col-12">
                            <InputText id="taskName" value={selectedtaskName} onChange={(e) => setselectedTaskName(e.target.value)} />
                            <label htmlFor="taskName">Titlu</label>
                        </span>

                        <div className="field col-12 pb-6">
                            <label className="ml-2">Descriere Task</label>
                            <br></br>
                            <ReactQuill
                                style={{ height: '10vw' }}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={text}
                                onChange={handleProcedureContentChange}
                            />
                        </div>
                        {/* <br></br> */}
                        {/* <Divider /> */}

                        <span className="p-float-label field col-3">
                            <Dropdown inputId="dd-city" value={selectedstatus} onChange={(e) => setselectedStatus(e.value)} options={toBeResolved} optionLabel="name" className="w-full" />
                            <label htmlFor="dd-city">De rezolvat</label>
                        </span>


                        <span className="p-float-label field col-3">
                            <Dropdown inputId="dd-city" value={selectedstatus} onChange={(e) => setselectedStatus(e.value)} options={priorities} optionLabel="name" className="w-full" />
                            <label htmlFor="dd-city">Prioritate</label>
                        </span>

                        <span className="p-float-label field col-3">
                            <Dropdown inputId="dd-city" value={selectedstatus} onChange={(e) => setselectedStatus(e.value)} options={allStatus} optionLabel="name" className="w-full" />
                            <label htmlFor="dd-city">Status</label>
                        </span>

                        <div className="flex align-items-center col-12">
                            <Checkbox inputId="notifications"
                                onChange={e => setSendNotifications(e.checked)}
                                checked={sendNotifications} />
                            <label htmlFor="ingredient1" className="ml-2">Trimite notificari</label>
                        </div>

                        <div className="flex align-items-center col-12 pb-6">
                            <Checkbox inputId="reminders"
                                onChange={e => setReminderNotifications(e.checked)}
                                checked={reminderNotifications} />
                            <label htmlFor="ingredient1" className="ml-2">Trimite reminder</label>
                        </div>

                        {reminderNotifications ?
                            <span className="p-float-label field col-3">
                                <Dropdown inputId="dd-city" value={selectedstatus} onChange={(e) => setselectedStatus(e.value)} options={reminders} optionLabel="name" className="w-full" />
                                <label htmlFor="dd-city">Reminder</label>
                            </span>
                            : null}

                        <Divider />

                        <div className="field col-1 md:col-2 ">
                            <Button label="Salveaza" />
                        </div>


                    </div>



                </Card>
            </div>


        </div >

    );
}