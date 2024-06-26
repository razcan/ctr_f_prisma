'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axios, { AxiosRequestConfig } from 'axios';
import { MyContext, MyProvider } from '../../../../../layout/context/myUserContext'

export default function Documents() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = searchParams.get("Id");
    // console.log(Id)
    const [selectedFile, setSelectedFile] = useState<any>([]);
    const [selectedoriginalname, setSelecteoriginalname] = useState<any>([]);
    const [attachmentsfiles, setAttachmentsfiles] = useState<any>([]);
    const [calattachmentsfiles, setCalAttachmentsfiles] = useState<any>([]);
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [metaKey, setMetaKey] = useState(true);
    const [selectedCell, setSelectedCell] = useState(null);
    const useMyContext = () => useContext(MyContext);
    const {
        fetchWithToken, Backend_BASE_URL,
        Frontend_BASE_URL, isPurchasing, setIsPurchasing
        , isLoggedIn, login, userId
    } = useMyContext();


    useEffect(() => {

        if (!userId) {
            router.push(`${Frontend_BASE_URL}/auth/login`)
        }

    }, [])


    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'Files Uploaded' });

        setTotalSize(0);

        setVisible(false);
        fetchAttachmentsData();

    };


    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 200000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';
        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                {/* <Button type="button" icon="pi pi-times"
                    tooltip="Clear results" tooltipOptions={{ position: 'bottom' }}
                    className="p-button-outlined p-button-rounded p-button-warning ml-auto" onClick={handleFileUpload} /> */}

                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 20 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {/* <img alt={file.name} role="presentation" src={file.objectURL} width={100} /> */}
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto"

                    onClick={() => onTemplateRemove(file, props.onRemove)} />

            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Files Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };


    const fetchAttachmentsData = async () => {

        const session = localStorage.getItem('token');
        const jwtToken = JSON.parse(session);

        if (jwtToken && jwtToken.access_token) {
            const jwtTokenf = jwtToken.access_token;

            const roles = jwtToken.roles;
            const entity = jwtToken.entity;
            const config: AxiosRequestConfig = {
                method: 'get',
                url: `${Backend_BASE_URL}/contracts/file/${Id}`,
                headers: {
                    'user-role': `${roles}`,
                    'entity': `${entity}`,
                    'Authorization': `Bearer ${jwtTokenf}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    setAttachmentsfiles(response.data)

                    const columnName = 'size';
                    const originalname = 'originalname';

                    if (response.data.length > 0) {

                        if (response.data !== null && response.data !== undefined) {
                            const newArray = response.data?.map((item) =>
                            ({
                                ...item,

                                [columnName]: Math.ceil(item[columnName] / 1000000 * Math.pow(10, 2)) / Math.pow(10, 2),
                                // [originalname]: item[originalname].toUpperCase()
                            }));

                            setCalAttachmentsfiles(newArray);
                        }
                    }

                })
                .catch(function (error) {

                    router.push(`${Frontend_BASE_URL}/auth/login`)

                    console.log(error);
                });
        }

        // fetch(`http://localhost:3000/contracts/file/${Id}`) //pt fiecare cre Id
        //     .then(response => {
        //         return response.json()
        //     })
        //     .then(attachmentsfiles => {
        //         setAttachmentsfiles(attachmentsfiles)

        //         // Specify the column you want to divide
        //         const columnName = 'size';
        //         const originalname = 'originalname';

        //         // Use map to create a new array with the transformation

        //         if (attachmentsfiles.length > 0) {
        //             if (attachmentsfiles !== null && attachmentsfiles !== undefined) {
        //                 const newArray = attachmentsfiles?.map((item) =>
        //                 ({
        //                     ...item,

        //                     [columnName]: Math.ceil(item[columnName] / 1000000 * Math.pow(10, 2)) / Math.pow(10, 2),
        //                     // [originalname]: item[originalname].toUpperCase()
        //                 }));

        //                 setCalAttachmentsfiles(newArray);
        //             }
        //         }
        //     })
    }

    useEffect(() => {
        fetchAttachmentsData()
    }, [calattachmentsfiles])


    const deleteTemplate = (event) => {
        return <i className="pi pi-delete-left" style={{ color: 'red' }}></i>
        // <Tag severity="danger" value="Delete"></Tag>
    };

    const downloadTemplate = (rowData) => {
        return (<div>
            <i className="pi pi-download" style={{ color: 'green' }}></i>
        </div>)
    };


    const deleteFile = async (file: string): Promise<void> => {
        try {

            const session = localStorage.getItem('token');
            const jwtToken = JSON.parse(session);

            if (jwtToken && jwtToken.access_token) {
                const jwtTokenf = jwtToken.access_token;

                const roles = jwtToken.roles;
                const entity = jwtToken.entity;
                const config: AxiosRequestConfig = {
                    method: 'delete',
                    url: `${Backend_BASE_URL}/contracts/delete/${file}`,
                    headers: {
                        'user-role': `${roles}`,
                        'entity': `${entity}`,
                        'Authorization': `Bearer ${jwtTokenf}`,
                        'Content-Type': 'application/json'
                    }
                };
                axios(config)
                    .then(function (response) {
                        if (response.data.ok) {
                            console.log(`File ${file} deleted successfully.`);
                            fetchAttachmentsData()
                        }
                        // else {
                        //     const errorMessage = "Eroare";
                        //     console.error(`Error deleting file ${file}: ${errorMessage}`);
                        // }
                    })
            }

            // const response = await fetch(`http://localhost:3000/contracts/delete/${file}`, {
            //     method: 'DELETE',
            // });

            // if (response.ok) {
            //     console.log(`File ${file} deleted successfully.`);
            //     fetchAttachmentsData()
            // } else {
            //     const errorMessage = await response.text();
            //     console.error(`Error deleting file ${file}: ${errorMessage}`);
            // }
        } catch (error) {
            console.error(`Error deleting file ${file}: ${error.message}`);
        }
    };

    const downloadile = async (file: string, originalname: string): Promise<void> => {

        // console.log("originalname", originalname)

        try {

            // const session = localStorage.getItem('token');
            // const jwtToken = JSON.parse(session);

            // if (jwtToken && jwtToken.access_token) {
            //     const jwtTokenf = jwtToken.access_token;

            //     const roles = jwtToken.roles;
            //     const entity = jwtToken.entity;
            //     const config: AxiosRequestConfig = {
            //         method: 'GET',
            //         url: `${Backend_BASE_URL}/contracts/download/${file}`,
            //         headers: {
            //             'user-role': `${roles}`,
            //             'entity': `${entity}`,
            //             'Authorization': `Bearer ${jwtTokenf}`,
            //             'Content-Type': 'application/json'
            //         }
            //     };
            //     axios(config)
            //         .then(async function (response) {
            //             console.log(response.data.ok, "ok")
            //             if (response.data) {

            //                 const blobData = response.data as Blob;
            //                 const url = window.URL.createObjectURL(blobData);
            //                 const link = document.createElement('a');
            //                 link.download = `${originalname}`;

            //                 link.href = url;

            //                 document.body.appendChild(link);
            //                 link.click();

            //                 document.body.removeChild(link);
            //                 window.URL.revokeObjectURL(url);

            //                 console.log(`File ${originalname} downloaded successfully.`);
            //             }
            //             else {
            //                 const errorMessage = "Eroare";
            //                 console.error(`Error on downloading file ${originalname}: ${errorMessage}`);
            //             }
            //         })
            // }

            const response = await fetch(`${Backend_BASE_URL}/contracts/download/${file}`, {
                method: 'GET',
            });

            if (response.ok) {
                // const customFileName = prompt('Enter file name:', file) || file;

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');

                // Set a custom file name here
                link.download = `${originalname}`;


                link.href = url;

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log(`File ${originalname} downloaded successfully.`);
            } else {
                const errorMessage = await response.text();
                console.error(`Error on downloading file ${originalname}: ${errorMessage}`);
            }

        } catch (error) {
            console.error(`Error ${originalname}: ${error.message}`);
        }
    };

    const onCellSelect = (event) => {
        // console.log(event.rowData.id)
        // console.log(event.cellIndex)

        if (event.cellIndex === 5) {
            setDeleteVisible(true)
            setSelectedFile(event.rowData.filename)
            setSelecteoriginalname(event.rowData.originalname)
            // deleteFile(event.rowData.filename)
            fetchAttachmentsData()
        }
        if (event.cellIndex === 6) {
            downloadile(event.rowData.filename, event.rowData.originalname)
            fetchAttachmentsData()
        }

        // toast.current.show({ severity: 'info', summary: 'Cell Selected', detail: `Name: ${event.value}`, life: 3000 });
    };


    const accept = () => {
        deleteFile(selectedFile)
        setDeleteVisible(false)
    }


    const reject = () => {
        setDeleteVisible(false)
    }

    const messageDelete = () => {
        return <div>Doriti stergerea fisierului {selectedoriginalname}?</div>
    }

    const url_link = `${Backend_BASE_URL}/contracts/file/${Id}`;

    return (
        <div className="card">
            <div className="grid">
                <div className="col-12">

                    <Toast ref={toast} />

                    {calattachmentsfiles.length !== 0 ?

                        <DataTable value={calattachmentsfiles} tableStyle={{ minWidth: '50rem' }}
                            cellSelection selectionMode="single" selection={selectedCell}
                            onSelectionChange={(e) => setSelectedCell(e.value)}
                            onCellSelect={onCellSelect}
                            //onCellUnselect={onCellUnselect}
                            metaKeySelection={false}
                            stripedRows
                            // paginator rows={5} rowsPerPageOptions={[5, 10, 20, 40, 100]} 
                            sortMode="multiple"
                            dataKey="id">
                            <Column hidden field="id" header="id" ></Column>
                            <Column field="originalname" header="Nume Fisier" style={{ textAlign: 'left' }} ></Column>
                            <Column hidden field="filename" header="filename" ></Column>
                            <Column hidden field="path" header="path"></Column>
                            <Column field="size" header="Marime Fisier(MB)" ></Column>
                            <Column field="id" header="Sterge" body={deleteTemplate} style={{ width: '5vh' }} ></Column>
                            <Column field="id" header="Salveaza" body={downloadTemplate} style={{ width: '5vh' }} ></Column>
                            {/* <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column> */}

                        </DataTable>
                        : null}

                    <div className='pt-3'>
                        <Button label="Incarca Fisiere" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                    </div>


                    <ConfirmDialog group="declarative" visible={deleteVisible} onHide={() => setDeleteVisible(false)}
                        // message='Doriti sa stergeti fisierul?'
                        message={messageDelete}
                        header="Stergere fisier" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />


                    <Dialog header="Ataseaza fisiere" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>


                        <Tooltip target=".custom-choose-btn" content="Alege fisiere" position="bottom" />
                        <Tooltip target=".custom-upload-btn" content="Incarca" position="bottom" />
                        <Tooltip target=".custom-cancel-btn" content="Goleste" position="bottom" />

                        <FileUpload ref={fileUploadRef} name="files" url={url_link}
                            // customUpload={true}
                            // uploadHandler={SendDocuments}
                            multiple accept="*" maxFileSize={20000000}
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                            headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                            chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                    </Dialog>


                </div>
            </div>
        </div>
    );
}
