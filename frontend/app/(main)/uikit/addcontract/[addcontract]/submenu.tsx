'use client';

import { useRouter } from 'next/navigation';
import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { PrimeReactProvider, PrimeReactContext, PrimeIcons } from 'primereact/api';
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
import Documents from './documents'
import HeaderContract from './header';
import Additional from './additional'
import Financial from './financial'
import Content from './content'
import History from './history'
import Alerts from './alerts';
import Tasks from './tasks'
import { useSearchParams } from 'next/navigation'
import { Toast } from 'primereact/toast';
import { CurrentContractContext } from './context';
import { DataProvider, useData } from './DataContext';

export default function Submenu() {

    const router = useRouter();
    const [number, setNumber] = useState();
    const [activeIndex, setActiveIndex] = useState(0);
    const [paramId, setParamId] = useState(0);
    const toast = useRef(null);
    const [personIndex, setPersonIndex] = useState<number>(0);

    // const { value, updateValue } = useData();
    const { value } = useData();
    const [renderCount, setRenderCount] = useState(0);

    console.log(value, "din submenu")

    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home'
            // ,
            // command: () => {
            //     router.push('/uikit/addcontract');
            // }
        },
        {
            label: 'Documente Atasate', icon: 'pi pi-inbox'
        },
        {
            label: 'Acte Aditionale', icon: 'pi pi-chart-line'
        },

        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        // { label: 'Flux aprobare', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' }
        // { label: 'Istoric', icon: 'pi pi-fw pi-table' },
        // { label: 'Alerte', icon: 'pi pi-fw pi-mobile' }
    ];

    const showError = () => {
        toast.current.show({
            severity: 'error', summary: 'Error',
            detail: 'Inainte sa mergeti mai departe, trebuie sa salvati contractul.', life: 3000
        });
    }

    const searchParams = useSearchParams()

    const changeTab = (e) => {
        setParamId(parseInt(searchParams.get("Id")));
        if (paramId == 0) {
            showError()
        }
        else if (paramId != 0) {
            setActiveIndex(e)
            // router.push(`/uikit/addcontract/ctr?Id=${2}`)
            // permanentRedirect(`/uikit/addcontract/${2}`)
        }
    }

    // const Id = parseInt(searchParams.get("Id"));

    console.log("Id: ", paramId, "activeIndex: ", activeIndex)

    useEffect(() => {
        // setParamId(Id)
        // changeTab(activeIndex)
        setParamId(parseInt(searchParams.get("Id")));
    }, [])

    // Utilizați useEffect pentru a actualiza renderCount atunci când valoarea din context se schimbă
    useEffect(() => {
        // Incrementați renderCount pentru a declanșa re-renderizarea
        setRenderCount(prevCount => prevCount + 1);
        console.log(value, "din submenu")
    }, [value]); // Re-randăm doar atunci când valoarea din context se schimbă

    console.log("personIndex", personIndex)

    return (
        <>
            <DataProvider key={personIndex}>
                <div className="grid">
                    <div className="col-12">
                        <div className="card">
                            <div className="field lg:col-12 xs:col-3 md:col-12">
                                <Toast ref={toast} />
                                <TabMenu model={items} activeIndex={activeIndex}
                                    onTabChange={(e) => changeTab(e.index)} />
                                <p>Value: {value}</p>
                            </div>
                            {/* <div className="p-fluid formgrid grid pt-2"> */}

                            {activeIndex === 0 ?

                                <div>
                                    <div className='pt-4'>
                                        <HeaderContract
                                            key={personIndex}
                                            setPersonIndex={setPersonIndex}
                                        />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex === 1 ?

                                <div>
                                    <div className='pt-4'>
                                        <Documents />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex === 2 ?

                                <div>
                                    <div className='pt-4'>
                                        <Additional />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex === 3 ?

                                <div>
                                    <div className='pt-4'>
                                        <Financial />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex === 4 ?

                                <div>
                                    <div className='pt-4'>
                                        <Content />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex === 5 ?

                                <div>
                                    <div className='pt-4'>
                                        <Tasks />
                                    </div>
                                </div>

                                : null
                            }
                        </div>
                    </div>
                </div>
            </DataProvider>
        </>

    );
}