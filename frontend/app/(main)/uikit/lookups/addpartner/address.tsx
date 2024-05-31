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
import countries from "../partnerdetails/[partnerdetails]/country.json";
import { Judete } from '../partnerdetails/[partnerdetails]/judete'

interface Address {
    id: Number,
    addressName: String,
    addressType: String,
    Country: String,
    County: String,
    City: String,
    Street: String,
    Number: String,
    postalCode: String,
    Status: Boolean,
    Default: Boolean,
    aggregate: Boolean,
    completeAddress: String
}

const PartnerAddress = ({ params, setAddressIndex, setAddressChild }: any) => {
    const partnerid = params[0]
    const [visibleAddress, setVisibleAddress] = useState<any>('');

    const [addressName, setAddressName] = useState<any>('');

    const [selectedaddressType, setSelectedAddressType] = useState<any>('');
    const [Country, setCountry] = useState<any>({ "code": "RO", "name": "Romania" });
    const [County, setCounty] = useState<any>('');
    const [City, setCity] = useState<any>([]);
    const [Street, setStreet] = useState<any>('');
    const [Number, setNumber] = useState<any>('');
    const [postalCode, setPostalCode] = useState<any>('');
    const [selectedStatus, setSelectedStatus] = useState<any>(true);
    const [selectedDefault, setSelectedDefault] = useState<any>(true);
    const [aggregate, setAggregate] = useState<any>(true);
    const [completeAddress, setCompleteAddress] = useState<any>(['Tara:, Judet:, Oras:, Strada:, Numar:, Cod Postal:']);
    const [receivedAddress, setReceivedAddress] = useState<any>([]);
    const [selectedAddress, setselectedAddress] = useState<any>([]);

    const [myAddressArray, setMyAddressArray] = useState<Address[]>([]);

    const judete = Judete;
    const [listajudete, setListajudete] = useState<any>(null);
    const [listaorase, setListaorase] = useState<any>(null);
    const getJudete = () => {
        const judeteAll: any = [];
        judete.map((localitate: { nume: any; }) => {
            judeteAll.push({ judet: `${localitate.nume}` })

        })
        setListajudete(judeteAll)

    }

    const filterbycounty = () => {

        type MyObject = {
            judet: string;
            localitate: string;
        };
        const myArray: MyObject[] = []

        judete.map((localitate: { localitati: string | any[]; nume: any; }) => {
            for (let i = 0; i < localitate.localitati.length; i++) {
                myArray.push({ judet: `${localitate.nume}`, localitate: `${localitate.localitati[i].nume}` })
            }
            // console.log(myArray)
        })

        if (County) {
            const filteredItems = myArray
                .filter(item => item.judet.includes(County.judet))
            setListaorase(filteredItems)
        }
    }


    useEffect(() => {
        getJudete(),
            filterbycounty()

    },
        [Country, County]
    )


    const AddressType: any = [
        { name: "Adresa Sociala" },
        { name: "Adresa Comerciala" },
        { name: "Adresa Facturare" },
        { name: "Adresa Corespondenta" },
    ];

    const addItemToArray = () => {

        const newAddress: Address = {
            id: myAddressArray.length + 1,
            addressName: addressName,
            addressType: ((selectedaddressType) ? selectedaddressType.name : undefined),
            Country: ((Country) ? Country.name : undefined),
            County: ((County) ? County.judet : undefined),
            City: ((City) ? City.localitate : undefined),
            Street: Street,
            Number: Number,
            postalCode: postalCode,
            Status: selectedStatus,
            Default: selectedDefault,
            aggregate: aggregate,
            completeAddress: aggregate ? String(
                `Tara:${((Country) ? Country.name : undefined)}, 
                Judet:${((County) ? County.judet : undefined)}, 
                Oras:${((City) ? City.localitate : undefined)}, 
                Strada:${Street}, Numar:${Number}, Cod Postal:${postalCode}`) : completeAddress
        };

        const newAddressToBeSent: any = {
            addressName: addressName,
            addressType: ((selectedaddressType) ? selectedaddressType.name : undefined),
            Country: ((Country) ? Country.name : undefined),
            County: ((County) ? County.judet : undefined),
            City: ((City) ? City.localitate : undefined),
            Street: Street,
            Number: Number,
            postalCode: postalCode,
            Status: selectedStatus,
            Default: selectedDefault,
            aggregate: aggregate,
            completeAddress: aggregate ? String(
                `Tara:${((Country) ? Country.name : undefined)}, 
                Judet:${((County) ? County.judet : undefined)}, 
                Oras:${((City) ? City.localitate : undefined)}, 
                Strada:${Street}, Numar:${Number}, Cod Postal:${postalCode}`) : completeAddress
        };


        // Update the state by spreading the existing array and adding the new item
        //add element
        if (!selectedAddress.id) {

            setMyAddressArray((prevArray) => [...prevArray, newAddress]);
            setAddressChild((prevArray) => [...prevArray, newAddressToBeSent]);
        }
        //edit element
        else {
            let addressindex: number = myAddressArray.findIndex(address => address.id === selectedAddress.id);
            // console.log("index de editat ", addressindex);
            myAddressArray[addressindex] = newAddress;
            myAddressArray[addressindex].id = selectedAddress.id;
        }
        setselectedAddress('')
        setAddressName('')
        setCountry('');
        setCounty('');
        setSelectedAddressType('');
        setCity('')
        setStreet('')
        setNumber('')
        setPostalCode('')
        setSelectedStatus(false)
        setSelectedDefault(false)
        setAggregate(true)
        setCompleteAddress('')

        setVisibleAddress(false)

    };

    // const sendAddressData = async () => {




    //     let addAddress: Address = {
    //         id: 0,
    //         addressName: addressName,
    //         addressType: selectedaddressType.name,
    //         Country: Country.name,
    //         County: County.judet,
    //         City: City.localitate,
    //         Street: Street,
    //         Number: Number,
    //         postalCode: postalCode,
    //         Status: selectedStatus,
    //         Default: selectedDefault,
    //         aggregate: aggregate,
    //         completeAddress: aggregate ? String(`Tara:${Country.name}, Judet:${County.judet}, Oras:${City.localitate}, Strada:${Street}, Numar:${Number}, Cod Postal:${postalCode}`) : completeAddress,
    //         partner: {
    //             "connect":
    //             {
    //                 id: parseInt(partnerid)
    //             }
    //         }
    //     }

    //     try {
    //         const response = await axios.post('http://localhost:3000/nomenclatures/address',
    //             addAddress
    //         );
    //         setAddressIndex((prevKey: number) => prevKey + 1),
    //             setVisibleAddress(false)
    //         console.log('Adress added:', response.data);
    //     } catch (error) {
    //         console.error('Error creating address:', error);
    //     }
    // }


    const getCountry = (countryToFind: string) => {
        return countries.find((obj: { name: string; }) => obj.name === countryToFind);
    };

    const getCounty = (countyToFind: string) => {
        return listajudete.find((obj: { judet: string; }) => obj.judet === countyToFind);
    };

    const getAddressType = (AddressTypeToFind: string) => {
        return AddressType.find((obj: { name: string; }) => obj.name === AddressTypeToFind);
    };

    const deleteAddress = async () => {

        console.log("idul este: ", selectedAddress.id)

        let addressindex: number = myAddressArray.findIndex(address => address.id === selectedAddress.id);


        if (addressindex !== -1) {
            console.log(`Address with id ${selectedAddress.id} found at index ${addressindex}`);
            myAddressArray.splice(addressindex, 1);
            // myAddressArray.filter((element) => element.id !== selectedAddress.id);

        } else {
            console.log(`Address with id ${selectedAddress.id} not found in the array`);
        }



    }
    // try {
    //     const response = await axios.delete(`http://localhost:3000/nomenclatures/address/${selectedAddress.id}`,
    //     );
    //     setAddressIndex((prevKey: number) => prevKey + 1),
    //         setVisibleAddress(false)
    // } catch (error) {
    //     console.error('Error deleting address:', error);
    // }




    const statusTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="status" checked={rowData.Status}></Checkbox>
            </div>
        );
    };

    const implicitTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" checked={rowData.Default}></Checkbox>
            </div>
        );
    };

    const selectedCountryTemplate = (option: any, props: any) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <div className="p-fluid formgrid grid pt-2">
            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga" onClick={() => setVisibleAddress(true)} />
            </div>
            <div className="field col-12">
                <Dialog header="Adresa" visible={visibleAddress} style={{ width: '60vw' }} onHide={() => setVisibleAddress(false)}>
                    <div className="card">
                        <div className="p-fluid formgrid grid pt-2">
                            <div className="field col-12 md:col-12 pt-4">
                                <div className="field-checkbox col-12  md:col-12">
                                    <InputSwitch
                                        checked={aggregate}
                                        onChange={(e) => setAggregate(e.value ?? false)}
                                    />
                                    <label htmlFor="name">Adresa Complexa{aggregate}</label>
                                </div>
                                {aggregate ?
                                    <div className="grid">
                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="name">Nume Adresa</label>
                                            <InputText id="name" type="text" value={addressName} onChange={(e) => setAddressName(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="type">Tip Adresa</label>
                                            <Dropdown id="type"
                                                showClear
                                                value={selectedaddressType}
                                                onChange={(e) => setSelectedAddressType(e.value)}
                                                options={AddressType}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>


                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="Country">Tara</label>
                                            <Dropdown value={Country} showClear onChange={(e) => setCountry(e.value)} options={countries} optionLabel="name" placeholder="Select One"
                                                filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate}
                                            />
                                        </div>

                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="Country">Judet</label>
                                            <Dropdown
                                                showClear
                                                value={County}
                                                onChange={(e: any) => {
                                                    setCounty(e.value)

                                                }}
                                                options={listajudete}
                                                optionLabel="judet"
                                                editable
                                                filter
                                                placeholder="Select a County"

                                            />
                                        </div>


                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="County">Oras</label>
                                            <Dropdown
                                                showClear
                                                value={City}
                                                onChange={(e: any) => {
                                                    setCity(e.value)

                                                }}
                                                options={listaorase}
                                                optionLabel="localitate"
                                                editable
                                                filter
                                                // disabled={County}
                                                placeholder="Select a City"
                                            />
                                        </div>


                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="Street">Strada</label>
                                            <InputText id="Street" type="text" value={Street} onChange={(e) => setStreet(e.target.value)} />
                                        </div>


                                        <div className="field col-12 md:col-8">
                                            <label htmlFor="number">Alte Detalii(Numar/Bloc/Scara/Apartament/Etaj)</label>
                                            <InputText id="number" type="text" value={Number} onChange={(e) => setNumber(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-4">
                                            <label htmlFor="postalCode">Cod Postal</label>
                                            <InputText id="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <Checkbox id="status" onChange={e => setSelectedStatus(e.checked)} checked={selectedStatus}></Checkbox>
                                            <label htmlFor="status" className="ml-2">Adresa Activa</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <Checkbox id="default" onChange={e => setSelectedDefault(e.checked)} checked={selectedDefault}></Checkbox>
                                            <label htmlFor="default" className="ml-2">Adresa Implicita</label>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="name">Nume Adresa</label>
                                            <InputText id="name" type="text" value={addressName} onChange={(e) => setAddressName(e.target.value)} />
                                        </div>



                                        <div className="field col-12  md:col-3">
                                            <label htmlFor="type">Tip Adresa</label>
                                            <Dropdown id="type"
                                                showClear
                                                value={selectedaddressType}
                                                onChange={(e) => setSelectedAddressType(e.value)}
                                                options={AddressType}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>


                                        <div className="field col-12 md:col-6">
                                            <label htmlFor="completeAddress">Adresa</label>
                                            <InputTextarea
                                                placeholder="Adresa"
                                                rows={5}
                                                cols={30}
                                                value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)}
                                            />
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <Checkbox id="status" onChange={e => setSelectedStatus(e.checked)} checked={selectedStatus}></Checkbox>
                                            <label htmlFor="status" className="ml-2">Adresa Activa</label>
                                        </div>

                                        <div className="field-checkbox col-12 md:col-12">
                                            <Checkbox id="default" onChange={e => setSelectedDefault(e.checked)} checked={selectedDefault}></Checkbox>
                                            <label htmlFor="default" className="ml-2">Adresa Implicita</label>
                                        </div>
                                    </div>

                                }

                                <div className='p-3 field col-2 md:col-2'>
                                    <div className='grid'>
                                        <div className='flex flex-wrap justify-content-left gap-3'>
                                            <Button label="Salveaza" severity="success" onClick={addItemToArray} />
                                            <Button label="Sterge" severity="danger" onClick={deleteAddress} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                {myAddressArray.length > 0 ?
                    <DataTable value={myAddressArray} selectionMode="single"
                        // paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                        selection={selectedAddress} onSelectionChange={(e) => {

                            setselectedAddress(e.value)
                            setAddressName(e.value.addressName)
                            setCountry(getCountry(e.value.Country));
                            setCounty(getCounty(e.value.County));
                            setSelectedAddressType(getAddressType(e.value.addressType));
                            setCity(e.value.City)
                            setStreet(e.value.Street)
                            setNumber(e.value.Number)
                            setPostalCode(e.value.postalCode)
                            setSelectedStatus(e.value.Status)
                            setSelectedDefault(e.value.Default)
                            setAggregate(e.value.aggregate)
                            setVisibleAddress(true)
                            setCompleteAddress(e.value.completeAddress)
                        }}>
                        {/* <div className="hidden"> */}
                        <Column field="id" header="Cod"></Column>
                        {/* </div> */}

                        <Column field="addressName" header="Nume"></Column>
                        <Column field="addressType" header="Tip"></Column>
                        <Column field="completeAddress" header="Adresa Completa"></Column>
                        <Column header="Activa" style={{ width: '10vh' }} body={statusTemplate} />
                        <Column header="Implicita" style={{ width: '10vh' }} body={implicitTemplate} />

                    </DataTable>
                    : null}
            </div>
        </div>
    )
}

export default PartnerAddress;