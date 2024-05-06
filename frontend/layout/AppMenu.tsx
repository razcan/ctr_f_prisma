/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Acasa',
            items: [{ label: 'Panou de bord', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Contracte',
            items: [
                { label: 'Contracte furnizori', icon: 'pi pi-fw pi-id-card', to: '/uikit/suppliercontracts' },
                // { label: 'Formular2', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                { label: 'Contracte clienti', icon: 'pi pi-fw pi-bookmark', to: '/uikit/customercontracts' },
                // { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                // { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
                // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            ]
        },
        {
            label: 'Rapoarte',
            items: [
                { label: 'Raport general', icon: 'pi pi-fw pi-chart-line', to: '/uikit/reports' },
                { label: 'Raport financiar', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/reports_financial' },
            ]
        },
        {
            label: 'Administrare',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Nomenclatoare',
                    icon: 'pi pi-fw pi-globe',
                    to: '/uikit/lookups'
                },
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
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                {/* <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link> */}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
