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

//adresa cumulata - tip adresa, adresa efectiva, togle button
//adresa campuri/ nume adresa/tip adresa/tara/judet/oras/strada/numar/status/implicita/cod postal/
//tip adresa(comerciala/corespondenta/sociala/facturare)

const PartnerAddress = ({ params }: any) => {
    const partnerid = params[0]
    const [visibleAddress, setVisibleAddress] = useState<any>('');

    const [addressName, setAddressName] = useState<any>('');
    const [selectedaddressType, setSelectedAddressType] = useState<any>('');
    const [Country, setCountry] = useState<any>('');
    const [County, setCounty] = useState<any>('');
    const [City, setCity] = useState<any>('');
    const [Street, setStreet] = useState<any>('');
    const [Number, setNumber] = useState<any>('');
    const [postalCode, setPostalCode] = useState<any>('');
    const [selectedStatus, setSelectedStatus] = useState<any>(true);
    const [selectedDefault, setSelectedDefault] = useState<any>(true);
    const [aggregate, setAggregate] = useState<any>(true);
    const [completeAddress, setCompleteAddress] = useState<any>(['Tara:, Judet:, Oras:, Strada:, Numar:, Cod Postal:']);
    const [receivedAddress, setReceivedAddress] = useState<any>([]);

    const AddressType: any = [
        { name: "Adresa Sociala" },
        { name: "Adresa Comerciala" },
        { name: "Adresa Facturare" },
        { name: "Adresa Corespondenta" },
    ];

    const fetchPartnerAddress = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/address/${partnerid}`).then(res => res.json())
        setReceivedAddress(response);
        console.log(response);
    }

    useEffect(() => {
        fetchPartnerAddress()
    }, [])

    console.log(completeAddress)
    const sendAddressData = async () => {

        interface Address {

            addressName: String,
            addressType: String,
            Country: String,
            County: String,
            City: String,
            Street: String,
            Number: String,
            postalCode: String,
            Status: String,
            Default: String,
            aggregate: String,
            completeAddress: String,
            partner: any
        }

        let addAddress: Address = {
            addressName: addressName,
            addressType: selectedaddressType.name,
            Country: Country,
            County: County,
            City: City,
            Street: Street,
            Number: Number,
            postalCode: postalCode,
            Status: String(selectedStatus),
            Default: String(selectedDefault),
            aggregate: String(aggregate),
            completeAddress: aggregate ? String(`Tara:${Country}, Judet:${County}, Oras:${City}, Strada:${Street}, Numar:${Number}, Cod Postal:${postalCode}`) : completeAddress,
            partner: {
                "connect":
                {
                    id: parseInt(partnerid)
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:3000/nomenclatures/address',
                addAddress
            );
            console.log('Adress added:', response.data);
        } catch (error) {
            console.error('Error creating address:', error);
        }
    }

    const statusTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" onChange={e => setSelectedDefault(e.checked)} checked={selectedDefault}></Checkbox>
            </div>
        );
    };

    const activeTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Checkbox id="default" onChange={e => setSelectedDefault(e.checked)} checked={selectedDefault}></Checkbox>
            </div>
        );
    };

    return (
        <div className="p-fluid formgrid grid pt-2">
            <div className="field col-12 md:col-1 pt-4">
                <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga" onClick={() => setVisibleAddress(true)} />
            </div>
            <div className="field col-12">
                <Dialog header="Adresa" visible={visibleAddress} style={{ width: '30vw' }} onHide={() => setVisibleAddress(false)}>
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
                                    <div>
                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="name">Nume Adresa</label>
                                            <InputText id="name" type="text" value={addressName} onChange={(e) => setAddressName(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="type">Tip Adresa</label>
                                            <Dropdown id="type"
                                                value={selectedaddressType}
                                                onChange={(e) => setSelectedAddressType(e.value)}
                                                options={AddressType}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>


                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="Country">Tara</label>
                                            <InputText id="Country" type="text" value={Country} onChange={(e) => setCountry(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="County">Judet</label>
                                            <InputText id="County" type="text" value={County} onChange={(e) => setCounty(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="County">Oras</label>
                                            <InputText id="County" type="text" value={City} onChange={(e) => setCity(e.target.value)} />
                                        </div>


                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="Street">Strada</label>
                                            <InputText id="Street" type="text" value={Street} onChange={(e) => setStreet(e.target.value)} />
                                        </div>


                                        <div className="field col-12 md:col-12">
                                            <label htmlFor="number">Numar</label>
                                            <InputText id="number" type="text" value={Number} onChange={(e) => setNumber(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
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
                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="name">Nume Adresa</label>
                                            <InputText id="name" type="text" value={addressName} onChange={(e) => setAddressName(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="type">Tip Adresa</label>
                                            <Dropdown id="type"
                                                value={selectedaddressType}
                                                onChange={(e) => setSelectedAddressType(e.value)}
                                                options={AddressType}
                                                optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="field col-12 md:col-12">
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
                                            <Button label="Salveaza" severity="success" onClick={sendAddressData} />
                                            <Button label="Stege" severity="danger" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <DataTable value={receivedAddress} selectionMode="single"
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                // selection={selectedAddress}
                // onSelectionChange={(e) => {
                //     setSelectedAddress(e.value)
                //     setVisibleAddress(true)
                // }}
                >
                    <Column field="addressName" header="Nume adresa"></Column>
                    <Column field="addressType" header="Tip Adresa"></Column>
                    <Column header="Status" style={{ width: '10vh' }} body={statusTemplate} />
                    <Column header="Default" style={{ width: '10vh' }} body={activeTemplate} />
                    <Column field="completeAddress" header="Adresa Completa"></Column>

                </DataTable>
            </div>
        </div>
    )
}

export default PartnerAddress;