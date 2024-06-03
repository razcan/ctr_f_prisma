/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { MyContext, MyProvider } from '../layout/context/myUserContext'
import { Badge } from 'primereact/badge';
import { BreadCrumb } from 'primereact/breadcrumb';
import AppConfig from './AppConfig';
import { Dropdown } from 'primereact/dropdown';


const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {

    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);


    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    const useMyContext = () => useContext(MyContext);

    const { userName, setUserName } = useMyContext();
    const { entity, setEntity } = useMyContext();
    const { userId, setUserId } = useMyContext();
    const { picture, setPicture } = useMyContext();
    const { isLoggedIn, setIsLoggedIn } = useMyContext();
    const { nrOfTasks, setNrOfTasks } = useMyContext();
    const { BreadCrumbItems, setBreadCrumbItems } = useMyContext();
    const { Backend_BASE_URL, Frontend_BASE_URL, login } = useMyContext();

    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York aderwrewrwerwe', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));


    return (
        <MyProvider >
            <div className="layout-topbar">
                <Link href="/" className="layout-topbar-logo">
                    <img src={`/layout/images/image.svg`} width="25px" height={'25px'} alt="profile" />
                    <span>ContractsHub</span>
                </Link>

                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>

                <BreadCrumb model={BreadCrumbItems} />



                <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                    <i className="pi pi-ellipsis-v" />
                </button>

                <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                    <Dropdown
                        // value={entity}
                        // onChange={(e) => setEntity(e.value)}
                        options={entity} optionLabel="name"
                        // placeholder="Select a City" 
                        className="w-full md:h-3rem" />


                    <Link href="/auth/login" className='pl-2'>
                        <Avatar className="p-overlay-badge"
                            image={`${Backend_BASE_URL}/nomenclatures/download/${picture}`}
                            size="large"
                            shape="circle"

                        >
                            <Badge value={` ${userName} `} />
                        </Avatar>
                    </Link>


                    <Link href="/uikit/usertasks">
                        <Avatar className="p-link p-overlay-badge" icon="pi pi-bell" size="large">
                            <Badge value={nrOfTasks} />
                        </Avatar>
                    </Link>


                    {isLoggedIn ?
                        <Link href="/auth/logout">
                            <Avatar className="p-link p-overlay-badge" icon="pi pi-user" size="large">
                                <Badge value="logout" />
                            </Avatar>
                        </Link>
                        :
                        <Link href="/auth/login">
                            <Avatar className="p-link p-overlay-badge" icon="pi pi-user" size="large">
                                <Badge value="login" />
                            </Avatar>
                        </Link>}
                    <div className="pt-2">
                        <AppConfig />
                    </div>


                    {/* <Link href="/auth/login">
                        <Avatar className="p-link p-overlay-badge" icon="pi pi-user" size="large">
                            {isLoggedIn ? <Badge value="logout" /> : <Badge value="login" />}
                        </Avatar>
                    </Link> */}


                    {/* <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button> */}
                    {/* <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link> */}
                </div>
            </div>
        </MyProvider>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
