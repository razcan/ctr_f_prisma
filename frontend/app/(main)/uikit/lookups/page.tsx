"use client"

import React, { useState } from 'react';
import { Editor } from "primereact/editor";

const EmptyPage = () => {
    const [text, setText] = useState('');
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Nomenclatoare</h5>

                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
