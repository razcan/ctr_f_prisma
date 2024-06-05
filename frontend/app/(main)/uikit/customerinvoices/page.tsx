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



export default function CustomerInvoice() {

    const router = useRouter();

    const handleBack = () => {
        router.back();
    };


    const toast = useRef(null);
    const useMyContext = () => useContext(MyContext);
    const {
        Backend_BASE_URL, userId, setBreadCrumbItems, Frontend_BASE_URL } = useMyContext();

    const [vatOnReceipt, setVatOnreceipt] = useState(false);
    const [isStorno, setIsStorno] = useState(false);


    const [remarks, setRemarks] = useState();
    const [status, setStatus] = useState();
    const [actualCurrencyRate, setActualCurrencyRate] = useState(1);
    const [actualSeries, setActualSeries] = useState('SHB');
    const [actualNumber, setActualNumber] = useState('1');
    const [date, setDate] = useState(new Date());
    const [dueDate, setDueDate] = useState('');
    const [paymentTerm, setPaymentTerm] = useState(0);
    const [series, setSeries] = useState([]);
    const [price, setPrice] = useState<Float>(0);
    const [qtty, setQtty] = useState<Float>(1);

    const [vat, setVAT] = useState<Float>();
    const [vatAmount, setVatAmount] = useState<Float>();
    const [allVAT, setAllVAT] = useState<any>([]);

    const [measuringUnit, setMeasuringUnit] = useState();
    const [allMeasuringUnit, setAllMeasuringUnit] = useState();
    const [selectedMeasuringUnitId, setSelectedMeasuringUnitId] = useState();


    const [amount, setAmount] = useState<Float>(0);
    const [totalAmount, setTotalAmount] = useState<Float>(0);
    const [lineDescription, setLineDescription] = useState('');


    const [allCurrency, setAllCurrency] = useState([]);
    const [currency, setCurrency] = useState({ id: 1, code: 'RON', name: 'LEU' });

    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

    const [partner, setPartner] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState([]);

    const [party_address, setParty_Address] = useState([]);
    const [partnerAddress, setPartnerAddress] = useState([]);
    const [invoiceLines, setInvoiceLines] = useState([]);


    const searchParams = useSearchParams()



    const fetchAllCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
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
                // console.log(data)
                // setSeries(data);
                // setActualSeries(data[0]);
                setActualNumber(data[0].last_number + 1)
            })
    }


    const fetchAllVAT = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/vatquota`).then(res => res.json())
        setAllVAT(response);
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
            }]
        )

    }, [])


    useEffect(() => {
        fetchItemsData(),
            fetchPartners(),
            fetchAllCurrencies(),
            fetchSeriesData(),
            fetchAllVAT(),
            fetchAllMeasuringUnit()
    }, [])


    useEffect(() => {

    }, [])

    const saveInvoice = () => {
        console.log(selectedPartner, party_address, currency, actualCurrencyRate,
            actualSeries, actualNumber, date, dueDate, remarks, vatOnReceipt, status)
    }

    const handleDropDownStepUsers = async (index, value) => {
        setSelUsers(value);
        const to_add = [...final_users, {
            Index: index,
            UserId: { id: value.id, name: value.name, email: value.email, status: true }
        }];

        selectedTaskUsers[index].Index = index
        selectedTaskUsers[index].UserId = { id: value.id, name: value.name, email: value.email, status: true }
        setfinal_users(to_add);
    };

    // const handleStepUsers = async (index, value) => {
    //     selectedTaskUsers[index].StepName = value
    // }

    const addInvoiceLines = () => {
        setInvoiceLines(
            [...invoiceLines, {
                Index: null,
                qtty: qtty,
                price: price,
                itemId: selectedItem.id,
                measuringUnit: selectedMeasuringUnitId,
                vatAmount: vatAmount,
                amount: amount,
                totalAmount: totalAmount,
                lineDescription: lineDescription

            }]
        )
        console.log(invoiceLines, "invoiceLines")
    }


    return (
        <div className="p-d-flex p-jc-center p-ai-center">
            <div className="card">

                {invoiceLines.map((field, index) => {
                    // console.log(field.UserId)
                    return (
                        // console.log(field)
                        <div className="grid" >

                            <div className="field col-1 md:col-1 p-2">

                                <Tag style={{ fontSize: 16 }} value={index + 1}></Tag>
                            </div>

                            <Divider />
                        </div>


                    )
                })}

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
                                        <label htmlFor="remarks" >Stare</label>
                                        <InputText disabled id="status" className='max-w-screen'
                                            value={status} onChange={(e) => setStatus(e.target.value)}
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

                                    <div className="field col-12 md:col-12">
                                        <Checkbox id="vatOnReceipt" onChange={e => setVatOnreceipt(e.checked)}
                                            checked={vatOnReceipt}
                                        ></Checkbox>
                                        <label htmlFor="vatOnReceipt" className="ml-2">TVA la incasare</label>
                                    </div>

                                    <div className="field col-12 md:col-12">
                                        <Checkbox id="isStorno" onChange={e => setIsStorno(e.checked)}
                                            checked={isStorno}
                                        ></Checkbox>
                                        <label htmlFor="isStorno" className="ml-2">Storno</label>
                                    </div>

                                </div>


                                <div className="formgroup-inline">
                                    <div className="field-checkbox">
                                        <Button label="Salveaza" text onClick={saveInvoice} />
                                        <Button label="Valideaza" text onClick={saveInvoice} />
                                        <Button label="Anuleaza" text onClick={saveInvoice} />
                                        <Button label="Sterge" text onClick={saveInvoice} />
                                        <Button label="Storneaza" text onClick={saveInvoice} />
                                        <Button label="Copiaza" text onClick={saveInvoice} />
                                        <Button label="Descarca" text onClick={saveInvoice} />
                                        <Button label="Trimite" text onClick={saveInvoice} />
                                        <Button label="Fisier" text onClick={saveInvoice} />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="col-12">
                        <div className='card'>
                            <div className="col-12 md:col-12" style={{ width: '90%' }}>

                                <div className="p-fluid formgrid grid pt-2">


                                    <div className="field col-12 md:col-2">
                                        <label htmlFor="item">Articol</label>
                                        <Dropdown id="item"
                                            filter
                                            filterBy="name,code"
                                            filterInputAutoFocus
                                            showClear
                                            value={selectedItem}
                                            onChange={(e) => {
                                                setSelectedItem(e.value);
                                                setMeasuringUnit(e.value.measuringUnit.name);
                                                setSelectedMeasuringUnitId(e.value.measuringUnit.id);
                                                // setVAT(`${e.value.vat.VATPercent}%`)
                                                setVAT(e.value.vat.VATPercent)
                                                console.log(e.value)

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

                                    <div className="field col-12  md:col-1">
                                        <label htmlFor="measuringUnit">UM</label>
                                        <InputText disabled id="measuringUnit" type="text"
                                            value={measuringUnit}
                                        // onChange={(e) => setMeasuringUnit(e.target.value)}
                                        />
                                    </div>


                                    <div className="field col-12  md:col-1">
                                        <label htmlFor="qtty">Cantitate</label>
                                        <InputNumber inputId="minmaxfraction" value={qtty}
                                            onValueChange={(e) => {
                                                setQtty(e.value);
                                                const am = Math.round((e.value * price) * 100) / 100;
                                                setAmount(am);
                                                const vt = Math.round((e.value * price * vat / 100) * 100) / 100
                                                setVatAmount(vt);
                                                const tot_amount = Math.round((e.value * price * vat / 100 + (e.value * qtty)) * 100) / 100
                                                setTotalAmount(tot_amount);
                                            }}
                                            minFractionDigits={2}
                                            maxFractionDigits={2} />

                                    </div>

                                    <div className="field col-12  md:col-1">
                                        <label htmlFor="price">Pret unitar</label>
                                        <InputNumber inputId="minmaxfraction"
                                            value={price}
                                            onValueChange={(e) => {
                                                setPrice(e.value);
                                                const am = Math.round((e.value * qtty) * 100) / 100;
                                                setAmount(am);
                                                const vt = Math.round((e.value * qtty * vat / 100) * 100) / 100
                                                setVatAmount(vt);
                                                const tot_amount = Math.round((e.value * qtty * vat / 100 + (e.value * qtty)) * 100) / 100
                                                setTotalAmount(tot_amount);
                                            }}
                                            minFractionDigits={4}
                                            maxFractionDigits={4} />
                                    </div>

                                    <div className="field col-12  md:col-2">
                                        <label htmlFor="amount">Valoare</label>
                                        <InputNumber inputId="minmaxfraction"
                                            disabled
                                            value={amount}
                                            // onValueChange={(e) => setAmount(e.value)}
                                            minFractionDigits={2}
                                            maxFractionDigits={2} />
                                    </div>

                                    <div className="field col-12  md:col-1">
                                        <label htmlFor="vat">TVA(%)</label>
                                        <InputText disabled id="vat" type="text"
                                            value={vat} onChange={(e) => setVAT(e.target.value)}
                                        />
                                    </div>

                                    <div className="field col-12  md:col-1">
                                        <label htmlFor="vat">Valoare TVA</label>

                                        <InputNumber inputId="minmaxfraction"
                                            disabled
                                            value={vatAmount}
                                            minFractionDigits={2}
                                            maxFractionDigits={2} />
                                    </div>
                                    <div className="field col-12  md:col-2">
                                        <label htmlFor="totalAmount">Valoare Finala</label>
                                        <InputNumber inputId="totalAmount"
                                            disabled
                                            value={totalAmount}
                                            minFractionDigits={2}
                                            maxFractionDigits={2} />
                                    </div>
                                    <div className="field col-12  md:col-1 pt-4">
                                        <Button icon="pi pi-plus" onClick={addInvoiceLines}
                                            rounded text aria-label="Add" />
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
