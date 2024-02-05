'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ToggleButton } from 'primereact/togglebutton';
import { Editor } from 'primereact/editor';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { FileUpload } from 'primereact/fileupload';
import * as XLSX from 'xlsx';

export default function Financial() {

    const [financialVisible, setfinancialVisible] = useState(false);

    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [contractValue, setContractValue] = useState();
    const [totalContractValue, setTotalContractValue] = useState();
    const [currency, setCurrency] = useState([]);
    const [allCurrency, setAllCurrency] = useState([]);
    const [currencyPercent, setCurrencyPercent] = useState(1);
    const [currencyValue, setCurrencyValue] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [allPaymentType, setAllPaymentType] = useState([]);
    const [remarks, setRemarks] = useState('');
    const [billingFrequency, setBillingFrequency] = useState([]);
    const [allBillingFrequency, setAllBillingFrequency] = useState([]);
    const [billingQtty, setBillingQtty] = useState(1);
    const [billingDay, setBillingDay] = useState(1);
    const [billingDueDays, setBillingDueDays] = useState(10);
    const [billingPenaltyPercent, setBillingPenaltyPercent] = useState(1);
    const [guaranteeLetter, setGuaranteeLetter] = useState(false);
    const [guaranteeLetterValue, setGuaranteeLetterValue] = useState();
    const [guaranteeLetterDate, setGuaranteeLetterDate] = useState(false);
    const [guaranteeLetterCurrency, setGuaranteeLetterCurrency] = useState([]);
    const [measuringUnit, setMeasuringUnit] = useState();
    const [allMeasuringUnit, setAllMeasuringUnit] = useState();

    const dt = useRef(null);
    const [data, setData] = useState(null);


    const cols = [
        { field: 'name', header: 'Name' },
        { field: 'start', header: 'start' },
        { field: 'final', header: 'final' },
        { field: 'cantitate', header: 'cantitate' },
        { field: 'facturat', header: 'facturat' },
        { field: 'valoare', header: 'valoare' },
        { field: 'interval', header: 'interval' },
        { field: 'pret', header: 'pret' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));


    const item2 = [
        { name: "Servicii chirie", start: "2022-01-01", final: "2022-01-31", cantitate: "1", pret: "200", valoare: "200 EUR", interval: "Lunar", facturat: "true" },
        { name: "Tarif de administrare", start: "2023-02-01", final: "2022-02-29", cantitate: "1", pret: "400", valoare: "400 EUR", interval: "Lunar", facturat: "false" }
    ]

    //la nivel de partener trebuie adaugata o bifa, daca este sau nu platitor TVA

    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item").then(response => { return response.json() })
            .then(item => { setItems(item) })
    }

    const fetchAllCurrencies = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

    const fetchAllBillingFrequency = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/billingfrequency`).then(res => res.json())
        setAllBillingFrequency(response);
    }

    const fetchAllPaymentType = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/paymenttype`).then(res => res.json())
        setAllPaymentType(response);
    }

    const fetchAllMeasuringUnit = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/measuringunit`).then(res => res.json())
        setAllMeasuringUnit(response);
    }


    useEffect(() => {
        fetchItemsData(),
            fetchAllCurrencies(),
            fetchAllBillingFrequency(),
            fetchAllPaymentType(),
            fetchAllMeasuringUnit()

    }, [])

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, item2);
                doc.save('scandetar.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(item2);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'scadentar');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };




    const handleFileUpload = (event) => {
        const file = event.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Convert JSON with headers to array of JSON objects without headers
            const headers = jsonData[0];
            const dataArray = jsonData.slice(1).map((row) => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[`${header}`] = row[index];
                });
                return obj;
            });

            setData(dataArray);
        };

        reader.readAsBinaryString(file);
    };

    const chooseOptions = {
        icon: "pi pi-search",
        label: "Import"
        //  * Options used to customize the upload button. These options have "label", "icon", "className" and "style" properties.
    };

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />

            <FileUpload
                mode="basic"
                auto
                accept=".xls,.xlsx"
                uploadLabel="Incarca"
                cancelLabel="Renunta"
                customUpload
                uploadHandler={handleFileUpload}
                chooseOptions={chooseOptions}
            />
        </div>
    );

    return (
        <div className='card'>
            <div className="grid">
                <div className="col-12">
                    <div className="p-fluid formgrid grid pt-2">

                        <div className="field col-12 md:col-3">
                            <label htmlFor="item">Obiect de contract</label>
                            <Dropdown id="item" filter value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="totalContractValue">Pret</label>
                            <InputText id="totalContractValue" type="text" value={totalContractValue} onChange={(e) => setContractValue(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="currency">Valuta</label>
                            <Dropdown id="currency" filter value={currency} onChange={(e) => setCurrency(e.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="currencyValue">Curs referinta</label>
                            <InputText id="currencyValue" type="text" value={currencyValue} onChange={(e) => setCurrencyValue(e.target.value)} />
                        </div>


                        <div className="field col-12  md:col-3">
                            <label htmlFor="currencyPercent">Procent peste BNR</label>
                            <InputText id="currencyPercent" type="text" value={currencyPercent} onChange={(e) => setCurrencyPercent(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="billingDay">Zi facturare</label>
                            <InputText id="billingDay" type="text" value={billingDay} onChange={(e) => setBillingDay(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="billingQtty">Cantitate facturata</label>
                            <InputText id="billingQtty" type="text" value={billingQtty} onChange={(e) => setBillingQtty(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="measuringUnit">Unitate de masura</label>
                            <Dropdown id="measuringUnit" filter value={measuringUnit} onChange={(e) => setMeasuringUnit(e.value)} options={allMeasuringUnit} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>


                        <div className="field col-12 md:col-3">
                            <label htmlFor="paymentType">Tip plata</label>
                            <Dropdown id="paymentType" filter value={paymentType} onChange={(e) => setPaymentType(e.value)} options={allPaymentType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="billingFrequency">Interval facturare</label>
                            <Dropdown id="billingFrequency" filter value={billingFrequency} onChange={(e) => setBillingFrequency(e.value)} options={allBillingFrequency} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="billingPenaltyPercent">Procent penalizare</label>
                            <InputText id="billingPenaltyPercent" filter value={billingPenaltyPercent} onChange={(e) => setBillingPenaltyPercent(e.value)} placeholder="Select One" />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="billingDueDays">Zile scadente</label>
                            <InputText id="billingDueDays" filter value={billingDueDays} onChange={(e) => setBillingDueDays(e.value)} placeholder="Select One" />
                        </div>

                        <div className="field col-12 md:col-12">
                            <label htmlFor="guaranteeLetterOtherInfo">Note</label>
                            <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={5} cols={30} />
                        </div>

                        <div className="field col-12 md:col-12 pt-4">
                            <ToggleButton onLabel="Da" offLabel="Nu" checked={guaranteeLetter} onChange={(e) => setGuaranteeLetter(e.value)} className="w-8rem" />
                            <label htmlFor="default" className="ml-2">Exista scrisoare garantie?</label>
                        </div>

                        {guaranteeLetter ?
                            <div className="col-12 md:col-12">
                                <div className="p-fluid formgrid grid pt-2">
                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Data scadenta scrisoare garantie
                                        </label>
                                        <Calendar id="start" value={guaranteeLetterDate} onChange={(e) => setGuaranteeLetterDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                    </div>

                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Valoare scrisoare garantie
                                        </label>
                                        <InputText id="guaranteeLetterValue" value={guaranteeLetterValue} onChange={(e) => setGuaranteeLetterDate(e.value)} />
                                    </div>

                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Valuta scrisoare garantie
                                        </label>
                                        <Dropdown id="billingFrequency" filter value={guaranteeLetterCurrency} onChange={(e) => setGuaranteeLetterCurrency(e.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                                    </div>


                                </div>
                            </div> : null}

                        <div className="field col-12 md:col-3 pt-4">
                            <Button label="Genereaza scadentar" icon="pi pi-external-link" />
                        </div>

                        <div className="field col-12 md:col-12 pt-4">
                            {/* <DataTable className='pt-2' value={item2} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="name" header="Name"></Column>
                                <Column field="start" header="start"></Column>
                                <Column field="final" header="final"></Column>
                                <Column field="cantitate" header="cantitate"></Column>
                                <Column field="pret" header="pret"></Column>
                                <Column field="valoare" header="valoare"></Column>
                                <Column field="interval" header="interval"></Column>
                                <Column field="facturat" header="facturat"></Column>
                            </DataTable> */}

                            <DataTable ref={dt} value={item2} header={header} tableStyle={{ minWidth: '50rem' }}>
                                {cols.map((col, index) => (
                                    <Column key={index} field={col.field} header={col.header} />
                                ))}
                            </DataTable>

                            {/* <div className='pt-4'>
                                <InputText type="file" className="p-inputtext-sm" placeholder="Importa Scadentar" onChange={handleFileUpload} />
                                {data && (
                                    <div>
                                        <h2>Parsed Data:</h2>
                                        <pre>{JSON.stringify(data, null, 2)}</pre>
                                    </div>
                                )}
                            </div> */}

                            <DataTable className='pt-8' ref={dt} value={data} tableStyle={{ minWidth: '50rem' }}>
                                {cols.map((col, index) => (
                                    <Column key={index} field={col.field} header={col.header} />
                                ))}
                            </DataTable>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}