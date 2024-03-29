'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from "primereact/inputtextarea";
import { ToggleButton } from 'primereact/togglebutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import * as XLSX from 'xlsx';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import axios from 'axios';

export default function Financial() {

    const [financialVisible, setfinancialVisible] = useState(false);
    const [indexTable, setIndextable] = useState(0)
    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [contractValue, setContractValue] = useState();
    const [totalContractValue, setTotalContractValue] = useState(1000);
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
    const [guaranteeLetterValue, setGuaranteeLetterValue] = useState(0);
    const [guaranteeLetterDate, setGuaranteeLetterDate] = useState('');
    const [guaranteeLetterCurrency, setGuaranteeLetterCurrency] = useState([]);
    const [measuringUnit, setMeasuringUnit] = useState();
    const [allMeasuringUnit, setAllMeasuringUnit] = useState();
    const [scadentar, setScadentar] = useState([]);
    const [active, setActive] = useState(true);

    const [isInvoiced, setIsInvoiced] = useState(false);
    const [isPayed, setIsPayed] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState();


    const dt = useRef(null);
    // const [data, setData] = useState(null);

    const cols = [
        { field: 'item', header: 'item' },
        { field: 'data', header: 'data' },
        { field: 'um', header: 'um' },
        { field: 'cantitate', header: 'cantitate' },
        { field: 'pret', header: 'pret' },
        { field: 'valoare', header: 'valoare' },
        { field: 'moneda', header: 'moneda' },
        { field: 'isInvoiced', header: 'isInvoiced' },
        { field: 'isPayed', header: 'isPayed' }
        // { field: 'facturat', header: 'facturat' },
        // { field: 'platit', header: 'platit' },
    ];


    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const [selectedCell, setSelectedCell] = useState(null);
    const [editingCell, setEditingCell] = useState(null);

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

    useEffect(() => {
        setIndextable(indexTable + 1)
    }, [scadentar])



    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, scadentar);
                doc.save('scandetar.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(scadentar);
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

            // setData(dataArray);
            setScadentar(dataArray);
        };

        reader.readAsBinaryString(file);
    };

    const chooseOptions = {
        icon: "pi pi-search",
        label: "Import"
        //  * Options used to customize the upload button. These options have "label", "icon", "className" and "style" properties.
    };


    const generateTimeTable = () => {

        var startDate: any = '2021-01-01'
        var endDate: any = '2022-07-01'

        // month sch
        if (billingFrequency) {
            if (billingFrequency.id == 3) {
                var year = new Date(endDate).getFullYear() - new Date(startDate).getFullYear();
                var enddate_month = new Date(endDate).getMonth()
                var startdate_month = new Date(startDate).getMonth()
                var result = 1 + (year * 12) + (enddate_month - startdate_month)

                const array: {
                    id: Number
                    itemid: Number, item: string, data: string, um: string, measuringunitid: Number, cantitate: Number, pret: Number,
                    valoare: Number, billingValue: Number, moneda: string, currencyid: Number, isPayed: Number, isInvoiced: Number
                }[] = [];


                for (let i = 0; i < result; i++) {
                    const oneMonthAhead = new Date(startDate);
                    oneMonthAhead.setMonth(new Date(startDate).getMonth() + i);

                    const year = oneMonthAhead.getFullYear();
                    const month = String(oneMonthAhead.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(billingDay).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;

                    array.push({
                        id: i,
                        itemid: selectedItem.id, item: selectedItem.name, data: formattedDate, um: measuringUnit.name, measuringunitid: measuringUnit.id,
                        cantitate: billingQtty, pret: totalContractValue, valoare: (billingQtty * totalContractValue),
                        billingValue: (billingQtty * totalContractValue), moneda: currency.code, currencyid: currency.id, isPayed: isPayed, isInvoiced: isInvoiced
                    })



                    setScadentar(array)
                }
            }
        }
    }

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            <Button type="button" icon="pi pi-sign-out" severity="info" rounded onClick={generateTimeTable} />

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

    const onCellSelect = (event) => {

        if (event.cellIndex == 9) {
            let schIndex: number = scadentar.findIndex(id => id.id === event.rowData.id);

            scadentar[schIndex].isInvoiced = !event.rowData.isInvoiced;
        }

        if (event.cellIndex == 10) {
            let schIndex: number = scadentar.findIndex(id => id.id === event.rowData.id);

            scadentar[schIndex].isPayed = !event.rowData.isPayed;
        }

        setIndextable(indexTable + 1)

        // console.log(event.rowData.id)
        // console.log(event.cellIndex)
        // console.log(event.rowData)
    };

    const saveData = async () => {

        interface financialDetail {
            itemid?: number,
            totalContractValue?: number,
            currencyid?: number,
            currencyValue?: boolean,
            currencyPercent?: boolean,
            billingDay?: number,
            billingQtty?: number,
            billingFrequencyid?: number,
            measuringUnitid?: number,
            paymentTypeid?: number,
            billingPenaltyPercent?: boolean,
            billingDueDays?: number,
            remarks?: String,
            guaranteeLetter?: Boolean,
            guaranteeLetterCurrencyid?: number,
            guaranteeLetterDate?: Date | undefined,
            guaranteeLetterValue?: Boolean,
            contractItemId?: number,
            active?: boolean,
            // contractfinancialItemId: number

        }

        let addedfinancialDetail: financialDetail = {
            itemid: parseInt(selectedItem.id),
            totalContractValue: parseFloat(totalContractValue),
            currencyid: parseInt(currency.id),
            currencyValue: parseFloat(currencyValue),
            currencyPercent: currencyPercent,
            billingDay: parseInt(billingDay),
            billingQtty: parseFloat(billingQtty),
            billingFrequencyid: parseInt(billingFrequency.id),
            measuringUnitid: parseInt(measuringUnit.id),
            paymentTypeid: paymentType.id,
            billingPenaltyPercent: parseInt(billingPenaltyPercent),
            billingDueDays: parseInt(billingDueDays),
            remarks: remarks,
            guaranteeLetter: guaranteeLetter ? guaranteeLetter : null,
            guaranteeLetterCurrencyid: guaranteeLetterCurrency ? guaranteeLetterCurrency.id : null,
            guaranteeLetterDate: guaranteeLetterDate ? guaranteeLetterDate : null,
            guaranteeLetterValue: guaranteeLetterValue ? parseFloat(guaranteeLetterValue) : 0,
            contractItemId: 0,
            active: active,
            // contractfinancialItemId: 0
        }

        interface financialDetailSchedule {
            itemid: number,
            currencyid?: number,
            date: Date,
            measuringUnitid?: number,
            billingQtty: number,
            totalContractValue: number,
            billingValue: number,
            isInvoiced: boolean,
            isPayed: boolean,
            active?: boolean,
            contractfinancialItemId?: number
        }

        const ResultSchedule: financialDetailSchedule[] = []
        scadentar.forEach(
            scadenta => {
                const add: financialDetailSchedule = {
                    itemid: scadenta.itemid,
                    currencyid: scadenta.currencyid,
                    date: new Date(scadenta.data),
                    measuringUnitid: scadenta.measuringunitid,
                    billingQtty: parseFloat(scadenta.cantitate),
                    totalContractValue: scadenta.valoare,
                    billingValue: parseFloat(scadenta.pret),
                    isInvoiced: scadenta.isInvoiced,
                    isPayed: scadenta.isPayed,
                    active: active,
                    contractfinancialItemId: 0

                }
                ResultSchedule.push(add)
            }
        )

        interface financialContractItem {
            contractId?: number,
            itemid: number,
            currencyid?: number,
            currencyValue?: number,
            billingFrequencyid: number,
            active?: boolean
        }


        const financialContractItem = {
            contractId: 1,
            itemid: selectedItem.id,
            currencyid: currency.id,
            currencyValue: parseFloat(totalContractValue),
            billingFrequencyid: billingFrequency.id,
            active: active,

        }

        try {

            console.log(financialContractItem)
            const responseitem = await axios.post('http://localhost:3000/contracts/contractItems',
                [financialContractItem, addedfinancialDetail, ResultSchedule]
            );

            // const response = await axios.post('http://localhost:3000/contracts/financialDetail',
            //     addedfinancialDetail
            // );

            // const responsesch = await axios.post('http://localhost:3000/contracts/financialDetailSchedule',
            //     ResultSchedule
            // );




            console.log('Contract details added:', responseitem.data
                // , response.data, responsesch.data
            );
        } catch (error) {
            console.error('Error creating contract details:', error);
        }

    }

    // const saveData = () => {
    //     console.log(selectedItem.id, totalContractValue, currency.id, currencyValue, currencyPercent, billingDay, billingQtty, billingFrequency.id, measuringUnit.id,
    //         paymentType.id, billingPenaltyPercent, billingDueDays, remarks, guaranteeLetter, guaranteeLetterCurrency.id, guaranteeLetterDate, guaranteeLetterValue)

    //     console.log("scadentar", scadentar)
    //     //treb adaugate id-urile si ascune la afisare - fol doar la export
    // }

    //in cazul saptm - zi facturare reprez ziua din sapt de la 1 - 7
    //se sparge in func de start end la nr de intervale si se copiaza valoarile in tabel.


    const statusInvoiceTemplate = (product) => {
        return <Tag value={product.isInvoiced} severity={getSeverity(product)}></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.isInvoiced) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };


    const statusPayedTemplate = (product) => {
        return <Tag value={product.isPayed} severity={getSeverity2(product)}></Tag>;
    };

    const getSeverity2 = (product) => {
        switch (product.isPayed) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };


    return (
        <div className='card'>
            <div className="grid">
                <div className="col-12">
                    <div className="p-fluid formgrid grid pt-2">


                        <div className="field col-12 md:col-3">
                            <label htmlFor="item">Obiect de contract</label>
                            <Dropdown id="item" filter showClear value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="totalContractValue">Pret</label>
                            <InputText id="totalContractValue" type="text" value={totalContractValue} onChange={(e) => setTotalContractValue(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="currency">Valuta</label>
                            <Dropdown id="currency" filter showClear value={currency} onChange={(e) => setCurrency(e.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="currencyValue">Curs referinta</label>
                            <InputText id="currencyValue" type="text" value={currencyValue} onChange={(e) => setCurrencyValue(e.target.value)} />
                        </div>


                        <div className="field col-12  md:col-3">
                            <label htmlFor="currencyPercent">Curs BNR plus Procent</label>
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
                            <Dropdown id="measuringUnit" filter showClear value={measuringUnit} onChange={(e) => setMeasuringUnit(e.value)} options={allMeasuringUnit} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>


                        <div className="field col-12 md:col-3">
                            <label htmlFor="paymentType">Tip plata</label>
                            <Dropdown id="paymentType" filter showClear value={paymentType} onChange={(e) => setPaymentType(e.value)} options={allPaymentType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="billingFrequency">Interval facturare</label>
                            <Dropdown id="billingFrequency" filter showClear value={billingFrequency} onChange={(e) => setBillingFrequency(e.value)} options={allBillingFrequency} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="billingPenaltyPercent">Procent penalizare(%/zi)</label>
                            <InputText id="billingPenaltyPercent" value={billingPenaltyPercent} onChange={(e) => setBillingPenaltyPercent(e.target.value)} placeholder="Select One" />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="billingDueDays">Zile scadente</label>
                            <InputText id="billingDueDays" value={billingDueDays} onChange={(e) => setBillingDueDays(e.target.value)} placeholder="Select One" />
                        </div>

                        <div className="field-checkbox col-12 md:col-12">
                            <Checkbox id="ent_legal_person" checked={active} onChange={e => setActive(e.checked)}></Checkbox>
                            <label htmlFor="ent_legal_person" className="ml-2">Activ</label>
                        </div>


                        <div className="field col-12 md:col-12">
                            <label htmlFor="guaranteeLetterOtherInfo">Note</label>
                            <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={5} cols={30} />
                        </div>

                        <div className="field col-12 md:col-12 pt-4">
                            <ToggleButton onLabel="Da" offLabel="Nu" checked={guaranteeLetter} onChange={(e) => setGuaranteeLetter(e.value)} className="w-8rem" />
                            <label htmlFor="default" className="ml-2">Exista scrisoare garantie?</label>
                        </div>

                        {/* <Checkbox onChange={e => setChecked(e.checked)} checked={checked}></Checkbox> */}

                        {guaranteeLetter ?
                            <div className="col-12 md:col-12">
                                <div className="p-fluid formgrid grid pt-2">
                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Data SGB
                                        </label>
                                        <Calendar id="start" value={guaranteeLetterDate} onChange={(e) => setGuaranteeLetterDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                    </div>

                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Valoare SGB
                                        </label>
                                        <InputText id="guaranteeLetterValue" value={guaranteeLetterValue} onChange={(e) => setGuaranteeLetterValue(e.target.value)} />
                                    </div>

                                    <div className="field col-12 md:col-3">
                                        <label className="font-bold block mb-2">
                                            Valuta SGB
                                        </label>
                                        <Dropdown id="guaranteeLetterCurrency" filter value={guaranteeLetterCurrency} onChange={(e) => setGuaranteeLetterCurrency(e.target.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                                    </div>
                                </div>
                            </div> : null}


                        <div className="field col-12 md:col-12 pt-4">

                            <DataTable key={indexTable} ref={dt} className='pt-2' value={scadentar} tableStyle={{ minWidth: '50rem' }} header={header}
                                cellSelection selectionMode="single" selection={selectedSchedule}
                                onCellSelect={onCellSelect}
                                onSelectionChange={(e) => {
                                    setSelectedSchedule(e.value)
                                    // console.log("linie selectata: ", e.value.rowData.isInvoiced)
                                }}
                                stripedRows
                                sortMode="multiple"
                                sortField="data"
                                dataKey="data"
                                sortOrder={1} //cres
                            >
                                <Column field="item" header="item"></Column>
                                <Column field="data" header="data"></Column>
                                <Column field="um" header="um"></Column>
                                <Column field="cantitate" header="cantitate"></Column>
                                <Column field="pret" header="pret"></Column>
                                <Column field="valoare" header="valoare"></Column>
                                <Column field="moneda" header="moneda"></Column>
                                {/* <Column header="facturat" style={{ width: '10vh' }} body={isInvoicedTemplate} />
                                <Column header="platit" style={{ width: '10vh' }} body={isPayedTemplate} />
                                <Column header="facturat2" style={{ width: '10vh' }} body={
                                    scadentar.isInvoiced ? console.log("true") : console.log("false")
                                    // <i className="pi pi-circle-fill" style={{ fontSize: '1rem', color: 'green' }}></i>
                                    // : < i className="pi pi-circle" style={{ fontSize: '1rem', color: 'green' }}></i >
                                } /> */}

                                <Column hidden field="isInvoiced" header="isInvoiced"></Column>
                                <Column hidden field="isPayed" header="isPayed"></Column>
                                <Column header="facturat" body={statusInvoiceTemplate}></Column>
                                <Column header="platit" body={statusPayedTemplate}></Column>


                            </DataTable>


                        </div>
                        <div className="field col-12 md:col-2">
                            <Button label="Salveaza" onClick={saveData} />
                        </div>


                    </div>

                </div>
            </div>
        </div >
    );
}