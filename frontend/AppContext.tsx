
// 'use client'

// import React, { createContext, useContext, useState } from 'react';

// interface ContextValues {
//     userId: number;
//     updateUser: (newValue: number) => void;
// }


// const AppContext = createContext<ContextValues | undefined>(undefined);


// export const AppProvider: React.FC = ({ children }: any) => {

//     // const [value, setValue] = useState(0);

//     // const updateValue = (newValue: number) => {
//     //     setValue(newValue);
//     // };

//     const [userId, setUserId] = useState(0);

//     const updateUser = (newValue: number) => {
//         setUserId(newValue);
//     };


//     if (userId === undefined || updateUser === undefined) {
//         throw new Error('App Provider is not properly configured');
//     }

//     return (
//         <AppContext.Provider value={{ userId, updateUser }}>
//             {children}
//         </AppContext.Provider>
//     );
// };

// export const useData = (): ContextValues => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error('useData must be used within a AppProvider');
//     }
//     return context;
// };


"use client"
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
