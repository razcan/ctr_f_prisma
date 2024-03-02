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
import { _descriptors } from 'chart.js/helpers';

export default function UserGroup() {

    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [entity, setEntity] = useState([]);
    const [selectedEntities, setselectedEntities] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);

    const fetchEntity = () => {
        fetch("http://localhost:3000/nomenclatures/entity")
            .then(response => {
                return response.json()
            })
            .then(entity => {
                setEntity(entity)

            })
    }

    const fetchGroups = () => {
        fetch("http://localhost:3000/nomenclatures/groups")
            .then(response => {
                return response.json()
            })
            .then(groups => {
                setAllGroups(groups)

            })
    }

    const setDialogVisible = () => {
        setVisible(true)
    }

    useEffect(() => {
        fetchEntity()
        fetchGroups()
    }, [])


    const show = () => {
        toast.current.show({ severity: 'error', summary: 'Eroare', detail: 'Nu a putut fi confirmata parola', life: 3000 });
    };


    const saveGroup = async () => {

        const entitiesIds: number[] = [];
        for (let i = 0; i < selectedEntities.length; i++) {
            entitiesIds.push(selectedEntities[i].id)
        }

        const entities = entitiesIds.map(id => ({
            entity: {
                connect: {
                    id: id
                }
            }
        }));

        interface Group {
            name: String,
            description: String,
            entity: String[]
        }

        // console.log(name, description, selectedEntities)

        let addGroup: any = {
            "name": name,
            "description": description,
            "entity": {
                connect: selectedEntities
            }
        }

        try {
            const response = await axios.post('http://localhost:3000/nomenclatures/groups',
                addGroup
            );
            setVisible(false)
            console.log('Group added:', response.data);
        } catch (error) {
            console.error('Error creating group:', error);
        }

    }
    const fetchGroupById = async (Id) => {
        const response = await fetch(`http://localhost:3000/nomenclatures/groups/${Id}`).then(res => res.json())

        setName(response.name)
        setDescription(response.description)
        setselectedEntities(response.entity)

    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    Grupuri Utilizatori
                    <div className="field col-12  md:col-2">
                        <Button label="Adauga" onClick={setDialogVisible} />
                    </div>

                    <DataTable value={allGroups} tableStyle={{ minWidth: '50rem' }}
                        selectionMode="single" selection={selectedGroup}
                        onSelectionChange={(e) => {
                            setSelectedGroup(e.value),
                                console.log(e.value)
                            setVisible(true)
                            fetchGroupById(e.value.id)
                        }}>
                        <Column field="id" header="Id"></Column>
                        <Column field="name" header="Denumire grup"></Column>
                        <Column field="description" header="Descriere"></Column>
                    </DataTable>

                    <Dialog header="Grup" visible={visible} style={{ width: '30vw' }}
                        onHide={() => setVisible(false)}>
                        <div className='card'>
                            <div className="grid flex justify-content-center flex-wrap">

                                <div className="col-12">
                                    <div className="p-fluid formgrid grid pt-2">

                                        <Toast ref={toast}></Toast>



                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="name">Denumire</label>
                                            <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>

                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="description">Descriere</label>
                                            <InputText id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                        </div>


                                        <div className="field col-12  md:col-12">
                                            <label htmlFor="roles">Acces Entitati</label>
                                            <MultiSelect value={selectedEntities} onChange={(e) => {
                                                setselectedEntities(e.value)
                                                // console.log(e.value)
                                            }}
                                                options={entity}
                                                optionLabel="name"
                                                display="chip"
                                                placeholder="Selecteaza entitate"
                                                maxSelectedLabels={5} />
                                        </div>


                                    </div>

                                    <div className='p-3 field col-2 md:col-12'>
                                        <div className='grid'>
                                            <div className='flex flex-wrap justify-content-left gap-3'>
                                                <Button label="Salveaza" severity="success" onClick={saveGroup} />
                                                <Button label="Sterge" severity="danger" />
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
    );
}
