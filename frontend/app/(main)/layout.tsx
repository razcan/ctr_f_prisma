// 'use client';

import { Metadata } from 'next';
import Layout from '../../layout/layout';
import React, { useContext, useEffect, useState } from 'react';
import { useData, DataProvider } from '../../AppContext'
import Head from 'next/head';


interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'ContractsHub',
    description: 'SHB',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'ContractHub',
        description: 'SHB',
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};


export default function AppLayout({ children }: AppLayoutProps) {

    // const { value, updateValue } = useData();


    return (
        <>
            <Head>
                <title>My Page</title>
                <link rel="icon" href="/public/layout/images/banner-primeblocks-dark.png" />
            </Head>
            <Layout>{children}</Layout>
        </>
    );

    // return <Layout>{children}</Layout>;
}
