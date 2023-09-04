import React, { useEffect } from 'react';
import './Popup.css';
import {v4 as uuidV4} from 'uuid'
import { io } from "socket.io-client";



function Popup({ setTrigger, trigger, nth, docname, onSave  }) {
    const dynamicUuid = uuidV4();
    const docnamex = `${docname}-${nth}.0-`

    useEffect(() => {
        const storedContents = localStorage.getItem('editorContents');
        if (storedContents) {
            setTrigger(true); // Trigger the popup if editorContents is detected
        }
    }, [setTrigger]);

    function save() {
        setTrigger(false);
        // const url = `/document/${dynamicUuid}?name=${encodeURIComponent(docnamex)}`;
        // window.open(url, '_blank');
        onSave();
        console.log('from Popup side')
    }

    // function editItem({ id, newItem }) {
    //     console.log(id + '_' + newItem);
    // }

    return trigger ? (
        <div className='popup'>
            <div className="popup-inner">
                    <div className='flex'>
                        <p >Confirm to create the ={'>'}</p> <h4> {docname}-{nth}.0-</h4> <p> version of the file </p>
                    </div>
                    <button className='close-btn' onClick={save}>Save</button>
            </div>
        </div>
    ) : '';
}

export default Popup;