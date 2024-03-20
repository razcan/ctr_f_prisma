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


interface Car {
    make: string;
    model: string;
    price: number;
}

const queryClient = new QueryClient();



function Report() {

    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [makeFilter, setMakeFilter] = useState<string>('');
    const [modelFilter, setModelFilter] = useState<string>('');
    const [priceFilter, setPriceFilter] = useState<number[]>([0, 100000]);



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
        // Fetch data from API (mocked data for demonstration)
        const fetchData = async () => {
            // Simulate API call
            const data: Car[] = [
                { make: 'Toyota', model: 'Corolla', price: 15000 },
                { make: 'Honda', model: 'Civic', price: 18000 },
                { make: 'Ford', model: 'Mustang', price: 35000 },
                { make: 'Tesla', model: 'Model 3', price: 45000 },
                // More cars...
            ];
            setCars(data);
            setFilteredCars(data); // Initialize filtered cars with all cars
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters whenever filter values change
        const filtered = cars.filter(car =>
            car.make.toLowerCase().includes(makeFilter.toLowerCase()) &&
            car.model.toLowerCase().includes(modelFilter.toLowerCase()) &&
            car.price >= priceFilter[0] && car.price <= priceFilter[1]
        );
        setFilteredCars(filtered);
    }, [cars, makeFilter, modelFilter, priceFilter]);


    //raport 1 contract general - filtre(informatii generale -acte aditionale ) - export excel 
    //raport 2 informatii financiare - filtre(date financiare - ) - export excel 


    return (
        <MyProvider>
            <div className="grid p-fluid input-demo">

                <div className="col-12">
                    <div className="card">
                        <h5>Filtre Raport</h5>
                        <div className="grid p-fluid">
                            <div>
                                <h1>Car Report</h1>
                                <div>
                                    <label>Make:</label>
                                    <input type="text" value={makeFilter} onChange={e => setMakeFilter(e.target.value)} />
                                </div>
                                <div>
                                    <label>Model:</label>
                                    <input type="text" value={modelFilter} onChange={e => setModelFilter(e.target.value)} />
                                </div>
                                <div>
                                    <label>Price Range:</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100000}
                                        value={priceFilter[0]}
                                        onChange={e => setPriceFilter([parseInt(e.target.value), priceFilter[1]])}
                                    />
                                    <input
                                        type="range"
                                        min={0}
                                        max={100000}
                                        value={priceFilter[1]}
                                        onChange={e => setPriceFilter([priceFilter[0], parseInt(e.target.value)])}
                                    />
                                </div>
                                <div>
                                    <h2>Filtered Cars:</h2>
                                    <ul>
                                        {filteredCars.map((car, index) => (
                                            <li key={index}>{car.make} - {car.model} - ${car.price}</li>
                                        ))}
                                    </ul>
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
