'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
import { FileUpload } from 'primereact/fileupload';

export default function HeaderContract({ setContractId }: any) {

    const toast = useRef(null);
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [isActive, setIsActive] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [repassword, setRePassword] = useState('');
    const [all_roles, setAll_roles] = useState('');
    const [myBankArray, setMyBankArray] = useState<[]>([]);
    const [all_users, setAll_users] = useState([]);
    const [picturefiles, setPicturefiles] = useState<any>();

    const show = () => {
        toast.current.show({ severity: 'error', summary: 'Eroare', detail: 'Nu a putut fi confirmata parola', life: 3000 });
    };

    const fetchAllUserRoles = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/roles`).then(res => res.json())
        setAll_roles(response);
    }

    const fetchAllUsers = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/users`).then(res => res.json())
        setAll_users(response);
    }

    useEffect(() => {
        fetchAllUserRoles(),
            fetchAllUsers()
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


    const url_link = `http://localhost:3000/nomenclatures/users}`


    const onUpload = ({ files }: any) => {
        console.log(files)
        setPicturefiles(files);
    }


    const saveUser = async () => {

        // onUpload(picturefiles);

        console.log("kk", picturefiles[0])

        // const roleIds: any = []
        const roleIds: number[] = [];

        for (let i = 0; i < roles.length; i++) {
            roleIds.push(roles[i].id)
        }

        const roles1 = roleIds.map(id => ({
            role: {
                connect: {
                    id: id
                }
            }
        }));

        if (password !== repassword) {
            show()
        } else {

            let addUser: any = {
                "name": name,
                "email": email,
                "password": password,
                "status": isActive,
                "picture": "poza",
                "roles": {
                    "create":
                        roles1

                }
            }
            //   console.log(addUser)
            // formdata.append('picture', picturefiles[0]);

            // try {
            //     const response = await axios.post('http://localhost:3000/nomenclatures/users',
            //         addUser
            //     );
            //     fetchAllUsers()
            //     setVisible(false)
            //     console.log('User added:', response.data);
            // } catch (error) {
            //     console.error('Error creating user:', error);
            // }
        }

        const RRoles: any = {
            "create":
                roles1
        }

        const rolesString = JSON.stringify(RRoles);


        var formdata = new FormData();

        formdata.append('name', name);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('status', isActive);
        formdata.append('avatar', picturefiles[0]);
        formdata.append('picture', "");
        formdata.append('roles', rolesString);
        // formdata.append('json', rolesString)

        // Display the key/value pairs
        // for (var pair of formdata.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        var requestOptions: any = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/nomenclatures/users", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                fetchAllUsers()
                setVisible(false)

            }
            )
            .catch(error => {
                console.log('error', error)
            });


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
                            <DataTable value={all_users} tableStyle={{ minWidth: '50rem' }}
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

                                            <Toast ref={toast}></Toast>
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
                                                <Password value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="repassword">Confirmare Parola</label>
                                                <Password value={repassword} feedback={false} onChange={(e) => setRePassword(e.target.value)} />
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

                                            <div className="field col-12  md:col-12">
                                                {/* 
                                                <FileUpload mode="basic"
                                                    url={url_link} accept="image/*"
                                                    maxFileSize={10000000} onUpload={onUpload}
                                                    auto chooseLabel="Avatar" /> */}

                                                <FileUpload
                                                    accept="image/*"
                                                    multiple
                                                    // mode="basic"
                                                    maxFileSize={1000000}
                                                    customUpload={true}
                                                    //uploadHandler={setPicturefiles(files)}
                                                    uploadHandler={onUpload}
                                                    auto
                                                    chooseLabel="Avatar"
                                                />
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


// {
//     "name": "John Doe",
//         "email": "john@example.com",
//             "password": "hashedPassword123",
//                 "status": true,
//                     "picture": "https://example.com/profile.jpg",
//                         "roles": {
// "create": [
//     {
//         "role": {
//             "connect": {
//                 "id": 1 // ID-ul rolului asociat
//             }
//         }
//     },
//     {
//         "role": {
//             "connect": {
//                 "id": 2 // ID-ul altui rol asociat
//             }
//         }
//     }
// ]
//     }
// }