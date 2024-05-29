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
        },
        {
            label: 'Contracte',
            items: [
                {
                    label: 'Contracte furnizori', icon: 'pi pi-fw pi-id-card',
                    // to: '/uikit/suppliercontracts'
                    command: () => {
                        router.push(`/uikit/suppliercontracts`);
                    }
                },
                {
                    label: 'Contracte clienti', icon: 'pi pi-fw pi-bookmark',
                    // to: '/uikit/customercontracts'
                    command: () => {
                        router.push(`/uikit/customercontracts`);
                    }
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
                {
                    label: 'Raport general', icon: 'pi pi-fw pi-chart-line',
                    // to: '/uikit/reports' 
                    command: () => {
                        router.push(`/uikit/reports`);
                    }
                },
                {
                    label: 'Raport financiar', icon: 'pi pi-fw pi-chart-bar',
                    // to: '/uikit/reports_financial' 
                    command: () => {
                        router.push(`/uikit/reports_financial`);
                    }
                },
            ]
        },
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
                    // to: '/uikit/dynamicInfo'
                    command: () => {
                        router.push(`/uikit/dynamicInfo`);
                    }
                },
                {
                    label: 'Modele Contracte',
                    icon: 'pi pi-fw pi-book',
                    // to: '/uikit/contractTemplates'
                    command: () => {
                        router.push(`/uikit/contractTemplates`);
                    }
                },
                {
                    label: 'Fluxuri de aprobare',
                    icon: 'pi pi-fw pi-calendar',
                    // to: '/uikit/workflows'
                    command: () => {
                        router.push(`/uikit/workflows`);
                    }
                },
                {
                    label: 'Alerte',
                    icon: 'pi pi-fw pi-mobile',
                    // to: '/uikit/alerts',
                    command: () => {
                        router.push(`/uikit/alerts`);
                    }
                },
                {
                    label: 'Grupuri Utilizatori',
                    icon: 'pi pi-fw pi-clone',
                    // to: '/uikit/usergroups',
                    command: () => {
                        router.push(`/uikit/usergroups`);
                    }
                },
                {
                    label: 'Utilizatori',
                    icon: 'pi pi-fw pi-check-square',
                    // to: '/uikit/users',
                    command: () => {
                        router.push(`/uikit/users`);
                    }
                },
                {
                    label: 'Cursuri Valutare',
                    icon: 'pi pi-fw pi-dollar',
                    // to: '/uikit/exchagerates',
                    command: () => {
                        router.push(`/uikit/exchagerates`);
                    }
                },

                // {
                //     label: 'Landing page',
                //     icon: 'pi pi-fw pi-sign-in',
                //     to: '/uikit/landing'
                //     // frontend/ app / (full - page) / landing
                // },
            ]
        }
    ];

    return (
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
                <PanelMenu model={model} className="w-full md:w-20rem" multiple />
            </div>

        </MenuProvider>
    );
};

export default AppMenu;
