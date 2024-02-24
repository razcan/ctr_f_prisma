'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import Documents from './documents'
import HeaderContract from './header';
import Additional from './additional'
import Financial from './financial'
import Content from './content'
import History from './history'
import Alerts from './alerts';
import Tasks from './tasks'
import Submenu from './submenu'
import { useSearchParams } from 'next/navigation'
import { Toast } from 'primereact/toast';
import { DataProvider, useData } from './DataContext';

export default function AddContract() {

    const router = useRouter();
    const [number, setNumber] = useState();
    const [activeIndex, setActiveIndex] = useState(0);
    const [paramId, setParamId] = useState(0);
    const toast = useRef(null);


    return (
        <DataProvider >
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="field lg:col-12 xs:col-3 md:col-12">

                            <Submenu />

                        </div>
                    </div>
                </div>
            </div>
        </DataProvider>
    );
}