"use client"
import React, { createContext, useContext, useState } from 'react';

// Step 1: Create the context
export const MyContext = createContext(null);

// Step 2: Create a provider component
export const MyProvider = ({ children }: any) => {

    const [userName, setUserName] = useState(0);
    const [userId, setUserId] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [picture, setPicture] = useState("avatar-1709299164782-285606945.jpg");

    const login = () => {
        // Logic for logging in
        setIsLoggedIn(true);
    };

    const logout = () => {
        // Logic for logging out
        setIsLoggedIn(false);
    };

    // Create an object containing all your variables and functions
    const contextValue = {
        userName,
        setUserName,
        userId,
        setUserId,
        isLoggedIn,
        login,
        logout,
        picture,
        setPicture
    };


    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};
