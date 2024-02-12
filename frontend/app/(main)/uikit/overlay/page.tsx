'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import type { Demo } from '@/types';

type ButtonEvent = React.MouseEvent<HTMLButtonElement>;
const OverlayDemo = () => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [visibleRight, setVisibleRight] = useState(false);
    const [visibleTop, setVisibleTop] = useState(false);
    const [visibleBottom, setVisibleBottom] = useState(false);
    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Demo.Product | null>(null);
    const op = useRef<OverlayPanel>(null);
    const op2 = useRef<OverlayPanel>(null);
    const toast = useRef<Toast>(null);

    const accept = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'You have accepted',
            life: 3000
        });
    };

    const reject = () => {
        toast.current?.show({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000
        });
    };

    const confirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        });
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    const toggle = (event: ButtonEvent) => {
        op.current?.toggle(event);
    };

    const toggleDataTable = (event: ButtonEvent) => {
        op2.current?.toggle(event);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const onProductSelect = (event: DataTableSelectEvent) => {
        op2.current?.hide();
        toast.current?.show({
            severity: 'info',
            summary: 'Product Selected',
            detail: event.data.name,
            life: 3000
        });
    };

    const onSelectionChange = (e: any): void => {
        setSelectedProduct(e.value as Demo.Product);
    };

    const basicDialogFooter = <Button type="button" label="OK" onClick={() => setDisplayBasic(false)} icon="pi pi-check" outlined />;
    const imageBodyTemplate = (data: Demo.Product) => (
        <img
            src={`/demo/images/product/${data.image}`}
            alt={data.image}
            className="product-image"
            width="60"
            style={{
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            }}
        />
    );
    const priceBodyTemplate = (data: Demo.Product) => formatCurrency(data.price ?? 0);
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} text />
            <Button type="button" label="Yes" icon="pi pi-check" onClick={() => setDisplayConfirmation(false)} text autoFocus />
        </>
    );

    return (
        <>

        </>
    );
};

export default OverlayDemo;
