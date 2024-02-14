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

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setselectedTask] = useState([]);

    const allStatus = [
        { id: 1, name: "In curs" },
        { id: 2, name: "Finalizat" },
        { id: 3, name: "Anulat" },
    ]

    const fetchTasksData = () => {
        fetch("http://localhost:3000/contracts/task")
            .then(response => {
                return response.json()
            })
            .then(tasks => {
                setTasks(tasks)
            })
    }

    useEffect(() => {
        fetchTasksData()
    }, [])



    //TaskName, Progress, StatusDate , Status, Requestor, Assigned, Due, Notes, LastUpdated, Delete
    //de adaugat nomencaltor status in seed db Status - In Progress, Completed, Canceled


    //Prepare contract review, 30 % completed, , in progress, Laura calcche, vasile petre, data, trebuie sa repede, data, icoana stergere
    //la salvare se trimite email catre cel caruia i-a fost asignat si catre solicitant
    //ui tabel cu taskuri - modal cu adaugare
    //nomenclarorul de persoane se ia de la nivel de entitate pe care este ctr.

    const SaveTask = async () => {

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
            console.log('Task added:', response.data);
        } catch (error) {
            console.error('Error adding task:', error);
        }

    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    Config  taskuri

                    <Dialog header="Adauga Task" visible={visible} style={{ width: '60vw' }} onHide={() => setVisible(false)}>
                        <div className='card'>
                            <div className="grid">
                                <div className="col-12">
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
                                            <Calendar id="start" value={due} onChange={(e) => setDue(e.value)} showIcon dateFormat="dd/mm/yy" />
                                        </div>


                                        <div className="field col-12 md:col-3">
                                            <label className="font-bold block mb-2">
                                                Progres la Data
                                            </label>
                                            <Calendar id="start" value={statusDate} onChange={(e) => setStatusDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                        </div>

                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="progress">Progres Actual(%)</label>
                                            <InputText id="progress" type="int" value={progress} onChange={(e) => setProgress(e.target.value)} />
                                        </div>



                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="requestor">Solicitant</label>
                                            <Dropdown id="requestor" filter showClear value={requestor} onChange={(e) => setRequestor(e.value)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="">Asignat catre</label>
                                            <Dropdown id="assigned" filter showClear value={assigned} onChange={(e) => setAssigned(e.value)} options={allStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>



                                        <div className="field col-12  md:col-12">
                                            <label className="ml-2">Descriere Task</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <InputTextarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} cols={60} />
                                        </div>
                                    </div>
                                    <Button label="Salveaza" onClick={SaveTask} />
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <DataTable className='pt-2' value={tasks} tableStyle={{ minWidth: '50rem' }}

                        selectionMode="single" selection={selectedTask} onSelectionChange={(e) => {
                            setselectedTask(e.value),
                                setVisible(true)
                        }}
                        stripedRows
                        sortMode="multiple"
                        sortField="data"
                        dataKey="data"
                        sortOrder={1}
                    >
                        <Column field="progress" header="progress"></Column>
                        <Column field="status" header="status"></Column>
                        <Column field="statusDate" header="statusDate"></Column>
                        <Column field="requestor" header="Solicitant"></Column>
                        <Column field="assigned" header="Responsabil"></Column>
                        <Column field="due" header="Data Limita"></Column>
                        <Column field="notes" header="Detalii"></Column>
                        <Column field="createdAt" header="createdAt"></Column>
                        <Column field="updatedAt" header="updatedAt"></Column>

                    </DataTable>

                </div>
            </div>
        </div >
    );
}