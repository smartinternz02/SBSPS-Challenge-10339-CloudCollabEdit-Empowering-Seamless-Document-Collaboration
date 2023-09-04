import React, { useState, useEffect } from 'react';
import "./css/data.css";
//import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListIcon from '@mui/icons-material/List';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { io } from "socket.io-client";

const Data = () => {
    const [token, setToken] = useState('');
    function removeDomain(email) {
        const atIndex = email.indexOf('@');
        if (atIndex !== -1) {
            return email.substring(0, atIndex); // Extract characters before '@'
        }
        return email; // Return the original email if '@' is not present
    }    
    const jwtToken1 = localStorage.getItem("jwtToken1");
    const bucketName = removeDomain(jwtToken1);
    const [files, setFiles] = useState([]);
    const [bucketContents, setBucketContents] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("jwtToken");
        setToken(storedToken);
    
        const s = io("http://localhost:3001", {
          auth: { token: storedToken },
        });
        setSocket(s);

        // s.on('objectsList', (receivedFiles) => {
        //     console.log('Received files:', receivedFiles);
        //     // setFiles(receivedFiles); // Update the files state with received data
        //   });
        
        s.emit("displaycontent", bucketName);
        s.on("bucketContentsFetched", (contents) => { // Use s.on here, not socket.on
            setBucketContents(contents);
        });
        // Listen for server events


        // Call the display function when the component mounts
        //display(bucketName);
        return () => {
            s.disconnect(); // Clean up the socket connection on component unmount
        };
    }, []);


    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    // function display(bname){
    //     const socket = io("http://localhost:3001");
    //     s.emit("displaycontent", bname);
    // }

    return (
        <div className='data'>
            <div className='data__header'>
                <div className='data__headerleft'>
                <p><b>OBJECT STORAGE</b></p>
                </div>
                <div className='data__headerright'>
                    <ListIcon />
                    <InfoOutlinedIcon />
                </div>
            </div>
            <div className='data__content'>
                <div className='data__grid'>
                    {
                        files.map((file) => {
                            return <div className='data__file'>
                                <InsertDriveFileIcon />
                                <p>{file.data.filename}</p>
                            </div>
                        })
                    }
                </div>
                <div className='data__list'>
                    <div className='detailsRow'>
                        <p><b>Name<ArrowDownwardIcon /></b></p>
                        <p><b>Last Modified</b></p>
                        <p><b>File Size</b></p>
                    </div>                            
                    {bucketContents.map((content, index) => (
                        <div className='detailsRow' key={index}>
                            <a href={`https://ibm-hc-clone.s3.us-south.cloud-object-storage.appdomain.cloud/${content.name}`} target="_blank" rel="noopener noreferrer">
                                {content.name.length > 30 ? `${content.name.slice(0, 15)}...` : content.name}
                            </a>                       
                            <p>{new Date(content.lastModified).toUTCString()}</p>
                            <p>{formatBytes(content.size)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Data;