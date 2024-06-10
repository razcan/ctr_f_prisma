'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import axios from 'axios';
import {
    QueryClient
} from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { MyContext } from '../../../../layout/context/myUserContext'
import { Toast } from 'primereact/toast';
import router from 'next/router';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { saveAs } from 'file-saver';


export default function CustomerInvoice() {

    const router = useRouter();

    const handleBack = () => {
        router.back();
    };


    const toast = useRef(null);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId, selectedEntity, setBreadCrumbItems
    } = useMyContext();


    const [vatOnReceipt, setVatOnreceipt] = useState(false);
    const [isStorno, setIsStorno] = useState(false);


    const [remarks, setRemarks] = useState('');
    const [itemRemarks, setItemRemarks] = useState('');

    const [entityBank, setEntityBank] = useState<any>();
    const [status, setStatus] = useState();
    const [actualCurrencyRate, setActualCurrencyRate] = useState(1);
    const [actualSeries, setActualSeries] = useState('');
    const [actualNumber, setActualNumber] = useState('1');
    const [date, setDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [paymentTerm, setPaymentTerm] = useState(0);
    const [series, setSeries] = useState([]);
    const [price, setPrice] = useState<Float>();
    const [qtty, setQtty] = useState<Float>();

    const [vat, setVAT] = useState<Float>();
    const [vatAmount, setVatAmount] = useState<Float>();
    const [allVAT, setAllVAT] = useState<any>([]);

    const [measuringUnit, setMeasuringUnit] = useState();
    const [allMeasuringUnit, setAllMeasuringUnit] = useState();
    const [selectedMeasuringUnitId, setSelectedMeasuringUnitId] = useState();


    const [amount, setAmount] = useState<Float>();
    const [totalAmount, setTotalAmount] = useState<Float>();

    const [lineDescription, setLineDescription] = useState('');

    const [totalInvoice, setTotalInvoice] = useState<any>({ amount: 0, totalAmount: 0, vatAmount: 0 });


    const [allCurrency, setAllCurrency] = useState([]);
    const [currency, setCurrency] = useState({ id: 1, code: 'RON', name: 'LEU' });

    const [allInvoiceStatus, setAllInvoiceStatus] = useState([]);
    const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState({
        "id": 1,
        "name": "In lucru"
    });


    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

    const [partner, setPartner] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState([]);

    const [party_address, setParty_Address] = useState([]);
    const [partnerAddress, setPartnerAddress] = useState([]);
    const [invoiceLines, setInvoiceLines] = useState([{
        index: 9999,
        invoiceId: 0,
        measuringUnitid: 0,
        vatId: 0,
        vatValue: 0,
        entityId: 0,
        qtty: '',
        price: '',
        measuringUnit: '',
        vatPercent: 0,
        vatAmount: 0,
        amount: 0,
        totalAmount: 0,
        lineDescription: '',
        lineValue: 0,
        totalValue: 0,
        description: '',
        itemId: ''

    }]);
    const [invoiceHeader, setInvoiceHeader] = useState([]);
    const [itemsArray, setItemsArray] = useState([]);

    const searchParams = useSearchParams()

    let showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };



    const fetchAllCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

    const fetchEntityBank = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/entitybank/${selectedEntity.id}`).then(res => res.json())
        setEntityBank(response);
    }


    const fetchPartners = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/partners`)
            .then(response => {
                return response.json()
            })
            .then(partner => {
                setPartner(partner)
            })
    }

    const fetchItemsData = () => {
        fetch(`${Backend_BASE_URL}/contracts/item`)
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItems(item)
            })
    }

    const fetchPartnerAddress = async (partnerId: Number) => {
        const response =
            await fetch(`${Backend_BASE_URL}/nomenclatures/address/${partnerId}`).
                then(res => res.json())
        setPartnerAddress(response);
        setParty_Address(response[0]);
    }


    // const allDocumentType = [
    //     { id: 1, name: "Facturi Vanzare" },
    //     { id: 2, name: "Contracte Clienti" },
    // ]

    const fetchSeriesData = () => {
        //get series only for sales invoices
        fetch(`${Backend_BASE_URL}/nomenclatures/documentseriesbytype/${1}`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setSeries(data);
                setActualSeries(data[0]);
                setActualNumber(data[0].last_number + 1)
            })
    }

    const fetchSeriesDataByIdandType = (seriesId: any) => {
        //get series only for sales invoices
        fetch(`${Backend_BASE_URL}/nomenclatures/documentseriesbytypeandseries/${1}/${seriesId}`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setActualNumber(data[0].last_number + 1)
                const x = (data[0].last_number + 1)
                return x;
            })
    }


    const fetchAllVAT = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/vatquota`).then(res => res.json())
        setAllVAT(response);
    }

    const fetchAlInvoiceStatus = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/invoicestatus`).then(res => res.json())
        setAllInvoiceStatus(response);
    }

    const fetchAllMeasuringUnit = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/measuringunit`).then(res => res.json())
        setAllMeasuringUnit(response);
    }

    function getFormatDate(date): string {
        const today = new Date(date);
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is 0
        const day = today.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function addDays(dateInput: Date | string, days: number): Date {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    const getExchangeRateAtDate = async (date: Date, currencycode: String) => {
        const response =
            await fetch(`${Backend_BASE_URL}/nomenclatures/exchangerates/${getFormatDate(date)}/${currencycode}`).
                then(res => res.json())
        if (response.length > 0) {
            setActualCurrencyRate(response[0].amount);
        }
        else {
            setActualCurrencyRate(0);
        }

    }


    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }
        setBreadCrumbItems(
            [{
                label: 'Dashboard',
                template: () => <Link href="/">Dashboard</Link>
            },
            {
                label: 'Facturi Clienti',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/customercinvoices`
                    return (
                        <Link href={url}>Facturi Clienti</Link>
                    )
                }
            }])
    }, [])


    useEffect(() => {
        fetchItemsData(),
            fetchPartners(),
            fetchAllCurrencies(),
            fetchSeriesData(),
            fetchAllVAT(),
            fetchAllMeasuringUnit(),
            fetchAlInvoiceStatus(),
            fetchEntityBank()
    }, [])

    function roundTo(num: number, decimalPlaces: number): number {
        const factor: number = Math.pow(10, decimalPlaces);
        return Math.round(num * factor) / factor;
    }
    // let num: number = 3.14159;
    // let rounded: number = roundTo(num, 2);

    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];

        console.log(fields)


        if (fields[1].length === 0) {
            errors.push("Trebuie sa aveti minim un articol pe factura!");
            // addInvoiceLines();
        }

        if (!fields[0].entityId) {
            errors.push("Trebuie sa setati o entitate!");
        }

        if (!fields[0].partnerId) {
            errors.push("Trebuie sa setati un partener!");
        }

        for (let i = 0; i < fields[1].length; i++) {
            if (!fields[1][i].itemId) {
                errors.push("Toate liniile trebuie sa contina un articol!");
            }
            if (!fields[1][i].qtty) {
                errors.push("Toate liniile trebuie sa contina cantitate!");
            }
            if (!fields[1][i].price) {
                errors.push("Toate liniile trebuie sa contina pret!");
            }
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }


    const saveInvoice = async () => {

        const current_db__number = fetch(`${Backend_BASE_URL}/nomenclatures/documentseriesbytypeandseries/${1}/${actualSeries.id}`
        )
            .then(response => {
                return response.json()
            })
            .then(data => {
                setActualNumber(data[0].last_number + 1)
                const x = (data[0].last_number + 1)
                return x;
            })


        if (actualNumber != await current_db__number) {
            setActualNumber(await current_db__number)
            showMessage('warning', 'Info numar document', "Numarul a fost actualizat cu ultimul numar disponibil din seria selectata!")

        } else {
            console.log("sunt ok")
        }

        const toAddHeader = {
            partnerId: selectedPartner.id,
            entityId: selectedEntity.id,
            number: String(await current_db__number),
            date: date,
            duedate: dueDate,
            totalAmount: totalInvoice.amount,
            vatAmount: totalInvoice.vatAmount,
            totalPayment: totalInvoice.totalAmount,
            typeId: 1,
            transactionTypeId: 1,
            statusId: selectedInvoiceStatus.id,
            entitybankId: entityBank[0].id,
            partneraddressId: party_address ? party_address.id : null,
            currencyRate: actualCurrencyRate,
            userId: userId,
            currencyId: currency.id,
            remarks: remarks,
            seriesId: parseInt(actualSeries.id),
            serialNumber: (actualSeries.series + actualNumber),
            eqvTotalAmount: roundTo(totalInvoice.amount * actualCurrencyRate, 2),
            eqvVatAmount: roundTo(totalInvoice.vatAmount * actualCurrencyRate, 2),
            eqvTotalPayment: roundTo(totalInvoice.totalAmount * actualCurrencyRate, 2),
            vatOnReceipt: vatOnReceipt
        }

        setInvoiceHeader(toAddHeader);

        // console.log(toAddHeader, "toAddHeader")
        // https://www.youtube.com/watch?v=vK2zHBVnsF8


        const idToCheck = 0;

        // Check if the array contains an item with the specified id and if its length is greater than 1
        const idExists = invoiceLines.some(item => item.invoiceId === idToCheck);
        const isArrayLengthGreaterThanOne = invoiceLines.length > 1;


        if (idExists && isArrayLengthGreaterThanOne) {
            // console.log(`The id ${idToCheck} exists in the array and the array length is greater than 1.`);
            const invoiceLinesFinal = invoiceLines.filter(line => line.index !== 9999);

            const newLinseArray = invoiceLinesFinal.map(item => ({
                invoiceId: item.invoiceId,
                entityId: item.entityId,
                qtty: item.qtty,
                price: item.price,
                measuringUnitid: item.measuringUnitid,
                vatId: item.vatId,
                vatValue: item.vatValue,
                lineValue: item.lineValue,
                totalValue: item.totalValue,
                description: item.description,
                itemId: item.itemId.id
            }));

            setInvoiceLines(invoiceLinesFinal);

            const toAdd = []

            toAdd.push(toAddHeader);
            toAdd.push(newLinseArray);

            const validationResult = validateForm(toAdd);



            if (!validationResult.isValid) {
                showMessage('error', 'Eroare', validationResult.errors)
            } else {
                try {
                    const response_update = await axios.post(`${Backend_BASE_URL}/invoice`,
                        toAdd
                    );
                    console.log('Content added:', response_update.data);

                } catch (error) {
                    console.error('Error creating content:', error);
                }
            }
        }
        else {

            const newLinseArray = invoiceLines.map(item => ({
                invoiceId: item.invoiceId,
                entityId: item.entityId,
                qtty: item.qtty,
                price: item.price,
                measuringUnitid: item.measuringUnitid,
                vatId: item.vatId,
                vatValue: item.vatValue,
                lineValue: item.lineValue,
                totalValue: item.totalValue,
                description: item.description,
                itemId: item.itemId.id
            }));

            setInvoiceLines(invoiceLines);

            const toAdd = []

            toAdd.push(toAddHeader);
            toAdd.push(newLinseArray);

            const validationResult = validateForm(toAdd);

            if (!validationResult.isValid) {
                showMessage('error', 'Eroare', validationResult.errors)
            } else {
                try {
                    const response_update = await axios.post(`${Backend_BASE_URL}/invoice`,
                        toAdd
                    );
                    console.log('Content added:', response_update.data);

                } catch (error) {
                    console.error('Error creating content:', error);
                }
            }
        }
    }


    const addInvoiceLines = () => {
        setInvoiceLines(
            [...invoiceLines,
            {
                index: 9999,
                invoiceId: 0,
                measuringUnitid: 0,
                vatId: 0,
                vatValue: 0,
                entityId: 0,
                qtty: '',
                price: '',
                measuringUnit: '',
                vatPercent: 0,
                vatAmount: 0,
                amount: 0,
                totalAmount: 0,
                lineDescription: '',
                lineValue: 0,
                totalValue: 0,
                description: '',
                itemId: ''
            }
            ]
        )
        // console.log(invoiceLines, "invoiceLines")
    }

    const handleItemChange = (index, value) => {

        const newFormData = [...invoiceLines];
        setSelectedItem(value);

        newFormData[index].itemId = value;
        newFormData[index].index = index;
        newFormData[index].measuringUnit = value.measuringUnit.name;
        newFormData[index].measuringUnitid = value.measuringUnit.id;
        newFormData[index].vatPercent = value.vat.VATPercent;
        newFormData[index].vatId = value.vat.id;
        newFormData[index].entityId = selectedEntity.id;

        setInvoiceLines(newFormData);
        // addInvoiceLines();
    };

    const handleQttyChange = async (index, value) => {

        const am = Math.round((value * invoiceLines[index].price) * 100) / 100;
        const vt = Math.round((value * invoiceLines[index].price * invoiceLines[index].vatPercent / 100) * 100) / 100
        const tot_amount = Math.round((value * invoiceLines[index].price * invoiceLines[index].vatPercent / 100 + (value * invoiceLines[index].price)) * 100) / 100


        const newFormData = [...invoiceLines];

        newFormData[index].qtty = value;
        newFormData[index].amount = am;
        newFormData[index].vatAmount = vt;
        newFormData[index].totalAmount = tot_amount;

        newFormData[index].vatValue = vt;
        newFormData[index].lineValue = am;
        newFormData[index].totalValue = tot_amount;

        setInvoiceLines(newFormData);


    }

    const handlePriceChange = async (index, value) => {

        const am = Math.round((value * invoiceLines[index].qtty) * 100) / 100;
        const vt = Math.round((value * invoiceLines[index].qtty * invoiceLines[index].vatPercent / 100) * 100) / 100
        const tot_amount = Math.round((value * invoiceLines[index].qtty * invoiceLines[index].vatPercent / 100 + (value * invoiceLines[index].qtty)) * 100) / 100

        const newFormData = [...invoiceLines];

        newFormData[index].price = value;
        newFormData[index].amount = am;
        newFormData[index].vatAmount = vt;
        newFormData[index].totalAmount = tot_amount;

        newFormData[index].vatValue = vt;
        newFormData[index].lineValue = am;
        newFormData[index].totalValue = tot_amount;


        setInvoiceLines(newFormData);

    }

    const handleItemDescription = async (index, value) => {

        const newFormData = [...invoiceLines];

        newFormData[index].lineDescription = value;
        newFormData[index].description = value;

        setInvoiceLines(newFormData);

    }

    useEffect(() => {

        const result = invoiceLines.reduce((acc, curr) => {
            acc.amount += curr.amount;
            acc.totalAmount += curr.totalAmount;
            acc.vatAmount += curr.vatAmount;
            return acc;
        }, { amount: 0, totalAmount: 0, vatAmount: 0 });
        setTotalInvoice(result);

    }, [invoiceLines])


    const removeInvoiceLine = (index) => {

        const newFormData = invoiceLines.filter(line => line.index !== index);
        setInvoiceLines(newFormData);
    };

    const downloadInvoice = async () => {
        const data = [];
        data.push(invoiceHeader);
        data.push(invoiceLines)
        try {
            const response = await fetch(`${Backend_BASE_URL}/createpdf/file3`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });


            if (response.ok) {
                const pdfBytes = await response.arrayBuffer();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                saveAs(blob, `invoice_${new Date()}.pdf`);
            } else {
                console.error('Failed to generate invoice.');
            }


        } catch (error) {
            console.error('Error creating content:', error);
        }
    }

    return (
        <div className="p-d-flex p-jc-center p-ai-center">
            <div className="card">
                <Toast ref={toast} />
                <div className="grid">
                    <Button className="p-d-flex p-jc-end p-mt-3 p-1" label="Go back" icon="pi pi-arrow-left" onClick={handleBack} />

                    <Toast ref={toast} position="top-right" />


                    <div className="col-12">

                        <div className='card'>
                            <div className="p-fluid formgrid grid pt-2">

                                <div className="field col-12 md:col-3">
                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="selectedPartner">Partner</label>
                                        <Dropdown
                                            value={selectedPartner}
                                            options={partner}
                                            onChange={(e) => {
                                                setSelectedPartner(e.value);
                                                fetchPartnerAddress(e.value.id);

                                                if (e.value.paymentTerm > 0) {
                                                    setPaymentTerm(e.value.paymentTerm);
                                                } else {
                                                    setPaymentTerm(0);
                                                }

                                                const x = addDays(date, e.value.paymentTerm);
                                                setDueDate(x);
                                            }}
                                            optionLabel="name"
                                            filter
                                            filterBy="name,fiscal_code"
                                            filterInputAutoFocus
                                            showClear
                                            itemTemplate={(option) => (
                                                <div>
                                                    {option.name} ({option.fiscal_code})
                                                </div>
                                            )}
                                            placeholder="Select"
                                        />
                                    </div>
                                    <div className="field col-12 md:col-12">

                                        <label htmlFor="party_address">Adresa</label>
                                        <Dropdown id="party_address"
                                            value={party_address}
                                            filter
                                            filterBy="completeAddress"
                                            filterInputAutoFocus
                                            showClear
                                            onChange={(e) => {
                                                setParty_Address(e.target.value)
                                            }}
                                            options={partnerAddress}
                                            optionLabel="completeAddress"
                                            placeholder="Select One">

                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="field col-12 md:col-2">

                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="actualSeries">Serie</label>
                                        <Dropdown id="actualSeries" filter
                                            value={actualSeries}
                                            onChange={(e) => {
                                                {
                                                    setActualSeries(e.target.value)
                                                    fetchSeriesDataByIdandType(e.target.value.id)
                                                }

                                            }}
                                            options={series}
                                            optionLabel="series"
                                            placeholder="Select One">

                                        </Dropdown>
                                    </div>

                                    <div className="field col-12  md:col-12">
                                        <label htmlFor="actualNumber">Numar</label>
                                        <InputText id="actualNumber" type="text" value={actualNumber} onChange={(e) => setActualNumber(e.target.value)} />
                                    </div>





                                </div>
                                <div className="field col-12 md:col-2">

                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="date" className="font-bold block mb-2">
                                            Data Emiterii
                                        </label>
                                        <Calendar id="date" value={date} onChange={(e) => {
                                            setDate(e.value);
                                            getExchangeRateAtDate(e.value, currency.code);
                                        }

                                        } showIcon dateFormat="dd/mm/yy" />
                                    </div>

                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="start" className="font-bold block mb-2">
                                            Data Scadentei
                                        </label>
                                        <Calendar id="start" value={dueDate} onChange={(e) => {
                                            setDueDate(e.value)
                                        }

                                        } showIcon dateFormat="dd/mm/yy" />
                                    </div>

                                </div>
                                <div className="field col-12 md:col-2">
                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="currency">Moneda</label>
                                        <Dropdown id="currency"
                                            filter
                                            filterBy="name,code"
                                            filterInputAutoFocus
                                            showClear
                                            value={currency}
                                            onChange={(e) => {
                                                setCurrency(e.value);
                                                getExchangeRateAtDate(date, e.value.code);

                                            }}
                                            options={allCurrency}
                                            optionLabel="code"
                                            itemTemplate={(option) => (
                                                <div>
                                                    {option.name} ({option.code})
                                                </div>
                                            )}
                                            placeholder="Select One"></Dropdown>
                                    </div>

                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="actualCurrencyRate" >Rata Schimb</label>
                                        <InputText id="actualCurrencyRate" className='max-w-screen'
                                            value={actualCurrencyRate}
                                            onChange={(e) => setActualCurrencyRate(e.target.value)}
                                        />
                                    </div>

                                </div>

                                <div className="field col-12 md:col-2">

                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="status" >Stare</label>
                                        <InputText disabled id="status" className='max-w-screen'
                                            value={selectedInvoiceStatus.name}
                                        // onChange={(e) => setStatus(e.target.value)}
                                        />
                                    </div>

                                    <div className="field col-12 md:col-12">
                                        <label htmlFor="remarks">Observatii</label>
                                        <InputText id="remarks" className='max-w-screen'
                                            value={remarks} onChange={(e) => setRemarks(e.target.value)}
                                        />
                                    </div>

                                </div>

                                <div className="field col-12 md:col-1 pt-6">

                                    {/* <div className="field col-12 md:col-12">
                                        <Checkbox id="vatOnReceipt" onChange={e => setVatOnreceipt(e.checked)}
                                            checked={vatOnReceipt}
                                        ></Checkbox>
                                        <label htmlFor="vatOnReceipt" className="ml-2">TVA la incasare</label>
                                    </div> */}

                                    {/* <div className="field col-12 md:col-12">
                                        <Checkbox id="isStorno" onChange={e => setIsStorno(e.checked)}
                                            checked={isStorno}
                                        ></Checkbox>
                                        <label htmlFor="isStorno" className="ml-2">Storno</label>
                                    </div> */}

                                </div>

                                <div className="formgroup-inline">
                                    <div className="field-checkbox">
                                        <Button label="Salveaza" text onClick={saveInvoice} />
                                        <Button label="Valideaza" text onClick={saveInvoice} />
                                        <Button label="Anuleaza" text onClick={saveInvoice} />
                                        <Button label="Sterge" text onClick={saveInvoice} />
                                        <Button label="Storneaza" text onClick={saveInvoice} />
                                        <Button label="Copiaza" text onClick={saveInvoice} />
                                        <Button label="Descarca" text onClick={downloadInvoice} />
                                        <Button label="Trimite" text onClick={saveInvoice} />
                                        <Button label="Fisier" text onClick={saveInvoice} />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>


                    <div className="col-12">
                        <div className='card' >
                            <div className="p-fluid formgrid grid pt-2">
                                {invoiceLines.map((field, index) => {
                                    // console.log(field)
                                    return (
                                        <div className="col-12" key={index}>

                                            <div className="col-12 md:col-12">

                                                <div className="p-fluid formgrid grid pt-2">

                                                    {/* <div className="field col-12 md:col-1 p-2">
                                                <Tag style={{ fontSize: 16 }} value={index + 1}></Tag>
                                            </div> */}

                                                    <div className="field col-12 md:col-2">
                                                        <label htmlFor="item">Articol</label>
                                                        <Dropdown id="item"
                                                            filter
                                                            filterBy="name,code"
                                                            filterInputAutoFocus
                                                            showClear
                                                            // value={selectedItem}
                                                            value={field.itemId}
                                                            onChange={(e) => {

                                                                handleItemChange(index, e.value);
                                                                setMeasuringUnit(e.value.measuringUnit.name);
                                                                setSelectedMeasuringUnitId(e.value.measuringUnit.id);
                                                                // setVAT(`${e.value.vat.VATPercent}%`)
                                                                setVAT(e.value.vat.VATPercent);
                                                                // addInvoiceLines();


                                                            }}
                                                            options={items}
                                                            optionLabel="name"
                                                            itemTemplate={(option) => (
                                                                <div>
                                                                    {option.name} ({option.code})
                                                                </div>
                                                            )}
                                                            placeholder="Select One"></Dropdown>
                                                    </div>

                                                    <div className="field col-12 md:col-2">
                                                        <label htmlFor="remarks">Nota Articol</label>
                                                        <InputText id="remarks" className='max-w-screen'
                                                            value={field.lineDescription} onChange={(e) => handleItemDescription(index, e.target.value)}
                                                        />
                                                    </div>


                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="measuringUnit">UM</label>
                                                        <InputText disabled id="measuringUnit" type="text"
                                                            value={field.measuringUnit}
                                                        // onChange={(e) => setMeasuringUnit(e.target.value)}
                                                        />
                                                    </div>


                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="qtty">Cantitate</label>
                                                        <InputNumber inputId="minmaxfraction"
                                                            value={field.qtty}
                                                            onValueChange={(e) => {
                                                                handleQttyChange(index, e.value)

                                                            }}
                                                            minFractionDigits={2}
                                                            maxFractionDigits={2} />

                                                    </div>

                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="price">Pret unitar</label>
                                                        <InputNumber inputId="minmaxfraction"
                                                            value={field.price}
                                                            onValueChange={(e) => {

                                                                handlePriceChange(index, e.value)

                                                            }}
                                                            minFractionDigits={4}
                                                            maxFractionDigits={4} />
                                                    </div>

                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="amount">Valoare</label>
                                                        <InputText id="amount"
                                                            // disabled
                                                            value={field.amount}

                                                        />
                                                    </div>

                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="vat">TVA(%)</label>
                                                        <InputText
                                                            // disabled 
                                                            id="vat" type="text"
                                                            value={field.vatPercent}
                                                        />
                                                    </div>

                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="vatAmount">Valoare TVA</label>

                                                        <InputText id="vatAmount"

                                                            value={field.vatAmount}

                                                        />
                                                    </div>
                                                    <div className="field col-12  md:col-1">
                                                        <label htmlFor="totalAmount">Valoare Finala</label>
                                                        <InputText id="totalAmount"
                                                            // disabled
                                                            value={field.totalAmount}
                                                        />
                                                    </div>
                                                    <div className="field col-12  md:col-1 pt-4">
                                                        <Button icon="pi pi-times" onClick={() => removeInvoiceLine(index)}
                                                            rounded text aria-label="remove" severity="danger" />
                                                        <Button icon="pi pi-plus" onClick={() => addInvoiceLines()}
                                                            rounded text aria-label="Add" severity="success" />
                                                    </div>


                                                </div>
                                            </div>
                                        </div>



                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="flex flex-row-reverse flex-wrap" style={{ gap: '1px' }}>
                            <div className="p-fluid formgrid grid pt-2">

                                <div className="align-items-end font-bold">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="vatAmount">Total TVA</label>
                                        <InputNumber
                                            inputId="vatAmount"
                                            disabled
                                            value={totalInvoice.vatAmount}
                                            minFractionDigits={2}
                                            maxFractionDigits={2}
                                        />
                                    </div>
                                </div>

                                <div className="align-items-end font-bold">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="amount">Total Valoare</label>
                                        <InputNumber
                                            inputId="amount"
                                            disabled
                                            value={totalInvoice.amount}
                                            minFractionDigits={2}
                                            maxFractionDigits={2}
                                        />
                                    </div>
                                </div>

                                <div className="align-items-end font-bold">
                                    <div className="field col-12 md:col-6">
                                        <label htmlFor="totalAmount">Valoare de plata</label>
                                        <InputNumber
                                            inputId="totalAmount"
                                            disabled
                                            value={totalInvoice.totalAmount}
                                            minFractionDigits={2}
                                            maxFractionDigits={2}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>

    )
};

