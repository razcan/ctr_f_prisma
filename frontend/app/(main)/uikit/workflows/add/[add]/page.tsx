'use client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Toast } from 'primereact/toast';
import axios from 'axios';
// import ReactQuill, { Quill } from 'react-quill';
// import "react-quill/dist/quill.snow.css";
import { MyContext, MyProvider } from '../../../../../../layout/context/myUserContext'
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Messages } from 'primereact/messages';
import { Tag } from 'primereact/tag';
import { Editor } from 'primereact/editor';

export default function Tasks() {

    const toast = useRef(null);
    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, postWithToken, GetUserTasks,
        userId, nrOfTasks, setNrOfTasks, patchWithToken } = useMyContext();

    const [users, setUsers] = useState([]);
    const router = useRouter();

    const [arrLength, setArrLength] = useState(0);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [cashflows, setCashflow] = useState([]);
    const [costcenters, setCostCenter] = useState([]);
    const [selUsers, setSelUsers] = useState([]);
    const [allStatus, setAllStatus] = useState([])
    const [final_users, setfinal_users] = useState([])
    const [arrUserLength, setUserArrLength] = useState(0);

    const msgs = useRef(null);
    const [wfname, setwfname] = useState('');
    const [wfdescription, setwfdescription] = useState('');
    const [isActive, setIsActive] = useState(false);
    // const [approveInParalel, setApproveInParalel] = useState(false);
    // const [approveAll, setApproveAll] = useState(true);
    const [sendNotifications, setSendNotifications] = useState(true);
    const [reminderNotifications, setReminderNotifications] = useState(true);
    const [selectedtaskName, setselectedTaskName] = useState('');
    const [selectedDueDate, setSelectedDueDate] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState([]);
    const [selectedReminder, setSelectedReminder] = useState([]);
    const [text, setText] = useState('');
    const [priority, setPriority] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [duedates, setDuedates] = useState([]);
    const [stepName, setStepName] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const [conditions, setConditions] = useState([]);
    const [selectedTaskUsers, setSelectedTaskUsers] = useState([]);



    const handleProcedureContentChange = (content: any) => {
        setText(content);
    };

    const posibleFilters = [
        { name: 'Centru Cost' },
        { name: 'Departament' },
        { name: 'Categorie' },
        { name: 'Cashflow' }
    ];

    const fetchTasksStatusData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/taskStatus`)
            .then(response => {
                return response.json()
            })
            .then(allStatus => {
                setAllStatus(allStatus)
            })
    }

    const fetchPriority = () => {
        fetch(`${Backend_BASE_URL}/contracts/priority`)
            .then(response => {
                return response.json()
            })
            .then(priority => {
                setPriority(priority)
            })
    }


    const fetchReminders = () => {
        fetch(`${Backend_BASE_URL}/contracts/reminders`)
            .then(response => {
                return response.json()
            })
            .then(reminders => {
                setReminders(reminders)
            })
    }

    const fetchDueDates = () => {
        fetch(`${Backend_BASE_URL}/contracts/duedates`)
            .then(response => {
                return response.json()
            })
            .then(duedates => {
                setDuedates(duedates)
            })
    }

    const fetchCategoriesData = () => {
        fetch(`${Backend_BASE_URL}/contracts/category`)
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })
    }

    const fetchCashFlow = () => {
        fetch(`${Backend_BASE_URL}/contracts/cashflownom`)
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchCostCenter = () => {
        fetch(`${Backend_BASE_URL}/contracts/costcenter`)
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }

    const fetchDepartmentsData = () => {
        fetch(`${Backend_BASE_URL}/contracts/department`)
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
        fetchPriority()
        fetchReminders()
        fetchDueDates()

    }, [])

    useEffect(() => {

    }, [final_users])



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

    const addFlowUsers = () => {
        setSelectedTaskUsers(
            [...selectedTaskUsers, {
                Index: null,
                UserId: { id: 0, name: '', email: '', status: true },
                StepName: null
            }]
        )
    }

    const handleDropDownStepUsers = async (index, value) => {
        setSelUsers(value);
        // console.log(index, value);

        const to_add = [...final_users, {
            Index: index,
            UserId: { id: value.id, name: value.name, email: value.email, status: true }
        }];

        selectedTaskUsers[index].Index = index
        selectedTaskUsers[index].UserId = { id: value.id, name: value.name, email: value.email, status: true }
        setfinal_users(to_add);
        // console.log(final_users);
    };

    const handleStepUsers = async (index, value) => {

        // const to_add = [...stepName, {
        //     StepName: value
        // }];
        selectedTaskUsers[index].StepName = value

        // setStepName(to_add);
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

    const removeUser = (index) => {
        const newFormData = selectedTaskUsers.filter((_, i) => i !== index);
        setSelectedTaskUsers(newFormData);
        setUserArrLength(arrUserLength - 1)
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

    //status wf - requested, approved, finalized


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

    useEffect(() => {
        fetchUsers()
    }, [])

    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];


        if (!fields[0].wfName || fields[0].wfName.trim() === '') {
            errors.push("Trebuie sa setati un nume de flux!");
        }

        if (fields[1].length == 0) {
            errors.push("Trebuie sa setati minim o regula de alocare automata!");
        }

        if (fields[3].target.length == 0) {
            errors.push("Trebuie sa setati minim un utilizator!");
        }

        if (!fields[2].taskDueDateId) {
            errors.push("Trebuie sa setati data pana la care trebuie rezolvat task-ul!");
        }

        if (!fields[2].taskReminderId) {
            errors.push("Trebuie sa setati data la care trebuie trimis un reminder!");
        }

        if (!fields[2].taskPriorityId) {
            errors.push("Trebuie sa setati prioritatea task-ului!");
        }

        if (!fields[2].taskName) {
            errors.push("Trebuie sa setati denumirea task-ului!");
        }

        if (!fields[2].taskNotes) {
            errors.push("Trebuie sa setati continutul task-ului!");
        }

        // console.log(errors)

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }

    const addMessages = () => {
        msgs.current.show([
            { severity: 'info', summary: 'Info:', detail: 'O sa se trimita email catre toti', sticky: true, closable: true }
        ]);
    };


    const showWarn = (detail) => {
        toast.current.show({
            severity: 'warn', summary: 'Atentie',
            detail: detail, life: 3000
        });
    }


    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };


    const saveWF = async () => {

        interface wf {
            "wfName": String,
            "wfDescription": String,
            "status": Boolean
        }

        const wfg: wf = {
            wfName: wfname,
            wfDescription: wfdescription,
            status: isActive
        }

        interface wfr {
            "workflowId": number,
            "ruleFilterName": string,
            "ruleFilterSource": string,
            "ruleFilterValue": number,
            "ruleFilterValueName": string
        }

        const rules: wfr[] = []
        conditions.map(condition => {
            const add = {
                workflowId: 0,
                ruleFilterName: condition.filter.name,
                ruleFilterSource: condition.source.name,
                ruleFilterValue: parseInt(condition.filterValue.id),
                ruleFilterValueName: condition.filterValue.name
            }
            rules.push(add)
        })
        const wff: any[] = [];

        interface wfts {
            workflowId: number,
            taskName: string,
            taskDueDateId: number | never[],
            taskNotes: string,
            taskSendNotifications: Boolean,
            taskSendReminders: Boolean,
            taskReminderId: number | never[],
            taskPriorityId: number | never[]
        }
        const wftsf: wfts = {
            workflowId: 0,
            taskName: selectedtaskName,
            taskDueDateId: selectedDueDate ? selectedDueDate.id : 1,
            taskNotes: text,
            taskSendNotifications: sendNotifications,
            taskSendReminders: reminderNotifications,
            taskReminderId: selectedReminder.id,
            taskPriorityId: selectedPriority ? selectedPriority.id : 1
        }

        interface wftstu {
            workflowTaskSettingsId: number,
            target: number[],
        }


        const wftstuf: wftstu = {
            workflowTaskSettingsId: 0,
            target: target.length > 0 ? target : selectedTaskUsers
            // selUsers
        }

        wff.push(wfg)
        wff.push(rules)
        wff.push(wftsf)
        wff.push(wftstuf)


        const validationResult = validateForm(wff);

        if (!validationResult.isValid) {
            // console.log("Validation failed. Errors:");
            // console.log(validationResult.errors);
            showWarn(validationResult.errors)
        } else {

            // console.log("Validation passed.");

            const response = await axios.post(`${Backend_BASE_URL}/contracts/workflow`,
                wff
            );

            if (response.status == 200 || response.status == 201) {
                showMessage('success', 'Salvat cu succes!', 'Ok');

                router.push(`${Frontend_BASE_URL}/uikit/workflows/edit/edit?Id=${response.data.id}`);
            }
            else {
                showMessage('error', 'Eroare', response.statusText)
            }
        }
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Card className='border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all' title="Date generale">
                    <Toast ref={toast} />
                    <div className="grid">

                        {/* <div className="flex flex-wrap column-gap-1 row-gap-2"> */}
                        <div className="field col-4">
                            <span className="p-float-label">
                                <InputText id="taskName" value={wfname}
                                    onChange={(e) => setwfname(e.target.value)}
                                    className="w-full" />
                                <label htmlFor="taskName">Denumire</label>
                            </span>
                        </div>

                        <span className="p-float-label field col-4">
                            <InputText id="taskName" value={wfdescription}
                                onChange={(e) => setwfdescription(e.target.value)}
                                className="w-full" />
                            <label htmlFor="taskName">Descriere</label>
                        </span>

                        <div className="flex align-items-center col-2">
                            <Checkbox inputId="notifications"
                                onChange={e => setIsActive(e.checked)}
                                checked={isActive} />
                            <label htmlFor="ingredient1" className="ml-2">Activ</label>
                        </div>
                        {/* </div> */}
                    </div>
                    {/* update pe campul stare contract , email , etc */}

                </Card>
            </div>

            <div className="col-12">
                <Card className='border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all' title="Reguli alocare">
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

                                            handleDropdown1Change(index, e.value);
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
                <Card className='border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all' title="Asignat">

                    {selectedTaskUsers.length === 0 ?
                        <Button label="Adauga" icon="pi pi-plus" onClick={addFlowUsers} />
                        : null
                    }


                    {selectedTaskUsers.map((field, index) => {
                        // console.log(field.UserId)
                        return (
                            // console.log(field)
                            <div className="grid" >

                                <div className="field col-1 md:col-1 p-2">

                                    <Tag style={{ fontSize: 16 }} value={index + 1}></Tag>
                                </div>

                                <div className="field col-12 md:col-3 p-2" key={index} >

                                    <Dropdown id="user"
                                        value={field.UserId}
                                        onChange={(e) => {
                                            handleDropDownStepUsers(index, e.value);
                                        }}
                                        className="w-full"
                                        options={users}
                                        optionLabel="name"
                                        placeholder="Utilizator" />
                                </div>

                                <div className="flex flex-column field col-12 md:col-4 p-2">
                                    <InputText

                                        value={field.StepName}
                                        onChange={(e) => handleStepUsers(index, e.target.value)}
                                        placeholder="Denumire Pas Flux"
                                        id="stepName"
                                    />
                                </div>

                                <div className=" field col-12 md:col-2">
                                    <Button icon="pi pi-plus" rounded text severity="success"
                                        onClick={addFlowUsers} aria-label="Adauga" />
                                    <Button icon="pi pi-minus" rounded text severity="danger"
                                        onClick={() => removeUser(index)} aria-label="Sterge" />
                                </div>

                                <Divider />
                            </div>


                        )
                    }
                    )
                    }

                </Card>
            </div >

            {/* update pe campul stare contract , email , etc */}
            {/* <div className="col-12">
                <Card title="Actiuni dupa aprobare">
                   

                </Card>
            </div> */}


            <div className="col-12">
                <Card className='border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all' title="Actiuni dupa respingere">

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
                <Card className='border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all' title="Task">
                    <div className="grid">

                        <span className="p-float-label field col-3">
                            <InputText id="taskName" value={selectedtaskName}
                                onChange={(e) => setselectedTaskName(e.target.value)}
                                className="w-full" />
                            <label htmlFor="taskName">Titlu</label>
                        </span>

                        <span className="p-float-label field col-3">
                            <Dropdown inputId="dd-city" value={selectedDueDate}
                                onChange={(e) => setSelectedDueDate(e.value)}
                                options={duedates} optionLabel="name" className="w-full" />
                            <label htmlFor="dd-city">De rezolvat</label>
                        </span>


                        <span className="p-float-label field col-3">
                            <Dropdown inputId="dd-city" value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.value)}
                                options={priority} optionLabel="name" className="w-full" />
                            <label htmlFor="dd-city">Prioritate</label>
                        </span>



                        <div className="field col-12 pb-6">
                            <label className="ml-2">Descriere Task</label>
                            <br></br>
                            {/* <ReactQuill
                                style={{ height: '10vw' }}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={text}
                                onChange={handleProcedureContentChange}
                            /> */}
                            <Editor value={text}
                                key={refreshKey}
                                style={{ height: '10vw' }}
                                onTextChange={(e) => setText(e.htmlValue)}
                            />
                        </div>


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
                                <Dropdown inputId="dd-city" value={selectedReminder} onChange={(e) => setSelectedReminder(e.value)} options={reminders} optionLabel="name" className="w-full" />
                                <label htmlFor="dd-city">Reminder</label>
                            </span>
                            : null}

                        <Divider />

                        <div className="field col-1 md:col-2 ">
                            <Button label="Salveaza" onClick={saveWF} />
                        </div>

                    </div>

                </Card>
            </div>


        </div >

    );
}

