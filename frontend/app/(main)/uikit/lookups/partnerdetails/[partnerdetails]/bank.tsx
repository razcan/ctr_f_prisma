"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext"
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { InputSwitch } from "primereact/inputswitch";
import { get } from 'http';
import { MyContext } from '../../../../../../layout/context/myUserContext';
import { Divider } from 'primereact/divider';

const PartnerBank = ({ params, setBankIndex }: any) => {
    const partnerid = params
    const [visibleBank, setVisibleBank] = useState<any>('');
    const [selectedBank, setSelectedBank] = useState<any>([]);
    const [sBank, setsBank] = useState<any>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any>([]);
    const [Branch, setBranch] = useState<any>('');
    const [IBAN, setIBAN] = useState<any>('');
    const [selectedStatus, setSelectedStatus] = useState<any>(true);
    const [Status, setStatus] = useState<any>(true);
    const [allBanks, setAllBanks] = useState<any>([]);
    const [allExtraRates, setAllExtraRates] = useState<any[]>([]);
    const [currentPaymentTerm, setCurrentPaymentTerm] = useState('10');
    const [paymentTerm, setPaymentTerm] = useState(10);


    const [Bank, setBank] = useState<any>([]);
    const [Currency, setCurrency] = useState<any>([]);

    const toast = useRef(null);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const getCurrency = (CurrencyToFind: string) => {
        return Currency.find((obj: { code: string; }) => obj.code === CurrencyToFind);
    };

    const getBank = (BankToFind: string) => {
        return Bank.find((obj: { name: string; }) => obj.name === BankToFind);
    };

    const fetchPartnerBanks = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/bank/${partnerid}`).then(res => res.json())
        setAllBanks(response);
    }

    const fetchAllBanks = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allbanks`).then(res => res.json())
        setBank(response);
    }

    const fetchAllCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setCurrency(response);
    }


    const fetchAllExtraRates = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/extrarates/${partnerid}`).then(res => res.json())
        console.log(response, "response")
        if (response.length == 0) {
            // console.error('Network response was not ok:', response.statusText);
            setAllExtraRates([]);
            return;
        }
        else {
            console.log(response, "response")
            setAllExtraRates(response);
        }
    }

    const fetchPartnerDetails = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/partners/${partnerid}`).then(res => res.json().then(res => {
            setCurrentPaymentTerm(res.paymentTerm);
        })
        )
    }


    useEffect(() => {
        fetchPartnerBanks(),
            fetchAllBanks(),
            fetchAllCurrencies(),
            fetchAllExtraRates(),
            fetchPartnerDetails()
    }, [])

    const deleteBankAccount = async () => {

        try {
            const response = await axios.delete(`${Backend_BASE_URL}/nomenclatures/bank/${sBank.id}`,
            );
            setBankIndex((prevKey: number) => prevKey + 1),
                setVisibleBank(false)
        } catch (error) {
            console.error('Error deleting address:', error);
        }

    }


    const sendAddressData = async () => {

        interface Bank {
            bank: String,
            currency: String,
            branch: String,
            iban: String,
            status: Boolean
            partner: any
        }
        if (sBank.id) {
            let addBank: Bank = {
                bank: selectedBank.name,
                currency: selectedCurrency.code,
                branch: Branch,
                iban: IBAN,
                status: selectedStatus,
                partner: {
                    "connect":
                    {
                        id: parseInt(partnerid)
                    }
                }
            }
            try {
                const response = await axios.patch(`${Backend_BASE_URL}/nomenclatures/bank/${sBank.id}`,
                    addBank
                );
                setBankIndex((prevKey: number) => prevKey + 1),
                    setVisibleBank(false)
                console.log('Bank added:', response.data);
            } catch (error) {
                console.error('Error updating bank:', error);
            }

        }
        else {
            let addBank: Bank = {
                bank: selectedBank.name,
                currency: selectedCurrency.code,
                branch: Branch,
                iban: IBAN,
                status: selectedStatus,
                partner: {
                    "connect":
                    {
                        id: parseInt(partnerid)
                    }
                }
            }
            try {
                const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/bank`,
                    addBank
                );
                setBankIndex((prevKey: number) => prevKey + 1),
                    setVisibleBank(false)
                console.log('Bank added:', response.data);
            } catch (error) {
                console.error('Error creating bank:', error);
            }
        }
    }


    const statusTemplate = (rowData: any) => {
        // console.log('rand', rowData)
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" checked={rowData.status}></Checkbox>
            </div>
        );
    };



    return (
        <div className="p-fluid formgrid grid pt-2">

            <Toast ref={toast} position="top-right" />

            <div className="field col-12  md:col-2">
                <label htmlFor="paymentTerm">Termen Plata (Zile)</label>
                <InputText id="paymentTerm"
                    type="text"
                    keyfilter="int"
                    value={currentPaymentTerm}
                    onChange={(e) => {
                        setPaymentTerm(e.target.value);
                    }} />
            </div>
            <Divider />

            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga"
                    onClick={() => {
                        setSelectedBank('')
                        setSelectedCurrency('')
                        setBranch('')
                        setIBAN('')
                        setSelectedStatus('')
                        setsBank('')
                        setStatus('')

                        setVisibleBank(true)
                    }

                    }
                />
            </div>
            <div className="field col-12">
                <Dialog header="Adresa" visible={visibleBank} style={{ width: '30vw' }} onHide={() => setVisibleBank(false)}>
                    <div className="card">
                        <div className="p-fluid formgrid grid pt-2">

                            <div className="field col-12  md:col-12">
                                <label htmlFor="type">Banca</label>
                                <Dropdown id="type"
                                    showClear
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.value)}
                                    options={Bank}
                                    optionLabel="name" placeholder="Select One"></Dropdown>
                            </div>
                            <div className="field col-12  md:col-12">
                                <label htmlFor="name">Filiala</label>
                                <InputText id="name" type="text" value={Branch} onChange={(e) => setBranch(e.target.value)} />
                            </div>
                            <div className="field col-12  md:col-12">
                                <label htmlFor="type">Moneda</label>
                                <Dropdown id="type"
                                    showClear
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.value)}
                                    options={Currency}
                                    optionLabel="code" placeholder="Select One"></Dropdown>
                            </div>
                            <div className="field col-12  md:col-12">
                                <label htmlFor="name">IBAN</label>
                                <InputText id="name" type="text" value={IBAN} onChange={(e) => setIBAN(e.target.value)} />
                            </div>
                            <div className="field-checkbox col-12 md:col-12">
                                <Checkbox id="status" onChange={e => setSelectedStatus(e.checked)} checked={selectedStatus}></Checkbox>
                                <label htmlFor="status" className="ml-2">Cont Activ</label>
                            </div>

                            <div className='p-3 field col-2 md:col-2'>
                                <div className='grid'>
                                    <div className='flex flex-wrap justify-content-left gap-3'>
                                        <Button label="Salveaza" severity="success" onClick={sendAddressData} />
                                        <Button label="Sterge" severity="danger" onClick={deleteBankAccount} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Dialog>

                <DataTable value={allBanks} selectionMode="single"
                    // paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                    selection={selectedBank} onSelectionChange={(e) => {
                        setSelectedBank(getBank(e.value.bank))
                        setSelectedCurrency(getCurrency(e.value.currency))
                        setBranch(e.value.branch)
                        setIBAN(e.value.iban)
                        setSelectedStatus(e.value.status)
                        setsBank(e.value)
                        setStatus(e.value.status)
                        setVisibleBank(true)
                    }}>
                    <Column field="id" header="Cod"></Column>
                    <Column field="bank" header="Banca"></Column>
                    <Column field="currency" header="Valuta"></Column>
                    <Column field="branch" header="Filiala"></Column>
                    <Column field="iban" header="IBAN"></Column>
                    <Column header="Activ" style={{ width: '10vh' }} body={statusTemplate} />


                </DataTable>

                {allExtraRates.length > 0 ?
                    <div className="field col-12 md:col-12">
                        <DataTable value={allExtraRates} selectionMode="single"
                        // selection={selectedCurrencyExchangeRates}
                        // onSelectionChange={(e) => {
                        //     setSelectedCurrencyExchangeRates(getCurrencyRate(e.value.codeCurrency));
                        //     setCurrency(getCurrencyRate(e.value.codeCurrency));
                        //     setExtraPercent(e.value.percent);
                        //     setVisibleExtraPercent(true);
                        // }}
                        >
                            <Column field="id" header="Cod"></Column>
                            <Column field="codeCurrency" header="Moneda"></Column>
                            <Column hidden field="currency" header="IdValuta"></Column>
                            <Column field="percent" header="Procent"></Column>


                        </DataTable>
                    </div>
                    : null}

            </div>
        </div>
    )
}

export default PartnerBank;