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




    const fetchTasksData = () => {
        fetch(`${Backend_BASE_URL}/contracts/usertask/${userId}`)
            .then(response => {
                return response.json()
            })
            .then(tasks => {
                setTasks(tasks)

                tasks.forEach((element: any, index: any) => {
                    if (!element.uuid) {
                        // console.log(element.status.name)
                        tasks[index].statusWF = tasks[index].status
                    }
                });
            })
    }

    useEffect(() => {
        fetchTasksData()
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


    const goToContract = (contractId: any) => {
        // router.push(`${Frontend_BASE_URL}/uikit/editcontract/ctr?Id=${contractId}`);
        router.push(`/uikit/editcontract/ctr?Id=${contractId}&idxp=${6}`);
    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>

                    {tasks.length > 0 ?
                        <DataTable
                            dataKey={tasks.id}
                            className='pt-2' value={tasks} tableStyle={{ minWidth: '50rem' }}

                            selectionMode="single"
                            //selection={selectedTask} 

                            onSelectionChange={(e) => {
                                goToContract(e.value.contractId)
                            }}
                            stripedRows
                            sortMode="multiple"
                            sortField="contract.number"
                            sortOrder={1}
                        >
                            <Column sortable field="id" header="id"></Column>
                            <Column hidden field="contractId" header="contractId"></Column>
                            <Column sortable field="contract.number" header="Nr. Contract"></Column>
                            <Column sortable field="statusWF.name" header="Stare"></Column>
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
