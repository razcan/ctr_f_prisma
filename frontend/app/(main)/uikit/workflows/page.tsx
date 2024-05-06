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
import { Tag } from 'primereact/tag';


export default function Tasks() {

    // const useMyContext = () => useContext(MyContext);
    // const {
    //     fetchWithToken, Backend_BASE_URL,
    //     Frontend_BASE_URL, postWithToken, GetUserTasks,
    //     userId, nrOfTasks, setNrOfTasks, patchWithToken } = useMyContext();


    const router = useRouter();
    const searchParams = useSearchParams()
    const [wflist, setWflist] = useState([]);
    const [selectedWF, setSelectedWF] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState([]);

    const addFlow = () => {
        router.push(`/uikit/workflows/add/add`)
    }

    const editFlow = (selectedWF: number) => {
        router.push(`/uikit/workflows/edit/edit/?Id=${selectedWF}`)
    }

    const fetchwflist = () => {
        fetch("http://localhost:3000/contracts/wflist")
            .then(response => {
                return response.json()
            })
            .then(wflist => {
                setWflist(wflist)
            })
    }

    useEffect(() => {
        fetchwflist()

    }, [])

    const statusTemplate = (item) => {
        return <Tag value={item.status} severity={getSeverity(item)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item.status) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div className="card">
                        <Button label="Adauga flux aprobare" onClick={addFlow} />

                        {wflist.length > 0 ?
                            <DataTable className='pt-2'
                                value={wflist}
                                tableStyle={{ minWidth: '50rem' }}
                                selectionMode="single"
                                onSelectionChange={(e) => {
                                    editFlow(e.value.id)
                                }}
                            >
                                {/* <Column hidden field="id" header="Id"></Column> */}
                                <Column hidden field="id" header="Id"></Column>
                                <Column field="wfName" header="Denumire"></Column>
                                <Column field="wfDescription" header="Descriere"></Column>
                                <Column field="status" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>

                            </DataTable>
                            : null}

                    </div>
                </div>
            </div>
        </div >
    );
}
