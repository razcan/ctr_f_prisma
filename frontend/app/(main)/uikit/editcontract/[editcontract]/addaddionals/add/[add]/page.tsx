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

import HeaderContract from './header';
import Documents from './documents'
import Financial from './financial'
import Content from './content'
import Tasks from './tasks'
import { Tag } from 'primereact/tag';


export default function AddContract() {

    const router = useRouter();
    const [number, setNumber] = useState();
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home'
        },
        {
            label: 'Documente Atasate', icon: 'pi pi-inbox'
        },
        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' },

    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="field lg:col-12 xs:col-3 md:col-12">
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    </div>
                    <Tag severity="warning" value="Adaugare Act Aditional"></Tag>
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
                                <Financial />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex === 3 ?

                        <div>
                            <div className='pt-4'>
                                <Content />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex === 4 ?

                        <div>
                            <div className='pt-4'>
                                <Tasks />
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