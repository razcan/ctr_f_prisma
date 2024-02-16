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
import { ProgressSpinner } from 'primereact/progressspinner';
import PartnerBank from '../../lookups/partnerdetails/[partnerdetails]/bank';

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
    itemId?: number,
    costcenterId?: number,
    automaticRenewal: boolean,
    partnersId: number,
    entityId: number,
    partnerpersonsId: number,
    entitypersonsId: number,
    entityaddressId: number,
    partneraddressId: number,
    entitybankId: number,
    partnerbankId: number
}

export default function EditContract() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");
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

    const [item, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

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


    const fetchContractData = async () => {
        await fetch(`http://localhost:3000/contracts/details/${Id}`)
            .then(response => {
                return response.json()
            })
            .then(contractdetails => {
                setContractDetails(contractdetails)

                console.log(contractdetails)

                if (contractdetails.PartnerBank !== null && contractdetails.PartnerBank !== undefined) {
                    setPartnerbankId(contractdetails.PartnerBank.id)
                }

                if (contractdetails.PartnerAddress !== null && contractdetails.PartnerAddress !== undefined) {
                    setPartneraddressId(contractdetails.PartnerAddress.id)
                }



                setEntitybankId(contractdetails.EntityBank.id)
                setEntityaddressId(contractdetails.EntityAddress.id)

                const formated_start_date = new Date(contractdetails.start);
                const formated_end_date = new Date(contractdetails.end);
                const formated_completion_date = new Date(contractdetails.completion);
                const formated_sign_date = new Date(contractdetails.sign);

                setStartDate(formated_start_date)
                setEndDate(formated_end_date)
                setSignDate(formated_sign_date)
                setCompletionDate(formated_completion_date)
                setNumber(contractdetails.number)
                setAutomaticRenewal(contractdetails.automaticRenewal)

                setType(contractdetails.type)
                setStatus(contractdetails.status)
                setSelectedCategory(contractdetails.Category)
                setSelectedDepartment(contractdetails.departament)
                setSelectedItem(contractdetails.item)
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


    const fetchItemsData = () => {
        fetch("http://localhost:3000/contracts/item")
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItems(item)
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


    useEffect(() => {
        fetchContractData(),
            fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchItemsData(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData()

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
            categoryId: selectedCategory.id,
            departmentId: selectedDepartment.id,
            cashflowId: selectedCashflow.id,
            itemId: selectedItem.id,
            costcenterId: selectedCostCenter.id,
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
            partnerbankId: partnerbankId
        }
        // console.log(addedContract);

        try {
            const response = await axios.patch(`http://localhost:3000/contracts/${Id}`,
                addedContract
            );

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
                                                <Checkbox id="default" checked={ent_legal_person} onChange={e => setChecked(e.checked)}></Checkbox>
                                                <label htmlFor="default" className="ml-2">Reprezentant Legal</label>
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_legal_person">Banca</label>
                                                <InputText disabled id="ent_legal_person" type="text" value={ent_bank} />
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
                                                <label htmlFor="number">Adresa</label>
                                                <Dropdown id="address" filter value={getAddressJson(ent_address)}
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
                                                <Dropdown id="partner" value={selectedPartner} filter
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
                                                <Checkbox id="default" checked={party_legal_person}></Checkbox>
                                                <label htmlFor="default" className="ml-2">Reprezentant Legal</label>

                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_legal_person">Banca</label>
                                                <InputText disabled id="ent_legal_person" type="text" value={party_bank} />
                                            </div>
                                            <div className="field col-12  md:col-3">
                                                <label htmlFor="ent_iban">IBAN</label>
                                                <Dropdown id="ent_iban" value={getPartnerBankJson(party_iban)} filter
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
                                                <label htmlFor="address">Adresa</label>
                                                <Dropdown id="address" value={getPartnerAddressJson(party_address)} filter
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
                        </Accordion>
                        <div className="field col-12  md:col-3">
                            <label htmlFor="number">Numar</label>
                            <InputText id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Tip</label>
                            <Dropdown id="type" filter value={type} onChange={(e) => setType(e.value)} options={contractType} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Stare</label>
                            <Dropdown id="state" filter value={status} onChange={(e) => setStatus(e.value)} options={contractStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="category">Categorie</label>
                            <Dropdown id="category" filter value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categories} optionLabel="name" placeholder="Select One"></Dropdown>
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
                            <Dropdown id="department" filter value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.value)} options={departments} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="item">Obiect de contract</label>
                            <Dropdown id="item" filter value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="costcenter">Centru de cost&profit</label>
                            <Dropdown id="costcenter" filter value={selectedCostCenter} onChange={(e) => setSelectedCostCenter(e.value)} options={costcenters} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cashflow">CashFlow</label>
                            <Dropdown id="cashflow" filter value={selectedCashflow} onChange={(e) => setSelectedCashflow(e.value)} options={cashflows} optionLabel="name" placeholder="Select One"></Dropdown>
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
