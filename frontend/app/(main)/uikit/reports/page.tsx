"use client"

import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from 'primereact/button';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';



const queryClient = new QueryClient();

const Report = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <div className="grid">
                <div className="col-12">
                    <div className="card">

                        <Contracts />
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
};

function Contracts() {



    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing } = useMyContext();


    const [selectedContract, setselectedContract] = useState(null);
    const [data, setData] = useState([]);
    const [metaKey, setMetaKey] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');




    // const formatDate = (dateString: Date) => {
    //     // Implement your date formatting logic here
    //     const date = new Date(dateString);
    //     const options = { year: 'numeric', month: 'short', day: 'numeric' };
    //     return date.toLocaleDateString('ro-Ro', options);
    // };



    // const fetchContracts = async () => {

    //     const session = sessionStorage.getItem('token');
    //     const jwtToken = JSON.parse(session);

    //     if (jwtToken && jwtToken.access_token) {
    //         const jwtTokenf = jwtToken.access_token;

    //         const roles = jwtToken.roles;
    //         const entity = jwtToken.entity;
    //         const config: AxiosRequestConfig = {
    //             method: 'get',
    //             url: `${Backend_BASE_URL}/contracts/false`,
    //             headers: {
    //                 'user-role': `${roles}`,
    //                 'entity': `${entity}`,
    //                 'Authorization': `Bearer ${jwtTokenf}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         };
    //         axios(config)
    //             .then(function (response) {
    //                 // setAll_users(response.data);
    //                 setData(response.data);
    //             })
    //             .catch(function (error) {
    //                 // if (response.status === 401) {
    //                 // }
    //                 setData([]);
    //                 router.push('http://localhost:5500/auth/login')

    //                 console.log(error);
    //             });
    //     }
    // }


    useEffect(() => {

    }, [])


    const router = useRouter()

    //raport 1 contract general - filtre(informatii generale -acte aditionale ) - export excel 
    //raport 2 informatii financiare - filtre(date financiare - ) - export excel 


    return (
        <MyProvider>
            <div className="grid p-fluid input-demo">

                <div className="col-12">
                    <div className="card">
                        <h5>Filtre Raport</h5>
                        <div className="grid p-fluid">

                            <div className="grid formgrid">
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                                <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                    <InputText
                                        type="text"
                                        placeholder="Default"
                                    ></InputText>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>


                <div className="col-12 md:col-12">
                    <div className="card">



                    </div>

                </div>




            </div>
        </MyProvider>
    );
}

export default Report;
