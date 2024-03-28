'use client';

import { useRouter } from 'next/navigation';
import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import React, { useState, useEffect, useMemo, useContext } from 'react';
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
import Documents from './documents';
import { useSearchParams } from 'next/navigation'
import { useData } from './DataContext';
import { DataProvider } from './DataContext';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'


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




    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing } = useMyContext();


    const { userId, setUserId } = useMyContext();

    const { value, updateValue } = useData();
    const router = useRouter();
    const [contractStatus, setContractStatus] = useState([]);
    const [number, setNumber] = useState();
    const [type, setType] = useState();
    const [contractType, setContractType] = useState([]);
    const [start, setStartDate] = useState();
    const [end, setEndDate] = useState();
    const [sign, setSignDate] = useState();
    const [completion, setCompletionDate] = useState();
    const [remarks, setRemarks] = useState();
    const [status, setStatus] = useState();
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
    const [persons, setPersons] = useState([]);

    const [partnerdetails, setPartnerdetails] = useState([]);
    const [entitydetails, setEntitydetails] = useState([]);

    // const [selectedCostCenter, setSelectedCostCenter] = useState([]);

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
    // console.log("Id: ", Id)
    const [paramId, setParamId] = useState(0);
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
    const fetchPartnersDetailsData = (partnerId: number) => {
        fetch(`http://localhost:3000/nomenclatures/partnersdetails/${partnerId}`)
            .then(response => {
                return response.json()
            })
            .then(partnerdetails => {
                setPartnerdetails(partnerdetails[0])
            })
    }
    const fetchEntityDetailsData = (entityId: number) => {
        fetch(`http://localhost:3000/nomenclatures/entitydetails/${entityId}`)
            .then(response => {
                return response.json()
            })
            .then(entitydetails => {
                setEntitydetails(entitydetails[0])
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
        fetch("http://localhost:3000/contracts/cashflownom")
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
        fetchCategoriesData(),
            fetchDepartmentsData(),
            fetchItemsData(),
            fetchCostCenter(),
            fetchCashFlow(),
            fetchPartners(),
            fetchEntity(),
            fetchTypeData(),
            fetchStatusData(),
            fetchDynamicFields()
    }, [])

    const saveContract = async () => {
        // console.log(number, partner, start, end, completion, sign, type, remarks, status)

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
            entityaddressId: ent_address.id,
            partneraddressId: party_address?.id ?? null,
            entitybankId: ent_iban.id,
            partnerbankId: party_iban?.id ?? null,
            userId: userId,
            isPurchasing: isPurchasing
        }

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
            const response = await axios.post('http://localhost:3000/contracts',
                // addedContract
                toSend
            );

            setParamId(response.data.id)
            setContractId(response.data.id)
            updateValue(response.data.id)

            router.push(`/uikit/addcontract/ctr?Id=${response.data.id}`)


            console.log('Contract added:', response.data);
        } catch (error) {
            console.error('Error creating contract:', error);
        }

    }

    return (
        <div className="grid">
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
                        <label htmlFor="status">Stare</label>
                        <Dropdown id="status" filter showClear value={status} onChange={(e) => setStatus(e.value)} options={contractStatus} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                    <div className="field col-12 md:col-3">
                        <label htmlFor="category">Categorie</label>
                        <Dropdown id="category" filter showClear value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categories} optionLabel="name" placeholder="Select One"></Dropdown>
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
                        <label htmlFor="item">Obiect de contract</label>
                        <Dropdown id="item" filter showClear value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={item} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>

                    <div className="field col-12 md:col-3">
                        <label htmlFor="costcenter">Centru de cost&profit</label>
                        <Dropdown id="costcenter" showClear filter value={selectedCostCenter} onChange={(e) => setSelectedCostCenter(e.value)} options={costcenters} optionLabel="name" placeholder="Select One"></Dropdown>
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
