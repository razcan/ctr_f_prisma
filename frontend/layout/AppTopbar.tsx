/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { MyContext, MyProvider } from '../layout/context/myUserContext'



const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);


    const useMyContext = () => useContext(MyContext);

    const { userName, setUserName } = useMyContext();
    const { userId, setUserId } = useMyContext();
    const { picture, setPicture } = useMyContext();


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <MyProvider>
            <div className="layout-topbar">
                <Link href="/" className="layout-topbar-logo">
                    <img src={`/layout/images/image.svg`} width="25px" height={'25px'} alt="profile" />
                    <span>Contracts</span>
                </Link>

                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>


                <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                    <i className="pi pi-ellipsis-v" />
                </button>

                <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                    {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button> */}
                    {`[ ${userName} ]`}
                    <Avatar image={`http://localhost:3000/nomenclatures/download/${picture}`}
                        size="xlarge" shape="circle" style={{ width: '5vh', height: '5vh' }} />
                    <Link href="/auth/login">
                        <button type="button" className="p-link layout-topbar-button">
                            <i className="pi pi-user"></i>
                            <span>Profile</span>

                        </button>
                    </Link>
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
