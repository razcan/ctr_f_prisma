"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import {
    QueryClient,
} from '@tanstack/react-query'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext"
// import PartnerAddress from '../partnerdetails/[partnerdetails]/address'
import PartnerAddress from './address'
import PartnerBank from './bank'
import Person from './person'
import { MyContext } from '../../../../../layout/context/myUserContext'
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
// import a from '../../../../../public/layout/images'

const queryClient = new QueryClient();

const Partner = () => {

    const partnerid = 0;

    const [name, setName] = useState<any>('');
    const [fiscal_code, setFiscalCode] = useState<any>('');
    const [email, setEmail] = useState<any>('');
    const [commercial_reg, setCommercialReg] = useState('');
    const [remarks, setRemarks] = useState<any>('');
    const [selectedStatusType, setStatusType] = useState<any>([]);
    const [selectedType, setType] = useState<any>('');
    const [selectedPerson, setSelectedPerson] = useState<any>([]);
    const [visiblePerson, setVisiblePerson] = useState<any>('');
    const [personIndex, setPersonIndex] = useState<number>(0);
    const [addressIndex, setAddressIndex] = useState<number>(0);
    const [addressChild, setAddressChild] = useState([]);
    const [personChild, setPersonChild] = useState([]);
    const [bankChild, setBankChild] = useState([]);
    const [bankIndex, setBankIndex] = useState<number>(0);
    const [dbPartnerId, setdbPartnerId] = useState<number>(-1);
    const [isVatPayer, setIsVatPayer] = useState(false);
    const [partnersBanksExtraRatesChild, setPartnersBanksExtraRatesChild] = useState([]);
    const [paymentTerm, setPaymentTerm] = useState(10);
    const [picturefiles, setPicturefiles] = useState<any>();

    const [API_KEY_Ac, setAPI_KEY] = useState('');

    const toast = useRef<undefined | null | any>(null);

    useEffect(() => {

        const API_KEY = process.env.NEXT_PUBLIC_API_KEY

        setAPI_KEY(API_KEY)

    }, [])


    const url: string = `https://api.openapi.ro/api/companies/${fiscal_code}`;

    const headers = {
        'x-api-key': API_KEY_Ac
    };


    // Create the Axios request configuration
    const config: AxiosRequestConfig = {
        headers: headers
    };

    // Function to make the GET request
    const getCompanyData = async () => {

        if (fiscal_code !== null && fiscal_code !== 'undefined' && fiscal_code.length > 1) {
            try {
                const response: AxiosResponse = await axios.get(url, config);
                console.log('Status:', response.status);
                console.log('Response:', response.data);

                setName(response.data.denumire);
                setCommercialReg(response.data.numar_reg_com);
                setRemarks(response.data.adresa)
                if (response.data.radiata == false) {
                    setStatusType({ name: "Activ", code: "01" })
                }

                if (response.data.tva !== null || response.data.tva !== 'undifined') {
                    setIsVatPayer(true)
                }

                // setType({ name: "Furnizor", code: "02" });


            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log('Status:', error.response.status);
                        console.log('Response:', error.response.data);
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log('Error Request:', error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error Message:', error.message);
                    }
                } else {
                    console.log('Unexpected Error:', error);
                }
            }
        }

    };



    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();


    interface DropdownItem {
        name: string;
        code: string;
    }

    const statusType: DropdownItem[] = [
        { name: "Activ", code: "01" },
        { name: "Inactiv", code: "02" }
    ];

    const getstatusType = (status: string) => {
        return statusType.find((obj) => obj.name === status);
    };


    const Type: DropdownItem[] = [
        { name: "Client", code: "01" },
        { name: "Furnizor", code: "02" },
        { name: "Entitate", code: "03" }
    ];


    interface Partner {
        name: string,
        fiscal_code?: string,
        commercial_reg?: string,
        state: string,
        type: string,
        email?: string,
        remarks?: string,
        paymentTerm: number,
        picture: string,
        Persons?: any,
        Address?: any,
        Banks?: any,
        PartnerBanksExtraRates?: any,
        isVatPayer?: any
    }

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



    const sendPartnerData = async () => {

        let addPartner: Partner = {
            name: name,
            fiscal_code: fiscal_code,
            commercial_reg: commercial_reg,
            state: selectedStatusType.name,
            type: selectedType.name,
            email: email,
            remarks: remarks,
            paymentTerm: parseInt(paymentTerm),
            picture: "",
            Persons: {
                "createMany":
                {
                    data: personChild
                }
            },
            Address: {
                "createMany":
                {
                    data: addressChild
                }
            },
            Banks: {
                "createMany":
                {
                    data: bankChild
                }
            },
            PartnerBanksExtraRates: {
                "createMany":
                {
                    data: partnersBanksExtraRatesChild
                }
            },
            isVatPayer: isVatPayer
        }

        console.log(addPartner, "addPartner", formdata, "formdata")

        try {
            if (dbPartnerId === -1) {
                const response = await axios.post(`${Backend_BASE_URL}/nomenclatures/partners`,
                    addPartner
                );
                setdbPartnerId(response.data.id)
                // console.log('Partner added:', response.data);
                showSuccess(`Partener adaugat cu succes!`)
            }
            else {
                const response = await axios.patch(`${Backend_BASE_URL}/nomenclatures/partners/${dbPartnerId}`,
                    addPartner
                );
                showSuccess(`Partener editat cu succes!`)
                console.log('Partner edited:', response.data);
            }

        } catch (error) {
            showError('Eroare adaugare partener')
            console.error('Error creating partner:', error);
        }
    }


    useEffect(() => {
        // console.log(addressIndex)
    }, [addressIndex])

    useEffect(() => {
        // console.log("addressChild", addressChild)
    }, [addressChild])

    useEffect(() => {
    }, [paymentTerm])


    useEffect(() => {
        // console.log(partnersBanksExtraRatesChild, "partnersBanksExtraRatesChild")
    }, [partnersBanksExtraRatesChild])



    const onUpload = ({ files }: any) => {
        // console.log(files)
        setPicturefiles(files);
    }



    return (

        <div className="grid">
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <div>Adaugare Partener</div>
                    <div className="p-fluid formgrid grid pt-2">
                        <div className="field col-12  md:col-3">
                            <label htmlFor="name">Nume</label>
                            <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="fiscal_code">Cod Fiscal</label>
                            <InputText id="fiscal_code" type="text" value={fiscal_code} onChange={(e) => setFiscalCode(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="commercial_reg">Nr. Reg. Comertului</label>
                            <InputText id="commercial_reg" type="text" value={commercial_reg} onChange={(e) => setCommercialReg(e.target.value)} />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">Status</label>
                            <Dropdown id="state"
                                showClear
                                value={selectedStatusType}
                                onChange={(e) => setStatusType(e.value)}
                                options={statusType}
                                optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="type">Tip</label>
                            <Dropdown id="type"
                                showClear
                                value={selectedType}
                                onChange={(e) => setType(e.value)} options={Type} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>

                        <div className="field col-12  md:col-3">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="field col-12  md:col-6">
                            <label htmlFor="remarks">Adresa Sociala</label>
                            <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={1} cols={30} />
                        </div>




                        <div className="field-checkbox col-12 md:col-1">
                            <Checkbox id="legalrepresent" onChange={e => setIsVatPayer(e.checked)}
                                checked={isVatPayer}
                            // checked={person_legalrepresent === "false" ? false : true}
                            ></Checkbox>
                            <label htmlFor="legalrepresent" className="ml-2">Platitor de TVA</label>
                        </div>




                        <div className="field-checkbox col-12 md:col-2">

                            <Button label="Preluare Date" onClick={getCompanyData} />
                        </div>



                    </div>
                </div>
                <div className="card">
                    Date Financiare
                    <Divider />
                    <PartnerBank
                        params={partnerid}
                        key={bankIndex}
                        setBankIndex={setBankIndex}
                        setBankChild={setBankChild}
                        setPartnersBanksExtraRatesChild={setPartnersBanksExtraRatesChild}
                        setPaymentTerm={setPaymentTerm}
                    />
                </div>
                <div className="card">
                    Persoane
                    <Person
                        params={partnerid}
                        key={personIndex}
                        setPersonIndex={setPersonIndex}
                        setPersonChild={setPersonChild}
                    />
                </div>
                <div className="card">
                    Adrese
                    <PartnerAddress
                        params={partnerid}
                        key={addressIndex}
                        setAddressIndex={setAddressIndex}
                        setAddressChild={setAddressChild}
                        setPartnersBanksExtraRatesChild={setPartnersBanksExtraRatesChild}
                    />
                </div>

                <div className='card'>
                    <div className='flex flex-wrap justify-content-left gap-3'>
                        <Button label="Salveaza" severity="success" onClick={sendPartnerData} />
                        {/* <Button label="Sterge" severity="danger" onClick={deletePartner} /> */}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Partner;

