"use client"

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation'
import { MyContext } from '../../../../../layout/context/myUserContext';
import Link from 'next/link';


const Partner = ({ executeFunction }: any) => {


    const router = useRouter()
    const [selectedPartner, setSelectedPartner] = useState('');
    const [partners, setPartners] = useState(false);
    const [checked, setChecked] = useState(false);


    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { setBreadCrumbItems } = useContext(MyContext);



    const fetchPartnersData = () => {
        fetch(`${Backend_BASE_URL}/nomenclatures/allparties`
        )
            .then(response => {
                return response.json()
            })
            .then(partners => {
                setPartners(partners)
            })
    }

    useEffect(() => {
        fetchPartnersData();

        setBreadCrumbItems(
            [{
                label: 'Acasa',
                template: () => <Link href="/">Acasa</Link>
            },
            {
                label: 'Nomenclatoare',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups`
                    return (
                        <Link href={url}>Nomenclatoare</Link>
                    )

                }
            },
            {
                label: 'Parteneri',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/lookups/partner`
                    return (
                        <Link href={url}>Parteneri</Link>
                    )

                }
            },

            ]
        )


    }, [])


    const toast = useRef<undefined | null | any>(null);

    const showSuccess = (message: any) => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
        }
    }

    const showError = (message: any) => {
        if (toast.current) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    }

    const gotoSelectedPartner = (partner: any) => {
        setSelectedPartner(partner)
        router.push(`/uikit/lookups/partnerdetails/page?partnerid=${partner.id}`);
    }

    const addPartner = () => {
        router.push(`/uikit/lookups/addpartner`)
    }


    return (

        <div className="grid">
            <div className="col-12">
                <div className="card">


                    <div className="field col-12  md:col-12">
                        <div><Button label="Adauga" onClick={addPartner} /></div>

                        <DataTable className='pt-2' value={partners} selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                            selection={selectedPartner} onSelectionChange={(e) => { gotoSelectedPartner(e.value) }}>
                            <Column field="name" header="Nume"></Column>
                            <Column field="fiscal_code" header="Cod Fiscal"></Column>
                            <Column field="commercial_reg" header="Nr. reg. Comertului"></Column>
                            <Column field="type" header="Tip"></Column>
                            <Column field="state" header="Stare"></Column>
                        </DataTable>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default Partner;


//     header={
//     <Button icon="pi pi-plus" rounded outlined severity="success" size="small" aria-label="Adauga" />
// }