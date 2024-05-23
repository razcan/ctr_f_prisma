
import { LayoutProvider } from '../layout/context/layoutcontext';
import React, { useContext } from 'react';
import { UserContext, UserContextProvider } from '../layout/context/appcontext'
import { MyContext, MyProvider } from '../layout/context/myUserContext'



import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { FilterMatchMode, PrimeReactProvider } from 'primereact/api';
import { PrimeReactContext } from 'primereact/api';
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

  // const valuex = {
  //   filterMatchMode: {
  //     text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
  //     numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
  //     date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  //   },
  // };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <link id="theme-css" href={`/themes/lara-dark-indigo/theme.css`} rel="stylesheet"></link> */}
        {/* <link id="theme-css" href={`/themes/bootstrap4-dark-blue/theme.css`} rel="stylesheet"></link> */}
        {/* <link id="theme-css" href={`/themes/soho-dark/theme.css`} rel="stylesheet"></link> */}
        <link id="theme-css" href={`/themes/bootstrap4/theme.css`} rel="stylesheet"></link>

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
