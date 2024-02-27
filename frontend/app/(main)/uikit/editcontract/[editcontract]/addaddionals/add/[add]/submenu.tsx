'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import Documents from './documents'
import HeaderContract from './header';
import Financial from './financial'
import Content from './content'
import Tasks from './tasks'
import { useSearchParams } from 'next/navigation'
import { Toast } from 'primereact/toast';
import { DataProvider, useData } from './DataContext';
import { Tag } from 'primereact/tag';

export default function Submenu() {

    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [paramId, setParamId] = useState(0);
    const toast = useRef(null);
    const [contractId, setContractId] = useState<number>(0);
    const { value, updateValue } = useData();
    const [renderCount, setRenderCount] = useState(0);

    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home'
        },
        {
            label: 'Documente Atasate', icon: 'pi pi-inbox'
        },
        {
            label: 'Acte Aditionale', icon: 'pi pi-chart-line'
        },
        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' }
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
        }
    }

    useEffect(() => {
        setParamId(parseInt(searchParams.get("Id")));
    }, [])


    useEffect(() => {
        setRenderCount(prevCount => prevCount + 1);
        //updateValue(personIndex);
        setParamId(contractId);
    }, [contractId]);



    return (
        <>
            <DataProvider >
                <div className="grid">
                    <div className="col-12">
                        <div className="card">
                            <div className="field lg:col-12 xs:col-3 md:col-12">
                                <Toast ref={toast} />
                                <TabMenu model={items} activeIndex={activeIndex}
                                    onTabChange={(e) => changeTab(e.index)} />
                            </div>

                            {/* <div className="p-fluid formgrid grid pt-2"> */}

                            {activeIndex === 0 ?

                                <div>
                                    <div className='pt-4'>
                                        <HeaderContract
                                            setContractId={setContractId}
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