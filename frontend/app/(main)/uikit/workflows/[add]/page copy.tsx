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


export default function Tasks() {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, postWithToken, GetUserTasks,
        userId, nrOfTasks, setNrOfTasks, patchWithToken } = useMyContext();


    const router = useRouter();
    const searchParams = useSearchParams()

    const [visible, setVisible] = useState(false);

    const [taskName, setTaskName] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState([]);
    const [statusDate, setStatusDate] = useState(new Date());
    const [requestor, setRequestor] = useState(0);
    const [assigned, setAssigned] = useState(0);
    const [due, setDue] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [taskId, setTaskId] = useState('');

    const [selUsers, setSelUsers] = useState([]);
    const [selectedtaskName, setselectedTaskName] = useState('');
    const [selectedprogress, setselectedProgress] = useState(0);
    const [selectedstatus, setselectedStatus] = useState([]);
    const [selectedstatusDate, setselectedStatusDate] = useState(new Date());
    const [selectedrequestor, setselectedRequestor] = useState();
    const [selectedassigned, setselectedAssigned] = useState();
    const [selecteddue, setselectedDue] = useState(new Date());
    const [selectednotes, setselectedNotes] = useState('');
    const [selectedtaskId, setselectedtaskId] = useState('');

    const [tasks, setTasks] = useState([]);
    const [persons, setPersons] = useState([]);
    const [selectedTask, setselectedTask] = useState();
    const [allStatus, setAllStatus] = useState([])

    const [users, setUsers] = useState([]);

    const [approveInParalel, setApproveInParalel] = useState(true);

    const [selectedProcessType, setSelectedProcessType] = useState(null);

    const process_type = [
        { name: 'Parallel' },
        { name: 'Sequential' }
    ];

    const priorities = [
        { name: 'Importanță Maximă' },
        { name: 'Foarte Importantă' },
        { name: 'Normală' }
    ];


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


    // const getRequestor = (id: number) => {
    //     return users.find((obj) => obj.id === id);
    // };

    // const getStatusJson = (id: InputNumber) => {
    //     return allStatus.find((obj) => obj.id === id);
    // };


    const fetchTasksStatusData = () => {
        fetch("http://localhost:3000/nomenclatures/taskStatus")
            .then(response => {
                return response.json()
            })
            .then(allStatus => {
                setAllStatus(allStatus)
            })
    }


    const fetchUsers = async () => {
        try {
            const data = await fetchWithToken('nomenclatures/susers', { method: 'GET' });
            setUsers(data)

            console.log(data)

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

        fetchTasksStatusData(),
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


    console.log(approveInParalel);
    console.log(target)

    return (

        //pentru criteriu selectat. prima parte din flux, sunt afisate 4 coloane cu :
        //nume camp - cashflow,categorie,etc, 2 - semnul =><, valoare camp selectat la 1 cashflow line,
        // si o icoana de adauga sau sterge rand conditie.

        //se selecteaza aprobatorii si in ce ordine - eventual pu pick list

        // pt un task avem capurile: subiect, descriere, activ/inactiv/ due date - zile de la data inregistrarii
        // status - started, not started, approved, reject - la adaugare se va seta not started
        //prioritate - high/low/normal
        //check box - sa trimita email sau nu catre asignati
        //reminder - cu cat timp inainte de due date - valori - Same date as due date at 1 AM - email sau pop-up
        //in caz de reject - se trimite email catre: toti care au aprobat, o anumita lista de utilizatori
        //trebuie sa existe mesaje poate redactate in quill cu placeholdere
        <div className="card flex">
            <div className="flex flex-wrap gap-8">

                {/* in cazul in care sunt mai multi aprobatori si este bifat ca trebuie sa aprobe toti, atunci apare
campul Seq sau Paralel */}

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

                <div className="flex align-items-center">
                    <RadioButton inputId="anyone" name="anyone" value={true} onChange={(e) => setApproveInParalel(e.value)} checked={approveInParalel === true} />
                    <label htmlFor="anyone" className="ml-2">Oricine</label>
                </div>

                <div className="flex align-items-center">
                    <RadioButton inputId="everyone" name="everyone" value={false} onChange={(e) => setApproveInParalel(e.value)} checked={approveInParalel === false} />
                    <label htmlFor="everyone" className="ml-2">Toti</label>
                </div>

                <Dropdown value={selectedProcessType} onChange={(e) => setSelectedProcessType(e.value)} options={process_type} optionLabel="name"
                    placeholder="Specificati ordinea" className="w-full md:w-14rem" />

                {/* valori posibile Toti sau Unul din lista Anyone Everyone */}

                <PickList dataKey="id" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate} breakpoint="1280px"
                    sourceHeader="Disponibil" targetHeader="Selectat" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }} />

                <div className="p-fluid formgrid grid pt-2">


                    <div className="field col-12  md:col-6">
                        <label htmlFor="taskName">Titlu</label>
                        <InputText id="taskName" type="text" value={selectedtaskName} onChange={(e) => {
                            setselectedTaskName(e.target.value)
                        }

                        } />

                    </div>

                    <div className="field col-12  md:col-12">
                        <label className="ml-2">Descriere Task</label>
                    </div>

                    <div className="field-checkbox col-12 md:col-12">
                        <InputTextarea id="notes" value={selectednotes} onChange={(e) => setselectedNotes(e.target.value)} rows={3} cols={60} />
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="status">Stare</label>
                        <Dropdown id="status" filter showClear value={selectedstatus} onChange={(e) => setselectedStatus(e.value.id)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    {/* de adaugat un lov cu nr zile dupa introducere pe flux */}
                    <div className="field col-12 md:col-3">
                        <label className="block mb-2">
                            De rezolvat pana la data
                        </label>
                        <Calendar id="due" value={new Date(selecteddue)} onChange={(e) => setselectedDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="status">Prioritate</label>
                        <Dropdown id="status" filter showClear value={selectedstatus} onChange={(e) => setselectedStatus(e.value.id)} options={priorities} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="status">Reminder</label>
                        <Dropdown id="status" filter showClear value={selectedstatus} onChange={(e) => setselectedStatus(e.value.id)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    {/* <div className="field col-12 md:col-3">
                        <label htmlFor="requestor">Solicitant</label>
                        <Dropdown id="requestor" filter showClear
                            disabled
                            //value={selectedrequestor} 
                            value={selectedassigned}
                            onChange={(e) => setselectedRequestor(e.value)} options={users} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div> */}
                    {/* 
                    <div className="field col-12 md:col-3">
                        <label htmlFor="">Asignat catre</label>
                        <Dropdown id="assigned" filter showClear
                            // value={selectedassigned} 
                            value={selectedassigned}
                            onChange={(e) => setselectedAssigned(e.value)}
                            options={users} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div> */}








                </div>
            </div>
        </div>



    );
}