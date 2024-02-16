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


export default function AddContract() {

    const router = useRouter();
    const [number, setNumber] = useState();
    const [activeIndex, setActiveIndex] = useState(0);

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
            // ,
            // command: () => {
            //     router.push('/uikit/addcontract');
            // }
        },
        {
            label: 'Acte Aditionale', icon: 'pi pi-chart-line'
            // ,
            // command: () => {
            //     router.push('/uikit/additional');
            // }
        },

        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        // { label: 'Flux aprobare', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Istoric', icon: 'pi pi-fw pi-table' },
        { label: 'Alerte', icon: 'pi pi-fw pi-mobile' }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="field lg:col-12 xs:col-3 md:col-12">
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    </div>
                    {/* <div className="p-fluid formgrid grid pt-2"> */}

                    {activeIndex === 0 ?

                        <div>
                            <div className='pt-4'>
                                <HeaderContract />
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
                    {activeIndex === 6 ?

                        <div>
                            <div className='pt-4'>
                                <Tasks />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex === 7 ?

                        <div>
                            <div className='pt-4'>
                                <History />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex === 8 ?

                        <div>
                            <div className='pt-4'>
                                <Alerts />
                            </div>
                        </div>

                        : null
                    }



                    {/* </div> */}
                </div>
            </div>
        </div>


    );
}