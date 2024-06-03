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
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import PartnerAddress from './address'
import PartnerBank from './bank'
import Person from './person'
import { MyContext } from '../../../../../../layout/context/myUserContext';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';

const queryClient = new QueryClient();

const Partner = () => {

    // console.log("id ruta : ", params)
    const pathname = usePathname()
    const partnerid = useSearchParams().get("partnerid")


    const toast = useRef<undefined | null | any>(null);

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
    const [bankIndex, setBankIndex] = useState<number>(0);
    const [isVatPayer, setIsVatPayer] = useState(false);
    const [visibleLogo, setVisibleLogo] = useState(false);
    const [currentLogo, setCurrentLogo] = useState('');

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();


    const [persons, setPersons] = useState('');

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

    const getType = (status: string) => {
        return Type.find((obj) => obj.name === status);
    };


    const fetchPartnerDetails = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/partners/${partnerid}`).then(res => res.json().then(res => {
            setName(res.name);
            setFiscalCode(res.fiscal_code);
            setCommercialReg(res.commercial_reg);
            setStatusType(getstatusType(res.state));
            setType(getType(res.type));
            setEmail(res.email);
            setRemarks(res.remarks);
            setIsVatPayer(res.isVatPayer);
            setCurrentLogo(res.picture);
        })
        )
    }

    const deletePartner = async () => {

        try {
            const response = await axios.delete(`${Backend_BASE_URL}/nomenclatures/partners/${partnerid}`,
            );
            console.log(response);
        } catch (error) {
            console.error('Error deleting partner:', error);
        }


    }

    useEffect(() => {
        fetchPartnerDetails()
    }, [])

    interface Partner {
        name: string,
        fiscal_code?: string,
        commercial_reg?: string,
        state: string,
        type: string,
        email?: string,
        remarks?: string
    }

    const sendPartnerData = async () => {
        let addPartner: Partner = {
            name: name,
            fiscal_code: fiscal_code,
            commercial_reg: commercial_reg,
            state: selectedStatusType.name,
            type: selectedType.name,
            email: email,
            remarks: remarks
        }

        try {

            const response = await axios.patch(`${Backend_BASE_URL}/nomenclatures/partners/${partnerid}`,
                addPartner
            );
            console.log('Partner edited:', response.data);
            showSuccess('Partener editat cu succes!');
        } catch (error) {
            console.error('Error edited partner:', error);
        }
    }

    const [API_KEY_Ac, setAPI_KEY] = useState('');

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


    const [picturefiles, setPicturefiles] = useState<any>();
    var formdata = new FormData();

    const onUpload = ({ files }: any) => {
        console.log(files)
        setPicturefiles(files);
    }


    const addLogo = () => {

        var formdata = new FormData();

        formdata.append('logo', picturefiles?.length > 0 ? picturefiles[0] : "default.jpeg");
        formdata.append('picture', "");

        var requestOptions: any = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(`${Backend_BASE_URL}/nomenclatures/partnerlogo/${partnerid}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                setVisibleLogo(false)
            }
            )
            .catch(error => {
                console.log('error', error)
            });


    }

    const deleteLogo = () => {

        var requestOptions: any = {
            method: 'DELETE',
            body: '',
            redirect: 'follow'
        };

        fetch(`${Backend_BASE_URL}/nomenclatures/partnerlogo/${partnerid}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                setCurrentLogo('')
                setVisibleLogo(false)

            }
            )
            .catch(error => {
                console.log('error', error)
            });

    }

    useEffect(() => {

    }, [currentLogo])


    return (
        <div className="grid">
            <Toast ref={toast} />

            <div className="col-12">
                <div className="card">
                    <div>Date Generale</div>
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
                            <InputTextarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} cols={30} />
                        </div>


                        <div className="field-checkbox col-12 md:col-1">
                            <Checkbox id="legalrepresent" onChange={e => setIsVatPayer(e.checked)}
                                checked={isVatPayer}
                            ></Checkbox>
                            <label htmlFor="legalrepresent" className="ml-2">Platitor de TVA</label>
                        </div>
                        <Divider />

                        <div className="field-checkbox col-12 md:col-2">

                            <Button label="Preluare Date(API - CodFiscal)" onClick={getCompanyData} />
                        </div>

                        <Divider />


                        <div className="col-12 md:col-2">
                            <Button label="Logo" onClick={() => setVisibleLogo(true)} />
                        </div>

                        <div className="field-checkbox col-12 md:col-1"></div>
                        <div className="col-12 md:col-3">
                            {currentLogo ?

                                <div className="card flex justify-content-center">
                                    <Image src={`${Backend_BASE_URL}/nomenclatures/download/${currentLogo}`} alt="Image" width="250" preview />
                                </div>
                                : null}
                        </div>

                    </div>
                </div>

                <Dialog header="Logo Companie" visible={visibleLogo} style={{ width: '40vw' }} onHide={
                    () => {
                        setVisibleLogo(false)
                    }}>
                    <div className='card'>
                        <div className="grid flex justify-content-center flex-wrap">
                            <div>
                                {currentLogo ?
                                    <span>
                                        <Avatar image={`${Backend_BASE_URL}/nomenclatures/download/${currentLogo}`}
                                            size="xlarge" style={{ width: '40vh', height: '16vh' }} />
                                    </span>
                                    : null}

                            </div>

                            <div className="col-12">
                                <div className="p-fluid formgrid grid pt-2">
                                    <div className="field col-12  md:col-12">

                                        <FileUpload
                                            accept="image/*"
                                            multiple
                                            mode="basic"
                                            maxFileSize={100000000}
                                            customUpload={true}
                                            //uploadHandler={setPicturefiles(files)}
                                            uploadHandler={onUpload}
                                            auto
                                            chooseLabel="Logo"
                                        />
                                    </div>
                                    {/* : null} */}

                                </div>

                                <div className='pt-4'>
                                    <div className='grid'>
                                        <div className='col-3 '>
                                            <Button label="Salveaza" severity="success" onClick={addLogo} />
                                        </div>

                                        <div className='col-3 '>
                                            <Button label="Sterge" severity="danger" onClick={deleteLogo} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <div className="card">
                    Date Financiare
                    <Divider />
                    <PartnerBank
                        params={partnerid}
                        key={bankIndex}
                        setBankIndex={setBankIndex}
                    />
                </div>

                <div className="card">
                    Persoane
                    <Person
                        params={partnerid}
                        key={personIndex}
                        setPersonIndex={setPersonIndex}

                    />
                </div>
                <div className="card">
                    Adrese
                    <PartnerAddress
                        params={partnerid}
                        key={addressIndex}
                        setAddressIndex={setAddressIndex}
                    />
                </div>

                <div className='card'>
                    <div className='flex flex-wrap justify-content-left gap-3'>
                        <Button label="Salveaza" severity="success" onClick={sendPartnerData} />
                        <Button label="Sterge" severity="danger" onClick={deletePartner} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Partner;
