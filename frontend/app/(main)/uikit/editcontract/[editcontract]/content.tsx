'use client';




import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import axios from 'axios';
import 'quill/dist/quill.snow.css'; // Import Quill CSS


const Content = () => {
    const [editorContent, setEditorContent] = useState('');
    const editorRef = useRef();
    const iframeRef = useRef();
    const searchParams = useSearchParams()
    const Id = parseInt(searchParams.get("Id"));
    const [templates, setTemplates] = useState([]);
    const [type, setType] = useState();
    const [actualContract, setActualContract] = useState();
    const [text, setText] = useState('');

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

    const fetchTemplatesData = () => {
        fetch("http://localhost:3000/nomenclatures/contracttemplates")
            .then(response => {

                return response.json()
            })
            .then(templates => {
                setTemplates(templates)

            })
    }

    const fetchAllContractData = () => {
        fetch(`http://localhost:3000/contracts/details/${Id}`)
            .then(response => {
                return response.json()
            })
            .then(actualContract => {
                setActualContract(actualContract)

            })
    }


    useEffect(() => {
        fetchContent(),
            fetchTemplatesData(),
            fetchAllContractData()
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

    const formatDate = (actuallDate: Date) => {

        if (actuallDate) {
            const originalDate = new Date(actuallDate.toString());
            const day = originalDate.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if needed
            const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (January is 0, so we add 1) and pad with leading zero if needed
            const year = originalDate.getFullYear(); // Get the full year
            const date = `${day}.${month}.${year}`;
            return (date)
        }
        else return
    }

    const replacePlaceholders = async () => {

        const originalString: any = text;

        const contract_Sign = formatDate(actualContract?.sign);
        const contract_Number = actualContract?.number;
        const contract_Partner = actualContract?.partner.name;
        const contract_Entity = actualContract?.entity.name;
        const contract_Start = formatDate(actualContract?.start);
        const contract_End = formatDate(actualContract?.end);
        const contract_remarks = actualContract?.remarks;
        const contract_PartnerFiscalCode = actualContract?.partner.fiscal_code;
        const contract_PartnerComercialReg = actualContract?.partner.commercial_reg;
        const contract_PartnerAddress = actualContract?.PartnerAddress.completeAddress;
        const contract_PartnerStreet = actualContract?.PartnerAddress.Street;
        const contract_PartnerCity = actualContract?.PartnerAddress.City;
        const contract_PartnerCounty = actualContract?.PartnerAddress.County;
        const contract_PartnerCountry = actualContract?.PartnerAddress.Country;
        const contract_PartnerBank = actualContract?.PartnerBank.bank;
        const contract_PartnerBranch = actualContract?.PartnerBank.branch;
        const contract_PartnerIban = actualContract?.PartnerBank.iban;
        const contract_PartnerCurrency = actualContract?.PartnerBank.currency;
        const contract_PartnerPerson = actualContract?.PartnerPerson.name;
        const contract_PartnerEmail = actualContract?.PartnerPerson.email;
        const contract_PartnerPhone = actualContract?.PartnerPerson.phone;
        const contract_PartnerRole = actualContract?.PartnerPerson.role;
        const contract_EntityFiscalCode = actualContract?.entity.fiscal_code;
        const contract_EntityComercialReg = actualContract?.entity.commercial_reg;
        const contract_EntityAddress = actualContract?.EntityAddress.completeAddress;
        const contract_EntityStreet = actualContract?.EntityAddress.Street;
        const contract_EntityCity = actualContract?.EntityAddress.City;
        const contract_EntityCounty = actualContract?.EntityAddress.County;
        const contract_EntityCountry = actualContract?.EntityAddress.Country;
        const contract_EntityBranch = actualContract?.EntityBank.branch;
        const contract_EntityIban = actualContract?.EntityBank.iban;
        const contract_EntityCurrency = actualContract?.EntityBank.currency;
        const contract_EntityPerson = actualContract?.EntityPerson.name;
        const contract_EntityEmail = actualContract?.EntityPerson.email;
        const contract_EntityPhone = actualContract?.EntityPerson.phone;
        const contract_EntityRole = actualContract?.EntityPerson.role;
        const contract_Type = actualContract?.type.name;


        //de adaugat cod uni de inregistrare si r, 
        const replacements: { [key: string]: string } = {
            "ContractNumber": contract_Number,
            "SignDate": contract_Sign,
            "StartDate": contract_Start,
            "FinalDate": contract_End,
            "PartnerName": contract_Partner,
            "EntityName": contract_Entity,
            "ShortDescription": contract_remarks,
            "PartnerComercialReg": contract_PartnerComercialReg,
            "PartnerFiscalCode": contract_PartnerFiscalCode,
            "EntityFiscalCode": contract_EntityFiscalCode,
            "EntityComercialReg": contract_EntityComercialReg,
            "PartnerAddress": contract_PartnerAddress,
            "PartnerStreet": contract_PartnerStreet,
            "PartnerCity": contract_PartnerCity,
            "PartnerCounty": contract_PartnerCounty,
            "PartnerCountry": contract_PartnerCountry,
            "PartnerBank": contract_PartnerBank,
            "PartnerBranch": contract_PartnerBranch,
            "PartnerIban": contract_PartnerIban,
            "PartnerCurrency": contract_PartnerCurrency,
            "PartnerPerson": contract_PartnerPerson,
            "PartnerEmail": contract_PartnerEmail,
            "PartnerPhone": contract_PartnerPhone,
            "PartnerRole": contract_PartnerRole,
            "EntityAddress": contract_EntityAddress,
            "EntityStreet": contract_EntityStreet,
            "EntityCity": contract_EntityCity,
            "EntityCounty": contract_EntityCounty,
            "EntityCountry": contract_EntityCountry,
            "EntityBranch": contract_EntityBranch,
            "EntityIban": contract_EntityIban,
            "EntityCurrency": contract_EntityCurrency,
            "EntityPerson": contract_EntityPerson,
            "EntityEmail": contract_EntityEmail,
            "EntityPhone": contract_EntityPhone,
            "EntityRole": contract_EntityRole,
            "Type": contract_Type
        };

        let replacedString: string = originalString;
        for (const key in replacements) {
            if (Object.prototype.hasOwnProperty.call(replacements, key)) {
                replacedString = replacedString.replace(key, replacements[key]);
            }
        }
        setText(replacedString)
    }


    const handleTextChange = (e) => {
        // setEditorContent(e.htmlValue);
        setText(e.htmlValue)
    };

    const handlePrint = () => {
        // const printWindow = window.open('', '_blank');
        //     printWindow.document.write(`
        //   <!DOCTYPE html>
        //   <html>
        //     <head>
        //       <title>Print</title>
        //     </head>
        //     <body>
        //       <div style="height: 100%; width: 100%;">${text}</div>
        //     </body>
        //   </html>
        // `);
        //     printWindow.document.close();
        //     printWindow.print();
        const iframe = iframeRef.current;
        const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
          <style>
            body { margin: 0; }
           .print-content { height: 100%; width: 100%; font-size:16px; color: black }
          </style>
        </head>
        <body>
          <div class="print-content">${text}</div>
        </body>
      </html>
    `;
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(iframeContent);
        iframeDoc.close();
        iframe.contentWindow.print();

    };

    return (

        <div className="grid">
            <div className="col-12">

                <div className="grid">
                    <div className="col-12">
                        <div className="p-fluid formgrid grid ">

                            <div className="field col-12 md:col-3">
                                <Dropdown id="type" filter showClear value={type}
                                    onChange={(e) => {
                                        setType(e.value)
                                        setText(e.value.content)
                                        // console.log(e.value.content)
                                    }}
                                    options={templates}
                                    optionLabel="name"
                                    placeholder="Selecteaza Template Contract"></Dropdown>
                            </div>

                            <div className="field col-12  md:col-3">
                                <Button label="Inlocuieste placeholdere" onClick={replacePlaceholders} />
                            </div>
                            <div className="field col-12  md:col-3">
                                <Button label="Salveaza" onClick={saveContent} />

                            </div>
                            <div className="field col-12  md:col-3">
                                <Button label="Tipareste" onClick={handlePrint} />


                            </div>


                        </div>
                    </div>
                </div>

                <Editor
                    ref={(ref) => (editorRef.current = ref)}
                    style={{ height: '100vw' }}
                    value={text}
                    // onTextChange={handleChange}
                    onTextChange={handleTextChange}
                />
                <iframe
                    ref={iframeRef}
                    style={{ display: 'none' }}
                    title="Print Frame"
                />

            </div>

        </div>

    );
};

export default Content;
