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
// import { useData } from './DataContext';
import { MyContext } from '../../../../../layout/context/myUserContext'
import { Toast } from 'primereact/toast';


function addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

interface DropdownItem {
    name: string;
    code: string;
}


interface Contract {
    number?: number,
    typeId?: number,
    statusId?: number,
    statusWFId?: number,
    start?: Date,
    end?: Date,
    sign?: Date,
    completion?: Date,
    remarks?: string,
    categoryId?: number,
    departmentId?: number,
    cashflowId?: number,
    itemId?: number,
    costcenterId?: number,
    automaticRenewal: boolean,
    // contract: any,
    partnersId: number,
    entityId: number,
    partnerpersonsId: number,
    entitypersonsId: number,
    entityaddressId: number,
    partneraddressId: number,
    entitybankId: number,
    partnerbankId: number
}

interface DynamicInfo {
    contractId: number,
    dffInt1?: number,
    dffInt2?: number,
    dffInt3?: number,
    dffInt4?: number,
    dffString1?: string,
    dffString2?: string,
    dffString3?: string,
    dffString4?: string,
    dffDate1?: Date,
    dffDate2?: Date
}


export default function HeaderContract({ setContractId }: any) {



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
    const [dynamicFields, setDynamicFields] = useState([]);

    const [dffInt1, setdffInt1] = useState('');
    const [dffInt2, setdffInt2] = useState('');
    const [dffInt3, setdffInt3] = useState('');
    const [dffInt4, setdffInt4] = useState('');

    const [dffString1, setdffString1] = useState('');
    const [dffString2, setdffString2] = useState('');
    const [dffString3, setdffString3] = useState('');
    const [dffString4, setdffString4] = useState('');

    const [dffDate1, setdffDate1] = useState('');
    const [dffDate2, setdffDate2] = useState('');


    const getSourceOptions = (sourceName) => {
        switch (sourceName) {
            case 'dffInt1':
                return dffInt1;
            case 'dffInt2':
                return dffInt2;
            case 'dffInt3':
                return dffInt3;
            case 'dffInt4':
                return dffInt4;
            case 'dffString1':
                return dffString1;
            case 'dffString2':
                return dffString2;
            case 'dffString3':
                return dffString3;
            case 'dffString4':
                return dffString4;
            case 'dffDate1':
                return setdffDate1;
            case 'dffDate2':
                return setdffDate2;

            default:
                return [];
        }
    };

    // Store functions in an object
    const functionMap: { [key: string]: (value: string) => void } = {
        setdffInt1,
        setdffInt2,
        setdffInt3,
        setdffInt4,
        setdffString1,
        setdffString2,
        setdffString3,
        setdffString4,
        setdffDate1,
        setdffDate2
    };


    const fetchLocationData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/location`)
            .then(response => {
                return response.json()
            })
            .then(location => {
                setLocations(location)
            })
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

    const fetchDynamicFields = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/dynamicfield`)
            .then(response => {
                return response.json()
            })
            .then(dynfields => {
                setDynamicFields(dynfields)
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
            fetchDynamicFields(),
            fetchLocationData(),
            fetchWFStatusData()
    }, [])


    useEffect(() => {
        if (Id > 0) {
            fetchContractData()
        }

    }, [Id])


    interface ValidationResult {
        isValid: boolean;
        errors: string[];
    }

    function validateForm(fields: Record<string, any>): ValidationResult {
        const errors: string[] = [];


        if (!fields.start) {
            errors.push("Trebuie sa setati o data de start a contractului!");
        }

        if (!fields.end) {
            errors.push("Trebuie sa setati o data de final a contractului!");
        }

        if (fields.start > fields.end) {
            errors.push("Data de start nu trebuie sa fie mai mare decat data de final!");
        }

        if (fields.sign > fields.end) {
            errors.push("Data de semnare nu trebuie sa fie mai mare decat data de final!");
        }

        if (!fields.statusId) {
            errors.push("Trebuie sa setati o stare a contractului!");
        }

        if (!fields.statusWFId) {
            errors.push("Trebuie sa setati o stare flux contract!");
        }

        if (!fields.categoryId) {
            errors.push("Trebuie sa setati o categorie!");
        }

        if (!fields.departmentId) {
            errors.push("Trebuie sa setati un departament!");
        }

        if (!fields.costcenterId) {
            errors.push("Trebuie sa setati un centru de cost/profit!");
        }

        if (!fields.cashflowId) {
            errors.push("Trebuie sa setati o linie de CashFlow!");
        }

        if (!fields.locationId) {
            errors.push("Trebuie sa setati o locatie!");
        }

        if (!fields.partnersId) {
            errors.push("Trebuie sa setati un partener!");
        }

        if (!fields.entityId) {
            errors.push("Trebuie sa setati o entitate!");
        }
        if (!fields.partnerpersonsId) {
            errors.push("Trebuie sa setati o pesoana responsabila pentru partener!");
        }
        if (!fields.entitypersonsId) {
            errors.push("Trebuie sa setati o pesoana responsabila pentru entitate!");
        }
        if (!fields.entityaddressId) {
            errors.push("Trebuie sa setati o adresa pentru entitate!");
        }

        if (!fields.partneraddressId) {
            errors.push("Trebuie sa setati o adresa pentru partener!");
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


    const saveContract = async () => {
        // console.log(number, partner, start, end, completion, sign, type, remarks, status)

        let addedContract: Contract = {
            number: number,
            typeId: type ? type.id : null,
            // partner: partner,
            statusId: status ? status.id : null,
            statusWFId: statusWF ? statusWF.id : null,
            start: (start ? addOneDay(start) : null),
            end: (end ? addOneDay(end) : null),
            sign: (sign ? addOneDay(sign) : null),
            completion: (completion ? addOneDay(completion) : null),
            remarks: remarks,
            categoryId: selectedCategory ? selectedCategory.id : null,
            departmentId: selectedDepartment ? selectedDepartment.id : null,
            cashflowId: selectedCashflow ? selectedCashflow.id : null,
            locationId: selectedLocation ? selectedLocation.id : null,
            costcenterId: selectedCostCenter ? selectedCostCenter.id : null,
            automaticRenewal: automaticRenewalValue,
            // contract: selectedItem,
            partnersId: selectedPartner ? selectedPartner.id : null,
            entityId: selectedEntity ? selectedEntity.id : null,
            partnerpersonsId: party_id,
            entitypersonsId: ent_id,
            entityaddressId: ent_address ? ent_address.id : null,
            partneraddressId: party_address?.id ?? null,
            entitybankId: ent_iban ? ent_iban.id : null,
            partnerbankId: party_iban?.id ?? null,
            userId: userId,
            isPurchasing: isPurchasing
        }

        const validationResult = validateForm(addedContract);


        if (!validationResult.isValid) {
            showMessage('error', 'Eroare', validationResult.errors)
        }
        else {
            let addDynamicInfo: DynamicInfo = {
                contractId: 0,
                dffInt1: parseInt(dffInt1),
                dffInt2: parseInt(dffInt2),
                dffInt3: parseInt(dffInt3),
                dffInt4: parseInt(dffInt4),
                dffString1: dffString1,
                dffString2: dffString2,
                dffString3: dffString3,
                dffString4: dffString4,
                dffDate1: (dffDate1 ? addOneDay(dffDate1) : null),
                dffDate2: (dffDate2 ? addOneDay(dffDate2) : null),
            }

            const toSend = []
            toSend.push(addedContract)
            toSend.push(addDynamicInfo)


            try {
                const response = await axios.post(`${Backend_BASE_URL}/contracts`,
                    toSend
                );
                setactualContractId(response.data.id)
                setContractId(response.data.id)
                // updateValue(response.data.id)


                if (response.status == 200 || response.status == 201) {
                    showMessage('success', 'Salvat cu succes!', 'Ok');
                    // router.push(`/uikit/addcontract/ctr?Id=${response.data.id}&idxp=${0}`)

                    router.push(`/uikit/editcontract/ctr?Id=${response.data.id}&idxp=${0}`)
                }
                else {
                    showMessage('error', 'Eroare', response.statusText)
                }
            } catch (error) {
                console.error('Error creating contract:', error);
            }
        }



    }

    return (
        <div className="grid">
            <Toast ref={toast} position="top-right" />
            <div className="col-12">
                {/* <div className="card"> */}
                <div className="p-fluid formgrid grid pt-2">

                    <Accordion className="field lg:col-12 xs:col-3 md:col-12" multiple
                        activeIndex={[0, 1]}
                    >
                        <AccordionTab
                            header={
                                <span className="flex align-items-center gap-2 w-full">
                                    Entitate: {selectedEntity.name}
                                </span>
                            }

                        >
                            <div className="grid">
                                <div className="col-12">
                                    <div className="p-fluid formgrid grid pt-2">
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="entity">Entitate</label>
                                            <Dropdown id="entity"
                                                showClear
                                                filter
                                                value={selectedEntity}
                                                onChange={(e) => {
                                                    setSelectedEntity(e.value)
                                                    // fetchPartnersDetailsData(e.value.id)
                                                    fetchEntityDetailsData(e.value.id)

                                                }}
                                                options={entity}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="entity">Nume Responsabil</label>
                                            <Dropdown id="entity"
                                                filter
                                                showClear
                                                value={ent_name}
                                                // value={getPersonJson(ent_name)}
                                                onChange={(e) => {
                                                    setEnt_id(e.target.value.id)
                                                    setEnt_name(e.target.value)
                                                    setEnt_email(e.target.value.email)
                                                    setEnt_phone(e.target.value.phone)
                                                    setEnt_legal_person(e.target.value.legalrepresent)
                                                    setEnt_role(e.target.value.role)

                                                }
                                                }
                                                options={entitydetails.Persons}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_email">Rol</label>
                                            <InputText disabled id="ent_email" type="text" value={ent_role} />
                                        </div>

                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_email">Email Responsabil</label>
                                            <InputText disabled id="ent_email" type="text" value={ent_email} onChange={(e) => setEnt_email(e.target.value)} />
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_phone">Telefon Responsabil</label>
                                            <InputText disabled id="ent_phone" keyfilter="int" type="text" value={ent_phone} onChange={(e) => setEnt_phone(e.target.value)} />
                                        </div>
                                        <div className="field-checkbox col-12 md:col-3">
                                            <Checkbox id="default" checked={ent_legal_person}></Checkbox>
                                            <label htmlFor="default" className="ml-2">Reprezentant Legal</label>
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_legal_person">Banca</label>
                                            <InputText disabled id="ent_legal_person" type="text" value={ent_bank} />
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_iban">IBAN</label>
                                            <Dropdown id="entity" showClear value={ent_iban}
                                                filter
                                                onChange={(e) => {
                                                    setEnt_IBAN(e.target.value)
                                                    setEnt_bank(e.target.value.bank)
                                                }
                                                }
                                                options={entitydetails.Banks}
                                                optionLabel="iban" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="number">Adresa</label>
                                            <Dropdown id="entity" showClear value={ent_address}
                                                onChange={(e) => {
                                                    setEnt_Address(e.target.value)
                                                }
                                                }
                                                options={entitydetails.Address}
                                                optionLabel="completeAddress" placeholder="Select One"></Dropdown>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </AccordionTab>
                        <AccordionTab header={
                            <span className="flex align-items-center gap-2 w-full">
                                Partener: {selectedPartner.name}
                            </span>
                        }>
                            <div className="grid">
                                <div className="col-12">
                                    <div className="p-fluid formgrid grid pt-2">
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="partner">Partner</label>
                                            <Dropdown id="entity"
                                                filter
                                                showClear
                                                value={selectedPartner}
                                                onChange={(e) => {
                                                    setSelectedPartner(e.value)
                                                    fetchPartnersDetailsData(e.value.id)
                                                    // console.log(e.value)
                                                }}
                                                options={partner}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="party_name">Nume Responsabil</label>
                                            <Dropdown id="entity" showClear value={party_name}
                                                filter
                                                onChange={(e) => {
                                                    setParty_id(e.target.value.id)
                                                    setParty_name(e.target.value)
                                                    setParty_email(e.target.value.email)
                                                    setParty_phone(e.target.value.phone)
                                                    setParty_legal_person(e.target.value.legalrepresent)
                                                    setParty_role(e.target.value.role)
                                                }
                                                }
                                                options={partnerdetails.Persons}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_email">Rol</label>
                                            <InputText disabled id="ent_email" type="text" value={party_role} />
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="party_email">Email Responsabil</label>
                                            <InputText disabled id="party_email" type="text" value={party_email} onChange={(e) => setParty_email(e.target.value)} />
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="party_phone">Telefon Responsabil</label>
                                            <InputText disabled id="party_phone" keyfilter="int" type="text" value={party_phone} onChange={(e) => setParty_phone(e.target.value)} />
                                        </div>
                                        <div className="field-checkbox col-12 md:col-3">
                                            <Checkbox id="default" checked={party_legal_person}></Checkbox>
                                            <label htmlFor="default" className="ml-2">Reprezentant Legal</label>

                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_legal_person">Banca</label>
                                            <InputText disabled id="ent_legal_person" type="text" value={party_bank} />
                                        </div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="ent_iban">IBAN</label>
                                            <Dropdown id="party" showClear value={party_iban}
                                                filter
                                                onChange={(e) => {
                                                    setParty_IBAN(e.target.value)
                                                    setParty_bank(e.target.value.bank)
                                                }
                                                }
                                                options={partnerdetails.Banks}
                                                optionLabel="iban" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="number">Adresa</label>
                                            <Dropdown id="entity" showClear value={party_address}
                                                filter
                                                onChange={(e) => {
                                                    setParty_Address(e.target.value)
                                                }
                                                }
                                                options={partnerdetails.Address}
                                                optionLabel="completeAddress" placeholder="Select One"></Dropdown>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </AccordionTab>
                        <AccordionTab header="Informatii Dinamice">
                            <div className="grid">
                                <div className="col-12">
                                    <div className="p-fluid formgrid grid pt-2">

                                        {dynamicFields.map(field => {
                                            switch (field.fieldtype) {
                                                case 'String':
                                                    return (

                                                        <div className="field col-12 md:col-3">
                                                            <label htmlFor="party_bank">{field.fieldlabel}</label>
                                                            <InputText
                                                                key={field.fieldname}
                                                                value={getSourceOptions(field.fieldname)}
                                                                onChange={(e) => {
                                                                    const functionName = "set" + field.fieldname;
                                                                    if (functionName in functionMap) {
                                                                        functionMap[functionName](e.target.value);
                                                                    } else {
                                                                        console.error(`Function '${functionName}' does not exist.`);
                                                                    }
                                                                }}
                                                                type="text" />
                                                        </div>

                                                    );
                                                case 'Date':
                                                    return (

                                                        <div className="field col-12 md:col-3">
                                                            <label className="font-bold block mb-2">
                                                                {field.fieldlabel}
                                                            </label>
                                                            <Calendar
                                                                key={field.fieldname}
                                                                value={getSourceOptions(field.fieldname)}
                                                                onChange={(e) => {
                                                                    const functionName = "set" + field.fieldname;
                                                                    if (functionName in functionMap) {
                                                                        functionMap[functionName](e.value);
                                                                    } else {
                                                                        console.error(`Function '${functionName}' does not exist.`);
                                                                    }
                                                                }}
                                                                showIcon dateFormat="dd/mm/yy" />
                                                        </div>

                                                    );
                                                case 'Int':
                                                    return (
                                                        <div className="field col-12 md:col-3">
                                                            <label htmlFor="party_bank">{field.fieldlabel}</label>
                                                            <InputText
                                                                keyfilter="int"
                                                                key={field.fieldname}
                                                                value={getSourceOptions(field.fieldname)}

                                                                onChange={(e) => {
                                                                    const functionName = "set" + field.fieldname;
                                                                    if (functionName in functionMap) {
                                                                        functionMap[functionName](e.target.value);
                                                                    } else {
                                                                        console.error(`Function '${functionName}' does not exist.`);
                                                                    }
                                                                }}

                                                                type="text" />
                                                        </div>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })}

                                    </div>
                                </div>
                            </div>

                        </AccordionTab>
                    </Accordion>

                    <div className="field col-12  md:col-3">
                        <label htmlFor="number">Numar</label>
                        <InputText id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="type">Tip</label>
                        <Dropdown id="type" filter showClear value={type} onChange={(e) => setType(e.value)} options={contractType} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="status">Stare Contract</label>
                        <Dropdown id="status" filter showClear value={status}
                            onChange={(e) => setStatus(e.value)} options={contractStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                    <div className="field col-12 md:col-3">
                        <label htmlFor="state">Stare Flux</label>
                        <Dropdown id="state" showClear filter value={statusWF}
                            onChange={(e) => setStatusWF(e.value)} options={contractWFStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>


                    <div className="field col-12 md:col-3">
                        <label className="font-bold block mb-2">
                            Data Start
                        </label>
                        <Calendar id="start" value={start} onChange={(e) => setStartDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 md:col-3">
                        <label className="font-bold block mb-2">
                            Data Final
                        </label>
                        <Calendar id="end" value={end} onChange={(e) => setEndDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 md:col-3">
                        <label className="font-bold block mb-2">
                            Data Semnare
                        </label>
                        <Calendar id="sign" value={sign} onChange={(e) => setSignDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>
                    <div className="field col-12 md:col-3">
                        <label className="font-bold block mb-2">
                            Inchis la data
                        </label>
                        <Calendar id="completion" value={completion} onChange={(e) => setCompletionDate(e.value)} showIcon dateFormat="dd/mm/yy" />
                    </div>


                    <div className="field col-12 md:col-3">
                        <label htmlFor="department">Departament</label>
                        <Dropdown id="department" filter showClear value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.value)} options={departments} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                    <div className="field  col-12 md:col-3">
                        <label htmlFor="location">Locatie</label>
                        <Dropdown id="location" filter showClear value={selectedLocation} onChange={(e) => setSelectedLocation(e.value)} options={locations} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="costcenter">Centru de cost&profit</label>
                        <Dropdown id="costcenter" showClear filter value={selectedCostCenter} onChange={(e) => setSelectedCostCenter(e.value)} options={costcenters} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="category">Categorie</label>
                        <Dropdown id="category" filter showClear value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categories} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="cashflow">CashFlow</label>
                        <Dropdown id="cashflow" showClear filter value={selectedCashflow} onChange={(e) => setSelectedCashflow(e.value)} options={cashflows} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                    <div className="field col-12 md:col-3 pt-6">
                        <div className="field-checkbox">
                            <Checkbox onChange={e => setAutomaticRenewal(e.checked)} checked={automaticRenewalValue}></Checkbox>
                            <label htmlFor="auto_renewal">Prelungire Automata</label>
                        </div>
                    </div>

                    <div className="field col-12 md:col-12">
                        <label htmlFor="cashflow">Scurta descriere a contractului</label>
                        {/* <Editor value={remarks} onTextChange={(e) => setRemarks(e.htmlValue)}
                            className='max-w-screen' style={{ height: '220px' }}
                        /> */}
                        <InputTextarea className='max-w-screen' value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={5} cols={30} />
                    </div>

                    <div className="field col-1 md:col-2 ">
                        <Button label="Salveaza" onClick={saveContract} />
                    </div>
                </div>
            </div>
        </div>
    );
};
