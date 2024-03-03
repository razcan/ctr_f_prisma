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
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ToggleButton } from 'primereact/togglebutton';

export default function HeaderContract({ setContractId }: any) {

    const toast = useRef(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [password, setPassword] = useState('**');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [repassword, setRePassword] = useState('**');
    const [all_roles, setAll_roles] = useState('');
    const [all_groups, setAll_groups] = useState('');
    const [selected_groups, setSelected_groups] = useState('');
    const [all_users, setAll_users] = useState([]);
    const [picturefiles, setPicturefiles] = useState<any>();
    const [AvatarUser, setAvatar] = useState('avatar-1709367075603-462599146.svg')
    const [changeAvatar, setChangeAvatar] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(0);


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

    const fetchAllgroups = async () => {
        const response = await fetch(`http://localhost:3000/nomenclatures/groups`).then(res => res.json())
        setAll_groups(response);
    }


    const deleteUser = async (file: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/nomenclatures/user/${selectedUserId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`User deleted successfully.`);
                fetchAllUserRoles()
                setVisible(false)
            } else {
                const errorMessage = await response.text();
                console.error(`Error deleting user: ${errorMessage}`);
            }
        } catch (error) {
            console.error(`Error deleting user`);
        }
    };

    const fetchUserById = async (Id) => {
        const response = await fetch(`http://localhost:3000/nomenclatures/user/${Id}`).then(res => res.json())

        setIsActive(response.status)
        setName(response.name)
        setEmail(response.email)
        setAvatar(response.picture)
        setSelected_groups(response.User_Groups)
        console.log(response.User_Groups)

        const roluri = []
        for (let i = 0; i < response.roles.length; i++) {
            roluri.push(response.roles[i].role)
        }
        setRoles(roluri)

    }

    useEffect(() => {
        fetchAllUserRoles(),
            fetchAllUsers(),
            fetchAllgroups()
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


    const onUpload = ({ files }: any) => {
        // console.log(files)
        setPicturefiles(files);
    }


    const saveUser = async () => {

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

            // let addUser: any = {
            //     "name": name,
            //     "email": email,
            //     "password": password,
            //     "status": isActive,
            //     "picture": "poza",
            //     "roles": {
            //         "create":
            //             roles1

            //     }
            // }
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

        const Groups: any = {
            "connect":
                selected_groups
        }

        const rolesString = JSON.stringify(RRoles);
        const User_Groups = JSON.stringify(Groups);


        var formdata = new FormData();

        formdata.append('name', name);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('status', isActive);
        formdata.append('avatar', picturefiles[0]);
        formdata.append('picture', "");
        formdata.append('roles', rolesString);
        formdata.append('User_Groups', User_Groups);

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
                                        fetchUserById(e.value.id)
                                    setSelectedUserId(e.value.id)

                                    setVisible(true)
                                }}>
                                <Column field="id" header="Id"></Column>
                                <Column field="name" header="Utilizator"></Column>
                                <Column field="email" header="Email"></Column>
                                <Column field="status" header="Stare"></Column>
                            </DataTable>

                        </div>

                        <Dialog header="User" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)}>
                            <div className='card'>
                                <div className="grid flex justify-content-center flex-wrap">
                                    <div>
                                        <span>
                                            <Avatar image={`http://localhost:3000/nomenclatures/download/${AvatarUser}`}
                                                size="xlarge" shape="circle" style={{ width: '16vh', height: '16vh' }} />
                                        </span>
                                    </div>

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
                                                <MultiSelect value={roles} onChange={(e) => {
                                                    setRoles(e.value)
                                                    console.log(e.value)
                                                }}
                                                    options={all_roles} optionLabel="roleName"
                                                    display="chip"
                                                    placeholder="Selecteaza Roluri" maxSelectedLabels={5} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="roles">Grup</label>
                                                <MultiSelect value={selected_groups} onChange={(e) => {
                                                    setSelected_groups(e.value)
                                                    console.log(e.value)
                                                }}
                                                    options={all_groups} optionLabel="name"
                                                    display="chip"
                                                    placeholder="Selecteaza Grupuri" maxSelectedLabels={5} />
                                            </div>

                                            <div className="field-checkbox col-12 md:col-12">
                                                <Checkbox id="active" onChange={e => setIsActive(e.checked)}
                                                    checked={isActive}
                                                ></Checkbox>
                                                <label htmlFor="active" className="ml-2">Activ</label>
                                            </div>

                                            {/* <div className="field col-12  md:col-6">
                                                <ToggleButton
                                                    onLabel="Selecteaza" offLabel="Schimba Avatar"
                                                    onIcon="pi pi-circle" offIcon="pi pi-circle-fill"
                                                    checked={changeAvatar}
                                                    onChange={(e) => setChangeAvatar(e.value)} />
                                            </div> */}

                                            {changeAvatar ?
                                                <div className="field col-12  md:col-12">

                                                    <FileUpload
                                                        accept="image/*"
                                                        multiple
                                                        mode="basic"
                                                        maxFileSize={100000000}
                                                        customUpload={true}
                                                        //uploadHandler={setPicturefiles(files)}
                                                        uploadHandler={onUpload}
                                                        auto
                                                        chooseLabel="Fotografie de profil"
                                                    />
                                                </div>
                                                : null}

                                        </div>

                                        <div className='field col-2 md:col-12'>
                                            <div className='grid'>
                                                <div className='flex flex-wrap justify-content-left gap-3'>
                                                    <Button label="Salveaza" severity="success" onClick={saveUser} />
                                                    <Button label="Sterge" severity="danger" onClick={deleteUser} />
                                                </div>
                                            </div>
                                        </div>

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