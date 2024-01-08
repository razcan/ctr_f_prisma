"use client"

import React, { useState } from 'react';

const EmptyPage = () => {
    const [text, setText] = useState('');
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Empty Page</h5>
                   
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
