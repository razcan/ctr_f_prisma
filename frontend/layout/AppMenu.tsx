/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { MyContext, MyProvider } from '../layout/context/myUserContext'
import { PanelMenu } from 'primereact/panelmenu';
import router from 'next/router';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from 'primereact/button';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);
    const useMyContext = () => useContext(MyContext);
    const { Frontend_BASE_URL } = useMyContext();

    useEffect(() => {
    }, [BreadCrumbItems])

    const router = useRouter()

    const model = [
        {
            key: '0',
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            command: () => {
                router.push(`/`);
            }
        },
        {
            key: '0_1',
            label: 'Contracte',
            items: [
                {
                    key: '0_1_0',
                    label: 'Contracte furnizori', icon: 'pi pi-fw pi-id-card',
                    // to: '/uikit/suppliercontracts'
                    command: () => {
                        router.push(`/uikit/suppliercontracts`);
                    }
                },
                {
                    key: '0_1_1',
                    label: 'Contracte clienti', icon: 'pi pi-fw pi-bookmark',
                    // to: '/uikit/customercontracts'
                    command: () => {
                        router.push(`/uikit/customercontracts`);
                    }
                },
            ]
        },
        {
            key: '0_2_0',
            label: 'Facturi',
            items: [
                {
                    key: '0_2_1',
                    label: 'Facturi furnizori', icon: 'pi pi-fw pi-stop',
                    // to: '/uikit/supplierinvoices',
                    command: () => {
                        router.push(`/uikit/supplierinvoices`);
                    }
                },
                {
                    key: '0_2_2',
                    label: 'Facturi clienti', icon: 'pi pi-fw pi-stop-circle',
                    // to: '/uikit/customerinvoices'
                    command: () => {
                        router.push(`/uikit/customerinvoices`);
                    }
                },
                {
                    key: '0_2_3',
                    label: 'Emitere in masa', icon: 'pi pi-fw pi-box',
                    // to: '/uikit/massinvoicegenerate'
                    command: () => {
                        router.push(`/uikit/massinvoicegenerate`);
                    }
                },
            ]
        },
        {
            key: '0_3_0',
            label: 'Rapoarte',
            items: [
                {
                    key: '0_3_1',
                    label: 'Raport general', icon: 'pi pi-fw pi-chart-line',
                    // to: '/uikit/reports' 
                    command: () => {
                        router.push(`/uikit/reports`);
                    }
                },
                {
                    key: '0_3_2',
                    label: 'Raport financiar', icon: 'pi pi-fw pi-chart-bar',
                    // to: '/uikit/reports_financial' 
                    command: () => {
                        router.push(`/uikit/reports_financial`);
                    }
                },
            ]
        },
        {
            key: '0_4_0',
            label: 'Nomenclatoare',
            items: [
                {
                    key: '0_4_1',
                    label: 'Parteneri', icon: 'pi pi-fw pi-mobile',
                    command: () => {
                        router.push(`/uikit/lookups/partner`);
                    }
                },
                {
                    key: '0_4_2',
                    label: 'CashFlow', icon: 'pi pi-list',
                    command: () => {
                        router.push(`/uikit/lookups/cashflow`);
                    }
                },
                {
                    key: '0_4_3',
                    label: 'Articole', icon: 'pi pi-inbox',
                    command: () => {
                        router.push(`/uikit/lookups/item`);
                    }
                },
                {
                    key: '0_4_4',
                    label: 'Departamente', icon: 'pi pi-fw  pi-exclamation-circle',
                    command: () => {
                        router.push(`/uikit/lookups/department`);
                    }
                },
                {
                    key: '0_4_5',
                    label: 'Centre de Cost', icon: 'pi pi-fw  pi-clone',
                    command: () => {
                        router.push(`/uikit/lookups/costcenter`);
                    }
                },
                {
                    key: '0_4_6',
                    label: 'Categorii Contracte', icon: 'pi pi-chart-line',
                    command: () => {
                        router.push(`/uikit/lookups/category`);
                    }
                },
                {
                    key: '0_4_7',
                    label: 'Tipuri Contracte', icon: 'pi pi-fw pi-box',
                    command: () => {
                        router.push(`/uikit/lookups/type`);
                    }
                },
                {
                    key: '0_4_8',
                    label: 'Locatii', icon: 'pi pi-fw pi-table',
                    command: () => {
                        router.push(`/uikit/lookups/location`);
                    }
                },
                {
                    key: '0_4_9',
                    label: 'Tranzactii', icon: 'pi pi-fw pi-box',
                    command: () => {
                        router.push(`/uikit/lookups`);
                    }
                },
                {
                    key: '0_4_91',
                    label: 'Clasificari', icon: 'pi pi-fw pi-chart-line',
                    command: () => {
                        router.push(`/uikit/lookups`);
                    }
                },
                {
                    key: '0_4_92',
                    label: 'Cursuri Valutare',
                    icon: 'pi pi-fw pi-dollar',
                    // to: '/uikit/exchagerates',
                    command: () => {
                        router.push(`/uikit/exchagerates`);
                    }
                },

            ]
        },
        {
            key: '0_5_0',
            label: 'Administrare',
            // icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    key: '0_5_1',
                    label: 'Informatii Dinamice',
                    icon: 'pi pi-fw pi-pencil',
                    // to: '/uikit/dynamicInfo'
                    command: () => {
                        router.push(`/uikit/dynamicInfo`);
                    }
                },
                {
                    key: '0_5_2',
                    label: 'Modele Contracte',
                    icon: 'pi pi-fw pi-book',
                    // to: '/uikit/contractTemplates'
                    command: () => {
                        router.push(`/uikit/contractTemplates`);
                    }
                },
                {
                    key: '0_5_3',
                    label: 'Fluxuri de aprobare',
                    icon: 'pi pi-fw pi-calendar',
                    // to: '/uikit/workflows'
                    command: () => {
                        router.push(`/uikit/workflows`);
                    }
                },
                {
                    key: '0_5_4',
                    label: 'Alerte',
                    icon: 'pi pi-fw pi-mobile',
                    // to: '/uikit/alerts',
                    command: () => {
                        router.push(`/uikit/alerts`);
                    }
                },
                {
                    key: '0_5_5',
                    label: 'Grupuri Utilizatori',
                    icon: 'pi pi-fw pi-clone',
                    // to: '/uikit/usergroups',
                    command: () => {
                        router.push(`/uikit/usergroups`);
                    }
                },
                {
                    key: '0_5_6',
                    label: 'Utilizatori',
                    icon: 'pi pi-fw pi-check-square',
                    // to: '/uikit/users',
                    command: () => {
                        router.push(`/uikit/users`);
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


    const [expandedKeys, setExpandedKeys] = useState({});

    const toggleAll = () => {
        if (Object.keys(expandedKeys).length) {
            collapseAll();
        } else {
            expandAll();
        }
    };

    const expandAll = () => {
        model.forEach(expandNode);
        setExpandedKeys({ ...expandedKeys });
    };

    const collapseAll = () => {
        setExpandedKeys({});
    };

    const expandNode = (node) => {
        if (node.items && node.items.length) {
            expandedKeys[node.key] = true;

            node.items.forEach(expandNode);
        }
    };


    return (
        <div className="card flex flex-column align-items-center gap-3">
            <Button icon="pi pi-arrow-right-arrow-left" text
                onClick={() => toggleAll()} />




            <PanelMenu model={model} expandedKeys={expandedKeys}
                onExpandedKeysChange={setExpandedKeys} className="w-full md:w-18rem" multiple />
        </div>
        // <MenuProvider>
        //     <ul className="layout-menu">
        //         {model.map((item, i) => {
        //             return !item?.seperator ? 
        //             <AppMenuitem item={item} root={true} 
        //             index={i} key={item.label} /> : 
        //             <li className="menu-separator"></li>;
        //         })}

        //         <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
        //             <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
        //         </Link>
        //     </ul>

        //     <div className="flex justify-content-center">
        //         <PanelMenu model={model}
        //             className="w-full md:w-44rem" multiple />
        //     </div>

        // </MenuProvider>
    );
};

export default AppMenu;
