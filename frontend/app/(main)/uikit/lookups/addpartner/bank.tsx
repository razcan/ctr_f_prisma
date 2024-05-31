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
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputMask } from 'primereact/inputmask';
import { MyContext } from '../../../../../layout/context/myUserContext'
import { FloatLabel } from 'primereact/floatlabel';


interface Bank {
    id: number,
    bank: String,
    currency: String,
    branch: String,
    iban: String,
    status: Boolean
}


const PartnerBank = (
    { params, setBankChild, setPartnersBanksExtraRatesChild, setPaymentTerm }
        : any) => {

    const partnerid = params;


    const [visibleBank, setVisibleBank] = useState<any>('');
    const [visibleExtraPercent, setVisibleExtraPercent] = useState<any>('');
    const [selectedBank, setSelectedBank] = useState<any>([]);
    const [sBank, setsBank] = useState<any>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any>([]);
    const [Branch, setBranch] = useState<any>('');
    const [IBAN, setIBAN] = useState<any>('');
    const [selectedStatus, setSelectedStatus] = useState<any>(true);
    const [Status, setStatus] = useState<any>(true);
    const [allBanks, setAllBanks] = useState<any>([]);

    const [currencyExchangeRates, setCurrencyExchangeRates] = useState([]);
    const [selectedCurrencyExchangeRates, setSelectedCurrencyExchangeRates] = useState([]);

    const [extraPercent, setExtraPercent] = useState(0);
    const [allCurrency, setAllCurrency] = useState([]);
    const [currency, setCurrency] = useState(null);

    const [myBankArray, setMyBankArray] = useState<Bank[]>([]);
    const [myExtraRatesArray, setMyExtraRatesArray] = useState<Bank[]>([]);

    const [currentPaymentTerm, setCurrentPaymentTerm] = useState('10');



    const toast = useRef(null);
    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing,
    } = useMyContext();




    //nume banca, filiala, Cont, Valuta
    const Bank: any = [
        { name: "Alpha Bank" },
        { name: "BRCI" },
        { name: "Banca FEROVIARA" },
        { name: "Intesa Sanpaolo" },
        { name: "BCR" },
        { name: "BCR Banca pentru Locuinţe" },
        { name: "Eximbank" },
        { name: "Banca Românească" },
        { name: "Banca Transilvania" },
        { name: "Leumi" },
        { name: "BRD" },
        { name: "CEC Bank" },
        { name: "Crédit Agricole" },
        { name: "Credit Europe" },
        { name: "Garanti Bank" },
        { name: "Idea Bank" },
        { name: "Libra Bank" },
        { name: "Vista Bank" },
        { name: "OTP Bank" },
        { name: "Patria Bank" },
        { name: "First Bank" },
        { name: "Porsche Bank" },
        { name: "ProCredit Bank" },
        { name: "Raiffeisen" },
        { name: "Aedificium Banca pentru Locuinte" },
        { name: "UniCredit" },
        { name: "Alior Bank" },
        { name: "BLOM Bank France" },
        { name: "BNP Paribas" },
        { name: "Citibank" },
        { name: "ING" },
        { name: "TBI " }]
        ;

    const Currency: any = [
        { code: "RON", name: "Leul" },
        { code: "EUR", name: "Euro" },
        { code: "USD", name: "Dolarul SUA" },
        { code: "CHF", name: "Francul elveţian" },
        { code: "GBP", name: "Lira sterlină" },
        { code: "BGN", name: "Leva bulgarească" },
        { code: "RUB", name: "Rubla rusească" },
        { code: "ZAR", name: "Randul sud-african" },
        { code: "BRL", name: "Realul brazilian" },
        { code: "CNY", name: "Renminbi-ul chinezesc" },
        { code: "INR", name: "Rupia indiană" },
        { code: "MXN", name: "Peso-ul mexican" },
        { code: "NZD", name: "Dolarul neo-zeelandez" },
        { code: "RSD", name: "Dinarul sârbesc" },
        { code: "UAH", name: "Hryvna ucraineană" },
        { code: "TRY", name: "Noua lira turcească" },
        { code: "AUD", name: "Dolarul australian" },
        { code: "CAD", name: "Dolarul canadian" },
        { code: "CZK", name: "Coroana cehă" },
        { code: "DKK", name: "Coroana daneză" },
        { code: "EGP", name: "Lira egipteană" },
        { code: "HUF", name: "Forinți maghiari" },
        { code: "JPY", name: "Yeni japonezi" },
        { code: "MDL", name: "Leul moldovenesc" },
        { code: "NOK", name: "Coroana norvegiană" },
        { code: "PLN", name: "Zlotul polonez" },
        { code: "SEK", name: "Coroana suedeză" },
        { code: "AED", name: "Dirhamul Emiratelor Arabe" },
        { code: "THB", name: "Bahtul thailandez" }
    ]

    const getCurrency = (CurrencyToFind: string) => {
        return Currency.find((obj: { code: string; }) => obj.code === CurrencyToFind);
    };

    const getCurrencyRate = (CurrencyToFind: string) => {
        return allCurrency.find((obj: { code: string; }) => obj.code === CurrencyToFind);
    };

    const getBank = (BankToFind: string) => {
        return Bank.find((obj: { name: string; }) => obj.name === BankToFind);
    };


    const fetchAllCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

    useEffect(() => {
        fetchAllCurrencies();
    }, [])

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };


    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];

        const dim_IBAN = (IBAN.length - 5);

        if (dim_IBAN !== 24) {
            errors.push("IBAN-ul trebuie sa contina 24 de caractere!");
        }

        if (!fields.bank || fields.bank.length < 2) {
            errors.push("Trebuie sa selectati o banca!");
        }

        if (!fields.branch || fields.branch.length < 2) {
            errors.push("Trebuie sa introduceti numele filialei!");
        }

        if (!fields.currency || fields.currency.length < 2) {
            errors.push("Trebuie sa selectati o valuta!");
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }


    function validateRates(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];

        if (fields.codeCurrency == "undefined" || fields.codeCurrency.length < 2) {
            errors.push("Trebuie sa setati o valuta!");
        }

        if (fields.percent == "undefined" || !fields.percent) {
            errors.push("Trebuie sa selectati un procent!");
        }

        if (fields.percent) {
            if (fields.percent > 100)
                errors.push("Trebuie sa selectati un procent cu valoarea mai mica de 100%!");
        }

        const isValid = errors.length === 0;

        return {
            isValid,
            errors
        };
    }


    const addItemToArray = () => {

        let newBank: Bank = {
            id: myBankArray.length + 1,
            bank: selectedBank ? selectedBank.name : '0',
            currency: selectedCurrency ? selectedCurrency.code : '0',
            branch: Branch,
            iban: IBAN,
            status: selectedStatus
        }

        const newBankToBeSent: any = {
            bank: selectedBank.name,
            currency: selectedCurrency.code,
            branch: Branch,
            iban: IBAN,
            status: selectedStatus
        }

        const validationResult = validateForm(newBank);
        if (!validationResult.isValid) {
            showMessage('error', 'Eroare', validationResult.errors)
        }
        else {
            if (!sBank.id) {

                setMyBankArray((prevArray: any) => [...prevArray, newBank]);
                setBankChild((prevArray: any) => [...prevArray, newBankToBeSent]);
            }
            //edit element
            else {
                let bankindex: number = myBankArray.findIndex(bank => bank.id === sBank.id);
                // console.log("index de editat ", addressindex);
                myBankArray[bankindex] = newBank;
                myBankArray[bankindex].id = sBank.id;
            }
            setSelectedBank('')
            setSelectedCurrency('')
            setBranch('')
            setIBAN('')
            setSelectedStatus('')
            setsBank('')
            setStatus('')
            setVisibleBank(false)

        }
    }

    const addExtraRates = () => {

        let newExtraRate: any = {
            id: myExtraRatesArray.length + 1,
            currency: selectedCurrencyExchangeRates ? selectedCurrencyExchangeRates.id : null,
            codeCurrency: selectedCurrencyExchangeRates ? selectedCurrencyExchangeRates.code : null,
            percent: extraPercent

        }
        const newExtraRateToBeSent: any = {
            currencyId: selectedCurrencyExchangeRates ? selectedCurrencyExchangeRates.id : null,
            percent: extraPercent
        }

        const validationResult = validateRates(newExtraRate);
        if (!validationResult.isValid) {
            showMessage('error', 'Eroare', validationResult.errors)
        }
        else {
            setMyExtraRatesArray((prevArray) => [...prevArray, newExtraRate]);
            setVisibleExtraPercent(false);
            setPartnersBanksExtraRatesChild((prevArray: any) => [...prevArray, newExtraRateToBeSent]);

            setCurrency(null);
            setSelectedCurrency(null);
            setExtraPercent(0);
            setSelectedCurrencyExchangeRates([]);
        }
    }

    useEffect(() => {

    }, [myExtraRatesArray, currency])

    const deleteBank = async () => {

        let bankindex: number = myBankArray.findIndex(bank => bank.id === sBank.id);


        if (bankindex !== -1) {

            myBankArray.splice(bankindex, 1);
            // myAddressArray.filter((element) => element.id !== selectedAddress.id);

        } else {
            console.log(`Address with id ${sBank.id} not found in the array`);
        }

        setSelectedBank('')
        setSelectedCurrency('')
        setBranch('')
        setIBAN('')
        setSelectedStatus('')
        setsBank('')
        setStatus('')
        setVisibleBank(false)

    }

    const statusTemplate = (rowData: any) => {
        // console.log('rand', rowData)
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" checked={rowData.status}></Checkbox>
            </div>
        );
    };

    const setActPaymentTerm = (paymentTerm) => {
        setCurrentPaymentTerm(paymentTerm);
        setPaymentTerm(paymentTerm);
    }

    //   iban  24 caractere:
    // Cod IBAN în format tipărit	RO49 AAAA 1B31 0075 9384 0000
    return (
        <div className="p-fluid formgrid grid">
            <Toast ref={toast} position="top-right" />
            <div className="field col-12  md:col-2">
                <label htmlFor="paymentTerm">Termen Plata (Zile)</label>
                <InputText id="paymentTerm"
                    type="text"
                    keyfilter="int"
                    value={currentPaymentTerm}
                    onChange={(e) => {
                        setActPaymentTerm(e.target.value);
                    }} />
            </div>
            <Divider />



            <div className='pl-2'>Conturi Bancare</div>
            <Divider />



            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success"
                    size="small" aria-label="Adauga"
                    onClick={() => setVisibleBank(true)}
                />
            </div>


            <div className="field col-12">
                <Divider />
                {myBankArray.length > 0 ?
                    <DataTable value={myBankArray} selectionMode="single"
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
                    : null}

                <div className='p-2'>Rate schimb valutar</div>
                <Divider />
            </div>

            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga"
                    onClick={() => setVisibleExtraPercent(true)}
                />
            </div>
            <Divider />

            {myExtraRatesArray.length > 0 ?
                <div className="field col-12 md:col-12">
                    <DataTable value={myExtraRatesArray} selectionMode="single"
                        selection={selectedCurrencyExchangeRates}
                        onSelectionChange={(e) => {
                            setSelectedCurrencyExchangeRates(getCurrencyRate(e.value.codeCurrency));
                            setCurrency(getCurrencyRate(e.value.codeCurrency));
                            setExtraPercent(e.value.percent);
                            setVisibleExtraPercent(true);
                        }}
                    >
                        <Column field="id" header="Cod"></Column>
                        <Column field="codeCurrency" header="Moneda"></Column>
                        <Column hidden field="currency" header="IdValuta"></Column>
                        <Column field="percent" header="Procent"></Column>


                    </DataTable>
                </div>
                : null}





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
                            {/* <div className="field col-12  md:col-12">
                                <label htmlFor="name">IBAN</label>
                                <InputText id="name" type="text" value={IBAN} onChange={(e) => setIBAN(e.target.value)} />
                            </div> */}

                            <div className="field col-12  md:col-12">
                                <label htmlFor="IBAN">IBAN (Format: RO49-AAAA-1B31-0075-9384-0000)</label>
                                <InputMask id="IBAN" variant="filled" value={IBAN}
                                    onChange={(e) => setIBAN(e.target.value)}
                                    mask="aa99-aaaa-9a99-9999-9999-9999"
                                // placeholder="RO49-AAAA-1B31-0075-9384-0000" 
                                />


                            </div>

                            <div className="field-checkbox col-12 md:col-12">

                                <Checkbox id="status" onChange={e => setSelectedStatus(e.checked)} checked={selectedStatus}></Checkbox>
                                <label htmlFor="status" className="ml-2">Cont Activ</label>
                            </div>

                            <div className='p-3 field col-2 md:col-2'>
                                <div className='grid'>
                                    <div className='flex flex-wrap justify-content-left gap-3'>
                                        <Button label="Salveaza" severity="success" onClick={addItemToArray} />
                                        <Button label="Sterge" severity="danger" onClick={deleteBank} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Dialog>

                <Dialog header="Rate schimb valutar - procentul se aplica la curs BNR" visible={visibleExtraPercent} style={{ width: '30vw' }}
                    onHide={() => {
                        setVisibleExtraPercent(false);
                        setCurrency(null);
                        setSelectedCurrency(null);
                        setSelectedCurrencyExchangeRates([]);
                        setExtraPercent(0);
                    }}>
                    <div className="card">
                        <div className="p-fluid formgrid grid pt-2">

                            <div className="field col-12 md:col-12">
                                <label htmlFor="currency">Moneda</label>
                                <Dropdown id="currency"
                                    showClear
                                    value={selectedCurrencyExchangeRates}
                                    onChange={(e) => {
                                        setSelectedCurrencyExchangeRates(e.value);
                                    }}
                                    options={allCurrency}
                                    optionLabel="code"
                                    placeholder="Select One"></Dropdown>
                            </div>

                            <div className="field col-12  md:col-12">
                                <label htmlFor="extraPercent">Extra Procent</label>
                                <InputNumber id="extraPercent" type="text" value={extraPercent} onValueChange={(e) => setExtraPercent(e.target.value)} />
                            </div>


                            <div className='p-3 field col-2 md:col-2'>
                                <div className='grid'>
                                    <div className='flex flex-wrap justify-content-left gap-3'>
                                        <Button label="Salveaza" severity="success" onClick={addExtraRates} />
                                        <Button label="Sterge" severity="danger" onClick={deleteBank} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Dialog>




            </div>
        </div >
    )
}

export default PartnerBank;