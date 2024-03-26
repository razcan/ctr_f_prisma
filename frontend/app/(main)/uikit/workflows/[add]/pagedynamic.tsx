"use client"
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


export default function Tasks() {
    const [conditions, setConditions] = useState([]);
    const [arrLength, setArrLength] = useState(0);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [cashflows, setCashflow] = useState([]);
    const [costcenters, setCostCenter] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedCashflow, setSelectedCashflow] = useState([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState([]);


    const posibleFilters = [
        { name: 'Centru Cost' },
        { name: 'Departament' },
        { name: 'Categorie' },
        { name: 'Cashflow' }
    ];

    const fetchCategoriesData = () => {
        fetch("http://localhost:3000/contracts/category")
            .then(response => {
                return response.json()
            })
            .then(categories => {
                setCategories(categories)
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

    useEffect(() => {
        fetchCategoriesData()
        fetchDepartmentsData()
        fetchCostCenter()
        fetchCashFlow()

    }, [])


    const getSourceName = (name) => {
        if (name == 'Departament') {
            return { name: 'departments' }
        }
        else if (name == 'Centru Cost') {
            return { name: 'costcenters' }
        }
        else if (name == 'Cashflow') {
            return { name: 'cashflows' }
        }
        else if (name == 'Categorie') {
            return { name: 'categories' }
        }
        else
            return { name: 'categories' }

    }


    const addConditions = () => {
        setConditions(
            [...conditions,
            {
                filter: null,
                filterValue: null,
                source: { name: '' }
            }]
        )

        setArrLength(conditions.length)
    }


    const handleDropdown1Change = (index, value) => {
        const newFormData = [...conditions];
        newFormData[index].filter = value;
        const sursa = getSourceName(value.name);
        if (sursa === undefined) {
            newFormData[index].source = ''
        }
        else {
            newFormData[index].source = sursa;
        }
        setConditions(newFormData);
    };


    const handleDropdown2Change = (index, value) => {
        const newFormData = [...conditions];
        newFormData[index].filterValue = value;
        setConditions(newFormData);
    };

    const removeField = (index) => {
        const newFormData = conditions.filter((_, i) => i !== index);
        setConditions(newFormData);
        setArrLength(arrLength - 1)
    };


    const getSourceOptions = (sourceName) => {
        switch (sourceName) {
            case 'categories':
                return categories;
            case 'costcenters':
                return costcenters;
            case 'cashflows':
                return cashflows;
            case 'departments':
                return departments;
            default:
                return [];
        }
    };



    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>

                    {conditions.length === 0 ?
                        <Button label="Adauga" icon="pi pi-plus" onClick={addConditions} />
                        : null
                    }

                    {conditions.map((field, index) => (
                        <div key={index} className="dynamic-field">

                            <div className="grid">
                                <div className="col-3">
                                    <Dropdown
                                        value={field.filter}
                                        onChange={(e) => {
                                            handleDropdown1Change(index, e.value)
                                        }}
                                        options={posibleFilters}
                                        optionLabel="name"
                                        placeholder="Selecteaza conditie"
                                        className="w-full md:w-14rem"
                                    />
                                </div>
                                <div className="col-3">
                                    <Dropdown id="value"
                                        filter showClear
                                        value={field.filterValue}
                                        onChange={(e) => {
                                            handleDropdown2Change(index, e.value)
                                        }}
                                        options={getSourceOptions(field.source.name)}
                                        optionLabel="name"
                                        className="w-full md:w-14rem"
                                        placeholder="Select One">
                                    </Dropdown>
                                </div>
                                <div className="col-3">
                                    {/* <Button icon="pi pi-minus" severity="danger" onClick={() => removeField(index)} /> */}
                                    <Button icon="pi pi-minus" rounded text severity="danger" onClick={() => removeField(index)} aria-label="Sterge" />

                                    {index == arrLength ?
                                        <Button icon="pi pi-plus" rounded text severity="success" onClick={addConditions} aria-label="Adauga" />
                                        : null}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div >
    );
}