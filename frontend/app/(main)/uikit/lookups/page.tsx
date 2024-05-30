"use client"

import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';  // alege tema dorita
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const App = () => {
    return (
        <div className="p-d-flex p-flex-column" style={{ height: '100vh' }}>
            <header className="p-flex-none" style={{ height: '10%', backgroundColor: '#007ad9', color: 'white' }}>
                <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
                    <h1>Header</h1>
                </div>
            </header>
            <main className="p-flex-grow-1" style={{ height: '70%', backgroundColor: '#e0e0e0' }}>
                <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
                    <h2>Content</h2>
                </div>
            </main>
            <footer className="p-flex-none" style={{ height: '5%', backgroundColor: '#007ad9', color: 'white' }}>
                <div className="p-d-flex p-ai-center p-jc-center" style={{ height: '100%' }}>
                    <h3>Footer</h3>
                </div>
            </footer>
        </div>
    );
};

export default App;

// import React, { useState } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Paginator } from 'primereact/paginator';
// import 'primereact/resources/themes/saga-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import './App.css';

// const App = () => {
//     const allProducts = [
//         { id: 1, name: 'Product A', price: 100 },
//         { id: 2, name: 'Product B', price: 200 },
//         { id: 3, name: 'Product C', price: 300 },
//         { id: 4, name: 'Product D', price: 400 },
//         { id: 5, name: 'Product E', price: 500 },
//         { id: 6, name: 'Product F', price: 600 },
//         { id: 7, name: 'Product G', price: 700 },
//         { id: 8, name: 'Product H', price: 800 },
//         { id: 9, name: 'Product I', price: 900 },
//         { id: 1, name: 'Product A', price: 100 },
//         { id: 2, name: 'Product B', price: 200 },
//         { id: 3, name: 'Product C', price: 300 },
//         { id: 4, name: 'Product D', price: 400 },
//         { id: 5, name: 'Product E', price: 500 },
//         { id: 6, name: 'Product F', price: 600 },
//         { id: 7, name: 'Product G', price: 700 },
//         { id: 8, name: 'Product H', price: 800 },
//         { id: 9, name: 'Product I', price: 900 },
//         { id: 1, name: 'Product A', price: 100 },
//         { id: 2, name: 'Product B', price: 200 },
//         { id: 3, name: 'Product C', price: 300 },
//         { id: 4, name: 'Product D', price: 400 },
//         { id: 5, name: 'Product E', price: 500 },
//         { id: 6, name: 'Product F', price: 600 },
//         { id: 7, name: 'Product G', price: 700 },
//         { id: 8, name: 'Product H', price: 800 },
//         { id: 9, name: 'Product I', price: 900 },
//         { id: 1, name: 'Product A', price: 100 },
//         { id: 2, name: 'Product B', price: 200 },
//         { id: 3, name: 'Product C', price: 300 },
//         { id: 4, name: 'Product D', price: 400 },
//         { id: 5, name: 'Product E', price: 500 },
//         { id: 6, name: 'Product F', price: 600 },
//         { id: 7, name: 'Product G', price: 700 },
//         { id: 8, name: 'Product H', price: 800 },
//         { id: 9, name: 'Product I', price: 900 },
//         { id: 10, name: 'Product J', price: 1000 },
//         // Adaugă mai multe produse după necesități
//     ];

//     const [products, setProducts] = useState(allProducts.slice(0, 10));
//     const [first, setFirst] = useState(0);
//     const [rows, setRows] = useState(12);

//     const onPageChange = (event) => {
//         setFirst(event.first);
//         setRows(event.rows);
//         const newProducts = allProducts.slice(event.first, event.first + event.rows);
//         setProducts(newProducts);
//     };

//     return (
//         <div className="app-container">
//             {/* <div className="header">Header-ul Tabelului</div> */}
//             {/* <div className='card'> */}
//             <div className="card datatable-container">
//                 <DataTable value={products} className="datatable-fullscreen">
//                     <Column field="id" header="ID"></Column>
//                     <Column field="name" header="Name"></Column>
//                     <Column field="price" header="Price"></Column>
//                 </DataTable>
//             </div>
//             {/* </div> */}
//             <div className="footer">
//                 <Paginator
//                     first={first}
//                     rows={rows}
//                     totalRecords={allProducts.length}
//                     onPageChange={onPageChange}
//                     rowsPerPageOptions={[5, 10, 20]}
//                 />
//             </div>
//         </div>
//     );
// };

// export default App;
