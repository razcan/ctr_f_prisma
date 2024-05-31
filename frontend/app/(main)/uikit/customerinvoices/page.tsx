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


function addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

export default function CustomerInvoice() {



    const toast = useRef(null);
    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing,
    } = useMyContext();

    const { actualContractId, setactualContractId } = useMyContext();


    const { userId, setUserId } = useMyContext();

    // const { value, updateValue } = useData();

    const [vatOnReceipt, setVatOnreceipt] = useState(false);

    const router = useRouter();
    const [contractStatus, setContractStatus] = useState([]);
    const [contractWFStatus, setContractWFStatus] = useState([]);
    const [number, setNumber] = useState();
    const [type, setType] = useState();
    const [contractType, setContractType] = useState([]);
    const [start, setStartDate] = useState();
    const [end, setEndDate] = useState();
    const [sign, setSignDate] = useState();
    const [completion, setCompletionDate] = useState();
    const [remarks, setRemarks] = useState();
    const [status, setStatus] = useState();
    const [statusWF, setStatusWF] = useState();

    const [allCurrency, setAllCurrency] = useState([]);
    const [currency, setCurrency] = useState(null);

    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

    const [entity, setEntity] = useState([]);
    const [partner, setPartner] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState([]);
    const [persons, setPersons] = useState([]);

    const [partnerdetails, setPartnerdetails] = useState([]);
    const [entitydetails, setEntitydetails] = useState([]);

    const [automaticRenewalValue, setAutomaticRenewal] = useState<any>(false);

    const [ent_name, setEnt_name] = useState();
    const [ent_iban, setEnt_IBAN] = useState();
    const [ent_address, setEnt_Address] = useState();
    const [ent_bank, setEnt_bank] = useState();
    const [ent_role, setEnt_role] = useState();
    const [ent_id, setEnt_id] = useState();



    const [party_name, setParty_name] = useState();
    const [party_email, setParty_email] = useState();
    const [party_phone, setParty_phone] = useState();
    const [party_legal_person, setParty_legal_person] = useState();
    const [party_iban, setParty_IBAN] = useState();
    const [party_address, setParty_Address] = useState();
    const [party_role, setParty_role] = useState();
    const [party_bank, setParty_bank] = useState();
    const [party_id, setParty_id] = useState();


    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");



    const fetchAllCurrencies = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/allcurrencies`).then(res => res.json())
        setAllCurrency(response);
    }


    const fetchTypeData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contracttype`)
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })
    }
    const fetchStatusData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contractstatus`)
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractStatus(status)
            })
    }

    const fetchEntity = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/entity`)
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
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
        console.log(response)
    }

    // fetchPartnerAddress()


    function subtractDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }
    const [contractDetails, setContractDetails] = useState([]);
    const [partnerbankId, setPartnerbankId] = useState('');
    const [partneraddressId, setPartneraddressId] = useState('');
    const [entitybankId, setEntitybankId] = useState('');
    const [entityaddressId, setEntityaddressId] = useState('');
    const [ent_person, setEnt_person] = useState([]);
    const [ent_selected_person, setEnt_selected_person] = useState();
    const [party_person, setParty_person] = useState<any>([]);
    const [entityPersons, setEntityPersons] = useState([]);
    const [entityBanks, setEntityBanks] = useState([]);
    const [entityAddress, setEntityAddress] = useState([]);
    const [partnerPersons, setPartnerPersons] = useState([]);
    const [partnerBanks, setPartnerBanks] = useState([]);
    const [partnerAddress, setPartnerAddress] = useState([]);

    const getPersonJson = (name: string) => {
        return entityPersons.find((obj) => obj.name === name);
    };
    const getPartnerPersonJson = (name: string) => {
        return partnerPersons.find((obj) => obj.name === name);
    };
    const getBankJson = (iban: string) => {
        return entityBanks.find((obj) => obj.iban === iban);
    };
    const getPartnerBankJson = (iban: string) => {
        return partnerBanks.find((obj) => obj.iban === iban);
    };
    const getAddressJson = (id: string) => {
        return entityAddress.find((obj) => obj.id === id);
    };
    // const getPartnerAddressJson = (id: string) => {
    //     return partnerAddress.find((obj) => obj.id === id);
    // };



    useEffect(() => {
        fetchItemsData(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData(),
            fetchAllCurrencies()
    }, [])


    useEffect(() => {

    }, [])


    // interface ValidationResult {
    //     isValid: boolean;
    //     errors: string[];
    // }

    // function validateForm(fields: Record<string, any>): ValidationResult {
    //     const errors: string[] = [];


    //     if (!fields.start) {
    //         errors.push("Trebuie sa setati o data de start a contractului!");
    //     }

    //     if (!fields.end) {
    //         errors.push("Trebuie sa setati o data de final a contractului!");
    //     }

    //     if (fields.start > fields.end) {
    //         errors.push("Data de start nu trebuie sa fie mai mare decat data de final!");
    //     }

    //     if (fields.sign > fields.end) {
    //         errors.push("Data de semnare nu trebuie sa fie mai mare decat data de final!");
    //     }

    //     if (!fields.statusId) {
    //         errors.push("Trebuie sa setati o stare a contractului!");
    //     }

    //     if (!fields.statusWFId) {
    //         errors.push("Trebuie sa setati o stare flux contract!");
    //     }

    //     if (!fields.categoryId) {
    //         errors.push("Trebuie sa setati o categorie!");
    //     }

    //     if (!fields.departmentId) {
    //         errors.push("Trebuie sa setati un departament!");
    //     }

    //     if (!fields.costcenterId) {
    //         errors.push("Trebuie sa setati un centru de cost/profit!");
    //     }

    //     if (!fields.cashflowId) {
    //         errors.push("Trebuie sa setati o linie de CashFlow!");
    //     }

    //     if (!fields.locationId) {
    //         errors.push("Trebuie sa setati o locatie!");
    //     }

    //     if (!fields.partnersId) {
    //         errors.push("Trebuie sa setati un partener!");
    //     }

    //     if (!fields.entityId) {
    //         errors.push("Trebuie sa setati o entitate!");
    //     }
    //     if (!fields.partnerpersonsId) {
    //         errors.push("Trebuie sa setati o pesoana responsabila pentru partener!");
    //     }
    //     if (!fields.entitypersonsId) {
    //         errors.push("Trebuie sa setati o pesoana responsabila pentru entitate!");
    //     }
    //     if (!fields.entityaddressId) {
    //         errors.push("Trebuie sa setati o adresa pentru entitate!");
    //     }

    //     if (!fields.partneraddressId) {
    //         errors.push("Trebuie sa setati o adresa pentru partener!");
    //     }

    //     const isValid = errors.length === 0;

    //     return {
    //         isValid,
    //         errors
    //     };
    // }


    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };

    return (
        <div className="card">


            <div className="grid">
                <Toast ref={toast} position="top-right" />
                <div className="col-12">
                    <div className="p-fluid formgrid grid pt-2">


                        <div className="field col-12 md:col-3">
                            <label htmlFor="selectedPartner">Partner</label>
                            <Dropdown
                                value={selectedPartner}
                                options={partner}
                                onChange={(e) => {
                                    setSelectedPartner(e.value);
                                    fetchPartnerAddress(e.value.id);
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
                            // filterFunction={onSearch}
                            />
                        </div>

                        <div className="field col-12 md:col-3">
                            <div className="field col-12  md:col-12">
                                <label htmlFor="ent_address">Adresa</label>
                                <Dropdown id="ent_address" filter
                                    value={party_address}
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
                            <label htmlFor="currency">Moneda factura</label>
                            <Dropdown id="currency"
                                filter
                                filterBy="name,code"
                                filterInputAutoFocus
                                showClear
                                value={currency}
                                onChange={(e) => setCurrency(e.value)}
                                options={allCurrency}
                                optionLabel="code"
                                itemTemplate={(option) => (
                                    <div>
                                        {option.name} ({option.code})
                                    </div>
                                )}
                                placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="remarks" >Curs</label>
                            <InputText id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>


                        <div className="field col-12  md:col-2">
                            <label htmlFor="number">Serie</label>
                            <InputText id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-2">
                            <label htmlFor="number">Numar</label>
                            <InputText id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>


                        <div className="field col-12 md:col-2">
                            <label htmlFor="remarks" >Stare</label>
                            <InputText disabled id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>


                        <div className="field col-12 md:col-2">
                            <label htmlFor="start" className="font-bold block mb-2">
                                Data Emiterii
                            </label>
                            <Calendar id="start" value={start} onChange={(e) => {
                                setStartDate(e.value)
                            }

                            } showIcon dateFormat="dd/mm/yy" />
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="remarks" >Zile Scadenta</label>
                            <InputText disabled id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="start" className="font-bold block mb-2">
                                Data Scadentei
                            </label>
                            <Calendar id="start" value={start} onChange={(e) => {
                                setStartDate(e.value)
                            }

                            } showIcon dateFormat="dd/mm/yy" />
                        </div>


                        <div className="field col-12 md:col-4">
                            <label htmlFor="remarks">Note</label>
                            <InputText id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        <div className="field-checkbox col-12 md:col-1">
                            <Checkbox id="legalrepresent" onChange={e => setVatOnreceipt(e.checked)}
                                checked={vatOnReceipt}
                            // checked={person_legalrepresent === "false" ? false : true}
                            ></Checkbox>
                            <label htmlFor="legalrepresent" className="ml-2">TVA la incasare</label>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};
