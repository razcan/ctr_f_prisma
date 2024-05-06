'use client';
//import { useRouter } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from 'primereact/editor';
import axios from 'axios';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import { useData } from './DataContext';

const queryClient = new QueryClient();

function addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
}

interface Contract {
    number?: number,
    typeId?: number,
    statusId?: number,
    start?: Date,
    end?: Date,
    sign?: Date,
    completion?: Date,
    remarks?: string,
    categoryId?: number,
    departmentId?: number,
    cashflowId?: number,
    locationId?: number,
    costcenterId?: number,
    automaticRenewal: boolean,
    partnersId: number,
    entityId: number,
    partnerpersonsId: number,
    entitypersonsId: number,
    entityaddressId: number,
    partneraddressId: number,
    entitybankId: number,
    partnerbankId: number,
    parentId: number
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

export default function EditContract({ setAddContractId }: any) {

    const { value, updateValue } = useData();
    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");
    const addId = searchParams.get("addId");
    // console.log(Id)
    const [contractDetails, setContractDetails] = useState([]);
    const [contractStatus, setContractStatus] = useState([]);
    const [number, setNumber] = useState('');
    const [type, setType] = useState('');
    const [contractType, setContractType] = useState([]);
    const [start, setStartDate] = useState('');
    const [end, setEndDate] = useState('');
    const [sign, setSignDate] = useState('');
    const [completion, setCompletionDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);


    const [cashflows, setCashflow] = useState([]);
    const [selectedCashflow, setSelectedCashflow] = useState([]);

    const [costcenters, setCostCenter] = useState([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState([]);

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);


    const [entity, setEntity] = useState([]);
    const [partner, setPartner] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState([]);


    const [entityPersons, setEntityPersons] = useState([]);
    const [entityBanks, setEntityBanks] = useState([]);
    const [entityAddress, setEntityAddress] = useState([]);

    const [partnerPersons, setPartnerPersons] = useState([]);
    const [partnerBanks, setPartnerBanks] = useState([]);
    const [partnerAddress, setPartnerAddress] = useState([]);

    const [partnerdetails, setPartnerdetails] = useState([]);
    const [entitydetails, setEntitydetails] = useState([]);

    // const [selectedCostCenter, setSelectedCostCenter] = useState([]);

    const [automaticRenewalValue, setAutomaticRenewal] = useState<any>();

    const [ent_name, setEnt_name] = useState('');
    const [ent_email, setEnt_email] = useState('');
    const [ent_phone, setEnt_phone] = useState('');
    const [ent_legal_person, setEnt_legal_person] = useState('');
    const [ent_person, setEnt_person] = useState([]);
    const [ent_selected_person, setEnt_selected_person] = useState();
    const [ent_iban, setEnt_IBAN] = useState('');
    const [ent_address, setEnt_Address] = useState('');
    const [ent_bank, setEnt_bank] = useState('');
    const [ent_role, setEnt_role] = useState('');
    const [ent_id, setEnt_id] = useState('');
    const [entitybankId, setEntitybankId] = useState('');
    const [entityaddressId, setEntityaddressId] = useState('');

    const [party_person, setParty_person] = useState<any>([]);
    const [party_name, setParty_name] = useState('');
    const [party_email, setParty_email] = useState('');
    const [party_phone, setParty_phone] = useState('');
    const [party_legal_person, setParty_legal_person] = useState('');
    const [party_iban, setParty_IBAN] = useState('');
    const [party_address, setParty_Address] = useState('');
    const [party_role, setParty_role] = useState('');
    const [party_bank, setParty_bank] = useState('');
    const [party_id, setParty_id] = useState('');
    const [partnerbankId, setPartnerbankId] = useState('');
    const [partneraddressId, setPartneraddressId] = useState('');

    const [Checked, setChecked] = useState();
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
                return dffDate1;
            case 'dffDate2':
                return dffDate2;

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




    const fetchContractDynamicInfo = async () => {
        await fetch(`http://localhost:3000/contracts/dynamicfields/${Id}`)
            .then(response => {
                return response.json()
            })
            .then(contractDynamicInfo => {
                if (contractDynamicInfo.length > 0) {
                    setdffInt1(contractDynamicInfo[0].dffInt1)
                    setdffInt2(contractDynamicInfo[0].dffInt2)
                    setdffInt3(contractDynamicInfo[0].dffInt3)
                    setdffInt4(contractDynamicInfo[0].dffInt4)

                    setdffString1(contractDynamicInfo[0].dffString1)
                    setdffString2(contractDynamicInfo[0].dffString2)
                    setdffString3(contractDynamicInfo[0].dffString3)
                    setdffString4(contractDynamicInfo[0].dffString4)

                    const formated_dffDate1 = new Date(contractDynamicInfo[0].dffDate1);
                    const formated_dffDate2 = new Date(contractDynamicInfo[0].dffDate2);

                    setdffDate1(formated_dffDate1)
                    setdffDate2(formated_dffDate2)
                }
            })
    }



    const fetchContractData = async () => {
        await fetch(`http://localhost:3000/contracts/details/${Id}`)
            .then(response => {
                return response.json()
            })
            .then(contractdetails => {
                setContractDetails(contractdetails)


                if (contractdetails.PartnerBank !== null && contractdetails.PartnerBank !== undefined) {
                    setPartnerbankId(contractdetails.PartnerBank.id)
                }

                if (contractdetails.PartnerAddress !== null && contractdetails.PartnerAddress !== undefined) {
                    setPartneraddressId(contractdetails.PartnerAddress.id)
                }


                const referenceDate = new Date('1970-01-02T02:00:00+02:00');

                setEntitybankId(contractdetails.EntityBank.id)
                setEntityaddressId(contractdetails.EntityAddress.id)

                const formated_start_date = new Date(contractdetails.start);
                const formated_end_date = new Date(contractdetails.end);
                const formated_completion_date = new Date(contractdetails.completion);
                const formated_sign_date = new Date(contractdetails.sign);

                setStartDate(formated_start_date)

                setEndDate(formated_end_date)

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
                    const response = await fetch(`http://localhost:3000/nomenclatures/persons/${contractdetails.entity.id}`).then(res => res.json().then(res => {
                        setEntityPersons(res);
                    })
                    )
                }
                fetchEntityPersons()

                const fetchEntityBanks = async () => {
                    const response = await fetch(`http://localhost:3000/nomenclatures/bank/${contractdetails.entity.id}`).then(res => res.json())
                    setEntityBanks(response);
                }
                fetchEntityBanks()
                const fetchEntityAddress = async () => {
                    const response = await fetch(`http://localhost:3000/nomenclatures/address/${contractdetails.entity.id}`).then(res => res.json())
                    setEntityAddress(response);
                }
                fetchEntityAddress()

                setEnt_id(contractdetails.EntityPerson.id)
                setEnt_name(contractdetails.EntityPerson.name)
                setEnt_email(contractdetails.EntityPerson.email)
                setEnt_phone(contractdetails.EntityPerson.phone)
                setEnt_legal_person(contractdetails.EntityPerson.legalrepresent)
                setEnt_role(contractdetails.EntityPerson.role)
                setEnt_IBAN(contractdetails.EntityBank.iban)
                setEnt_bank(contractdetails.EntityBank.bank)
                setEnt_Address(contractdetails.EntityAddress.id)

                const fetchPartnerPersons = async () => {
                    const response = await fetch(`http://localhost:3000/nomenclatures/persons/${contractdetails.partner.id}`).then(res => res.json().then(res => {
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
                    const response = await fetch(`http://localhost:3000/nomenclatures/bank/${contractdetails.partner.id}`).then(res => res.json())
                    setPartnerBanks(response);
                }
                fetchPartnerBanks()
                const fetchPartnerAddress = async () => {
                    const response = await fetch(`http://localhost:3000/nomenclatures/address/${contractdetails.partner.id}`).then(res => res.json())
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

    const fetchLocationData = () => {
        fetch("http://localhost:3000/nomenclatures/location")
            .then(response => {
                return response.json()
            })
            .then(location => {
                setLocations(location)
            })
    }

    const fetchTypeData = () => {
        fetch("http://localhost:3000/nomenclatures/contracttype")
            .then(response => {
                return response.json()
            })
            .then(type => {
                setContractType(type)
            })

    }

    const fetchStatusData = () => {
        fetch("http://localhost:3000/nomenclatures/contractstatus")
            .then(response => {
                return response.json()
            })
            .then(status => {
                setContractStatus(status)
            })

    }


    const fetchCategoriesData = () => {
        fetch("http://localhost:3000/contracts/category")
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
            })

    }

    const fetchEntity = () => {
        fetch("http://localhost:3000/nomenclatures/entity")
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)
            })
    }

    const fetchPartners = () => {
        fetch("http://localhost:3000/nomenclatures/partners")
            .then(response => {
                return response.json()
            })
            .then(partner => {
                setPartner(partner)
            })
    }


    const fetchCashFlow = () => {
        fetch("http://localhost:3000/contracts/cashflow")
            .then(response => {
                return response.json()
            })
            .then(cashflow => {
                setCashflow(cashflow)
            })
    }

    const fetchCostCenter = () => {
        fetch("http://localhost:3000/contracts/costcenter")
            .then(response => {
                return response.json()
            })
            .then(costcenter => {
                setCostCenter(costcenter)
            })
    }


    const fetchDepartmentsData = () => {
        fetch("http://localhost:3000/contracts/department")
            .then(response => {
                return response.json()
            })
            .then(departments => {
                setDepartments(departments)
            })
    }

    const fetchDynamicFields = () => {
        fetch("http://localhost:3000/nomenclatures/dynamicfield")
            .then(response => {
                return response.json()
            })
            .then(dynfields => {
                setDynamicFields(dynfields)
            })
    }


    useEffect(() => {
        fetchContractData(),
            fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData(),
            fetchDynamicFields(),
            fetchContractDynamicInfo(),
            fetchLocationData()

    }, [])

    const saveContract = async () => {
        let addedContract: Contract = {
            number: number,
            typeId: type.id,
            // partner: partner,
            statusId: status.id,
            start: (start ? addOneDay(start) : null),
            end: (end ? addOneDay(end) : null),
            sign: (sign ? addOneDay(sign) : null),
            completion: (completion ? addOneDay(completion) : null),
            remarks: remarks,
            categoryId: (selectedCategory ? selectedCategory.id : null),
            departmentId: (selectedDepartment ? selectedDepartment.id : null),
            cashflowId: (selectedCashflow ? selectedCashflow.id : null),
            locationId: (selectedLocation ? selectedLocation.id : null),
            costcenterId: (selectedCostCenter ? selectedCostCenter.id : null),
            automaticRenewal: automaticRenewalValue,
            // contract: selectedItem,
            partnersId: selectedPartner.id,
            entityId: selectedEntity.id,
            partnerpersonsId: party_id,
            entitypersonsId: ent_id,
            entityaddressId: entityaddressId,
            partneraddressId: partneraddressId,
            //entitybankId: ent_iban.id,
            // partnerbankId: party_iban.id,
            entitybankId: entitybankId,
            partnerbankId: partnerbankId,
            parentId: parseInt(Id)
        }
        let addDynamicInfo: DynamicInfo = {
            contractId: parseInt(Id),
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
            const response = await axios.post('http://localhost:3000/contracts',
                //addedContract
                toSend
            );

            setAddContractId(response.data.id)
            updateValue(response.data.id)


            router.push(`/uikit/editcontract/editcontract/addaddionals/add/ctr?Id=${Id}&addId=${response.data.id}`)

            console.log('Contract edited:', response.data);
        } catch (error) {
            console.error('Error edited contract:', error);
        }
    }

    return (
        <div className="grid">
            {contractDetails ?
                <div className="col-12">
                    <div className="p-fluid formgrid grid pt-2">
                        <Accordion className="field lg:col-12 xs:col-3 md:col-12" multiple
                            activeIndex={[0, 1]}>
                            <AccordionTab
                                header={
                                    <span className="flex align-items-center gap-2 w-full">
                                        Entitate:
                                        {selectedEntity.name}
                                    </span>
                                }>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="entity">Entitate</label>
                                                <Dropdown id="entity" value={selectedEntity}
                                                    filter
                                                    onChange={(e) => {
                                                        setSelectedEntity(e.value)

                                                    }}
                                                    options={entity}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="entity_person">Nume Responsabil</label>
                                                <Dropdown id="entity_person" value={getPersonJson(ent_person)}
                                                    filter
                                                    onChange={(e) => {
                                                        setEnt_id(e.target.value.id)
                                                        setEnt_name(e.target.value.name)
                                                        setEnt_person(e.target.value.name)
                                                        setEnt_email(e.target.value.email)
                                                        setEnt_phone(e.target.value.phone)
                                                        setEnt_legal_person(e.target.value.legalrepresent)
                                                        setEnt_role(e.target.value.role)
                                                    }
                                                    }
                                                    options={entityPersons}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_role">Rol</label>
                                                <InputText disabled id="ent_role" type="text" value={ent_role} />
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
                                                <Checkbox id="ent_legal_person" checked={ent_legal_person} onChange={e => setChecked(e.checked)}></Checkbox>
                                                <label htmlFor="ent_legal_person" className="ml-2">Reprezentant Legal</label>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_bank">Banca</label>
                                                <InputText disabled id="ent_bank" type="text" value={ent_bank} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_iban">IBAN</label>
                                                <Dropdown id="iban" filter value={getBankJson(ent_iban)}
                                                    onChange={(e) => {
                                                        setEnt_IBAN(e.target.value.iban)
                                                        setEnt_bank(e.target.value.bank)
                                                        setEntitybankId(e.target.value.id)
                                                    }}
                                                    options={entityBanks}
                                                    optionLabel="iban" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="ent_address">Adresa</label>
                                                <Dropdown id="ent_address" filter value={getAddressJson(ent_address)}
                                                    onChange={(e) => {
                                                        // console.log("adresa", e.target.value)
                                                        setEnt_Address(e.target.value.id)
                                                    }}
                                                    options={entityAddress}
                                                    optionLabel="completeAddress" placeholder="Select One"></Dropdown>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </AccordionTab>
                            <AccordionTab header={
                                <span className="flex align-items-center gap-2 w-full">
                                    Partener:
                                    {selectedPartner.name}
                                </span>
                            }>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">
                                            <div className="field col-12 md:col-3">
                                                <label htmlFor="partner">Partner</label>
                                                <Dropdown id="selectedPartner" value={selectedPartner} filter
                                                    onChange={(e) => {
                                                        setSelectedPartner(e.value.id)
                                                        // fetchPartnersDetailsData(e.value.id)
                                                    }}
                                                    options={partner}
                                                    optionLabel="name" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_name">Nume Responsabil</label>
                                                <Dropdown id="party_name" value={getPartnerPersonJson(party_name)} filter
                                                    onChange={(e) => {
                                                        setParty_id(e.target.value.id)
                                                        setParty_name(e.target.value)
                                                        setParty_email(e.target.value.email)
                                                        setParty_phone(e.target.value.phone)
                                                        setParty_legal_person(e.target.value.legalrepresent)
                                                        setParty_role(e.target.value.role)
                                                    }}
                                                    options={partnerPersons}
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
                                                <Checkbox id="party_legal_person" checked={party_legal_person}></Checkbox>
                                                <label htmlFor="party_legal_person" className="ml-2">Reprezentant Legal</label>

                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_bank">Banca</label>
                                                <InputText disabled id="party_bank" type="text" value={party_bank} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="party_iban">IBAN</label>
                                                <Dropdown id="party_iban" value={getPartnerBankJson(party_iban)} filter
                                                    onChange={(e) => {
                                                        setParty_IBAN(e.target.value.iban)
                                                        setParty_bank(e.target.value.bank)
                                                        setPartnerbankId(e.target.value.id)
                                                        //console.log(e.target.value)
                                                    }}
                                                    options={partnerBanks}
                                                    optionLabel="iban" placeholder="Select One"></Dropdown>
                                            </div>
                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="party_address">Adresa</label>
                                                <Dropdown id="party_address" value={getPartnerAddressJson(party_address)} filter
                                                    onChange={(e) => {
                                                        setParty_Address(e.target.value)
                                                    }}
                                                    options={partnerAddress}
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
                            <label htmlFor="state">Tip</label>
                            <Dropdown id="type" showClear filter value={type} onChange={(e) => setType(e.value)} options={contractType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Stare</label>
                            <Dropdown id="state" showClear filter value={status} onChange={(e) => setStatus(e.value)} options={contractStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="category">Categorie</label>
                            <Dropdown id="category" showClear filter value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categories} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="font-bold block mb-2">
                                Data Start
                            </label>
                            <Calendar id="start" value={start} onChange={(e) => {
                                setStartDate(e.value)
                            }

                            } showIcon dateFormat="dd/mm/yy" />
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
                            <Dropdown id="department" showClear filter value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.value)} options={departments} optionLabel="name" placeholder="Select One"></Dropdown>
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
                            <label htmlFor="cashflow">CashFlow</label>
                            <Dropdown id="cashflow" showClear filter value={selectedCashflow} onChange={(e) => setSelectedCashflow(e.value)} options={cashflows} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <div className="field-checkbox">
                                <Checkbox onChange={e => setAutomaticRenewal(e.checked)} checked={automaticRenewalValue}></Checkbox>
                                <label htmlFor="auto_renewal">Prelungire Automata</label>
                            </div>
                        </div>

                        {/* <div className="field col-12 md:col-12">
                                <label htmlFor="cashflow">Note</label>
                                <Editor value={remarks} onTextChange={(e) => setRemarks(e.htmlValue)}
                                    className='max-w-screen' style={{ height: '220px' }}
                                />
                            </div> */}
                        <div className="field col-12 md:col-12">
                            <label htmlFor="cashflow">Scurta descriere a contractului</label>
                            <InputTextarea className='max-w-screen' value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={5} cols={30} />
                        </div>
                    </div>
                    <Button label="Salveaza" onClick={saveContract} />
                </div>
                : null}
        </div>
    );
};
