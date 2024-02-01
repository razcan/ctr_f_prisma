'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from 'primereact/editor';
import axios from 'axios';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query'
import { ProgressSpinner } from 'primereact/progressspinner';
import { FileUpload } from 'primereact/fileupload';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';


export default function Documents() {

    const router = useRouter();
    const [picturefiles, setPicturefiles] = useState<any>([]);
    const [attachmentsfiles, setAttachmentsfiles] = useState<any>([]);
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [metaKey, setMetaKey] = useState(true);
    const [selectedCell, setSelectedCell] = useState(null);
    const [rowClick, setRowClick] = useState(true);


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
        const value = totalSize / 2000000;
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



    const showSuccess = () => {
        if (toast.current != null) {
            toast.current.show({ severity: 'success', summary: 'Result', detail: 'The file/s was saved succesfully', life: 3000 });
        }
    }

    const showError = () => {
        if (toast.current != null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: "The file/s wasn't saved!", life: 3000 });
        }
    }

    const onUpload = () => {
        //        // Clear the FileUpload component after uploading
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    }

    const handleFileUpload = (event) => {
        // After successfully handling the upload, clear the FileUpload component
        fileUploadRef.current.clear();
    };

    const fetchAttachmentsData = () => {
        fetch(`http://localhost:3000/contracts/file`)
            .then(response => {
                return response.json()
            })
            .then(attachmentsfiles => {
                setAttachmentsfiles(attachmentsfiles)
            })
    }

    useEffect(() => {
        fetchAttachmentsData()
    }, [])

    // const SendDocuments = ({ files }: any) => {
    //     // onUpload(picturefiles);
    //     setPicturefiles(files);
    //     var formdata = new FormData();

    //     for (let i = 0; i < picturefiles.length; i++) {
    //         formdata.append("files", picturefiles[i]);
    //     }



    //     var requestOptions: any = {
    //         method: 'POST',
    //         body: formdata,
    //         redirect: 'follow'
    //     };

    //     fetch("http://localhost:3000/contracts/file", requestOptions)
    //         .then(response => response.text())
    //         .then(result => {
    //             console.log(result)
    //             showSuccess();
    //             //  router.push('/admin');
    //         }
    //         )
    //         .catch(error => {
    //             showError();
    //             console.log('error', error)
    //         });
    // }


    const deleteTemplate = (event) => {
        return <Tag severity="danger" value="Delete"></Tag>
    };

    const downloadTemplate = (rowData) => {
        return (<div>
            <Tag severity="info" value="Download"></Tag>
        </div>)
    };


    const deleteFile = async (file: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/contracts/delete/${file}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`File ${file} deleted successfully.`);
            } else {
                const errorMessage = await response.text();
                console.error(`Error deleting file ${file}: ${errorMessage}`);
            }
        } catch (error) {
            console.error(`Error deleting file ${file}: ${error.message}`);
        }
    };

    const downloadile = async (file: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/contracts/download/${file}`, {
                method: 'GET',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file);

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log(`File ${file} downloaded successfully.`);
            } else {
                const errorMessage = await response.text();
                console.error(`Error on downloading file ${file}: ${errorMessage}`);
            }
        } catch (error) {
            console.error(`Error ${file}: ${error.message}`);
        }
    };

    const onCellSelect = (event) => {
        console.log(event.rowData.id)
        console.log(event.cellIndex)

        if (event.cellIndex === 5) {
            deleteFile(event.rowData.filename)
            fetchAttachmentsData()
        }
        if (event.cellIndex === 6) {
            downloadile(event.rowData.filename)
            fetchAttachmentsData()
        }

        //trebuie facuta logica in functie de cele 2 col de mai sus
        // toast.current.show({ severity: 'info', summary: 'Cell Selected', detail: `Name: ${event.value}`, life: 3000 });
    };

    // const onCellUnselect = (event) => {
    //     toast.current.show({ severity: 'warn', summary: 'Cell Unselected', detail: `Name: ${event.value}`, life: 3000 });
    // };


    return (
        <div className="grid">
            <div className="col-12">

                <Toast ref={toast} />
                <DataTable value={attachmentsfiles} tableStyle={{ minWidth: '50rem' }}
                    cellSelection selectionMode="single" selection={selectedCell}
                    // selectionMode={rowClick ? null : 'radiobutton'}
                    onSelectionChange={(e) => setSelectedCell(e.value)}
                    onCellSelect={onCellSelect}
                    //onCellUnselect={onCellUnselect}
                    metaKeySelection={false}
                    stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 20, 40, 100]} sortMode="multiple"
                    dataKey="id">
                    <Column hidden field="id" header="id" ></Column>
                    <Column field="originalname" header="Nume Fisier" style={{ textAlign: 'left' }} ></Column>
                    <Column hidden field="filename" header="filename" ></Column>
                    <Column hidden field="path" header="path"></Column>
                    <Column field="size" header="Marime Fisier(MB)" ></Column>
                    <Column field="id" header="Sterge" body={deleteTemplate}  ></Column>
                    <Column field="id" header="Salveaza" body={downloadTemplate}  ></Column>
                    {/* <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column> */}

                </DataTable>

                <div className='pt-3'>
                    <Button label="Incarca Fisiere" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                </div>

                <Dialog visible={deleteVisible} modal style={{ width: '24rem' }} onHide={() => setDeleteVisible(false)}>

                    <span className="font-bold white-space-nowrap">Doriti sa stergeti fisierul  ?</span>
                    <div className='pt-4'>
                        <div className='grid'>
                            <div className='col-1 '>
                                {/* <Button label="Da" severity="danger" onClick={() => {
                                    deleteSelectedFile(departmentSelected)

                                }} /> */}
                            </div>
                            <div className='col-1 pl-7'>
                                <Button label="Nu" severity="success" onClick={() => setVisible(false)} autoFocus />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Ataseaza fisiere" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>


                    <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                    <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                    <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                    <FileUpload ref={fileUploadRef} name="files" url="http://localhost:3000/contracts/file"
                        // customUpload={true}
                        // uploadHandler={SendDocuments}
                        multiple accept="*" maxFileSize={2000000}
                        onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                </Dialog>


            </div>
        </div>
    );
}