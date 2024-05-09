'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import { useData } from './DataContext';
import { useSearchParams } from 'next/navigation'
import { Tag } from 'primereact/tag';

export default function Financial() {

    const [item, setItem] = useState([]);
    const { value, updateValue } = useData();
    // console.log(value)
    const [selectedContractItem, setSelectedContractItem] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");

    const fetchTypeData = () => {
        fetch(`http://localhost:3000/contracts/contractItems/${value}`)
            .then(response => {
                return response.json()
            })
            .then(item => {
                setItem(item)
            })
    }

    useEffect(() => {
        fetchTypeData()
        const addId = searchParams.get("addId");

        updateValue(addId)
    }, [])

    const addContractItem = () => {
        router.push(`/uikit/editcontract/editcontract/financialdetails/add/ctr?Id=${Id}`);
        // router.push('/uikit/addcontract/financialdetails');
    }

    // http://localhost:3000/contracts/contractItemsDetails/95

    const statusTemplate = (item) => {
        return <Tag value={item.active} severity={getSeverity(item)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item.active) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    };


    const editContractItem = (id: any) => {
        router.push(`/uikit/editcontract/editcontract/financialdetails/edit/ContractItemId?Id=${id}&ctrId=${Id}`);
    }

    const goToDetails = () => {
        router.push(`/uikit/editcontract/editcontract/addaddionals/add/add/financialdetails/add/a?Id=${Id}&ctrId=${value}`);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Button label="Adauga" icon="pi pi-external-link" onClick={() => addContractItem()} />
                    {
                        item.length > 0 ?
                            < DataTable className='pt-2' value={item} tableStyle={{ minWidth: '50rem' }}
                                stripedRows
                                sortMode="multiple"
                                selectionMode="single"
                                selection={selectedContractItem} onSelectionChange={(e) => {
                                    setSelectedContractItem(e.value),
                                        editContractItem(e.value.id)
                                }}
                            >
                                <Column hidden field="id" header="id"></Column>
                                <Column field="item.name" header="Articol"></Column>
                                <Column field="frequency.name" header="Perioada"></Column>
                                <Column field="currency.code" header="Valuta"></Column>
                                <Column field="currencyValue" header="Pret"></Column>
                                <Column field="active" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                            </DataTable>
                            : null}
                </div>
            </div>
        </div>
    );
}