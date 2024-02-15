'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
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

export default function Tasks() {

    const [visible, setVisible] = useState(false);

    const [taskName, setTaskName] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(0);
    const [statusDate, setStatusDate] = useState(new Date());
    const [requestor, setRequestor] = useState(0);
    const [assigned, setAssigned] = useState(0);
    const [due, setDue] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [taskId, setTaskId] = useState('');

    const [tasks, setTasks] = useState([]);
    const [persons, setPersons] = useState([]);
    const [selectedTask, setselectedTask] = useState();
    const [allStatus, setAllStatus] = useState([])

    // const allStatus = [
    //     { id: 1, name: "In curs" },
    //     { id: 2, name: "Finalizat" },
    //     { id: 3, name: "Anulat" },
    // ]

    const fetchTasksData = () => {
        fetch("http://localhost:3000/contracts/task")
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

    const fetchPersonsData = () => {
        fetch("   http://localhost:3000/nomenclatures/persons/2")
            .then(response => {
                return response.json()
            })
            .then(persons => {
                setPersons(persons)
            })
    }

    useEffect(() => {
        fetchTasksData(),
            fetchPersonsData(),
            fetchTasksStatusData()
    }, [])






    //TaskName, Progress, StatusDate , Status, Requestor, Assigned, Due, Notes, LastUpdated, Delete
    //de adaugat nomencaltor status in seed db Status - In Progress, Completed, Canceled


    //Prepare contract review, 30 % completed, , in progress, Laura calcche, vasile petre, data, trebuie sa repede, data, icoana stergere
    //la salvare se trimite email catre cel caruia i-a fost asignat si catre solicitant
    //ui tabel cu taskuri - modal cu adaugare
    //nomenclarorul de persoane se ia de la nivel de entitate pe care este ctr.

    interface Task {
        taskName: String,
        // contractId: Number,
        progress: Number,
        status: Number,
        statusDate: Date,
        requestor: Number,
        assigned: Number,
        due: Date,
        notes: String
    }

    const EditTask = async () => {

        interface TaskId {
            id: Number,
            taskName: String,
            progress: Number,
            status: Number,
            statusDate: Date,
            requestor: Number,
            assigned: Number,
            due: Date,
            notes: String
        }

        let Task: TaskId = {
            id: taskId.id,
            taskName: taskName,
            // contractId: contractId,
            progress: Number.parseInt(progress, 10),
            status: status.id,
            statusDate: statusDate,
            requestor: requestor.id,
            assigned: assigned.id,
            due: due,

            notes: notes
        }
        try {
            const response = await axios.patch(`http://localhost:3000/contracts/task/${id}`,
                Task
            );
            setVisible(false)
            fetchTasksData()
            fetchPersonsData()

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

    const SaveTask = async () => {



        let Task: Task = {
            taskName: taskName,
            // contractId: contractId,
            progress: Number.parseInt(progress, 10),
            status: status.id,
            statusDate: statusDate,
            requestor: requestor.id,
            assigned: assigned.id,
            due: due,
            notes: notes
        }

        try {
            const response = await axios.post('http://localhost:3000/contracts/task',
                Task
            );
            setVisible(false)
            fetchTasksData()
            fetchPersonsData()

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

    const getPersonJsonN = (id: InputNumber) => {
        return persons.find((obj) => obj.id === id);
    };

    const RequestorTemplate = (rowData: any) => {
        const requestor = getPersonJsonN(rowData.requestor);
        return <span>{requestor.name}</span>;
    };

    const AssignedTemplate = (rowData: any) => {
        const requestor = getPersonJsonN(rowData.assigned);
        return <span>{requestor.name}</span>;
    };

    const StatusTaskTemplate = (rowData: any) => {
        const status = getStatusJson(rowData.status);
        return <span>{status.name}</span>;
    };

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };



    const getStatusJson = (id: InputNumber) => {
        return allStatus.find((obj) => obj.id === id);
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
                                                <ProgressBar value={progress}></ProgressBar>
                                            </div>

                                            <div className="field col-12  md:col-6">
                                                <label htmlFor="taskName">Nume Task</label>
                                                <InputText id="taskName" type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />

                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="status">Stare</label>
                                                <Dropdown id="status" filter showClear value={getStatusJson(selectedTask.status)} onChange={(e) => setselectedTask(e.value)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label className="font-bold block mb-2">
                                                    De rezolvat pana la data
                                                </label>
                                                <Calendar id="due" value={new Date(due)} onChange={(e) => setDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                                            </div>


                                            <div className="field col-12 md:col-3">
                                                <label className="font-bold block mb-2">
                                                    Progres la Data
                                                </label>
                                                <Calendar id="statusDate" value={new Date(statusDate)} onChange={(e) => setStatusDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                            </div>

                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="progress">Progres Actual(%)</label>
                                                <InputText id="progress" type="int" value={progress} onChange={(e) => setProgress(e.target.value)} />
                                            </div>


                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="requestor">Solicitant</label>
                                                <Dropdown id="requestor" filter showClear value={getPersonJsonN(requestor)} onChange={(e) => setRequestor(e.value)} options={persons} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>

                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="">Asignat catre</label>
                                                <Dropdown id="assigned" filter showClear value={getPersonJsonN(assigned)} onChange={(e) => setAssigned(e.value)} options={persons} optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>



                                            <div className="field col-12  md:col-12">
                                                <label className="ml-2">Descriere Task</label>
                                            </div>

                                            <div className="field-checkbox col-12 md:col-12">
                                                <InputTextarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} cols={60} />
                                            </div>
                                            <div className="field-checkbox col-12 md:col-3">
                                                <Button label="Salveaza/E" onClick={EditTask} />
                                            </div>

                                        </div>
                                        :

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

                                    }


                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Button label="Adauga Task" onClick={addtask} />

                    <DataTable className='pt-2' value={tasks} tableStyle={{ minWidth: '50rem' }}

                        selectionMode="single"
                        //selection={selectedTask} 

                        onSelectionChange={(e) => {

                            setselectedTask(e.value), setTaskName(e.value.taskName), setProgress(e.value.progress), setStatus(e.value.status), setStatusDate(e.value.statusDate),
                                setRequestor(e.value.requestor), setAssigned(e.value.assigned),
                                setDue(e.value.due),
                                setNotes(e.value.notes),
                                setTaskId(e.value.id)
                            setVisible(true)

                        }}
                        stripedRows
                        sortMode="multiple"
                        sortField="data"
                        dataKey="data"
                        sortOrder={1}
                    >
                        <Column hidden field="id" header="id"></Column>
                        <Column field="progress" header="Progres(%)"></Column>
                        <Column field="status" header="Stare" body={StatusTaskTemplate}></Column>
                        <Column field="statusDate" header="Stare la data" body={StatusDateTemplate} ></Column>
                        <Column field="requestor" header="Solicitant" body={RequestorTemplate}></Column>
                        <Column field="assigned" header="Responsabil" body={AssignedTemplate}></Column>
                        <Column field="due" header="Data Limita" body={DueDateTemplate} ></Column>
                        <Column field="notes" header="Detalii"></Column>
                        <Column field="createdAt" header="Adaugat" body={CreatedDateTemplate} ></Column>

                    </DataTable>

                </div>
            </div>
        </div >
    );
}