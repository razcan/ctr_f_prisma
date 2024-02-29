'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'jspdf-autotable';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { text } from 'stream/consumers';
import { Password } from 'primereact/password';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import axios from 'axios';

export default function HeaderContract({ setContractId }: any) {

    const toast = useRef(null);
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [repassword, setRePassword] = useState('');
    const [all_roles, setAll_roles] = useState('');
    const [myBankArray, setMyBankArray] = useState<[]>([]);


    // const all_roles = [
    //     { name: 'Administrare' },
    //     { name: 'Citire' },
    //     { name: 'Solicitare' },
    //     { name: 'Scriere' },
    // ];

    const show = () => {
        toast.current.show({ severity: 'error', summary: 'Eroare', detail: 'Nu a putut fi confirmata parola', life: 3000 });
    };

    const fetchAllUserRoles = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/roles`).then(res => res.json())
        setAll_roles(response);
    }

    useEffect(() => {
        fetchAllUserRoles()
    }, [])

    const AddUser = () => {
        setVisible(true)
    }

    interface User {
        status: boolean,
        password: String,
        name: String,
        email: String,
        roles: String[]
    }

    const saveUser = async () => {

        const roleIds: any = []

        // console.log(roles)

        for (let i = 0; i < roles.length; i++) {
            roleIds.push(roles[i].id)
        }
        // console.log("roleIds", roleIds)

        // // Map the array of role IDs to an array of objects in the desired format
        const roles1 = roleIds.map(id => ({
            role: {
                connect: {
                    id: id
                }
            }
        }));

        // console.log("roles1", roles1)

        // // Construct the final object with the "create" property containing the array of roles
        const json = {
            roles: {
                create: roles1
            }
        };

        const jsonString = JSON.stringify(json, null, 2); // null and 2 are optional parameters for indentation


        console.log(jsonString)

        if (password !== repassword) {
            show()
        } else {



            let addUser: any = {
                "name": name,
                "email": email,
                "password": password,
                "status": isActive,
                "picture": "https://example.com/profile.jpg",
                "roles": {
                    "create": [
                        json
                    ]
                }
            }

            console.log(addUser)
            try {
                const response = await axios.post('http://localhost:3000/nomenclatures/users',
                    addUser
                );
                console.log('User added:', response.data);
            } catch (error) {
                console.error('Error creating user:', error);
            }

            //     setVisible(false)
            //     // console.log(isActive, password, name, email, roles)

            // {
            //     "name": "John Doe",
            //         "email": "john@example.com",
            //             "password": "hashedPassword123",
            //                 "status": true,
            //                     "picture": "https://example.com/profile.jpg",
            //                         "roles": {
            //         "create": [
            //             {
            //                 "role": {
            //                     "connect": {
            //                         "id": 1 // ID-ul rolului asociat
            //                     }
            //                 }
            //             },
            //             {
            //                 "role": {
            //                     "connect": {
            //                         "id": 2 // ID-ul altui rol asociat
            //                     }
            //                 }
            //             }
            //         ]
            //     }
            // }
        }

    }



    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    Utilizatori
                    <div className="p-fluid formgrid grid p-3">

                        <div className="field col-12  md:col-2">
                            <Button label="Adauga" onClick={AddUser} />
                        </div>


                        <div className="field col-12">
                            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}
                                selectionMode="single" selection={selectedUser}
                                onSelectionChange={(e) => {
                                    setSelectedUser(e.value),
                                        setVisible(true)
                                }}>
                                <Column field="id" header="Id"></Column>
                                <Column field="name" header="Utilizator"></Column>
                                <Column field="email" header="Email"></Column>
                                <Column field="status" header="Stare"></Column>
                            </DataTable>

                        </div>

                        <Dialog header="Adauga User" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)}>
                            <div className='card'>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">
                                            <Toast ref={toast} />
                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="nume">Utilizator</label>
                                                <InputText id="nume" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                                {/* va fi spre ex Expirare Contract  si nu poate fi modificata*/}
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="email">Email</label>
                                                <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="password">Parola</label>
                                                <Password value={password} onChange={(e) => setPassword(e.target.value)} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="repassword">Confirmare Parola</label>
                                                <Password value={repassword} onChange={(e) => setRePassword(e.target.value)} />
                                            </div>


                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="roles">Rol</label>
                                                {/* <InputText id="roles" type="text" value={roles} onChange={(e) => setRoles(e.target.value)} /> */}

                                                <MultiSelect value={roles} onChange={(e) => setRoles(e.value)} options={all_roles} optionLabel="roleName"
                                                    placeholder="Selecteaza Roluri" maxSelectedLabels={5} />

                                            </div>

                                            <div className="field-checkbox col-12 md:col-6">
                                                <Checkbox id="active" onChange={e => setIsActive(e.checked)}
                                                    checked={isActive}
                                                ></Checkbox>
                                                <label htmlFor="active" className="ml-2">Activ</label>
                                            </div>

                                        </div>


                                        <Button className="pr-2" label="Salveaza" onClick={saveUser} />

                                        <Button className="pl-2" label="Sterge" severity="danger" />


                                    </div>
                                </div>
                            </div>
                        </Dialog>

                    </div>
                </div>
            </div>
        </div>
    );
};
