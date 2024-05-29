/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { MyContext, MyProvider } from '../layout/context/myUserContext'
import { PanelMenu } from 'primereact/panelmenu';
import router from 'next/router';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);

    const useMyContext = () => useContext(MyContext);
    const { Frontend_BASE_URL } = useMyContext();

    useEffect(() => {
    }, [BreadCrumbItems])

    const router = useRouter()

    const model: AppMenuItem[] = [
        {
            label: 'Acasa',
            icon: 'pi pi-fw pi-home',
            command: () => {
                router.push(`/`);
            }
            // items: [{
            //     label: 'Panou de bord', icon: 'pi pi-fw pi-home', to: '/'
            //     //     ,command: () => setBreadCrumbItems(
            //     //         [{
            //     //             label: 'Home',
            //     //             template: () => <Link href="/">Home</Link>
            //     //         }]
            //     //     )
            // },
            // ]
        },
        {
            label: 'Contracte',
            items: [
                {
                    label: 'Contracte furnizori', icon: 'pi pi-fw pi-id-card',
                    to: '/uikit/suppliercontracts'
                    // command: () => setBreadCrumbItems(
                    //     [{
                    //         label: 'Home',
                    //         template: () => <Link href="/">Home</Link>
                    //     },
                    //     {
                    //         label: 'Contracte furnizori',
                    //         template: () => {
                    //             const url = `${Frontend_BASE_URL}/uikit/suppliercontracts`
                    //             return (
                    //                 <Link href={url}>Contracte Furnizare</Link>
                    //             )

                    //         }
                    //     }]
                    // )
                },
                {
                    label: 'Contracte clienti', icon: 'pi pi-fw pi-bookmark',
                    to: '/uikit/customercontracts'
                    // command: () => setBreadCrumbItems(
                    //     [{
                    //         label: 'Home',
                    //         template: () => <Link href="/">Home</Link>
                    //     },
                    //     {
                    //         label: 'Contracte clienti',
                    //         template: () => {
                    //             const url = `${Frontend_BASE_URL}/uikit/customercontracts`
                    //             return (
                    //                 <Link href={url}>Contracte clienti</Link>
                    //             )

                    //         }
                    //     }]
                    // )
                },
            ]
        },
        {
            label: 'Facturi',
            items: [
                {
                    label: 'Facturi furnizori', icon: 'pi pi-fw pi-stop',
                    // to: '/uikit/supplierinvoices',
                    command: () => {
                        router.push(`/uikit/supplierinvoices`);
                    }
                },
                {
                    label: 'Facturi clienti', icon: 'pi pi-fw pi-stop-circle',
                    // to: '/uikit/customerinvoices'
                    command: () => {
                        router.push(`/uikit/customerinvoices`);
                    }
                },
                {
                    label: 'Emitere in masa', icon: 'pi pi-fw pi-box',
                    // to: '/uikit/massinvoicegenerate'
                    command: () => {
                        router.push(`/uikit/massinvoicegenerate`);
                    }
                },
            ]
        },
        {
            label: 'Rapoarte',
            items: [
                { label: 'Raport general', icon: 'pi pi-fw pi-chart-line', to: '/uikit/reports' },
                { label: 'Raport financiar', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/reports_financial' },
            ]
        },

        //         const items = [
        //     { label: 'Parteneri', icon: 'pi pi-fw pi-mobile' },
        //     { label: 'Departamente', icon: 'pi pi-list' },
        //     { label: 'CashFlow', icon: 'pi pi-inbox' },
        //     { label: 'Obiecte de contract', icon: 'pi pi-fw  pi-exclamation-circle' },
        //     { label: 'Centre Cost/Profit', icon: 'pi pi-fw  pi-clone' },
        //     { label: 'Categorii', icon: 'pi pi-chart-line' },
        //     { label: 'Tip Contracte', icon: 'pi pi-fw pi-table' },
        //     { label: 'Locatii', icon: 'pi pi-fw pi-box' },

        // ];


        {
            label: 'Nomenclatoare',
            items: [
                {
                    label: 'Parteneri', icon: 'pi pi-fw pi-mobile',
                    command: () => {
                        router.push(`/uikit/lookups/partner`);
                    }
                },
                {
                    label: 'CashFlow', icon: 'pi pi-list',
                    command: () => {
                        router.push(`/uikit/lookups/cashflow`);
                    }
                },
                {
                    label: 'Articole', icon: 'pi pi-inbox',
                    command: () => {
                        router.push(`/uikit/lookups/item`);
                    }
                },
                {
                    label: 'Departamente', icon: 'pi pi-fw  pi-exclamation-circle',
                    command: () => {
                        router.push(`/uikit/lookups/department`);
                    }
                },
                {
                    label: 'Centre de Cost', icon: 'pi pi-fw  pi-clone',
                    command: () => {
                        router.push(`/uikit/lookups/costcenter`);
                    }
                },
                {
                    label: 'Categorii Contracte', icon: 'pi pi-chart-line',
                    command: () => {
                        router.push(`/uikit/lookups/category`);
                    }
                },
                {
                    label: 'Tipuri Contracte', icon: 'pi pi-fw pi-box',
                    command: () => {
                        router.push(`/uikit/lookups/type`);
                    }
                },
                {
                    label: 'Locatii', icon: 'pi pi-fw pi-table',
                    command: () => {
                        router.push(`/uikit/lookups/location`);
                    }
                },
                {
                    label: 'Tranzactii', icon: 'pi pi-fw pi-box',
                    command: () => {
                        router.push(`/uikit/lookups`);
                    }
                },
                {
                    label: 'Clasificari', icon: 'pi pi-fw pi-chart-line',
                    command: () => {
                        router.push(`/uikit/lookups`);
                    }
                },

            ]
        },
        {
            label: 'Administrare',
            // icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Informatii Dinamice',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/uikit/dynamicInfo'
                },
                {
                    label: 'Modele Contracte',
                    icon: 'pi pi-fw pi-book',
                    to: '/uikit/contractTemplates'
                },
                {
                    label: 'Fluxuri de aprobare',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/uikit/workflows'
                },
                {
                    label: 'Alerte',
                    icon: 'pi pi-fw pi-mobile',
                    to: '/uikit/alerts',
                },
                {
                    label: 'Grupuri Utilizatori',
                    icon: 'pi pi-fw pi-clone',
                    to: '/uikit/usergroups',
                },
                {
                    label: 'Utilizatori',
                    icon: 'pi pi-fw pi-check-square',
                    to: '/uikit/users',
                },
                {
                    label: 'Cursuri Valutare',
                    icon: 'pi pi-fw pi-dollar',
                    to: '/uikit/exchagerates',
                },

                // {
                //     label: 'Landing page',
                //     icon: 'pi pi-fw pi-sign-in',
                //     to: '/uikit/landing'
                //     // frontend/ app / (full - page) / landing
                // },
            ]
        }
        // {
        //     label: 'Pages',
        //     icon: 'pi pi-fw pi-briefcase',
        //     to: '/pages',
        //     items: [
        //         {
        //             label: 'Landing',
        //             icon: 'pi pi-fw pi-globe',
        //             to: '/landing'
        //         },
        //         {
        //             label: 'Auth',
        //             icon: 'pi pi-fw pi-user',
        //             items: [
        //                 {
        //                     label: 'Login',
        //                     icon: 'pi pi-fw pi-sign-in',
        //                     to: '/auth/login'
        //                 },
        //                 {
        //                     label: 'Error',
        //                     icon: 'pi pi-fw pi-times-circle',
        //                     to: '/auth/error'
        //                 },
        //                 {
        //                     label: 'Access Denied',
        //                     icon: 'pi pi-fw pi-lock',
        //                     to: '/auth/access'
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Crud',
        //             icon: 'pi pi-fw pi-pencil',
        //             to: '/pages/crud'
        //         },
        //         {
        //             label: 'Timeline',
        //             icon: 'pi pi-fw pi-calendar',
        //             to: '/pages/timeline'
        //         },
        //         {
        //             label: 'Not Found',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             to: '/pages/notfound'
        //         },
        //         {
        //             label: 'Empty',
        //             icon: 'pi pi-fw pi-circle-off',
        //             to: '/pages/empty'
        //         }
        //     ]
        // },

    ];

    return (

        // <>

        //     <div className="card flex justify-content-center">
        //         <PanelMenu model={model} className="w-full md:w-20rem" />
        //     </div>
        // </>
        <MenuProvider>
            {/* <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? 
                    <AppMenuitem item={item} root={true} 
                    index={i} key={item.label} /> : 
                    <li className="menu-separator"></li>;
                })}

                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link>
            </ul> */}

            <div className="card flex justify-content-center">
                <PanelMenu model={model} className="w-full md:w-20rem" />
            </div>

        </MenuProvider>
    );
};

export default AppMenu;
