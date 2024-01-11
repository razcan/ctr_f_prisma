import React, { useState, createContext } from 'react';
import { ChildContainerProps } from '@/types';

export const AppContext = createContext({});

export const AppProvider = ({ children }: ChildContainerProps) => {
    const [activeMenu, setActiveMenu] = useState('');

    const value = {
        activeMenu,
        setActiveMenu
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>);
};
