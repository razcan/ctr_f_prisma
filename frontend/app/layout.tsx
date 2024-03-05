
import { LayoutProvider } from '../layout/context/layoutcontext';
import React, { createContext, useState, useContext } from 'react';
import { UserContext, UserContextProvider } from '../layout/context/appcontext'
import { MyContext, MyProvider } from '../layout/context/myUserContext'



import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss'
import '../styles/demo/Demos.scss';

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] })
const useMyContext = () => useContext(MyContext);

// const { userId, updateUser } = useData();
// const { value, updateValue } = useData();

export const metadata: Metadata = {
  title: 'CONTRACTS',
  description: 'SHB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link id="theme-css" href={`/themes/lara-dark-indigo/theme.css`} rel="stylesheet"></link>
        {/* <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link> */}
      </head>
      <body>
        <MyProvider>
          <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </PrimeReactProvider>
        </MyProvider>
      </body>
    </html>
  )
}
