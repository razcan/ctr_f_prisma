'use client';


import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import axios, { AxiosRequestConfig } from 'axios';

import HeaderContract from './header';
import Documents from './documents'
import Additional from './additional'
import Financial from './financial'
import Content from './content'
import History from './history'
import Alerts from './alerts';
import Tasks from './tasks'
import WorkFlow from './workflow'
import { Tag } from 'primereact/tag';
import { MyContext } from '../../../../../layout/context/myUserContext'


// export default function EditContract({ initialIndex : any }) 
const EditContract = () => {

    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();
    const { isAdditional, setIsAdditional } = useMyContext();


    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()



    const Id = searchParams.get("Id");
    const idxp = searchParams.get("idxp");

    const urlsearchparams = new URLSearchParams(searchParams.toString())

    const useparams = useParams()

    // console.log(pathname, urlsearchparams, useparams)



    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }

    }, [])





    const [IsAdditionalContract, setIsAdditionalContract] = useState(false);

    const fetchContractData = async () => {

        const session = localStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/contracts/details/${Id}`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    if (response.data.parentId > 0) {
                        setIsAdditionalContract(true)
                    }
                })
                .catch(function (error) {
                    router.push(`${Frontend_BASE_URL}/auth/login`)

                    console.log(error);
                });
        }
    }

    useEffect(() => {
        fetchContractData()
    }, [])

    const [number, setNumber] = useState();
    // const [activeIndex, setActiveIndex] = useState(initialIndex);


    const [activeIndex, setActiveIndex] = useState(idxp);



    useEffect(() => {
        setActiveIndex(idxp);
    }, [idxp]);

    useEffect(() => {

        router.push(`/uikit/editcontract/ctr?Id=${Id}&idxp=${activeIndex}`)

    }, [activeIndex]);


    // console.log("idxp page", idxp, activeIndex)



    const items = [
        {
            label: 'Informatii generale', icon: 'pi pi-home'
        },
        {
            label: 'Documente Atasate', icon: 'pi pi-inbox'
            // ,
            // command: () => {
            //     router.push('/uikit/addcontract');
            // }
        },
        {
            label: 'Acte Aditionale', icon: 'pi pi-clone'
        },
        { label: 'Date Financiare', icon: 'pi pi-chart-line' },
        { label: 'Continut Contract', icon: 'pi pi-list' },
        { label: 'Flux aprobare', icon: 'pi pi-list' },
        { label: 'Actiuni', icon: 'pi pi-fw  pi-exclamation-circle' },
        { label: 'Istoric', icon: 'pi pi-fw pi-table' },
        { label: 'Alerte', icon: 'pi pi-fw pi-mobile' }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    {IsAdditionalContract ?
                        <Tag severity="warning" className='text-base w-1' value="Act Aditional"></Tag>
                        : null
                    }


                    {/* {isAdditional ? <Tag severity="warning" value="Adaugare Act Aditional"></Tag>
                        : null} */}

                    <div className="field lg:col-12 xs:col-3 md:col-12">
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    </div>
                    {/* <div className="p-fluid formgrid grid pt-2"> */}

                    {activeIndex == 0 ?

                        <div>
                            <div className='pt-4'>
                                <HeaderContract />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex == 1 ?

                        <div>
                            <div className='pt-4'>
                                <Documents />
                            </div>
                        </div>

                        : null
                    }

                    {activeIndex == 2 && !IsAdditionalContract && (
                        <div>
                            <div className='pt-4'>
                                <Additional />
                            </div>
                        </div>
                    )}

                    {activeIndex == 3 ?

                        <div>
                            <div className='pt-4'>
                                <Financial />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex == 4 ?

                        <div>
                            <div className='pt-4'>
                                <Content />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex == 5 ?

                        <div>
                            <div className='pt-4'>
                                <WorkFlow />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex == 6 ?

                        <div>
                            <div className='pt-4'>
                                <Tasks />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex == 7 ?

                        <div>
                            <div className='pt-4'>
                                <History />
                            </div>
                        </div>

                        : null
                    }
                    {activeIndex == 8 ?

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

export default EditContract;