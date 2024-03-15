"use client"

import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from 'primereact/button';
import { useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from 'primereact/dialog';
import "react-quill/dist/quill.snow.css";
import { ProgressBar } from 'primereact/progressbar';

import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'

function UserTaskList() {

    const router = useRouter();
    const searchParams = useSearchParams()
    // const Id = parseInt(searchParams.get("Id"));
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
    const [selectedrequestor, setselectedRequestor] = useState(0);
    const [selectedassigned, setselectedAssigned] = useState(0);
    const [selecteddue, setselectedDue] = useState(new Date());
    const [selectednotes, setselectedNotes] = useState('');
    const [selectedtaskId, setselectedtaskId] = useState('');

    const [tasks, setTasks] = useState([]);
    const [persons, setPersons] = useState([]);
    const [selectedTask, setselectedTask] = useState();
    const [allStatus, setAllStatus] = useState([])

    const [entityId, setEntityId] = useState([])


    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing } = useMyContext();


    const [selectedContract, setselectedContract] = useState(null);
    const [data, setData] = useState([]);
    const [metaKey, setMetaKey] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const fetchTasksData = () => {
        fetch(`http://localhost:3000/contracts/task/${1}`)
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



    const fetchEntity = () => {
        fetch(`http://localhost:3000/contracts/basic/${7}`)
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntityId(entity)
            })
    }

    const fetchPersonsData = (CtrId: Number) => {
        try {
            fetch(`http://localhost:3000/nomenclatures/persons/${CtrId}`)
                .then(response => {
                    return response.json()
                })
                .then(persons => {
                    setPersons(persons)
                })
        } catch {
            console.log("nu exista persoane")
        }

    }

    useEffect(() => {
        fetchTasksData(),
            fetchEntity(),
            // fetchPersonsData(entityId),
            fetchTasksStatusData()
    }, [])


    useEffect(() => {
        fetchPersonsData(entityId)
    }, [entityId])

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };


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

    const EditTask = async () => {

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

        let TaskR: TaskId = {
            taskName: selectedtaskName,
            // contractId: contractId,
            progress: Number.parseInt(selectedprogress, 10),
            statusId: selectedstatus.id,
            statusDate: selectedstatusDate,
            requestorId: selectedrequestor.id,
            assignedId: selectedassigned.id,
            due: selecteddue,
            notes: selectednotes

        }

        try {
            const response = await axios.patch(`http://localhost:3000/contracts/task/${selectedtaskId}`,
                TaskR
            );
            setVisible(false)
            fetchTasksData()

            console.log('Task added:', response.data);
        } catch (error) {
            console.error('Error adding task:', error);
        }

    }

    const SaveTask = async () => {



        let Task: Task = {
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

        //console.log(Task)
        try {
            const response = await axios.post('http://localhost:3000/contracts/task',
                Task
            );
            setVisible(false)
            fetchTasksData()
            setselectedTask(undefined)
            setProgress(0)
            setVisible(false)
            setTaskName('')
            setNotes('')

            console.log('Task added:', response.data);
        } catch (error) {
            console.error('Error adding task:', error);
        }

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
                                                <InputText id="taskName" type="text" value={selectedtaskName} onChange={(e) => setselectedTaskName(e.target.value)} />

                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="status">Stare</label>
                                                <Dropdown id="status" filter showClear value={selectedstatus} onChange={(e) => setselectedStatus(e.value)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
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
                                                <Dropdown id="requestor" filter showClear value={selectedrequestor} onChange={(e) => setselectedRequestor(e.value)} options={persons} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="">Asignat catre</label>
                                                <Dropdown id="assigned" filter showClear value={selectedassigned} onChange={(e) => setselectedAssigned(e.value)} options={persons} optionLabel="name" placeholder="Select One"></Dropdown>
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
                                            {persons ?
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
                                                        <Dropdown id="requestor" filter showClear value={requestor} onChange={(e) => setRequestor(e.value)} options={persons} optionLabel="name" placeholder="Select One"></Dropdown>
                                                    </div>

                                                    <div className="field col-12 md:col-3">
                                                        <label htmlFor="">Asignat catre</label>
                                                        <Dropdown id="assigned" filter showClear value={assigned} onChange={(e) => setAssigned(e.value)} options={persons} optionLabel="name" placeholder="Select One"></Dropdown>
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


                    {tasks.length > 0 ?
                        <DataTable className='pt-2' value={tasks} tableStyle={{ minWidth: '50rem' }}

                            selectionMode="single"
                            //selection={selectedTask} 

                            onSelectionChange={(e) => {

                                setselectedTask(e.value), setselectedTaskName(e.value.taskName), setselectedProgress(e.value.progress), setselectedStatus(e.value.status),
                                    setselectedStatusDate(e.value.statusDate),
                                    setselectedRequestor(e.value.requestor), setselectedAssigned(e.value.assigned),
                                    setselectedDue(e.value.due),
                                    setselectedNotes(e.value.notes),
                                    setselectedtaskId(e.value.id)
                                setVisible(true)

                            }}
                            stripedRows
                            sortMode="multiple"
                            sortField="data"
                            dataKey="data"
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

export default UserTaskList;

