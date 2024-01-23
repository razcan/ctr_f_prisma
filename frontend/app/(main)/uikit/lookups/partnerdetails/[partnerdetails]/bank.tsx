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

const PartnerBank = ({ params, setBankIndex }: any) => {
    const partnerid = params[0]
    const [visibleBank, setVisibleBank] = useState<any>('');
    const [selectedBank, setSelectedBank] = useState<any>([]);
    const [sBank, setsBank] = useState<any>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<any>([]);
    const [Branch, setBranch] = useState<any>('');
    const [IBAN, setIBAN] = useState<any>('');
    const [selectedStatus, setSelectedStatus] = useState<any>(true);
    const [Status, setStatus] = useState<any>(true);
    const [allBanks, setAllBanks] = useState<any>([]);

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

    const getBank = (BankToFind: string) => {
        return Bank.find((obj: { name: string; }) => obj.name === BankToFind);
    };

    const fetchPartnerBanks = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/bank/${partnerid}`).then(res => res.json())
        setAllBanks(response);
    }

    useEffect(() => {
        fetchPartnerBanks()
    }, [])

    const deleteBankAccount = async () => {

        try {
            const response = await axios.delete(`http://localhost:3000/nomenclatures/bank/${sBank.id}`,
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
                const response = await axios.patch(`http://localhost:3000/nomenclatures/bank/${sBank.id}`,
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
                const response = await axios.post('http://localhost:3000/nomenclatures/bank',
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
            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga"
                    onClick={() => setVisibleBank(true)}
                />
            </div>
            <div className="field col-12">
                <Dialog header="Adresa" visible={visibleBank} style={{ width: '30vw' }} onHide={() => setVisibleBank(false)}>
                    <div className="card">
                        <div className="p-fluid formgrid grid pt-2">

                            <div className="field col-12  md:col-12">
                                <label htmlFor="type">Banca</label>
                                <Dropdown id="type"
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
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                    selection={selectedBank} onSelectionChange={(e) => {
                        console.log(e.value)

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
                    <Column field="status" header="status"></Column>
                    <Column header="Activ" style={{ width: '10vh' }} body={statusTemplate} />


                </DataTable>
            </div>
        </div>
    )
}

export default PartnerBank;