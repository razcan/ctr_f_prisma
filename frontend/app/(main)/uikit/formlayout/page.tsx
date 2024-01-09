'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Calendar } from 'primereact/calendar';
import { Editor } from 'primereact/editor';
import axios from 'axios';

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'


interface DropdownItem {
    name: string;
    code: string;
}

interface Contract {
    number?: number,
    type?: string,
    partner?: string,
    status?: string,
    start?: Date,
    end?: Date,
    sign?: Date,
    completion?: Date,
    remarks?: string
}

const FormLayoutDemo = () => {

    const router = useRouter();
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);

    const [number, setNumber] = useState(null);
    const [partner, setPartner] = useState(null);
    const [type, setType] = useState(null);
    const [start, setStartDate] = useState(null);
    const [end, setEndDate] = useState(null);
    const [sign, setSignDate] = useState(null);
    const [completion, setCompletionDate] = useState(null);
    const [remarks, setRemarks] = useState(null);
    const [status, setStatus] = useState(null);

    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Activ', code: 'Activ' },
            { name: 'Draft', code: 'Draft' },
            { name: 'Anulat', code: 'Anulat' }
        ],
        []
    );

    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home',
            command: () => {
                router.push('/uikit/input');
            }
        },
        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        { label: 'Document Atasate', icon: 'pi pi-inbox' },
        { label: 'Flux aprobare', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Istoric', icon: 'pi pi-fw pi-table' },
        { label: 'Alerte', icon: 'pi pi-fw pi-mobile' }
    ];

    useEffect(() => {
        setDropdownItem(dropdownItems['']);
    }, [dropdownItems]);

    const saveContract = async () => {
        // console.log(number, partner, start, end, completion, sign, type, remarks, status)
        let addedContract: Contract = {
            number: number,
            type: type,
            partner: partner,
            status: status.name,
            start: (start ? start.toISOString() : null),
            end: (end ? end.toISOString() : null),
            sign: (sign ? sign.toISOString() : null),
            completion: (completion ? completion.toISOString() : null),
            remarks: remarks
        }

        try {
            const response = await axios.post('http://localhost:3000/contracts',
                addedContract
                // number, partner, start, end, completion, sign, type, remarks, status
            );

            console.log('Contract added:', response.data);
        } catch (error) {
            console.error('Error creating contract:', error);
        }

        // const queryClient = new QueryClient()

        // const mutation = useMutation({
        //     mutationFn: (newContract) => {
        //         return axios.post('http://localhost:3000/contracts', newContract)
        //     },
        // })

    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <div className="field lg:col-12 xs:col-3 md:col-12">
                        <TabMenu model={items} />
                    </div>

                    <div className="p-fluid formgrid grid pt-2">

                        <div className="field col-12  md:col-3">
                            <label htmlFor="number">Numar</label>
                            <InputText id="number" keyfilter="int" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="type">Tip</label>
                            <InputText id="type" type="text" value={type} onChange={(e) => setType(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="partner">Partner</label>
                            <InputText id="partner" type="text" value={partner} onChange={(e) => setPartner(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Stare</label>
                            <Dropdown id="state" value={status} onChange={(e) => setStatus(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Start
                            </label>
                            <Calendar id="buttondisplay" value={start} onChange={(e) => setStartDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Final
                            </label>
                            <Calendar id="buttondisplay" value={end} onChange={(e) => setEndDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Semnat
                            </label>
                            <Calendar id="buttondisplay" value={sign} onChange={(e) => setSignDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Inchis la
                            </label>
                            <Calendar id="buttondisplay" value={completion} onChange={(e) => setCompletionDate(e.value)} showIcon />
                        </div>
                        <div className="field col-12 md:col-12">
                            <Editor value={remarks} onTextChange={(e) => setRemarks(e.htmlValue)}
                                className='max-w-screen' style={{ height: '320px' }}
                            />
                        </div>
                    </div>
                    <Button label="Salveaza" onClick={saveContract} />
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;
