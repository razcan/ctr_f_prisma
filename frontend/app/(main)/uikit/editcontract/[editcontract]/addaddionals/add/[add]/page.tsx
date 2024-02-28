'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import Submenu from './submenu'
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