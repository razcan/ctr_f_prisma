"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from '@tanstack/react-query'

const queryClient = new QueryClient();

const ContractListPage =  () => {

 const [text, setText] = useState('');
 const [contracts, setContracts] = useState([]);

//  const getdata = ()=> {
//     const headers = {
//         'Content-Type': 'application/json', // Example content type
//         'Access-Control-Allow-Origin': '*', // Specify your allowed origin
//       };

//   axios.get('http://localhost:3000/contracts'
//   , { headers }
//   )
//   .then(response => {
//     // Handle the successful response
//     setContracts(response.data);
//     console.log('Response:', response.data);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('Error:', error);
//   })
// };

    return (
        <QueryClientProvider client={queryClient}>
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Empty Page x</h5>
                    <Users />   
                </div>
            </div>
        </div>
        </QueryClientProvider>
    );
};

function Users() {
    // 👇️ can use the useQuery hook here
    const {isLoading, error, data} = useQuery({
      queryKey: ['usersData'],
      queryFn: () =>
        fetch('http://localhost:3000/contracts').then(res => res.json()),
    });
  
    if (isLoading) return 'Loading...';
  
    if (error) return 'An error has occurred: ' + error.message;
  
    return (
      <div>

                <DataTable value={data} stripedRows tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="id"></Column>
                        <Column field="number" header="number"></Column>
                        <Column field="partner" header="partner"></Column>
                        <Column field="status" header="status"></Column>
                        <Column field="remarks" header="remarks"></Column>
                    </DataTable>
      </div>
    );
  }

export default ContractListPage;
