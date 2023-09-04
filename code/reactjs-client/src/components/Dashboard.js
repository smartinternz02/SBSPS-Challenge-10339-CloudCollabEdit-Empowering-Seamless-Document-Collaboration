import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { useNavigate, useParams} from 'react-router-dom';
import Fab from '../components/FAB';
import { FcAbout, FcBusinessman, FcCamera, FcFullTrash } from "react-icons/fc";
import { v4 as uuidV4 } from 'uuid';
import { io } from "socket.io-client";
import Data from './Profile-card/Data';
import ProfileCard from './Profile-card/Profile-card';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Dashboard = () => {
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentCode, setDocumentCode] = useState('');
  const [files, setFiles] = useState([]); // State variable for files array
  const navigate = useNavigate();
  const dynamicUuid = uuidV4();
  const [socket, setSocket] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const user_name = localStorage.getItem("jwtToken");
  const user_mail = localStorage.getItem("jwtToken1")
  function removeDomain(email) {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.substring(0, atIndex); // Extract characters before '@'
    }
    return email; // Return the original email if '@' is not present
}

const openSnackbar = (message) => {
  setSnackbarMessage(message);
  setSnackbarOpen(true);
};

const closeSnackbar = () => {
  setSnackbarOpen(false);
};
  const handleCreateDocument = () => {
    setOpen(true);
  };

  const handleDocumentCode=()=>{
    setOpen1(true)
  }

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogClose1 = () => {
    setOpen1(false);
  };
  
  const handleCreateDocumentConfirm = () => {
    navigate(`/document/${dynamicUuid}?name=${encodeURIComponent(documentName)}`);
  };

  const handleEnterDocumentConfirm=()=>{
    navigate(`/document/${documentCode}`)
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    setToken(storedToken);

    const s = io("http://localhost:3001", {
      auth: { token: storedToken },
    });
    setSocket(s);

    s.on('docslist', (receivedFiles) => {
      console.log('Received files:', receivedFiles);
      setFiles(receivedFiles); // Update the files state with received data
    });

    s.on('bucketMessage',(msg)=>{
      console.log('Msg about the bucket',msg)
      openSnackbar(msg);
    })

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null) return;

    socket.emit('don', user_name);
    const bucketName = removeDomain(user_mail)
    socket.emit("creationReq",bucketName)
  }, [socket]);

  const drive=()=>{
    navigate('/workdrive')
  }


  const actions = [
    { label: "About", icon: <FcAbout />, onClick: drive},
    { label: "Profile", icon: <FcBusinessman />, onClick: console.log },
    { label: "Picture", icon: <FcCamera />, onClick: console.log },
    { label: "Trash", icon: <FcFullTrash />, onClick: console.log },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',marginTop:'5%',marginBottom:'10%' }}>
          <div className="background">
      <ProfileCard
        name={token}
        mail={user_mail}
        onCreateDocumentClick={handleCreateDocument}
        onEnterDocumentClick={handleDocumentCode}
      ></ProfileCard>
    </div>
      <Fab actions={actions} />
      <Data files={files} /> 
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Create a Document</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the document name:</DialogContentText>
          <input type="text" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateDocumentConfirm} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open1} onClose={handleDialogClose1}>
        <DialogTitle>Enter the Document Code</DialogTitle>
        <DialogContent>
          <DialogContentText>Collaboration code</DialogContentText>
          <input type="text" value={documentCode} onChange={(e) => setDocumentCode(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose1}>Cancel</Button>
          <Button onClick={handleEnterDocumentConfirm} color="primary">
            Collaborate
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={closeSnackbar}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
