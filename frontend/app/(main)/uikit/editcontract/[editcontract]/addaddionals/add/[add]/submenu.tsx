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
import { MyContext, MyProvider } from '../../../../../../../../layout/context/myUserContext'

export default function Submenu() {

    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [paramId, setParamId] = useState(0);
    const toast = useRef(null);
    const [addContractId, setAddContractId] = useState<number>(0);
    const { value, updateValue } = useData();
    const [renderCount, setRenderCount] = useState(0);

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { isAdditional, setIsAdditional } = useMyContext();


    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home'
        },
        {
            label: 'Documente Atasate', icon: 'pi pi-inbox'
        },
        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' }
    ];

    const showError = () => {
        toast.current.show({
            severity: 'error', summary: 'Error',
            detail: 'Inainte sa mergeti mai departe, trebuie sa salvati actul aditional.', life: 3000
        });
    }

    const searchParams = useSearchParams()

    // console.log(paramId, searchParams.get("addId"))

    const changeTab = (e) => {
        setParamId(parseInt(searchParams.get("addId")));

        const addId = searchParams.get("addId");

        if (parseInt(addId) == 0) {
            showError()
        }
        else if (parseInt(addId) != 0) {
            setActiveIndex(e)
        }
    }

    // setParamId(parseInt(searchParams.get("addId")));

    useEffect(() => {
        setParamId(parseInt(searchParams.get("addId")));
    }, [])


    useEffect(() => {
        setRenderCount(prevCount => prevCount + 1);
        //updateValue(personIndex);
        setParamId(addContractId);
    }, [addContractId]);



    return (
        <>
            <DataProvider >
                <div className="grid">
                    <div className="col-12">
                        <div className="card">
                            <div className="field lg:col-12 xs:col-3 md:col-12">
                                <Toast ref={toast} />
                                {isAdditional ? <Tag severity="warning" className='text-base w-1' value="Act Aditional"></Tag>
                                    : null}

                                <TabMenu model={items} activeIndex={activeIndex}
                                    onTabChange={(e) => changeTab(e.index)} />
                            </div>


                            {activeIndex === 0 ?

                                <div>
                                    <div className='pt-4'>
                                        <HeaderContract
                                            setAddContractId={setAddContractId}
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
                        </div>
                    </div>
                </div>
            </DataProvider>
        </>

    );
}