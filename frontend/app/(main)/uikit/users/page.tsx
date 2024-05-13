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
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ToggleButton } from 'primereact/togglebutton';
import { MyContext, MyProvider } from '../../../../layout/context/myUserContext'
import axios, { AxiosRequestConfig } from 'axios';
import { Tag } from 'primereact/tag';
import Link from 'next/link';




export default function HeaderContract({ setContractId }: any) {


    const toast = useRef(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [isActive, setIsActive] = useState('');
    const [password, setPassword] = useState('**');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState([]);
    const [repassword, setRePassword] = useState('**');
    const [all_roles, setAll_roles] = useState([]);
    const [all_users, setAll_users] = useState([]);
    const [picturefiles, setPicturefiles] = useState<any>();
    const [AvatarUser, setAvatar] = useState('default.jpeg')
    const [changeAvatar, setChangeAvatar] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(0);
    const [all_groups, setAll_groups] = useState([]);
    const [selected_groups, setSelected_groups] = useState([]);


    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();

    const { BreadCrumbItems, setBreadCrumbItems } = useContext(MyContext);

    useEffect(() => {

        // if (!userId) {
        //     router.push(`${Frontend_BASE_URL}/auth/login`);
        // };

        setBreadCrumbItems(
            [{
                label: 'Home',
                template: () => <Link href="/">Home</Link>
            },
            {
                label: 'Utilizatori',
                template: () => {
                    const url = `${Frontend_BASE_URL}/uikit/users`
                    return (
                        <Link href={url}>Utilizatori</Link>
                    )

                }
            }]
        );

    }, [])


    // console.log("din users", userRoles);

    const fetchAllgroups = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/groups`).then(res => res.json())
        setAll_groups(response);
    }


    const show = () => {
        toast.current.show({ severity: 'error', summary: 'Eroare', detail: 'Nu a putut fi confirmata parola', life: 3000 });
    };

    const fetchAllUserRoles = async () => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/roles`).then(res => res.json())
        setAll_roles(response);
    }


    const fetchAllUsers = async () => {

        const session = sessionStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/nomenclatures/users`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    setAll_users(response.data);
                })
                .catch(function (error) {
                    // if (response.status === 401) {
                    // }
                    setAll_users([]);
                    router.push(`${Frontend_BASE_URL}/auth/login`)

                    console.log(error);
                });
        }
    }


    const deleteUser = async (file: string): Promise<void> => {
        try {
            const response = await fetch(`${Backend_BASE_URL}/nomenclatures/user/${selectedUserId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`User deleted successfully.`);
                fetchAllUserRoles()
                setVisible(false)
                fetchAllUsers()
            } else {
                const errorMessage = await response.text();
                console.error(`Error deleting user: ${errorMessage}`);
            }
        } catch (error) {
            console.error(`Error deleting user`);
        }
    };

    const fetchUserById = async (Id) => {
        const response = await fetch(`${Backend_BASE_URL}/nomenclatures/user/${Id}`).then(res => res.json())

        setIsActive(response.status)
        setName(response.name)
        setEmail(response.email)
        setSelected_groups(response.User_Groups)
        if (response.picture == '') {
            setAvatar('default.jpg')
        } else {
            setAvatar(response.picture)
        }


        const roluri = []
        for (let i = 0; i < response.roles.length; i++) {
            // console.log('kkmk', response.roles[i].role)
            roluri.push(response.roles[i].role)
        }
        setRoles(roluri)

        //console.log("aaa", response.User_Groups[0])

        interface Groups {
            createdAt: Date,
            description: String,
            id: Number,
            name: String,
            updateadAt: Date
        }

        const grupuri: Groups[] = []
        for (let i = 0; i < response.User_Groups.length; i++) {
            const res = {
                createdAt: response.User_Groups[i].createdAt,
                description: response.User_Groups[i].description,
                id: response.User_Groups[i].id,
                name: response.User_Groups[i].name,
                updateadAt: response.User_Groups[i].updateadAt
            }
            grupuri.push(res)
        }
        setSelected_groups(grupuri)
        // console.log("bbb", grupuri)
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


        if (selectedUserId == 0) {

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
                //patch
            } else {

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
                formdata.append('avatar', picturefiles?.length > 0 ? picturefiles[0] : "default.jpeg");
                formdata.append('picture', "");
                formdata.append('roles', rolesString);
                formdata.append('User_Groups', User_Groups);

                var requestOptions: any = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };

                fetch(`${Backend_BASE_URL}/nomenclatures/users`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        // console.log(result)
                        fetchAllUsers()
                        setVisible(false)

                    }
                    )
                    .catch(error => {
                        console.log('error', error)
                    });
            }
        }
        else {

            const roleIds: number[] = [];
            for (let i = 0; i < roles.length; i++) {
                roleIds.push(roles[i].id)
            }

            const rells: string = roleIds
            const roles1 = roleIds.map(id => (
                {
                    id: id
                }
            ));

            if (password !== repassword) {
                show()
            } else {

                const RRoles: any = {
                    "set":
                        roles1
                }

                const Groups: any = {
                    "connect":
                        selected_groups
                }

                const group_array: string[] = []
                for (let i = 0; i < selected_groups.length; i++) {
                    if (selected_groups[i]) {
                        group_array.push(selected_groups[i].id)
                    }
                }


                const rolesString = JSON.stringify(RRoles);

                const User_Groups = JSON.stringify(Groups);

                var formdata = new FormData();

                formdata.append('name', name);
                formdata.append('email', email);
                formdata.append('password', password);
                formdata.append('status', isActive);
                formdata.append('avatar', picturefiles?.length > 0 ? picturefiles[0] : "default.jpeg");
                formdata.append('picture', "");
                formdata.append('roles', rells);
                formdata.append('User_Groups', group_array);

                var requestOptions: any = {
                    method: 'PATCH',
                    body: formdata,
                    redirect: 'follow'
                };
                fetch(`${Backend_BASE_URL}/nomenclatures/user/${selectedUserId}`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        fetchAllUsers()
                        setVisible(false)
                    }
                    )
                    .catch(error => {
                        console.log('error', error)
                    });

            }
        }
    }
    const statusTemplate = (item) => {
        return <Tag value={item.status} severity={getSeverity(item.status)}></Tag>;
    };

    const getSeverity = (item) => {
        switch (item) {
            case true:
                return 'success';

            case false:
                return 'danger';

            default:
                return null;
        }
    }


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid p-3">

                        <div className="field col-12  md:col-2">
                            <Button label="Adauga" onClick={AddUser} />
                        </div>


                        <div className="field col-12">
                            <DataTable value={all_users} tableStyle={{ minWidth: '50rem' }}
                                selectionMode="single" selection={selectedUser}
                                onSelectionChange={(e) => {
                                    setSelectedUser(e.value);
                                    fetchUserById(e.value.id);
                                    setSelectedUserId(e.value.id);

                                    setVisible(true)
                                }}>
                                <Column field="id" header="Id"></Column>
                                <Column field="name" header="Utilizator"></Column>
                                <Column field="email" header="Email"></Column>
                                {/* <Column field="status" header="Stare"></Column> */}
                                <Column field="status" header="Activ" body={statusTemplate} style={{ width: '5vh' }} ></Column>
                            </DataTable>

                        </div>

                        <Dialog header="Adauga User" visible={visible} style={{ width: '30vw' }} onHide={
                            () => {
                                setVisible(false)
                                setSelectedUser([])
                                setName('')
                                setEmail('')
                                setPassword('')
                                setRePassword('')
                                setRoles([])
                                setSelected_groups([])
                                setAvatar('default.jpeg')
                                // setIsActive(false)
                            }}>
                            <div className='card'>
                                <div className="grid flex justify-content-center flex-wrap">
                                    <div>
                                        <span>
                                            <Avatar image={`${Backend_BASE_URL}/nomenclatures/download/${AvatarUser}`}
                                                size="xlarge" shape="circle" style={{ width: '16vh', height: '16vh' }} />
                                        </span>
                                    </div>

                                    <div className="col-12">
                                        <div className="p-fluid formgrid grid pt-2">

                                            <Toast ref={toast}></Toast>


                                            {/* <div>{selectedUserId}</div> */}
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

                                                }}
                                                    options={all_roles} optionLabel="roleName"
                                                    display="chip"
                                                    placeholder="Selecteaza Roluri" maxSelectedLabels={5} />
                                            </div>

                                            <div className="field col-12  md:col-12">
                                                <label htmlFor="roles">Grup</label>
                                                <MultiSelect value={selected_groups} onChange={(e) => {
                                                    setSelected_groups(e.value)

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

                                            {/* {changeAvatar ? */}
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
                                                    chooseLabel="Imagine profil"
                                                />
                                            </div>
                                            {/* : null} */}

                                        </div>

                                        <div className='pt-4'>
                                            <div className='grid'>
                                                <div className='col-3 '>
                                                    <Button label="Salveaza" severity="success" onClick={saveUser} />
                                                </div>

                                                <div className='col-3 '>
                                                    <Button label="Sterge" severity="danger" onClick={deleteUser} />
                                                </div>

                                            </div>
                                        </div>


                                        {/* <Button className="pr-2" label="Salveaza" onClick={saveUser} />

                                        <Button className="pl-2" label="Sterge" severity="danger" onClick={deleteUser} />
 */}

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