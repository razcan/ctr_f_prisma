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
// import ReactQuill, { Quill } from 'react-quill';
// import "react-quill/dist/quill.snow.css";
import { ProgressBar } from 'primereact/progressbar';
import { Slider } from 'primereact/slider';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'


export default function Tasks() {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, postWithToken, userId } = useMyContext();


    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));

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

    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedRejectedReason, setSelectedRejectedReason] = useState('');
    const [priority, setPriority] = useState([]);


    const [selectedtaskName, setselectedTaskName] = useState('');
    const [selectedprogress, setselectedProgress] = useState(0);
    const [selectedstatus, setselectedStatus] = useState([]);
    const [selectedstatusDate, setselectedStatusDate] = useState(new Date());
    const [selectedrequestor, setselectedRequestor] = useState();
    const [selectedassigned, setselectedAssigned] = useState();
    const [selecteddue, setselectedDue] = useState(new Date());
    const [selectednotes, setselectedNotes] = useState('');
    const [selectedtaskId, setselectedtaskId] = useState('');
    const [selectedPriority, setSelectedPriority] = useState([]);

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setselectedTask] = useState();
    const [allStatus, setAllStatus] = useState([])

    const [users, setUsers] = useState([]);


    const getRequestor = (id: number) => {
        return users.find((obj) => obj.id === id);
    };

    const getStatusJson = (id: InputNumber) => {
        return allStatus.find((obj) => obj.id === id);
    };

    const getPriorityJson = (id) => {
        return priority.find((obj) => obj.id === id);

    };

    const fetchPriority = () => {
        fetch("http://localhost:3000/contracts/priority")
            .then(response => {
                return response.json()
            })
            .then(priority => {
                setPriority(priority)
            })
    }


    const fetchTasksData = () => {
        fetch(`http://localhost:3000/contracts/usertask/${userId}`)
            .then(response => {
                return response.json()
            })
            .then(tasks => {
                setTasks(tasks)
            })
    }

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

        } catch (error) {
            if (error.message === 'No token found.') {
                router.push(`${Backend_BASE_URL}/auth/login`);
            } else {
                console.error(error.message);
            }
        }
    };

    // http://localhost:3000/nomenclatures/users

    //trebuie adusi utilizatorii in loc de persoane, in functie de entitatea cu care suntem logati
    //in ui trebuie scos solicitantul pt ca se paote determina automat din context - campul ramande disabled
    //de adugat o ruta si un view pentru lista taskurilor unui user cu link catre ctr

    useEffect(() => {
        fetchTasksData(),
            fetchTasksStatusData(),
            fetchUsers(),
            fetchPriority()
    }, [])


    // useEffect(() => {
    //     fetchPersonsData(entityId)
    // }, [entityId])


    interface Task {
        taskName: String,
        contractId: Number,
        progress: Number,
        statusId: Number,
        statusDate: Date,
        requestorId: Number,
        assignedId: Number,
        due: Date,
        notes: String
    }

    // const EditTask = async () => {

    //     interface TaskId {
    //         taskName: String,
    //         progress: Number,
    //         statusId: Number,
    //         statusDate: Date,
    //         requestorId: Number,
    //         assignedId: Number,
    //         due: Date,
    //         notes: String
    //     }

    //     let TaskR: TaskId = {
    //         taskName: selectedtaskName,
    //         // contractId: contractId,
    //         progress: Number.parseInt(selectedprogress, 10),
    //         statusId: selectedstatus.id,
    //         statusDate: selectedstatusDate,
    //         requestorId: selectedrequestor,
    //         assignedId: selectedassigned,
    //         due: selecteddue,
    //         notes: selectednotes

    //     }

    //     try {
    //         const response = await axios.patch(`http://localhost:3000/contracts/task/${selectedtaskId}`,
    //             TaskR
    //         );
    //         setVisible(false)
    //         fetchTasksData()

    //         console.log('Task added:', response.data);
    //     } catch (error) {
    //         console.error('Error adding task:', error);
    //     }

    // }

    // const SaveTask = async () => {



    //     let Task: Task = {
    //         taskName: taskName,
    //         contractId: Id,
    //         progress: Number.parseInt(progress, 10),
    //         statusId: status.id,
    //         statusDate: statusDate,
    //         requestorId: requestor.id,
    //         assignedId: assigned.id,
    //         due: due,
    //         notes: notes
    //     }

    //     //console.log(Task)
    //     try {
    //         const response = await axios.post('http://localhost:3000/contracts/task',
    //             Task
    //         );
    //         setVisible(false)
    //         fetchTasksData()
    //         setselectedTask(undefined)
    //         setProgress(0)
    //         setVisible(false)
    //         setTaskName('')
    //         setNotes('')

    //         console.log('Task added:', response.data);
    //     } catch (error) {
    //         console.error('Error adding task:', error);
    //     }

    // }

    const addtask = () => {
        setVisible(true)
    }

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
                <div className='card'>

                    <Dialog header="Task" visible={visible} style={{ width: '60vw' }} onHide={() => {
                        setselectedTask(undefined)
                        setProgress(0)
                        setVisible(false)
                        setTaskName('')
                        setNotes('')

                    }}>
                        <div className='card'>
                            <div className="grid">
                                <div className="col-12">
                                    {selectedTask ?
                                        <div className="p-fluid formgrid grid pt-2">

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="taskName">Nume Task</label>
                                                <InputText id="taskName" type="text" value={selectedtaskName} onChange={(e) => setselectedTaskName(e.target.value)} />
                                            </div>


                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="status">Stare</label>
                                                <Dropdown id="status" filter showClear value={getStatusJson(selectedstatus)} onChange={(e) => setselectedStatus(e.value.id)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12  md:col-9">
                                                <label htmlFor="taskName">Motiv</label>
                                                <InputText id="taskName" type="text" value={selectedRejectedReason} onChange={(e) => setSelectedRejectedReason(e.target.value)} />
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label className="font-bold block mb-2">
                                                    De rezolvat pana la
                                                </label>
                                                <Calendar id="due" value={new Date(selecteddue)} onChange={(e) => setselectedDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                                            </div>


                                            <span className="field col-12 md:col-3">
                                                <label htmlFor="selectedPriority">Prioritate</label>
                                                <Dropdown id="selectedPriority" value={getPriorityJson(selectedPriority)}
                                                    filter showClear
                                                    onChange={(e) => setSelectedPriority(e.value.id)}
                                                    options={priority} optionLabel="name"
                                                    placeholder="Select One" className="w-full" />
                                            </span>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="requestor">Solicitant</label>
                                                <Dropdown id="requestor" filter showClear
                                                    value={getRequestor(selectedrequestor)}

                                                    disabled

                                                    onChange={(e) => {
                                                        setRequestor(e.value)
                                                    }} options={users} optionLabel="name"
                                                    placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="assigned">Asignat catre</label>
                                                <Dropdown id="assigned" filter showClear
                                                    value={getRequestor(selectedassigned)}
                                                    onChange={(e) => setselectedAssigned(e.value.id)}
                                                    options={users} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>



                                            <div className="field col-12  md:col-12">
                                                <label className="ml-2">Descriere Task</label>
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <Editor value={selectednotes}
                                                    style={{ height: '320px' }} />
                                            </div>


                                        </div>
                                        :

                                        <div>

                                            <div className="p-fluid formgrid grid pt-2">


                                                <div className="field col-12  md:col-6">
                                                    <label htmlFor="taskName">Nume Task</label>
                                                    <InputText id="taskName" type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />

                                                </div>

                                                <div className="field col-12 md:col-3">
                                                    <label htmlFor="status">Stare</label>
                                                    <Dropdown id="status" filter showClear value={status} onChange={(e) => setStatus(e.value)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                                </div>

                                                <div className="field col-12 md:col-3">
                                                    <label className="font-bold block mb-2">
                                                        De rezolvat pana la data
                                                    </label>
                                                    <Calendar id="due" value={due} onChange={(e) => setDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                                                </div>


                                                <div className="field col-12 md:col-3">
                                                    <label htmlFor="requestor">Solicitant</label>
                                                    <Dropdown id="requestor" filter showClear
                                                        value={requestor}
                                                        // value={getRequestor(requestor)}
                                                        onChange={(e) => {
                                                            setRequestor(e.value)

                                                        }} options={users} optionLabel="name"
                                                        placeholder="Select One"></Dropdown>
                                                </div>

                                                <div className="field col-12 md:col-3">
                                                    <label htmlFor="">Asignat catre</label>
                                                    <Dropdown id="assigned" filter showClear
                                                        value={assigned} onChange={(e) => setAssigned(e.value)}
                                                        options={users} optionLabel="name" placeholder="Select One"></Dropdown>
                                                </div>



                                                <div className="field col-12  md:col-12">
                                                    <label className="ml-2">Descriere Task</label>
                                                </div>

                                                <div className="field-checkbox col-12 md:col-12">
                                                    <InputTextarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} cols={60} />
                                                </div>
                                                {/* <div className="field-checkbox col-12 md:col-3">
                                                    <Button label="Salveaza" onClick={SaveTask} />
                                                </div> */}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Dialog>


                    {tasks.length > 0 ?
                        <DataTable
                            dataKey={tasks.id}
                            className='pt-2' value={tasks} tableStyle={{ minWidth: '50rem' }}

                            selectionMode="single"
                            //selection={selectedTask} 

                            onSelectionChange={(e) => {
                                setselectedRequestor(e.value.requestorId),
                                    setselectedAssigned(e.value.assignedId),
                                    setselectedTask(e.value), setselectedTaskName(e.value.taskName),
                                    setselectedStatus(e.value.statusId),
                                    setselectedDue(e.value.due),
                                    setselectedNotes(e.value.notes),
                                    setselectedtaskId(e.value.id),
                                    setSelectedRejectedReason(e.value.rejected_reason),
                                    setSelectedPriority(e.value.taskPriorityId),
                                    setVisible(true)

                            }}
                            stripedRows
                            sortMode="multiple"
                            sortField="data"
                            sortOrder={1}
                        >
                            <Column hidden field="id" header="id"></Column>
                            <Column field="status.name" header="Stare"></Column>
                            <Column field="requestor.name" header="Solicitant" ></Column>
                            <Column field="assigned.name" header="Responsabil"></Column>
                            <Column field="due" header="Data Limita" body={DueDateTemplate} ></Column>
                            <Column field="taskName" header="Denumire"></Column>
                            <Column field="createdAt" header="Adaugat" body={CreatedDateTemplate} ></Column>

                        </DataTable>
                        : null}

                </div>
            </div>
        </div >
    );
}
