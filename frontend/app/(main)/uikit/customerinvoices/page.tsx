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
    const [currency, setCurrency] = useState([]);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);

    const [cashflows, setCashflow] = useState([]);
    const [selectedCashflow, setSelectedCashflow] = useState([]);

    const [costcenters, setCostCenter] = useState([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState([]);

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
    const [ent_email, setEnt_email] = useState();
    const [ent_phone, setEnt_phone] = useState();
    const [ent_legal_person, setEnt_legal_person] = useState();
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

    const queryClient = new QueryClient();

    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");



    const fetchLocationData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/location`)
            .then(response => {
                return response.json()
            })
            .then(location => {
                setLocations(location)
            })
    }

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

    const fetchWFStatusData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/contractwfstatus`)
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractWFStatus(status)
            })
    }

    const fetchCategoriesData = () => {
        fetch(`${Backend_BASE_URL}/contracts/category`)
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
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
    const fetchPartnersDetailsData = (partnerId: number) => {
        fetch(`${Backend_BASE_URL}/nomenclatures/partnersdetails/${partnerId}`)
            .then(response => {
                return response.json()
            })
            .then(partnerdetails => {
                setPartnerdetails(partnerdetails[0])
            })
    }
    const fetchEntityDetailsData = (entityId: number) => {
        fetch(`${Backend_BASE_URL}/nomenclatures/entitydetails/${entityId}`)
            .then(response => {
                return response.json()
            })
            .then(entitydetails => {
                setEntitydetails(entitydetails[0])
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
    const fetchCashFlow = () => {
        fetch(`${Backend_BASE_URL}/contracts/cashflownom`)
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchCostCenter = () => {
        fetch(`${Backend_BASE_URL}/contracts/costcenter`)
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }
    const fetchDepartmentsData = () => {
        fetch(`${Backend_BASE_URL}/contracts/department`)
            .then(response => {
                return response.json()
            })
            .then(departments => {
                setDepartments(departments)
            })
    }



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
    const getPartnerAddressJson = (id: string) => {
        return partnerAddress.find((obj) => obj.id === id);
    };

    const fetchContractData = async () => {
        await fetch(`${Backend_BASE_URL}/contracts/details/${Id}`)
            .then(response => {

                return response.json()
            })
            .then(contractdetails => {
                setContractDetails(contractdetails)
                console.log(contractdetails, "contractdetails")


                if (contractdetails.PartnerBank !== null && contractdetails.PartnerBank !== undefined) {
                    setPartnerbankId(contractdetails.PartnerBank.id)
                }

                if (contractdetails.PartnerAddress !== null && contractdetails.PartnerAddress !== undefined) {
                    setPartneraddressId(contractdetails.PartnerAddress.id)
                }


                const referenceDate = new Date('2024-01-01T00:00:00+00:00');

                setEntitybankId(contractdetails.EntityBank.id)
                setEntityaddressId(contractdetails.EntityAddress.id)

                const formated_start_date = new Date(subtractDays(contractdetails.start, 1));
                const formated_end_date = new Date(subtractDays(contractdetails.end, 1));
                const formated_completion_date = new Date(subtractDays(contractdetails.completion, 1));
                const formated_sign_date = new Date(subtractDays(contractdetails.sign, 1));

                setStartDate(formated_start_date)

                setEndDate(formated_end_date)

                setCompletionDate(formated_completion_date)

                setSignDate(formated_sign_date)

                if (formated_completion_date < referenceDate) {
                    setCompletionDate('')
                }
                else setCompletionDate(formated_completion_date)

                if (formated_sign_date < referenceDate) {
                    setSignDate('')
                }
                else setSignDate(formated_sign_date)




                setNumber(contractdetails.number)
                setAutomaticRenewal(contractdetails.automaticRenewal)

                setType(contractdetails.type)
                setStatus(contractdetails.status)
                setStatusWF(contractdetails.statusWF)
                setSelectedCategory(contractdetails.Category)
                setSelectedDepartment(contractdetails.departament)
                setSelectedLocation(contractdetails.location)
                setSelectedCostCenter(contractdetails.costcenter)
                setSelectedCashflow(contractdetails.cashflow)

                setSelectedEntity(contractdetails.entity)
                setSelectedPartner(contractdetails.partner)

                if (contractdetails.EntityPerson !== null && contractdetails.EntityPerson !== undefined) {
                    setEnt_person(contractdetails.EntityPerson.name)
                }

                if (contractdetails.PartnerPerson !== null && contractdetails.PartnerPerson !== undefined) {
                    setParty_person(contractdetails.PartnerPerson.name)
                }



                const fetchEntityPersons = async () => {
                    const response = await fetch(`${Backend_BASE_URL}/nomenclatures/persons/${contractdetails.entity.id}`).then(res => res.json().then(res => {
                        setEntityPersons(res);

                    })
                    )
                }
                fetchEntityPersons()

                const fetchEntityBanks = async () => {
                    const response = await fetch(`${Backend_BASE_URL}/nomenclatures/bank/${contractdetails.entity.id}`).then(res => res.json())
                    setEntityBanks(response);
                }
                fetchEntityBanks()
                const fetchEntityAddress = async () => {
                    const response = await fetch(`${Backend_BASE_URL}/nomenclatures/address/${contractdetails.entity.id}`).then(res => res.json())
                    setEntityAddress(response);
                }
                fetchEntityAddress()

                setEnt_id(contractdetails.EntityPerson.id)
                // setEnt_name(contractdetails.EntityPerson.name)
                setEnt_name(getPersonJson(contractdetails.EntityPerson.name))
                setEnt_email(contractdetails.EntityPerson.email)
                setEnt_phone(contractdetails.EntityPerson.phone)
                setEnt_legal_person(contractdetails.EntityPerson.legalrepresent)
                setEnt_role(contractdetails.EntityPerson.role)
                setEnt_IBAN(contractdetails.EntityBank.iban)
                setEnt_bank(contractdetails.EntityBank.bank)
                setEnt_Address(contractdetails.EntityAddress.id)


                const fetchPartnerPersons = async () => {
                    const response = await fetch(`${Backend_BASE_URL}/nomenclatures/persons/${contractdetails.partner.id}`).then(res => res.json().then(res => {
                        setPartnerPersons(res);
                        // console.log(res)

                        if (contractdetails.PartnerPerson !== null && contractdetails.PartnerPerson !== undefined) {

                            setParty_id(contractdetails.PartnerPerson.id)
                            setParty_name(contractdetails.PartnerPerson.name)
                            setParty_email(contractdetails.PartnerPerson.email)
                            setParty_phone(contractdetails.PartnerPerson.phone)
                            setParty_legal_person(contractdetails.PartnerPerson.legalrepresent)
                            setParty_role(contractdetails.PartnerPerson.role)
                        }
                    })
                    )
                }
                fetchPartnerPersons()

                const fetchPartnerBanks = async () => {
                    const response = await fetch(`${Backend_BASE_URL}/nomenclatures/bank/${contractdetails.partner.id}`).then(res => res.json())
                    setPartnerBanks(response);
                }
                fetchPartnerBanks()
                const fetchPartnerAddress = async () => {
                    const response = await fetch(`${Backend_BASE_URL}/nomenclatures/address/${contractdetails.partner.id}`).then(res => res.json())
                    setPartnerAddress(response);
                }
                fetchPartnerAddress()

                if (contractdetails.partner !== null && contractdetails.partner !== undefined) {
                    setParty_id(contractdetails.partner.id)
                    setParty_name(contractdetails.partner.name)
                    setParty_email(contractdetails.partner.email)
                    setParty_phone(contractdetails.partner.phone)
                    setParty_legal_person(contractdetails.partner.legalrepresent)
                    setParty_role(contractdetails.partner.role)
                }

                if (contractdetails.PartnerBank !== null && contractdetails.PartnerBank !== undefined) {
                    setParty_IBAN(contractdetails.PartnerBank.iban)
                    setParty_bank(contractdetails.PartnerBank.bank)
                }
                setParty_Address(contractdetails.partneraddressId)

                setRemarks(contractdetails.remarks)
            })
    }

    useEffect(() => {
        fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchItemsData(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData(),
            fetchLocationData(),
            fetchWFStatusData(),
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


    // const saveContract = async () => {
    //     // console.log(number, partner, start, end, completion, sign, type, remarks, status)

    //     let addedContract: Contract = {
    //         number: number,
    //         typeId: type ? type.id : null,
    //         // partner: partner,
    //         statusId: status ? status.id : null,
    //         statusWFId: statusWF ? statusWF.id : null,
    //         start: (start ? addOneDay(start) : null),
    //         end: (end ? addOneDay(end) : null),
    //         sign: (sign ? addOneDay(sign) : null),
    //         completion: (completion ? addOneDay(completion) : null),
    //         remarks: remarks,
    //         categoryId: selectedCategory ? selectedCategory.id : null,
    //         departmentId: selectedDepartment ? selectedDepartment.id : null,
    //         cashflowId: selectedCashflow ? selectedCashflow.id : null,
    //         locationId: selectedLocation ? selectedLocation.id : null,
    //         costcenterId: selectedCostCenter ? selectedCostCenter.id : null,
    //         automaticRenewal: automaticRenewalValue,
    //         // contract: selectedItem,
    //         partnersId: selectedPartner ? selectedPartner.id : null,
    //         entityId: selectedEntity ? selectedEntity.id : null,
    //         partnerpersonsId: party_id,
    //         entitypersonsId: ent_id,
    //         entityaddressId: ent_address ? ent_address.id : null,
    //         partneraddressId: party_address?.id ?? null,
    //         entitybankId: ent_iban ? ent_iban.id : null,
    //         partnerbankId: party_iban?.id ?? null,
    //         userId: userId,
    //         isPurchasing: isPurchasing
    //     }

    //     const validationResult = validateForm(addedContract);


    //     if (!validationResult.isValid) {
    //         showMessage('error', 'Eroare', validationResult.errors)
    //     }
    //     else {
    //         let addDynamicInfo: DynamicInfo = {
    //             contractId: 0,
    //             dffInt1: parseInt(dffInt1),
    //             dffInt2: parseInt(dffInt2),
    //             dffInt3: parseInt(dffInt3),
    //             dffInt4: parseInt(dffInt4),
    //             dffString1: dffString1,
    //             dffString2: dffString2,
    //             dffString3: dffString3,
    //             dffString4: dffString4,
    //             dffDate1: (dffDate1 ? addOneDay(dffDate1) : null),
    //             dffDate2: (dffDate2 ? addOneDay(dffDate2) : null),
    //         }

    //         const toSend = []
    //         toSend.push(addedContract)
    //         toSend.push(addDynamicInfo)


    //         try {
    //             const response = await axios.post(`${Backend_BASE_URL}/contracts`,
    //                 toSend
    //             );
    //             setactualContractId(response.data.id)
    //             setContractId(response.data.id)
    //             // updateValue(response.data.id)


    //             if (response.status == 200 || response.status == 201) {
    //                 showMessage('success', 'Salvat cu succes!', 'Ok');
    //                 // router.push(`/uikit/addcontract/ctr?Id=${response.data.id}&idxp=${0}`)

    //                 router.push(`/uikit/editcontract/ctr?Id=${response.data.id}&idxp=${0}`)
    //             }
    //             else {
    //                 showMessage('error', 'Eroare', response.statusText)
    //             }
    //         } catch (error) {
    //             console.error('Error creating contract:', error);
    //         }
    //     }



    // }

    return (
        <div className="card">


            <div className="grid">
                <Toast ref={toast} position="top-right" />
                <div className="col-12">
                    <div className="p-fluid formgrid grid pt-2">

                        <div className="field col-12 md:col-2">
                            <label htmlFor="remarks" >Date Entitate</label>
                            <InputText disabled id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>


                        <div className="field col-12 md:col-3">
                            <label htmlFor="selectedPartner">Partner</label>
                            <Dropdown id="selectedPartner" value={selectedPartner} filter
                                onChange={(e) => {
                                    setSelectedPartner(e.value.id)
                                    // fetchPartnersDetailsData(e.value.id)
                                }}
                                options={partner}
                                optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="currency">Moneda factura</label>
                            <Dropdown id="currency" filter showClear value={currency} onChange={(e) => setCurrency(e.value)} options={allCurrency} optionLabel="code" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="remarks" >Curs</label>
                            <InputText disabled id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>


                        <div className="field col-12  md:col-2">
                            <label htmlFor="number">Serie si numar</label>
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

                        <div className="field col-12  md:col-4">
                            <label htmlFor="party_address">Adresa</label>
                            <Dropdown id="party_address" value={getPartnerAddressJson(party_address)} filter
                                onChange={(e) => {
                                    setParty_Address(e.target.value)
                                }}
                                options={partnerAddress}
                                optionLabel="completeAddress" placeholder="Select One"></Dropdown>

                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="remarks">Scurta descriere</label>
                            <InputText id="remarks" className='max-w-screen'
                                value={remarks} onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
