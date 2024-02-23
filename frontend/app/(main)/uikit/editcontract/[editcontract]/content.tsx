'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabMenu } from 'primereact/tabmenu';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import router from 'next/router';
import { Editor } from 'primereact/editor';
import axios from 'axios';
// import Quill from 'quill';
// import ReactQuill from "react-quill";
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";

export default function Content() {

    const [text, setText] = useState([]);

    const router = useRouter();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));

    // var Font = Quill.import('formats/font');
    // // We do not add Aref Ruqaa since it is the default
    // Font.whitelist = ['arial', 'roboto', 'raleway', 'montserrat', 'lato', 'rubik'];
    // Quill.register(Font, true);

    // var Size = Quill.import('formats/size');
    // Size.whitelist = [
    //     '9px',
    //     '10px',
    //     '11px',
    //     '12px',
    //     '14px',
    //     '16px',
    //     '18px',
    //     '20px',
    //     '22px',
    //     '24px',
    //     '26px',
    //     '28px'
    // ];
    // Quill.register(Size, true);

    // const myColors = [
    //     "red", "green", "blue", "orange", "violet",
    //     "purple",
    //     "#785412",
    //     "#452632",
    //     "#856325",
    //     "#963254",
    //     "#254563",
    //     "white"
    // ];
    // const modules = {
    //     toolbar: [
    //         [
    //             {
    //                 'font': [
    //                     "monospace",
    //                     "serif",
    //                     // "raleway",
    //                     // "montserrat",
    //                     // "lato",
    //                     // "rubik",
    //                     // "roboto"
    //                 ],
    //             },
    //         ],
    //         [{ header: [1, 2, 3, 4, 5, 6, false] }],

    //         ["bold", "italic", "underline", "strike", "blockquote"],
    //         [{ align: ["right", "center", "justify"] }],
    //         [{ list: "ordered" }, { list: "bullet" }],
    //         ["link", "image"],
    //         [{ color: myColors }],
    //         [{ background: myColors }]
    //     ]
    // };

    const modules = {
        toolbar: {
            container: [
                [{ font: [] }, { 'size': [] }, { 'header': [1, 2, 3, 4, 5, 6] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
                [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                ],
                [{ 'direction': 'rtl' }, { 'align': [] }],
                ['link', 'image', 'clean'],
            ],
        },
        clipboard: {
            matchVisual: true,
        },
    }

    const formats = [
        'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'header', 'blockquote', 'code-block',
        'indent', 'list',
        'direction', 'align',
        'link', 'image', 'video', 'formula',
    ];


    const handleProcedureContentChange = (content: any) => {
        setText(content);
    };


    const fetchContent = async () => {
        const response = await fetch(`http://localhost:3000/contracts/content/${Id}`).then(res => res.json().then(res => {
            if (res.length > 0) {
                if (res[0].content !== null && res[0].content !== undefined) {
                    setText(res[0].content);
                }
            }
        })
        )
    }

    useEffect(() => {
        fetchContent()
    }, [])

    const saveContent = async () => {
        try {

            interface Content {
                content: String,
                contractId: any
            }


            let createContent: Content = {
                content: text,
                contractId: parseInt(Id)
            }


            const response_update = await axios.patch(`http://localhost:3000/contracts/content/${Id}`,
                createContent
            );
            console.log('Content added:', response_update.data);


        } catch (error) {
            console.error('Error creating content:', error);
        }
    }

    return (
        <div className="grid">
            <div className="col-12">

                <div className='pl-4'>
                    <Button label="Salveaza" onClick={saveContent} />
                </div>

                {/* <div className='p-4'>
                    <Editor theme='snow' value={text} onTextChange={(e) => handleProcedureContentChange(e.htmlValue)} style={{ height: '30vw' }} />
                </div> */}
                <div className='p-4'>
                    <ReactQuill
                        style={{ height: '27vw' }}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={text}
                        onChange={handleProcedureContentChange}
                    />

                </div>




                {/* <button onClick={getContent}>Get Content</button> */}
            </div>

        </div>

    );
}