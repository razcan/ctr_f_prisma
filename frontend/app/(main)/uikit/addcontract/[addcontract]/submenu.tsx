'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { TabMenu } from 'primereact/tabmenu';
// import Documents from './documents'
import HeaderContract from './header';
// import Financial from './financial'
// import Content from './content'
// import Tasks from './tasks'
import { useSearchParams } from 'next/navigation'
import { Toast } from 'primereact/toast';
// import { DataProvider, useData } from './DataContext';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'

export default function Submenu() {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing } = useMyContext();


    const { setactualContractId } = useMyContext();

    const router = useRouter()
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");

    setactualContractId(parseInt(searchParams.get("Id")));


    const [activeIndex, setActiveIndex] = useState(0);
    // const [paramId, setParamId] = useState(parseInt(searchParams.get("Id")));
    const toast = useRef(null);
    const [contractId, setContractId] = useState<number>(parseInt(searchParams.get("Id")));
    const [renderCount, setRenderCount] = useState(0);


    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home'
        },
        // {
        //     label: 'Documente Atasate', icon: 'pi pi-inbox'
        // },
        // { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        // { label: 'Continut Contract', icon: 'pi pi-list' },
        // { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' }
    ];

    const showError = () => {
        toast.current.show({
            severity: 'error', summary: 'Error',
            detail: 'Inainte sa mergeti mai departe, trebuie sa salvati contractul.', life: 3000
        });
    }

    const changeTab = (e) => {
        setactualContractId(parseInt(searchParams.get("Id")));

        if (parseInt(searchParams.get("Id")) == 0) {
            showError()
        }
        else if (parseInt(searchParams.get("Id")) != 0) {
            setActiveIndex(e)
            router.push(`/uikit/addcontract/ctr?Id=${Id}&idxp=${e}`)
        }
    }


    useEffect(() => {
        router.push(`/uikit/addcontract/ctr?Id=${Id}&idxp=${activeIndex}`)
    }, [activeIndex]);



    useEffect(() => {
        setRenderCount(prevCount => prevCount + 1);
    }, [contractId]);



    return (
        <>
            {/* <DataProvider > */}
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="field lg:col-12 xs:col-3 md:col-12">
                            <Toast ref={toast} />
                            <TabMenu model={items} activeIndex={activeIndex}
                                onTabChange={(e) => changeTab(e.index)} />
                        </div>

                        {/* <div className="p-fluid formgrid grid pt-2"> */}

                        {activeIndex == 0 ?

                            <div>
                                <div className='pt-4'>
                                    <HeaderContract
                                        setContractId={setContractId}
                                    />
                                </div>
                            </div>

                            : null
                        }
                        {/* {activeIndex == 1 ?

                                <div>
                                    <div className='pt-4'>
                                        <Documents />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex == 2 ?

                                <div>
                                    <div className='pt-4'>
                                        <Financial />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex == 3 ?

                                <div>
                                    <div className='pt-4'>
                                        <Content />
                                    </div>
                                </div>

                                : null
                            }
                            {activeIndex == 4 ?

                                <div>
                                    <div className='pt-4'>
                                        <Tasks />
                                    </div>
                                </div>

                                : null
                            } */}
                    </div>
                </div>
            </div>
            {/* </DataProvider> */}
        </>

    );
}