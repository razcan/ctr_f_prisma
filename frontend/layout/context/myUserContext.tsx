"use client"
import router from 'next/router';
import React, { createContext, useContext, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

// Step 1: Create the context
export const MyContext = createContext(null);

// Step 2: Create a provider component
export const MyProvider = ({ children }: any) => {

    const [userName, setUserName] = useState('{NC}');
    const [userId, setUserId] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [picture, setPicture] = useState("default.jpeg");
    const [userRoles, setUserRoles] = useState([]);

    const [isPurchasing, setIsPurchasing] = useState(true);
    const Backend_BASE_URL = 'http://localhost:3000'; //  backend base URL
    const Frontend_BASE_URL = 'http://localhost:5500'; //  frontend base URL

    const router = useRouter()

    const login = () => {
        // Logic for logging in
        setIsLoggedIn(true);
    };

    const logout = () => {
        // Logic for logging out
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    // console.log("din context: ", userRoles)

    const fetchWithToken = async (url, options = {}) => {
        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;
            const headers = {
                'Authorization': `Bearer ${jwtTokenf}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await fetch(`${Backend_BASE_URL}/${url}`, {
                    ...options,
                    headers,
                });

                login();

                if (!response.ok) {
                    const error = await response.json();
                    router.push(`${Frontend_BASE_URL}/auth/login`)
                    logout();
                    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                if (error instanceof TypeError) {
                    throw new Error('Network error. Please check your internet connection.');
                }
                throw error;
            }
        } else {
            throw new Error('No token found.');
        }
    };


    // Example usage:
    // const fetchContracts = async () => {
    //     try {
    //         const data = await fetchWithToken('contracts', { method: 'GET' });
    //         setData(data);
    //     } catch (error) {
    //         if (error.message === 'No token found.') {
    //             setData([]);
    //             router.push('http://localhost:5500/auth/login');
    //         } else {
    //             console.error(error.message);
    //         }
    //     }
    // };

    // Create an object containing all your variables and functions
    const contextValue = {
        userName,
        setUserName,
        userId,
        setUserId,
        isLoggedIn,
        login,
        setIsLoggedIn,
        logout,
        picture,
        setPicture,
        fetchWithToken,
        Backend_BASE_URL,
        Frontend_BASE_URL,
        userRoles,
        setUserRoles,
        isPurchasing,
        setIsPurchasing
    };


    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};
