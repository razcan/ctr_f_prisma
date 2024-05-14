// 'use client';

import { Metadata } from 'next';
import Layout from '../../layout/layout';
import React, { useContext, useEffect, useState } from 'react';
import { useData, DataProvider } from '../../AppContext'


interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Contracts',
    description: 'SHB',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Contracts',
        description: 'SHB',
        ttl: 604800
    },
    icons: {
        // icon: '/favicon.ico'
        icon: '../shb.ico'
    }
};

// /Users/razvanmustata / Projects / contracts / frontend / public / layout / images / shb.ico

export default function AppLayout({ children }: AppLayoutProps) {

    // const { value, updateValue } = useData();


    return <Layout>{children}</Layout>;
}
