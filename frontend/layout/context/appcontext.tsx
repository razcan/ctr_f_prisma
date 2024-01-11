'use client';
import React, { useState, createContext } from 'react';
import { LayoutState, LayoutConfig, LayoutContextProps } from '@/types';
import { string } from "prop-types";
import { ChildContainerProps, MenuContextProps } from '@/types';


export type ThemeContextType = "light" | "dark" | "blue";

export const ThemeContext = createContext<ThemeContextType>("light");

export type AuthUser = {
    email: string;
    name: string;
}

export type UserContextType = {
    user: any;
    setUser: any;
}

type UserContextProviderType = {
    children: React.ReactNode
}

export const UserContext = createContext({} as UserContextType)

export const UserContextProvider = ({ children }: UserContextProviderType) => {

    const [user, setUser] = useState<AuthUser | null>(null);

    return (
        <UserContext.Provider value={user, setUser}>
            {children}
        </UserContext.Provider>
    )

}


