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
            fetchWFStatusData()
    }, [])


    useEffect(() => {

    }, [])

    const showMessage = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail });
    };


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <Toast ref={toast} position="top-right" />

                    Facturi Furnizori
                </div>
            </div>
        </div>
    );
};
