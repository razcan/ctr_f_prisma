'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
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
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

export default function Financial() {

    const [financialVisible, setfinancialVisible] = useState(false);
    const [indexTable, setIndextable] = useState(0)
    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [contractValue, setContractValue] = useState();
    const [totalContractValue, setTotalContractValue] = useState(1000);
    const [currency, setCurrency] = useState<any>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any>([]);
    // const [Currency, setCurrency] = useState<any>([]);

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
    const [measuringUnit, setMeasuringUnit] = useState();
    const [allMeasuringUnit, setAllMeasuringUnit] = useState();
    const [scadentar, setScadentar] = useState([]);
    const [active, setActive] = useState(true);
    const [contractItem, setContractItem] = useState([]);
    const [isInvoiced, setIsInvoiced] = useState(false);
    const [isPayed, setIsPayed] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState();
    const [contractfinancialItemId, setContractfinancialItemId] = useState(0);

    const [advancePercent, setAdvancePercent] = useState(0);
    const [visible, setVisible] = useState(false);
    const [guaranteeLetter, setGuaranteeLetter] = useState(false);
    const [guaranteeLetterValue, setGuaranteeLetterValue] = useState(0);
    const [guaranteeLetterDate, setGuaranteeLetterDate] = useState('');
    const [guaranteeLetterCurrency, setGuaranteeLetterCurrency] = useState([]);
    const [guaranteeLetterInfo, setGuaranteeLetterInfo] = useState('');
    const [guaranteeLetterBank, setGuaranteeLetterBank] = useState([]);
    const [guaranteeSelectedBank, setGuaranteeSelectedBank] = useState<any>([]);
    const [guaranteeSelectedCurrency, setGuaranteeSelectedCurrency] = useState<any>([]);


    const [goodexecutionLetter, setGoodexecutionLetter] = useState(false);
    const [goodexecutionValue, setGoodexecutionValue] = useState(0);
    const [goodexecutionDate, setGoodexecutionDate] = useState('');
    const [goodexecutionCurrency, setGoodexecutionCurrency] = useState([]);
    const [goodexecutionInfo, setGoodexecutionInfo] = useState('');
    const [goodexecutionBank, setGoodexecutionBank] = useState([]);
    const [goodexecutionSelectedBank, setGoodexecutionSelectedBank] = useState<any>([]);
    const [goodexecutionSelectedCurrency, setGoodexecutionSelectedCurrency] = useState<any>([]);

    const [selectedSchLineDate, setSelectedSchLineDate] = useState('');
    const [selectedSchLineQtty, setSelectedSchLineQtty] = useState(0);
    const [selectedSchLinePrice, setSelectedSchLinePrice] = useState(0);
    const [selectedSchLineValue, setSelectedSchLineValue] = useState(0);
    const [selectedSchLine, setSelectedSchLine] = useState([]);
    const [isPurchasing, setIsPurchasing] = useState('');


    const [allBanks, setAllBanks] = useState<any>([]);

    const [startContractDate, setStartContractDate] = useState('');
    const [endContractDate, setEndContractDate] = useState('');

    const toast = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");
    const ctrId = searchParams.get("ctrId");

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

    interface financialDetailSchedule {
        itemid: number,
        currencyid?: number,
        date: Date,
        measuringUnitid?: number,
        billingQtty: number,
        price: number,
        billingValue: number,
        isInvoiced: boolean,
        isPayed: boolean,
        active?: boolean,
        contractfinancialItemId?: number

    }


    const dt = useRef(null);
    // const [data, setData] = useState(null);

    const cols = [
        { field: 'articol', header: 'Articol' },
        { field: 'date', header: 'Data' },
        { field: 'measuringUnit.name', header: 'UM' },
        { field: 'billingQtty', header: 'Cantitate' },
        { field: 'totalContractValue', header: 'Pret' },
        { field: 'billingValue', header: 'Valoare' },
        { field: 'currency.code', header: 'Moneda' },
        { field: 'isInvoiced', header: 'Facturat' },
        { field: 'isPayed', header: 'Platit' }
        // { field: 'facturat', header: 'facturat' },
        // { field: 'platit', header: 'platit' },
    ];


    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const [selectedCell, setSelectedCell] = useState(null);
    const [editingCell, setEditingCell] = useState(null);

    //la nivel de partener trebuie adaugata o bifa, daca este sau nu platitor TVA

    const fetchContractItemData = () => {
        fetch(`http://localhost:3000/contracts/contractItemsEditDetails/${Id}`).then(response => { return response.json() })
            .then(contractItem => {
                // setContractItem(contractItem)
                console.log(contractItem)
                setSelectedItem(contractItem[0].item);
                setCurrency(contractItem[0].currency);

                setGuaranteeSelectedCurrency(contractItem[0].ContractFinancialDetail[0].guaranteecurrency);
                setGuaranteeSelectedBank(contractItem[0].ContractFinancialDetail[0].guaranteeLetterBank);
                setGuaranteeLetter(contractItem[0].ContractFinancialDetail[0].guaranteeLetter);
                setGuaranteeLetterCurrency(contractItem[0].ContractFinancialDetail[0].guaranteecurrency);
                setGuaranteeLetterDate(new Date(contractItem[0].ContractFinancialDetail[0].guaranteeLetterDate));
                setGuaranteeLetterValue(contractItem[0].ContractFinancialDetail[0].guaranteeLetterValue);
                setGuaranteeLetterInfo(contractItem[0].ContractFinancialDetail[0].guaranteeLetterInfo)

                setGoodexecutionSelectedCurrency(contractItem[0].ContractFinancialDetail[0].goodexecutionLetterCurrency);
                setGoodexecutionSelectedBank(contractItem[0].ContractFinancialDetail[0].goodexecutionLetterBank);
                setGoodexecutionLetter(contractItem[0].ContractFinancialDetail[0].goodexecutionLetter);
                setGoodexecutionDate(new Date(contractItem[0].ContractFinancialDetail[0].goodexecutionLetterDate));
                setGoodexecutionValue(contractItem[0].ContractFinancialDetail[0].goodexecutionLetterValue)
                setGoodexecutionInfo(contractItem[0].ContractFinancialDetail[0].goodexecutionLetterInfo)


                setMeasuringUnit(contractItem[0].ContractFinancialDetail[0].measuringUnit);
                setPaymentType(contractItem[0].ContractFinancialDetail[0].paymentType);

                setTotalContractValue(contractItem[0].ContractFinancialDetail[0].totalContractValue);

                setCurrencyValue(contractItem[0].ContractFinancialDetail[0].currencyValue);
                setCurrencyPercent(contractItem[0].ContractFinancialDetail[0].currencyPercent);

                setBillingDay(contractItem[0].ContractFinancialDetail[0].billingDay);
                setBillingDueDays(contractItem[0].ContractFinancialDetail[0].billingDueDays);

                setBillingQtty(contractItem[0].ContractFinancialDetail[0].billingQtty);
                setBillingFrequency(contractItem[0].frequency);

                setBillingPenaltyPercent(contractItem[0].ContractFinancialDetail[0].billingPenaltyPercent);

                setRemarks(contractItem[0].ContractFinancialDetail[0].remarks);
                setActive(contractItem[0].ContractFinancialDetail[0].active);
                setContractItem(contractItem[0].ContractFinancialDetail[0].contractItemId);

                setScadentar(contractItem[0].ContractFinancialDetail[0].ContractFinancialDetailSchedule);

                setStartContractDate(contractItem[0].contract.start);
                setEndContractDate(contractItem[0].contract.end);


                setContractItem(contractItem[0].ContractFinancialDetail[0].items.id);

                if (contractItem[0].ContractFinancialDetail[0].ContractFinancialDetailSchedule[0] !== undefined) {
                    setContractfinancialItemId(contractItem[0].ContractFinancialDetail[0].ContractFinancialDetailSchedule[0].contractfinancialItemId)
                }

                // console.log(contractItem)
                // console.log(contractItem[0].ContractFinancialDetail[0].ContractFinancialDetailSchedule[0].contractfinancialItemId)
            })
    }

    const getCurrency = (CurrencyToFind: string) => {
        return allCurrency.find((obj: { code: string; }) => obj.code === CurrencyToFind);
    };

    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item").then(response => { return response.json() })
            .then(item => { setItems(item) })
    }

    const fetchAllCurrencies = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

    const fetchAllBanks = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/allbanks`).then(res => res.json())
        setAllBanks(response);
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
        fetchContractItemData(),
            fetchItemsData(),
            fetchAllCurrencies(),
            fetchAllBillingFrequency(),
            fetchAllPaymentType(),
            fetchAllMeasuringUnit(),
            fetchAllBanks()


    }, [])

    useEffect(() => {
        setIndextable(indexTable + 1)
        console.log(scadentar)
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

        var startDate: any = startContractDate;
        var endDate: any = endContractDate;


        // trimestru - 3 luni -id 4 
        // semestru - 6 luni id 5
        // month sch - id 3
        // anual - id 6

        //lunar
        if (billingFrequency) {
            if (billingFrequency.id == 3) {
                var year = new Date(endDate).getFullYear() - new Date(startDate).getFullYear();
                var enddate_month = new Date(endDate).getMonth()
                var startdate_month = new Date(startDate).getMonth()
                var result = 1 + (year * 12) + (enddate_month - startdate_month)

                const array: {
                    id: Number
                    itemid: Number, 'Articol': string, Date: string,
                    'measuringUnit.name': string,
                    measuringunitid: Number, cantitate: Number, pret: Number,
                    valoare: Number, billingValue: Number, 'currency.code': string,
                    currencyid: Number, isPayed: Number, isInvoiced: Number
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
                        itemid: selectedItem.id, 'Articol': selectedItem.name,
                        date: formattedDate, 'measuringUnit.name': measuringUnit.name,
                        measuringunitid: measuringUnit.id,
                        billingQtty: billingQtty, pret: price,
                        totalContractValue: (billingQtty * price),
                        billingValue: price,
                        'currency.code': currency.code,
                        currencyid: currency.id, isPayed: isPayed, isInvoiced: isInvoiced
                    })

                    setScadentar(array)
                }
            }
        }
        //trimestrial
        if (billingFrequency) {
            if (billingFrequency.id == 4) {
                var year = new Date(endDate).getFullYear() - new Date(startDate).getFullYear();
                var enddate_month = new Date(endDate).getMonth()
                var startdate_month = new Date(startDate).getMonth()
                var result = 1 + (year * 12) + (enddate_month - startdate_month)

                const array: {
                    id: Number
                    itemid: Number, 'Articol': string, Date: string,
                    'measuringUnit.name': string,
                    measuringunitid: Number, cantitate: Number, pret: Number,
                    valoare: Number, billingValue: Number, 'currency.code': string,
                    currencyid: Number, isPayed: Number, isInvoiced: Number
                }[] = [];


                for (let i = 0; i < result; i += 3) {
                    const oneMonthAhead = new Date(startDate);
                    oneMonthAhead.setMonth(new Date(startDate).getMonth() + i);

                    const year = oneMonthAhead.getFullYear();
                    const month = String(oneMonthAhead.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(billingDay).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;

                    array.push({
                        id: i,
                        itemid: selectedItem.id, 'Articol': selectedItem.name,
                        date: formattedDate, 'measuringUnit.name': measuringUnit.name,
                        measuringunitid: measuringUnit.id,
                        billingQtty: billingQtty, pret: price,
                        totalContractValue: (billingQtty * price),
                        billingValue: price,
                        'currency.code': currency.code,
                        currencyid: currency.id, isPayed: isPayed, isInvoiced: isInvoiced
                    })

                    setScadentar(array)
                }
            }
        }

        //semestrial
        if (billingFrequency) {
            if (billingFrequency.id == 5) {
                var year = new Date(endDate).getFullYear() - new Date(startDate).getFullYear();
                var enddate_month = new Date(endDate).getMonth()
                var startdate_month = new Date(startDate).getMonth()
                var result = 1 + (year * 12) + (enddate_month - startdate_month)

                const array: {
                    id: Number
                    itemid: Number, 'Articol': string, Date: string,
                    'measuringUnit.name': string,
                    measuringunitid: Number, cantitate: Number, pret: Number,
                    valoare: Number, billingValue: Number, 'currency.code': string,
                    currencyid: Number, isPayed: Number, isInvoiced: Number
                }[] = [];


                for (let i = 0; i < result; i += 6) {
                    const oneMonthAhead = new Date(startDate);
                    oneMonthAhead.setMonth(new Date(startDate).getMonth() + i);

                    const year = oneMonthAhead.getFullYear();
                    const month = String(oneMonthAhead.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(billingDay).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;

                    array.push({
                        id: i,
                        itemid: selectedItem.id, 'articol': selectedItem.name,
                        date: formattedDate, 'measuringUnit.name': measuringUnit.name,
                        measuringunitid: measuringUnit.id,
                        billingQtty: billingQtty, pret: price,
                        totalContractValue: (billingQtty * price),
                        billingValue: price,
                        'currency.code': currency.code,
                        currencyid: currency.id, isPayed: isPayed, isInvoiced: isInvoiced
                    })

                    setScadentar(array)
                }
            }
        }

        //anual
        if (billingFrequency) {
            if (billingFrequency.id == 6) {

                var year = new Date(endDate).getFullYear() - new Date(startDate).getFullYear();
                var enddate_month = new Date(endDate).getMonth()
                var startdate_month = new Date(startDate).getMonth()
                var result = 1 + (year * 12) + (enddate_month - startdate_month)
                const nrOfYears = Math.floor(result / 12);

                const array: {
                    id: Number
                    itemid: Number, 'Articol': string, Date: string,
                    'measuringUnit.name': string,
                    measuringunitid: Number, cantitate: Number, pret: Number,
                    valoare: Number, billingValue: Number, 'currency.code': string,
                    currencyid: Number, isPayed: Number, isInvoiced: Number
                }[] = [];

                for (let i = 0; i < nrOfYears; i++) {

                    const oneYearhAhead = new Date(startDate);
                    const year = oneYearhAhead.getFullYear() + i;
                    const month = String(oneYearhAhead.getMonth()).padStart(2, '0'); // Months are zero-based
                    const day = String(billingDay).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;

                    array.push({
                        id: i,
                        itemid: selectedItem.id, 'Articol': selectedItem.name,
                        date: formattedDate, 'measuringUnit.name': measuringUnit.name,
                        measuringunitid: measuringUnit.id,
                        billingQtty: billingQtty, pret: price,
                        totalContractValue: (billingQtty * price),
                        billingValue: price,
                        'currency.code': currency.code,
                        currencyid: currency.id, isPayed: isPayed, isInvoiced: isInvoiced
                    })

                    setScadentar(array)

                }
            }
        }

    }
    const deleteDataScadentar = async () => {

        const ResultSchedule: financialDetailSchedule[] = []
        scadentar.forEach(
            scadenta => {
                const add: financialDetailSchedule = {
                    itemid: scadenta.itemid,
                    currencyid: scadenta.currencyid,
                    date: new Date(scadenta.date),
                    measuringUnitid: scadenta.measuringunitid,
                    billingQtty: parseFloat(scadenta.cantitate),
                    totalContractValue: scadenta.valoare,
                    billingValue: parseFloat(scadenta.cantitate * scadenta.valoare),
                    isInvoiced: scadenta.isInvoiced,
                    isPayed: scadenta.isPayed,
                    active: active,
                    contractfinancialItemId: contractfinancialItemId

                }
                ResultSchedule.push(add)
            }
        )
        console.log(ResultSchedule)
        try {
            const responseitem = await axios.delete(`http://localhost:3000/contracts/financialDetailSchedule/${Id}`
            );
            console.log('Contract details added:', contractfinancialItemId
            );
        } catch (error) {
            console.error('Error creating contract details:', error);
        }

    }


    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            <Button type="button" icon="pi pi-sign-out" severity="info" rounded onClick={generateTimeTable} />
            <Button type="button" icon="pi pi-delete-left" severity="danger" rounded onClick={deleteDataScadentar} />

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

        if (event.cellIndex == 11) {
            let schIndex: number = scadentar.findIndex(id => id.id === event.rowData.id);
            setSelectedSchLine(event.rowData);
            setSelectedSchLineDate(event.rowData.date);
            setSelectedSchLineQtty(event.rowData.billingQtty);
            setSelectedSchLinePrice(event.rowData.pret);
            const amount = (event.rowData.billingQtty * event.rowData.pret)
            setSelectedSchLineValue(amount);

            setVisible(true)
        }

        setIndextable(indexTable + 1)

        // console.log(event.rowData.id)
        // console.log(event.cellIndex)
        // console.log(event.rowData)
    };



    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];

        // console.log(fields, "fields")

        if (!fields.itemid) {
            errors.push("Trebuie sa setati un articol!");
        }

        if (!fields.currencyid) {
            errors.push("Trebuie sa setati o valuta!");
        }

        if (!fields.price) {
            errors.push("Trebuie sa introduceti un pret!");
        }

        if (!fields.billingDay) {
            errors.push("Trebuie sa setati ziua de facturare!");
        }

        if (!fields.billingQtty) {
            errors.push("Trebuie sa setati cantitatea facturata!");
        }

        if (!fields.measuringUnitid) {
            errors.push("Trebuie sa selectati unitatea de masura!");
        }

        if (!fields.paymentTypeid) {
            errors.push("Trebuie sa selectati tipul platii!");
        }


        if (!fields.billingFrequencyid) {
            errors.push("Trebuie sa selectati intervalul de facturare!");
        }

        if (!fields.billingPenaltyPercent) {
            errors.push("Trebuie sa setati procentul de penalizare!");
        }

        if (!fields.billingDueDays) {
            errors.push("Trebuie sa selectati numarul de zile scadenta!");
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }


    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };


    const saveData = async () => {

        // let addedfinancialDetail: financialDetail = {
        //     itemid: selectedItem.id,
        //     totalContractValue: parseFloat(totalContractValue),
        //     currencyid: currency.id,
        //     currencyValue: parseFloat(currencyValue),
        //     currencyPercent: parseFloat(currencyPercent),
        //     billingDay: parseInt(billingDay),
        //     billingQtty: parseFloat(billingQtty),
        //     billingFrequencyid: billingFrequency.id,
        //     measuringUnitid: measuringUnit.id,
        //     paymentTypeid: paymentType.id,
        //     billingPenaltyPercent: billingPenaltyPercent,
        //     billingDueDays: parseInt(billingDueDays),
        //     remarks: remarks,
        //     guaranteeLetter: guaranteeLetter ? guaranteeLetter : null,
        //     guaranteeLetterCurrencyid: guaranteeLetterCurrency ? guaranteeLetterCurrency.id : null,
        //     guaranteeLetterDate: guaranteeLetterDate ? guaranteeLetterDate : null,
        //     guaranteeLetterValue: guaranteeLetterValue ? parseFloat(guaranteeLetterValue) : 0,
        //     contractItemId: 0,
        //     active: active,
        //     // contractfinancialItemId: 0
        // }

        let addedfinancialDetail = {
            itemid: parseInt(selectedItem.id),
            price: parseFloat(price),
            currencyid: parseInt(currency.id),
            currencyValue: parseFloat(currencyValue),
            currencyPercent: parseFloat(currencyPercent),
            billingDay: parseInt(billingDay),
            billingQtty: parseFloat(billingQtty),
            billingFrequencyid: billingFrequency.id,
            measuringUnitid: measuringUnit.id,
            paymentTypeid: paymentType.id,
            billingPenaltyPercent: parseInt(billingPenaltyPercent),
            billingDueDays: parseInt(billingDueDays),
            remarks: remarks,
            guaranteeLetter: guaranteeLetter ? guaranteeLetter : null,
            guaranteeLetterCurrencyid: guaranteeSelectedCurrency ? guaranteeSelectedCurrency.id : null,
            guaranteeLetterDate: guaranteeLetterDate ? guaranteeLetterDate : null,
            guaranteeLetterValue: guaranteeLetterValue ? parseFloat(guaranteeLetterValue) : 0,
            guaranteeLetterInfo: guaranteeLetterInfo,
            guaranteeLetterBankId: guaranteeSelectedBank ? parseInt(guaranteeSelectedBank.id) : null,
            contractItemId: 0,
            active: active,
            goodexecutionLetter: goodexecutionLetter,
            goodexecutionLetterCurrencyId: goodexecutionSelectedCurrency ? goodexecutionSelectedCurrency.id : null,
            goodexecutionLetterDate: goodexecutionDate ? goodexecutionDate : null,
            goodexecutionLetterValue: goodexecutionValue ? parseFloat(goodexecutionValue) : null,
            goodexecutionLetterInfo: goodexecutionInfo,
            goodexecutionLetterBankId: goodexecutionSelectedBank ? goodexecutionSelectedBank.id : null,
            advancePercent: parseFloat(advancePercent)
            // contractfinancialItemId: 0
        }


        const ResultSchedule: financialDetailSchedule[] = []
        scadentar.forEach(
            scadenta => {
                const add: financialDetailSchedule = {
                    itemid: scadenta.itemid,
                    currencyid: scadenta.currencyid,
                    date: new Date(scadenta.date),
                    measuringUnitid: scadenta.measuringunitid,
                    billingQtty: parseFloat(scadenta.billingQtty),
                    totalContractValue: scadenta.totalContractValue,
                    billingValue: parseFloat(scadenta.billingValue),
                    isInvoiced: scadenta.isInvoiced,
                    isPayed: scadenta.isPayed,
                    active: active,
                    contractfinancialItemId: contractfinancialItemId

                }
                ResultSchedule.push(add)
            }
        )

        interface financialContractItem {
            id: number,
            contractId?: number,
            itemid: number,
            currencyid?: number,
            currencyValue?: number,
            billingFrequencyid: number,
            active?: boolean
        }


        const financialContractItem = {
            id: parseInt(contractItem),
            contractId: parseInt(ctrId),
            itemid: selectedItem.id,
            currencyid: currency.id,
            currencyValue: parseFloat(totalContractValue),
            billingFrequencyid: billingFrequency.id,
            active: active,

        }

        try {

            // console.log(financialContractItem)
            const responseitem = await axios.patch(`http://localhost:3000/contracts/updatecontractItems/${Id}/${ctrId}/${contractfinancialItemId}`,
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


    const editSchTemplate = (product) => {
        return <Tag value="Edit"></Tag>;
    }

    const formatDate = (dateString: Date) => {
        // Implement your date formatting logic here
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('ro-Ro', options);
    };

    const StartBodyTemplate = (rowData: any) => {
        const formattedDate = formatDate(rowData.date);
        return <span>{formattedDate}</span>;
    };

    console.log(currency, "currency", guaranteeSelectedBank, "guaranteeSelectedBank")

    return (
        <div className='card'>
            <Toast ref={toast} position="top-right" />
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

                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="type">Banca</label>
                                        <Dropdown id="type"
                                            showClear
                                            value={guaranteeSelectedBank}
                                            onChange={(e) => setGuaranteeSelectedBank(e.value)}
                                            options={allBanks}
                                            optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>

                                    <div className="field col-12 md:col-2">
                                        <label className="font-bold block mb-2">
                                            Valuta
                                        </label>
                                        <Dropdown showClear id="guaranteeLetterCurrency" filter value={guaranteeSelectedCurrency} onChange={(e) => setGuaranteeSelectedCurrency(e.target.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                                    </div>

                                    <div className="field col-12 md:col-2">
                                        <label className="font-bold block mb-2">
                                            Data
                                        </label>
                                        <Calendar id="start" value={guaranteeLetterDate} onChange={(e) => setGuaranteeLetterDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                    </div>

                                    <div className="field col-12 md:col-2">
                                        <label className="font-bold block mb-2">
                                            Valoare
                                        </label>
                                        <InputText id="guaranteeLetterValue" value={guaranteeLetterValue} onChange={(e) => setGuaranteeLetterValue(e.target.value)} />
                                    </div>

                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="goodexecutionInfo">Alte Info</label>
                                        <InputText id="goodexecutionInfo" type="text" value={guaranteeLetterInfo} onChange={(e) => setGuaranteeLetterInfo(e.target.value)} />
                                    </div>



                                </div>
                            </div> : null}

                        <div className="field col-12 md:col-12 pt-4">
                            <ToggleButton onLabel="Da" offLabel="Nu" checked={goodexecutionLetter} onChange={(e) => setGoodexecutionLetter(e.value)} className="w-8rem" />
                            <label htmlFor="default" className="ml-2">Exista scrisoare de buna executie?</label>
                        </div>

                        {goodexecutionLetter ?
                            <div className="col-12 md:col-12">
                                <div className="p-fluid formgrid grid pt-2">



                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="type">Banca</label>
                                        <Dropdown id="type"
                                            showClear
                                            value={goodexecutionSelectedBank}
                                            onChange={(e) => setGoodexecutionSelectedBank(e.value)}
                                            options={allBanks}
                                            optionLabel="name" placeholder="Select One"></Dropdown>
                                    </div>

                                    <div className="field col-12 md:col-2">
                                        <label className="font-bold block mb-2">
                                            Valuta
                                        </label>
                                        <Dropdown showClear id="goodexecutionCurrency" filter value={goodexecutionSelectedCurrency} onChange={(e) => setGoodexecutionSelectedCurrency(e.target.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                                    </div>

                                    <div className="field col-12 md:col-2">
                                        <label className="font-bold block mb-2">
                                            Data
                                        </label>
                                        <Calendar id="start" value={goodexecutionDate} onChange={(e) => setGoodexecutionDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                                    </div>

                                    <div className="field col-12 md:col-2">
                                        <label className="font-bold block mb-2">
                                            Valoare
                                        </label>
                                        <InputText id="guaranteeLetterValue" value={goodexecutionValue} onChange={(e) => setGoodexecutionValue(e.target.value)} />
                                    </div>

                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="goodexecutionInfo">Alte Info</label>
                                        <InputText id="goodexecutionInfo" type="text" value={goodexecutionInfo} onChange={(e) => setGoodexecutionInfo(e.target.value)} />
                                    </div>

                                </div>
                            </div> : null}

                        <Dialog header="Editare linie scadentar" visible={visible}
                            style={{ width: '60vw' }} onHide={() => setVisible(false)}>
                            <div className="col-12 md:col-12">
                                <div className="p-fluid formgrid grid pt-2">


                                    <div className="field col-12  md:col-3">
                                        <label htmlFor="selectedItem">Articol</label>
                                        <InputText disabled id="selectedItem" type="text" value={selectedSchLine.articol} />
                                    </div>


                                    <div className="field col-12  md:col-2">
                                        <label className="font-bold block mb-2">
                                            Data
                                        </label>
                                        {/* <Calendar id="start" value={new Date(selectedSchLine.date)} onChange={(e) => setGoodexecutionDate(e.value)} showIcon dateFormat="dd/mm/yy" /> */}
                                        <Calendar id="start" value={new Date(selectedSchLineDate)} onChange={(e) => setSelectedSchLineDate(e.value)} showIcon dateFormat="dd/mm/yy" />

                                    </div>

                                    <div className="field col-12  md:col-2">
                                        <label htmlFor="goodexecutionInfo">Cantitate</label>
                                        <InputText id="goodexecutionInfo" type="text" value={selectedSchLineQtty} onChange={(e) => setSelectedSchLineQtty(e.target.value)} />
                                        {/* <InputText id="goodexecutionInfo" type="text" value={selectedSchLine.billingQtty} onChange={(e) => setGoodexecutionInfo(e.target.value)} /> */}
                                    </div>

                                    <div className="field col-12  md:col-2">
                                        <label htmlFor="goodexecutionInfo">Pret</label>
                                        <InputText id="goodexecutionInfo" type="text" value={selectedSchLinePrice} onChange={(e) => setSelectedSchLinePrice(e.target.value)} />
                                    </div>

                                    <div className="field col-12  md:col-2">
                                        <label htmlFor="goodexecutionInfo">Valoare</label>
                                        <InputText disabled id="goodexecutionInfo" type="text" value={selectedSchLineValue} onChange={(e) => setSelectedSchLineValue(e.target.value)} />
                                        {/* <InputText id="goodexecutionInfo" type="text" value={selectedSchLine.billingValue} onChange={(e) => setGoodexecutionInfo(e.target.value)} /> */}
                                    </div>

                                </div>

                                <div className='pt-1'>
                                    <div className='grid'>

                                        <div className='col-1 pl-2'>
                                            <Button label="Salveaza" severity="success"
                                                onClick={() => saveSchLine(selectedSchLine)}
                                            />
                                        </div>

                                        <div className='col-1 pl-3'>
                                            <Button label="Sterge" severity="danger"

                                                onClick={() => deleteSchLine(selectedSchLine.id)}
                                            />
                                        </div>


                                    </div>
                                </div>

                            </div>

                        </Dialog>



                        <div className="field col-12 md:col-12 pt-4">

                            <DataTable key={indexTable} ref={dt} className='pt-2' value={scadentar}
                                tableStyle={{ minWidth: '50rem' }} header={header}
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
                                <Column field="item.name" header="Articol"></Column>
                                <Column field="Date" header="Data" sortable body={StartBodyTemplate}></Column>
                                <Column field="measuringUnit.name" header="UM"></Column>
                                <Column field="billingQtty" header="Cantitate"></Column>
                                <Column field="billingValue" header="Pret"></Column>
                                <Column field="totalContractValue" header="Valoare"></Column>
                                <Column field="currency.code" header="Moneda"></Column>

                                <Column hidden field="isInvoiced" header="isInvoiced"></Column>
                                <Column hidden field="isPayed" header="isPayed"></Column>
                                <Column header="Facturat" body={statusInvoiceTemplate}></Column>
                                <Column header={isPurchasing ? "Platit" : "Incasat"} body={statusPayedTemplate}></Column>
                                <Column header="Editeaza" body={editSchTemplate}></Column>

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