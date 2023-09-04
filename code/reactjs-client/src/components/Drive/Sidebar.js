
import React, { useState, useEffect } from 'react';
import "./css/sidebar.css";
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import { io } from "socket.io-client";



function Sidebar() {
    const [open, setOpen] = useState(false);
    const [uploading] = useState(false);
    const [file, setFile] = useState(null);
    const [socket, setSocket] = useState(null);
    const jwtToken1=localStorage.getItem("jwtToken1")
    function removeDomain(email) {
        const atIndex = email.indexOf('@');
        if (atIndex !== -1) {
            return email.substring(0, atIndex);
        }
        return email;
    }
    const user_mail=removeDomain(jwtToken1)
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };



    function handleUpload(event, fileName, fileData,bname) {
        console.log(fileName,fileData,bname)
        event.preventDefault(); 
        socket.emit("createfile",fileName,fileData,bname)
        setOpen(false)
    }
    return (
       
        <>
    <Modal open={open} onClose={handleClose}>
    <div className='modal_pop'>
        <form>
            <div className='modal_heading'>
                <h3>Select File you want to Upload</h3>
            </div>
            <div className='modalbody'>
                {
                    uploading ? (
                        <p className='uploading'>Uploading</p>
                    ) : (
                        <>
                            <input type="file" onChange={handleChange} />
                            <input
                                type='submit'
                                className='post_submit'
                                onClick={(e) => handleUpload(e, file.name, file,user_mail)}
                            />
                        </>
                    )
                }
            </div>
        </form>
    </div>
</Modal>

    <div className="sidebar">
    <div style={{height:"3%"}}></div>
        <div className='sidebar_btn'>
            <button onClick={handleOpen}>
                <AddIcon/> 
                <span>New</span>
            </button>
        </div>
        <div style={{height:"5%"}}></div>
        <hr/>
        <div className='abc'>
            <p className='p1'>Storage bucket created in <b>IBM COS</b></p>
            <p className='p2'>Bucket name : <b>{user_mail}</b></p>
        </div>
        <div className='sidebar_options'>
            <div className='sidebar_option'>
                <CloudQueueIcon/>
                <span>Storage</span>
            </div>
            <div className='progress_bar'>
                <progress size="tiny" value="50" max="100"/>
                <span>6.45 GB of 15 GB used</span>
            </div>
        </div>
    </div>
    </>
  ) 
}

export default Sidebar