// DataContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Definiți tipurile pentru valorile din context
interface ContextValues {
    value: number;
    updateValue: (newValue: number) => void;
}

const DataContext = createContext<ContextValues | undefined>(undefined);



export const DataProvider: React.FC = ({ children }) => {
    const [value, setValue] = useState(0);
    console.log(value, " din functia de context")

    const updateValue = (newValue: number) => {
        setValue(newValue);
    };

    // Asigurați-vă că Provider-ul nu este furnizat cu valoarea "undefined"
    if (value === undefined || updateValue === undefined) {
        throw new Error('Data Provider is not properly configured');
    }

    return (
        <DataContext.Provider value={{ value, updateValue }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): ContextValues => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
