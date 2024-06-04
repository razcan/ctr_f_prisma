"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext"
import { MyContext } from '../../../../../../layout/context/myUserContext';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';

interface Bank {
    id: number,
    bank: String,
    currency: String,
    branch: String,
    iban: String,
    status: Boolean
}


const PartnerBank = ({ params, setBankIndex, paymentTerm, setPaymentTerm }: any) => {
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
    // const [paymentTerm, setPaymentTerm] = useState(10);
    const [myExtraRatesArray, setMyExtraRatesArray] = useState<Bank[]>([]);
    const [myBankArray, setMyBankArray] = useState<Bank[]>([]);
    const [selectedCurrencyExchangeRates, setSelectedCurrencyExchangeRates] = useState([]);
    const [visibleExtraPercent, setVisibleExtraPercent] = useState<any>('');
    const [extraPercent, setExtraPercent] = useState(0);
    const [Bank, setBank] = useState<any>([]);
    const [selectedExtraRate, setSelectedExtraRate] = useState<any>([]);


    const [Currency, setCurrency] = useState<any>([]);
    const [allCurrency, setAllCurrency] = useState<any>([]);

    const toast = useRef(null);


    const useMyContext = () => useContext(MyContext);
    const {
        Backend_BASE_URL } = useMyContext();

    const fetchAllCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setCurrency(response);
    }


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


    const fetchAllRCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }

    const getCurrencyRate = (CurrencyToFind: string) => {
        return allCurrency.find((obj: { id: string; }) => obj.id === CurrencyToFind);
    };

    const fetchAllBanks = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allbanks`).then(res => res.json())

        setBank(response);
    }



    const fetchAllExtraRates = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/extrarates/${partnerid}`).then(res => res.json())
        if (response.length == 0) {
            // console.error('Network response was not ok:', response.statusText);
            setMyExtraRatesArray([]);
            return;
        }
        else {
            setMyExtraRatesArray(response);
        }
    }

    const fetchPartnerDetails = async () => {
    }


    useEffect(() => {
        fetchPartnerBanks(),
            fetchAllBanks(),
            fetchAllCurrencies(),
            fetchAllExtraRates(),
            fetchPartnerDetails(),
            fetchAllRCurrencies()
    }, [])

    const deleteBankAccount = async () => {

        try {
            setBankIndex((prevKey: number) => prevKey + 1),
                setVisibleBank(false)
        } catch (error) {
            console.error('Error deleting address:', error);
        }

    }
    const show = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content' });
    };

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };


    const showSuccess = (message: any) => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
        }
    }

    const showError = (message: any) => {
        if (toast.current) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
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
    const sendPartnerBankData = async () => {

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



    const addExtraRates = async () => {

        showSuccess('Actualizat cu succes!')
        show();

        let newExtraRate: any = {
            id: myExtraRatesArray.length + 1,
            currencyId: selectedCurrencyExchangeRates ? selectedCurrencyExchangeRates.id : null,
            codeCurrency: selectedCurrencyExchangeRates ? selectedCurrencyExchangeRates.code : null,
            percent: extraPercent

        }


        let toAddExtraRate: any = {
            partnersId: parseInt(partnerid),
            currencyId: selectedCurrencyExchangeRates ? selectedCurrencyExchangeRates.id : null,
            percent: extraPercent

        }

        if (selectedExtraRate.id) {

            try {
                const response = await axios.patch(`${Backend_BASE_URL}/nomenclatures/extrarates/${selectedExtraRate.id}`,
                    toAddExtraRate
                );
                setBankIndex((prevKey: number) => prevKey + 1),
                    setVisibleBank(false)
                showSuccess('Actualizat cu succes!')
                show();
                console.log(response.data);
            } catch (error) {
                console.error('Error:', error);
            }

        }
        else {

            try {
                const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/extrarates`,
                    toAddExtraRate
                );
                setBankIndex((prevKey: number) => prevKey + 1),
                    setVisibleBank(false)
                console.log(response.data);
            } catch (error) {
                console.error('Error:', error);
            }

        }

        setMyExtraRatesArray((prevArray) => [...prevArray, newExtraRate]);


        setVisibleExtraPercent(false);
        setCurrency(null);
        setSelectedCurrency(null);
        setExtraPercent(0);
        setSelectedCurrencyExchangeRates([]);

    }


    const statusTemplate = (rowData: any) => {
        // console.log('rand', rowData)
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" checked={rowData.status}></Checkbox>
            </div>
        );
    };

    const currencyTemplate = (rowData: any) => {
        const currency_table = getCurrencyRate(rowData.currencyId);
        return (

            <div>
                {currency_table ? currency_table.code : null}
            </div>

        );
    };

    const deleteExtraRates = async () => {

        try {
            const response = await axios.delete(`${Backend_BASE_URL}/nomenclatures/extrarates/${selectedExtraRate.id}`,
            );
            setBankIndex((prevKey: number) => prevKey + 1),
                setVisibleBank(false)
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }

    }

    return (
        <div className="p-fluid formgrid grid pt-2">

            <Toast ref={toast} />
            {/* <Button onClick={show} label="Show" /> */}

            <div className="field col-12  md:col-2">
                <label htmlFor="paymentTerm">Termen Plata (Zile)</label>
                <InputText id="paymentTerm"
                    type="text"
                    keyfilter="int"
                    value={paymentTerm}
                    onChange={(e) => {
                        setPaymentTerm(e.target.value);
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
            <Divider />
            <div className="field col-12">
                {allBanks.length > 0 ?
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
                    : null}
                <div className='pt-6'>Rate schimb valutar</div>
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
                    <DataTable value={myExtraRatesArray}
                        selectionMode="single"
                        // selection={selectedCurrencyExchangeRates}
                        onSelectionChange={(e) => {
                            // setSelectedCurrencyExchangeRates(e.value.currency);
                            setSelectedCurrencyExchangeRates(getCurrencyRate(e.value.currencyId));
                            setExtraPercent(e.value.percent);
                            setVisibleExtraPercent(true);
                            setSelectedExtraRate(e.value);
                        }}
                    >
                        <Column field="id" header="Cod"></Column>
                        <Column field="currency.code" header="Moneda" body={currencyTemplate}></Column>

                        <Column hidden field="currencyId" header="IdValuta"></Column>
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
                                        <Button label="Salveaza" severity="success" onClick={sendPartnerBankData} />
                                        <Button label="Sterge" severity="danger" onClick={deleteBankAccount} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Dialog>




                <Dialog header="Rate schimb valutar - procentul se aplica la curs BNR"
                    visible={visibleExtraPercent} style={{ width: '30vw' }}
                    onHide={() => {
                        setVisibleExtraPercent(false);
                        setCurrency(null);
                        setSelectedCurrency(null);
                        // setSelectedCurrencyExchangeRates(null);
                        setExtraPercent(0);
                        setSelectedExtraRate([]);
                    }}>
                    <div className="card">
                        <div className="p-fluid formgrid grid pt-2">
                            <Toast ref={toast} />

                            <div className="field col-12 md:col-12">
                                <label htmlFor="currency">Moneda</label>

                                <Dropdown id="type"
                                    showClear
                                    value={selectedCurrencyExchangeRates}
                                    onChange={(e) => setSelectedCurrencyExchangeRates(e.value)}
                                    options={allCurrency}
                                    optionLabel="code" placeholder="Select One"></Dropdown>


                            </div>

                            <div className="field col-12  md:col-12">
                                <label htmlFor="extraPercent">Extra Procent</label>
                                <InputNumber id="extraPercent" type="text" value={extraPercent} onValueChange={(e) => setExtraPercent(e.target.value)} />
                            </div>


                            <div className='p-3 field col-2 md:col-2'>
                                <div className='grid'>
                                    <div className='flex flex-wrap justify-content-left gap-3'>
                                        <Button label="Salveaza" severity="success" onClick={addExtraRates} />
                                        <Button label="Sterge" severity="danger" onClick={deleteExtraRates} />
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