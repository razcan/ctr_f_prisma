"use client"

import React, { useState } from 'react';
import { Editor } from "primereact/editor";
import { Column } from 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { Button } from 'react-native';
import header from '../../uikit/addcontract/[addcontract]/header';

const EmptyPage = () => {
    const [text, setText] = useState('');
    return (
        <div className="grid">
            {/* <Toast ref={toast} position="top-right" /> */}
            <div className="col-12">
                <div className="card">
                    <div className="p-d-flex p-flex-column" style={{ height: '80vh' }}>
                        <header className="p-flex-none" style={{ height: '10%' }}>
                            <div className="p-d-flex p-ai-center p-jc-center"
                                style={{ height: '100%' }}>

                            </div>
                        </header>
                        <main className="p-flex-grow-1" style={{
                            height: '80%', overflow: 'auto'
                        }}>
                            <div className="p-d-flex p-ai-center p-jc-center" style={{ minHeight: '100%' }}>




                            </div>
                        </main>
                        <footer className="p-flex-none" style={{ height: '10%' }}>
                            {/* <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
                                <Paginator
                                    first={first}
                                    rows={rows}
                                    totalRecords={data.length}
                                    onPageChange={onPageChange}
                                    rowsPerPageOptions={[12, 24, 50]}
                                />
                            </div> */}
                        </footer>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default EmptyPage;


// <div className="p-d-flex p-flex-column" style={{ height: '100vh' }}>
//     <header className="p-flex-none" style={{ height: '20%', backgroundColor: '#007ad9', color: 'white' }}>
//         <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
//             <h1>Header</h1>
//         </div>
//     </header>
//     <main className="p-flex-grow-1" style={{ height: '60%', backgroundColor: '#e0e0e0', overflow: 'auto' }}>
//         <div className="p-d-flex p-ai-center p-jc-center" style={{ minHeight: '100%' }}>
//             <h2>Content</h2>
//         </div>
//     </main>
//     <footer className="p-flex-none" style={{ height: '20%', backgroundColor: '#007ad9', color: 'white' }}>
//         <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
//             <h3>Footer</h3>
//         </div>
//     </footer>
// </div>



// <div className="grid">
//     <div className="col-12">
//         <div className="card">
//             <div className="p-d-flex p-flex-column" style={{ height: '80vh' }}>
//                 <header className="p-flex-none" style={{ height: '20%', backgroundColor: '#007ad9', color: 'white' }}>
//                     <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
//                         <h1>Header</h1>
//                     </div>
//                 </header>
//                 <main className="p-flex-grow-1" style={{ height: '70%', backgroundColor: '#e0e0e0' }}>
//                     <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
//                         <h2>Content</h2>
//                     </div>
//                 </main>
//                 <footer className="p-flex-none" style={{ height: '10%', backgroundColor: '#007ad9', color: 'white' }}>
//                     <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
//                         <h3>Footer</h3>
//                     </div>
//                 </footer>
//             </div>

//         </div>
//     </div>
// </div>
