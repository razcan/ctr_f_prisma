
// import { LayoutContext, LayoutProvider } from '../layout/context/layoutcontext';

// "use client"

import React, { useContext } from 'react';
import { UserContext, UserContextProvider } from '../layout/context/appcontext'
import { MyContext, MyProvider } from '../layout/context/myUserContext'
import { LayoutContext, LayoutProvider } from '../layout/context/layoutcontext'
// import { DynamicHead } from './(main)/uikit/DynamicHead'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FilterMatchMode, PrimeReactProvider } from 'primereact/api';
import { PrimeReactContext } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss'
import '../styles/demo/Demos.scss';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] })



// const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
// const { setRipple, changeTheme } = useContext(PrimeReactContext);

export const metadata: Metadata = {
  title: 'CONTRACTS',
  description: 'SHB',
}

// const useMyContext = () => useContext(MyContext);
// const {
//   theme, setTheme
// } = useMyContext();

// console.log(theme, "them from layout")



export default function RootLayout(
  { children, }: {
    children: React.ReactNode
  }) {

  // const { theme } = useContext(MyContext);

  return (
    <html lang="en" suppressHydrationWarning>
      {/* <DynamicHead /> */}
      <head>
        {/* <link id="theme-css" href={`/themes/new/bootstrap_blue/theme.css`} rel="stylesheet"></link> */}
        {/* <link id="theme-css" href={`/themes/new/bootstrap_purple/theme.css`} rel="stylesheet"></link> */}
        <link id="theme-css" href={`/themes/new/lara_green/theme.css`} rel="stylesheet"></link>
        {/* <link id="theme-css" href={`/themes/new/lara_indigo/theme.css`} rel="stylesheet"></link> */}
        {/* <link id="theme-css" href={`/themes/new/lara_purple/theme.css`} rel="stylesheet"></link> */}
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
