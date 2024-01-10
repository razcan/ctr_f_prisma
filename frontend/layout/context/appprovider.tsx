import { Context } from './appcontext';
import React, { useState, createContext } from 'react';
import { ChildContainerProps, MenuContextProps } from '@/types';


export function ContextProvider({ children }: ChildContainerProps) {
    const value = 'My Context Value';

    const [category, setCategory] = useState('');

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}