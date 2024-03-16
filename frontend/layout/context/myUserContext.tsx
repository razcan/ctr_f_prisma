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
    const [nrOfTasks, setNrOfTasks] = useState(0);
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
        const roles = jwtToken.roles;
        const entity = jwtToken.entity;

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;
            const headers = {
                'user-role': `${roles}`,
                'entity': `${entity}`,
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

    const postWithToken = async (url, data = {}, options = {}) => {
        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);
        const roles = jwtToken.roles;
        const entity = jwtToken.entity;

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;
            const headers = {
                'user-role': `${roles}`,
                'entity': `${entity}`,
                'Authorization': `Bearer ${jwtTokenf}`,
                'Content-Type': 'application/json'
            };

            try {
                const response = await fetch(`${Backend_BASE_URL}/${url}`, {
                    ...options,
                    method: 'POST', // Changed to POST method
                    headers,
                    body: JSON.stringify(data) // Added data to request body
                });

                // Assuming login(), logout(), and router.push() are defined elsewhere
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


    const GetUserTasks = async (Id: any) => {

        const tasks = await fetch(`http://localhost:3000/contracts/usertask/${Id}`).then(res => res.json())

        const nrOfTasks: number = tasks.length > 0 ? tasks.length : 0

        console.log(tasks, nrOfTasks)

        setNrOfTasks(nrOfTasks)

        return nrOfTasks
    }





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

    // Example usage of fetchWithToken method
    // const postData = async () => {
    //     try {
    //         // Define the URL endpoint
    //         const url = 'your-api-endpoint';

    //         // Define the data to be sent in the POST request body
    //         const data = {
    //             key1: 'value1',
    //             key2: 'value2'
    //         };

    //         // Call the fetchWithToken method with the URL and data
    //         const response = await fetchWithToken(url, data);

    //         // Log the response from the server
    //         console.log('Response from server:', response);
    //     } catch (error) {
    //         // Handle any errors that occur during the POST request
    //         console.error('Error:', error.message);
    //     }
    // };

    // // Call the postData function to initiate the POST request
    // postData();

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
        postWithToken,
        Backend_BASE_URL,
        Frontend_BASE_URL,
        userRoles,
        setUserRoles,
        isPurchasing,
        setIsPurchasing,
        nrOfTasks,
        setNrOfTasks,
        GetUserTasks
    };


    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};
