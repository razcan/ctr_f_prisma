'use client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
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
import { ProgressBar } from 'primereact/progressbar';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'


export default function Tasks() {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, postWithToken, GetUserTasks,
        userId, nrOfTasks, setNrOfTasks, patchWithToken } = useMyContext();


    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));

    const [visible, setVisible] = useState(false);

    const [taskName, setTaskName] = useState('');
    const [status, setStatus] = useState([]);
    const [requestor, setRequestor] = useState(0);
    const [assigned, setAssigned] = useState(0);
    const [due, setDue] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [taskId, setTaskId] = useState('');
    const [selectedPriority, setSelectedPriority] = useState([]);

    const [rejectionReason, setRejectionReason] = useState('');

    const [selectedtaskName, setselectedTaskName] = useState('');
    const [selectedstatus, setselectedStatus] = useState([]);
    const [selectedrequestor, setselectedRequestor] = useState();
    const [selectedassigned, setselectedAssigned] = useState();
    const [selecteddue, setselectedDue] = useState(new Date());
    const [selectednotes, setselectedNotes] = useState('');
    const [selectedtaskId, setselectedtaskId] = useState('');
    const [selectedRejectedReason, setSelectedRejectedReason] = useState('');
    const [priority, setPriority] = useState([]);

    const [tasks, setTasks] = useState([]);
    const [persons, setPersons] = useState([]);
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

    const fetchTasksData = () => {
        fetch(`http://localhost:3000/contracts/task/${Id}`)
            .then(response => {
                return response.json()
            })
            .then(tasks => {
                setTasks(tasks)
                setselectedRequestor(tasks.requestorId)
                console.log(tasks)
            })
    }

    const fetchPriority = () => {
        fetch("http://localhost:3000/contracts/priority")
            .then(response => {
                return response.json()
            })
            .then(priority => {
                setPriority(priority)
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

    const fetchRequestor = async () => {
        try {
            const data = await fetchWithToken(`nomenclatures/susers/${userId}`, { method: 'GET' });
            setRequestor(data)

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
        fetchTasksData(),
            fetchTasksStatusData(),
            fetchUsers(),
            fetchRequestor(),
            fetchPriority()
    }, [])


    useEffect(() => {
        GetUserTasks(userId)
    }, [nrOfTasks])

    const EditTask = async () => {
        try {
            interface TaskId {
                taskName: String,
                statusId: Number,
                requestorId: Number,
                assignedId: Number,
                due: Date,
                notes: String,
                uuid: String,
                type: String,
                taskPriorityId: Number | undefined,
                rejected_reason: String,
            }

            let data: TaskId = {
                taskName: selectedtaskName,
                statusId: selectedstatus,
                requestorId: selectedrequestor,
                assignedId: selectedassigned,
                due: selecteddue,
                notes: selectednotes,
                uuid: '',
                type: 'action_task',
                taskPriorityId: selectedPriority,
                rejected_reason: selectedRejectedReason
            }
            const url = `contracts/task/${selectedtaskId}/${Id}`;
            const response = await patchWithToken(url, data);

            setVisible(false)
            GetUserTasks(userId)
            setNrOfTasks(nrOfTasks + 1)
            fetchTasksData()

            console.log('Task added:', response);
        } catch (error) {
            console.error('Error adding task:', error);
        }

    }

    const SaveTask = async () => {
        try {
            interface Task {
                taskName: String,
                contractId: Number,
                statusId: Number,
                requestorId: Number,
                assignedId: Number,
                due: Date,
                notes: String,
                uuid: String,
                type: String,
                taskPriorityId: Number | undefined,
                rejected_reason: String,

            }

            // Define the URL endpoint
            const url = 'contracts/task';

            // Define the data to be sent in the POST request body
            let data: Task = {
                taskName: taskName,
                contractId: Id,
                statusId: status.id,
                requestorId: requestor.id,
                assignedId: assigned.id,
                due: due,
                notes: notes,
                uuid: '',
                type: 'action_task',
                taskPriorityId: selectedPriority.id,
                rejected_reason: rejectionReason,
            }

            // Call the fetchWithToken method with the URL and data
            const response = await postWithToken(url, data);
            // console.log(response)
            setVisible(false)
            fetchTasksData()
            setselectedTask(undefined)
            setVisible(false)
            setTaskName('')
            setNotes('')
            setNrOfTasks(nrOfTasks + 1)

            // Log the response from the server
            console.log('Response from server:', response);
        } catch (error) {
            // Handle any errors that occur during the POST request
            console.error('Error:', error.message);
        }
    };



    const addtask = () => {
        setVisible(true)
    }


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

    //de adaugat drop down cu mai multi catre care se asigneaza
    //de modifcat campul de text cu un quill


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>

                    <Dialog header="Task" visible={visible} style={{ width: '60vw' }} onHide={() => {
                        setselectedTask(undefined)
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

                                            <div className="field-checkbox col-12 md:col-12">
                                                <InputTextarea id="notes" value={selectednotes} onChange={(e) => setselectedNotes(e.target.value)} rows={3} cols={60} />
                                            </div>
                                            <div className="field-checkbox col-12 md:col-3">
                                                <Button label="Salveaza" onClick={EditTask} />
                                            </div>
                                        </div>
                                        :

                                        <div>
                                            {requestor ?
                                                <div className="p-fluid formgrid grid pt-2">

                                                    <div className="field col-12  md:col-12">
                                                        <label htmlFor="taskName">Nume Task</label>
                                                        <InputText id="taskName" type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                                                    </div>

                                                    <div className="field col-12 md:col-3">
                                                        <label htmlFor="status">Stare</label>
                                                        <Dropdown id="status" filter showClear value={status}
                                                            onChange={(e) => setStatus(e.value)} options={allStatus}
                                                            optionLabel="name" placeholder="Select One"></Dropdown>
                                                    </div>

                                                    <div className="field col-12  md:col-9">
                                                        <label htmlFor="taskName">Motiv</label>
                                                        <InputText id="taskName" type="text" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                                                    </div>

                                                    <div className="field col-12 md:col-3">
                                                        <label className="font-bold block mb-2">
                                                            De rezolvat pana la
                                                        </label>
                                                        <Calendar id="due" value={due} onChange={(e) => setDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                                                    </div>


                                                    <span className="field col-12 md:col-3">
                                                        <label htmlFor="selectedPriority">Prioritate</label>
                                                        <Dropdown id="selectedPriority" value={selectedPriority}
                                                            filter showClear
                                                            onChange={(e) => setSelectedPriority(e.value)}
                                                            options={priority} optionLabel="name"
                                                            placeholder="Select One" className="w-full" />
                                                    </span>

                                                    <div className="field col-12 md:col-3">
                                                        <label htmlFor="requestor">Solicitant</label>
                                                        <Dropdown id="requestor" filter showClear
                                                            value={requestor}
                                                            disabled
                                                            // value={getRequestor(requestor)}
                                                            onChange={(e) => {
                                                                setRequestor(e.value)
                                                            }} options={users} optionLabel="name"
                                                            placeholder="Select One"></Dropdown>
                                                    </div>

                                                    <div className="field col-12 md:col-3">
                                                        <label htmlFor="assigned">Asignat catre</label>
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
                                                    <div className="field-checkbox col-12 md:col-3">
                                                        <Button label="Salveaza" onClick={SaveTask} />
                                                    </div>
                                                </div>
                                                : null}

                                        </div>


                                    }


                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Button label="Adauga Task" onClick={addtask} />

                    {tasks.length > 0 ?
                        <DataTable
                            dataKey={tasks.id}
                            className='pt-2' value={tasks} tableStyle={{ minWidth: '50rem' }}

                            selectionMode="single"
                            //selection={selectedTask} 

                            onSelectionChange={(e) => {
                                setselectedRequestor(e.value.requestorId),
                                    setselectedAssigned(e.value.assignedId),
                                    setselectedTask(e.value),
                                    setselectedTaskName(e.value.taskName),
                                    setselectedDue(e.value.due),
                                    setselectedNotes(e.value.notes),
                                    setselectedtaskId(e.value.id),
                                    setSelectedRejectedReason(e.value.rejected_reason),


                                    setSelectedPriority(e.value.taskPriorityId),
                                    setselectedStatus(e.value.statusId),

                                    setVisible(true),

                                    console.log(e.value)

                            }}
                            stripedRows
                            sortMode="multiple"
                            sortField="data"
                            sortOrder={1}
                        >
                            <Column hidden field="id" header="id"></Column>
                            <Column hidden field="rejected_reason" header="rejected_reason"></Column>
                            <Column field="status.name" header="Stare"></Column>
                            <Column field="requestor.name" header="Solicitant" ></Column>
                            <Column field="assigned.name" header="Responsabil"></Column>
                            <Column field="due" header="Data Limita" body={DueDateTemplate} ></Column>
                            <Column field="notes" header="Detalii"></Column>
                            <Column field="createdAt" header="Adaugat" body={CreatedDateTemplate} ></Column>

                        </DataTable>
                        : null}

                </div>
            </div>
        </div >
    );
}