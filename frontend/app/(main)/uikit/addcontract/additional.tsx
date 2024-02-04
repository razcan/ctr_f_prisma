'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';

// numar versiune, tip act aditional, nr act aditional, data act ad, 

export default function AddContract() {

    const [selection, setSelection] = useState();

    const [data] = useState([
        {
            expanded: true,
            type: 'ctr',
            data: {
                name: 'Ctr actual',
                title: 'Nr 1'
            },
            children: [
                {
                    expanded: true,
                    type: 'ctr',
                    data: {
                        name: 'Act Aditional',
                        title: 'AA1'
                    }
                },
                {
                    expanded: true,
                    type: 'ctr',
                    data: {
                        name: 'Act Aditional',
                        title: 'AA2'
                    }
                },
                {
                    expanded: true,
                    type: 'ctr',
                    data: {
                        name: 'Act Aditional',
                        title: 'AA3'
                    }
                }
            ]
        }
    ]);

    const nodeTemplate = (node) => {
        if (node.type === 'ctr') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <span className="font-bold mb-2">{node.data.name}</span>
                        <span>{node.data.title}</span>
                    </div>
                </div>
            );
        }

        return node.label;
    };

    console.log(selection)

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    Acte aditionale
                    <OrganizationChart value={data} selectionMode="single" selection={selection}
                        onSelectionChange={(e) => {
                            setSelection(e.data)
                        }}
                        nodeTemplate={nodeTemplate} />

                    <div className="col-2 md:col-2 ">
                        <Button label="Adauga act aditional" />
                    </div>
                </div>

            </div>
        </div>


    );
}