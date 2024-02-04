'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from 'primereact/editor';
import axios from 'axios';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import { ProgressSpinner } from 'primereact/progressspinner';
import { OrganizationChart } from 'primereact/organizationchart';


export default function Financial() {

    //header
    // obiect contract (de adaug unitati de masura), 
    //valoare ctr, valoare lunara ctr, Valuta, Curs Valutar, Modalitate Plata/Incasare, Interval facturare, Interval facturare(saptamanal, lunar,trimestrial,semestrail,bilunar,anual,etape), 
    //detalii
    //Cantitate facturata, Zi factura, 
    //Nr zile scadente, Procent penalitate pe zi, Scadentar - Import - Generare / Facturi - Import Adaugare template, prel automata cc ch
    //nr ctr alg automat - bifa - id - sau o tabela aux
    // milestone de facturare
    //scrisoare garantie bncara - valoare , nr ,data ,  observatii

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    Financiar

                </div>
            </div>
        </div>


    );
}