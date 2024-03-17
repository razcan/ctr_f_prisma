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
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState([]);
    const [statusDate, setStatusDate] = useState(new Date());
    const [requestor, setRequestor] = useState(0);
    const [assigned, setAssigned] = useState(0);
    const [due, setDue] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [taskId, setTaskId] = useState('');

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


    const getRequestor = (id: number) => {
        return users.find((obj) => obj.id === id);
    };

    const getStatusJson = (id: InputNumber) => {
        return allStatus.find((obj) => obj.id === id);
    };

    const fetchTasksData = () => {
        fetch(`http://localhost:3000/contracts/task/${Id}`)
            .then(response => {
                return response.json()
            })
            .then(tasks => {
                setTasks(tasks)
                setselectedRequestor(tasks.requestorId)
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
            fetchRequestor()
    }, [])


    useEffect(() => {
        GetUserTasks(userId)
    }, [nrOfTasks])

    const EditTask = async () => {
        try {
            interface TaskId {
                taskName: String,
                progress: Number,
                statusId: Number,
                statusDate: Date,
                requestorId: Number,
                assignedId: Number,
                due: Date,
                notes: String
            }

            let data: TaskId = {
                taskName: selectedtaskName,
                // contractId: contractId,
                progress: Number.parseInt(selectedprogress, 10),
                statusId: selectedstatus.id,
                statusDate: selectedstatusDate,
                requestorId: selectedrequestor,
                assignedId: selectedassigned,
                due: selecteddue,
                notes: selectednotes

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
                progress: Number,
                statusId: Number,
                statusDate: Date,
                requestorId: Number,
                assignedId: Number,
                due: Date,
                notes: String
            }

            // Define the URL endpoint
            const url = 'contracts/task';

            // Define the data to be sent in the POST request body
            let data: Task = {
                taskName: taskName,
                contractId: Id,
                progress: Number.parseInt(progress, 10),
                statusId: status.id,
                statusDate: statusDate,
                requestorId: requestor.id,
                assignedId: assigned.id,
                due: due,
                notes: notes
            }

            // Call the fetchWithToken method with the URL and data
            const response = await postWithToken(url, data);
            // console.log(response)
            setVisible(false)
            fetchTasksData()
            setselectedTask(undefined)
            setProgress(0)
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
                                                <ProgressBar value={selectedprogress}></ProgressBar>
                                            </div>

                                            <div className="field col-12  md:col-6">
                                                <label htmlFor="taskName">Nume Task</label>
                                                <InputText id="taskName" type="text" value={selectedtaskName} onChange={(e) => {
                                                    setselectedTaskName(e.target.value)
                                                }

                                                } />

                                            </div>

                                            {/* <div className="field col-12 md:col-3">
                                                <label htmlFor="status">Stare</label>
                                                <Dropdown id="status" filter showClear value={selectedstatus} onChange={(e) => setselectedStatus(e.value)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div> */}

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="status">Stare</label>
                                                <Dropdown id="status" filter showClear value={getStatusJson(selectedstatus)} onChange={(e) => setselectedStatus(e.value.id)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label className="font-bold block mb-2">
                                                    De rezolvat pana la data
                                                </label>
                                                <Calendar id="due" value={new Date(selecteddue)} onChange={(e) => setselectedDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                                            </div>


                                            <div className="field col-12 md:col-3">
                                                <label className="font-bold block mb-2">
                                                    Progres la Data
                                                </label>
                                                <Calendar id="statusDate" value={new Date(selectedstatusDate)} onChange={(e) => setselectedStatusDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                            </div>

                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="progress">Progres Actual(%)</label>
                                                <InputText id="progress" type="int" value={selectedprogress} onChange={(e) => setselectedProgress(e.target.value)} />
                                            </div>


                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="requestor">Solicitant</label>
                                                <Dropdown id="requestor" filter showClear
                                                    disabled
                                                    //value={selectedrequestor} 
                                                    value={getRequestor(selectedrequestor)}
                                                    onChange={(e) => setselectedRequestor(e.value)} options={users} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="">Asignat catre</label>
                                                <Dropdown id="assigned" filter showClear
                                                    // value={selectedassigned} 
                                                    value={getRequestor(selectedassigned)}
                                                    onChange={(e) => setselectedAssigned(e.value)}
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
                                                        <ProgressBar value={progress}></ProgressBar>
                                                    </div>

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
                                                        <label className="font-bold block mb-2">
                                                            Progres la Data
                                                        </label>
                                                        <Calendar id="statusDate" value={statusDate} onChange={(e) => setStatusDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                                    </div>

                                                    <div className="field col-12  md:col-3">
                                                        <label htmlFor="progress">Progres Actual(%)</label>
                                                        <InputText id="progress" type="int" value={progress} onChange={(e) => setProgress(e.target.value)} />
                                                    </div>



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
                                    setselectedTask(e.value), setselectedTaskName(e.value.taskName),
                                    setselectedProgress(e.value.progress), setselectedStatus(e.value.statusId),
                                    setselectedStatusDate(e.value.statusDate),
                                    setselectedDue(e.value.due),
                                    setselectedNotes(e.value.notes),
                                    setselectedtaskId(e.value.id)
                                setVisible(true)

                            }}
                            stripedRows
                            sortMode="multiple"
                            sortField="data"
                            sortOrder={1}
                        >
                            <Column field="id" header="id"></Column>
                            <Column field="progress" header="Progres(%)"></Column>
                            <Column field="status.name" header="Stare"></Column>
                            <Column field="statusDate" header="Stare la data" body={StatusDateTemplate} ></Column>
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