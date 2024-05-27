'use client';

import React, { useContext } from 'react';
import { MyContext } from '../../../layout/context/myUserContext'; // Ensure correct path

const DynamicHead: React.FC = () => {


    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();
    const { theme } = useMyContext();

    return (
        <head>
            <link id="theme-css" href={`${theme}`} rel="stylesheet" />
        </head>

    );
};

export default DynamicHead;