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


export default function Tasks() {

    // const useMyContext = () => useContext(MyContext);
    // const {
    //     fetchWithToken, Backend_BASE_URL,
    //     Frontend_BASE_URL, postWithToken, GetUserTasks,
    //     userId, nrOfTasks, setNrOfTasks, patchWithToken } = useMyContext();


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


    const addFlow = () => {
        router.push(`/uikit/workflows/add`)
    }




    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>


                    <Button label="Adauga flux aprobare" onClick={addFlow} />

                </div>
            </div>
        </div >
    );
}
