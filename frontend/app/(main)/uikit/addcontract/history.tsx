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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import axios from 'axios';

export default function History() {

    const [text, setText] = useState('');
    const [products, setProducts] = useState([]);

    const fetchContent = async () => {
        const response = await fetch(`http://localhost:3000/contracts/content/${32}`).then(res => res.json())
        //treb modificat pe id de ctr
        setText(response.content);
    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    Istoric
                    <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="code" header="Code"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="category" header="Category"></Column>
                        <Column field="quantity" header="Quantity"></Column>
                    </DataTable>

                </div>
            </div>
        </div >
    );
}