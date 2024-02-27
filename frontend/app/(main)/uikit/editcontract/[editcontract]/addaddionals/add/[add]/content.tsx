'use client';

import { useRouter } from 'next/navigation';
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

    const [text, setText] = useState('');
    const [value, updateValue] = useState(0);

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
        const response = await fetch(`http://localhost:3000/contracts/content/${value}`).then(res => res.json())
        setText(response.content);

    }
    console.log(text)

    useEffect(() => {
        fetchContent()
    }, [])

    const saveContent = async () => {
        try {

            interface Content {
                content: String,
                // contractId: any
            }


            let createContent: Content = {
                content: text,
                // contractId: 0
            }



            const response = await axios.patch(`http://localhost:3000/contracts/content/${value}`,
                createContent
            );
            console.log('Content added:', response.data);
        } catch (error) {
            console.error('Error creating content:', error);
        }
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div >
                    {/* <Editor theme='snow' value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '30vw' }} />
                  
                      </div>*/}
                    <div className='pl-4'>
                        <Button label="Salveaza" onClick={saveContent} />
                    </div>

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
        </div >
    );
}