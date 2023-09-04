import { useCallback,useEffect, useState ,useRef} from "react";
import ReactQuill, { Quill } from "react-quill";
import 'quill/dist/quill.snow.css';
import '../TextEditor/style.css';
// import registerQuillLanguageTool from "quill-languagetool";
import { useParams,useLocation,useNavigate } from "react-router-dom";
import {v4 as uuidV4} from 'uuid'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Button,Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import ContentModal from "./ContentModal";
import Fab from '../FAB';
import { FcAlarmClock,FcClock,FcLinux, FcOpenedFolder, FcCollaboration, FcFullTrash,FcExport,FcHome } from "react-icons/fc";
import { io } from "socket.io-client";
import Popup from '../Popup/Popup';

const SAVE_INTERVAL_MS=2000
// registerQuillLanguageTool(Quill);
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]
  
const modules = {
    // languageTool: {
    //   apiOptions: {
    //     level: "picky",
    //   },
    // },
    toolbar:TOOLBAR_OPTIONS
};

export default function TextEditor(){
    const [socket,setSocket]=useState()
    const [quill,setQuill]=useState()
    const {id: documentId} = useParams()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const documentName = queryParams.get("name");
    const [token, setToken] = useState('');
    const [connectedClients, setConnectedClients] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [nth, setNth] = useState(1);
    const navigate=useNavigate();
    const dynamicUuid = uuidV4();
    const [collab_email,setCollab_email]=useState('')
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [quillHtml, setQuillHtml] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [versionIndex, setVersionIndex] = useState(1);
    const [either,setEither]=useState('');
    const [modalContent, setModalContent] = useState("");
    const quillRef = useRef(null);

    useEffect(() => {
        const trackedItems=localStorage.getItem('trackingContents')
        const storedContents = localStorage.getItem('editorContents');
        if(storedContents){
            console.log('From 57th')
            setButtonPopup(true)
        }
        if(trackedItems){
            localStorage.removeItem("trackingContents")
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("jwtToken");
        setToken(storedToken);
        
        // const s = io("http://localhost:3001", {
        //     auth: { token: storedToken } // Send the token as part of the initial connection
        // });
        const ipAddress = window.location.hostname;

        const s = io(`http://${ipAddress}:3001`, {
            auth: { token: storedToken } // Send the token as part of the initial connection
        });
        setSocket(s);

        s.on('connected-clients', clients => {
            setConnectedClients(clients);
        });

        s.on('docslist',(files)=>{
            console.log('Rec:',files)
        })       

        return () => {
            s.disconnect();
        };
    }, []);

    const convertQuillToHtml = () => {
        if (quill) {
            const delta = quill.getContents();
            const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
            const html = converter.convert();
            setQuillHtml(html);
            setIsModalOpen(true);
            setEither('1');
        }
    };

    useEffect(() => {
        if (quillRef.current) {
          const quill = quillRef.current.getEditor();
      
          const countLines = () => {
            const lines = quill.getLine(0, quill.getLength());
            console.log(`Number of lines: ${lines.length}`);
          };
      
          quill.on("text-change", countLines);
      
          return () => {
            quill.off("text-change", countLines); // Clean up the event listener
          };
        }
      }, []);

    useEffect(()=>{
        if(socket==null|| quill==null) return
        
        socket.once("load-document",document=>{
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document',documentId,documentName)
    },[socket,quill,documentId])

    useEffect(()=>{
        
        if(socket == null || quill == null) return

        const interval=setInterval(()=>{
            socket.emit('save-document',quill.getContents())
        }, SAVE_INTERVAL_MS)

        return ()=>{
            clearInterval(interval)
        }

    },[socket,quill])
    
    useEffect(()=>{
        if (socket == null || quill == null) return
        
        const handler=delta=>{
            quill.updateContents(delta)
        }
        socket.on('receive-changes',handler)

        return ()=>{
            socket.off('receive-changes',handler)
        }
    },[socket,quill])

    useEffect(()=>{
        if (socket == null || quill == null) return

        const handler=(delta,oldDelta,source)=>{
            if(source !=='user') return
            socket.emit("send-changes",delta)
        }
        quill.on('text-change',handler)

        return ()=>{
            quill.off('text-change',handler)
        }
    },[socket,quill])


    useEffect(() => {
        const interval = setInterval(() => {
          const currentQuillContent = quill.getContents();
          const storedVersions = JSON.parse(localStorage.getItem("trackingContents")) || [];
          storedVersions.push({
            version: versionIndex,
            content: currentQuillContent,
          });
          localStorage.setItem("trackingContents", JSON.stringify(storedVersions));
          setVersionIndex(versionIndex + 1);
        }, 10000); // Change to 10 seconds
      
        return () => {
          clearInterval(interval);
        };
      }, [quill, versionIndex]);
      

      const printLocalStorageContent = () => {
        const storedVersions = JSON.parse(localStorage.getItem("trackingContents")) || [];
        storedVersions.forEach((version) => {
          console.log(`Version ${version.version}:`, version.content);
        });
        setEither('2')
      };


      const displayContentInModal = () => {
        const storedVersions = JSON.parse(localStorage.getItem("trackingContents")) || [];
        let modalContent = "";
        storedVersions.forEach((version) => {
          modalContent += `Version ${version.version}:\n`;
          modalContent += JSON.stringify(version.content, null, 2); // Convert content to JSON string with indentation
          modalContent += "\n\n";
        });
        setModalContent(modalContent);
        setIsModalOpen(true);
        setEither('2')
      };


    const Abc = () => {
        window.print();
    };

    const openModal = () => {

      };

    const closeModal = () => {
    setIsModalOpen(false);
    };

    const def=()=>{
        const printing=quill.getContents()
        setNth(prevNth => prevNth + 1);
        localStorage.setItem('editorContents', JSON.stringify(printing));
        const docnamex = `${documentName}-${nth}.0-`
        // setButtonPopup(true)
        const url=`/document/${dynamicUuid}?name=${encodeURIComponent(docnamex)}`
        window.open(url, '_blank');
    }


    const handleSave = () => {
        const restore=localStorage.getItem('editorContents')
        quill.setContents(JSON.parse(restore))
        localStorage.removeItem('editorContents'); // Remove the stored contents
    };
    const jkl=()=>{
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtToken1');
        navigate('/logster')
    }

    const add=()=>{
        setOpen(true)
    }
    const dashboard=()=>{
        navigate('/dashboard')
    }
    const actions = [
        { label: "Export to PDF 💪", icon: <FcExport />, onClick: Abc },
        { label: "Create a new Version ✨", icon: <FcOpenedFolder />, onClick: def },
        { label: "Add Collaborators🏆", icon: <FcCollaboration />, onClick: add},
        { label: "Create a HTML Template", icon: <FcExport />, onClick: convertQuillToHtml },
        { label: "Tracking Changes", icon: <FcClock />, onClick: displayContentInModal },
        { label: "Go to Dashboard", icon: <FcHome />, onClick: dashboard },
        { label: "Log Out🏃‍♀️", icon: <FcFullTrash />, onClick: jkl },
    ];


    const wrapperRef = useCallback(wrapper=>{
        if(wrapper==null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: 'snow', modules: modules}); 
        q.disable()
        const storedContents = localStorage.getItem('editorContents');
        if (storedContents) {
          const delta = {
            ops: [{ attributes: { color: '#000000' }, insert: 'This is sample text.' }],
          };
          q.setContents(delta);
        } else {
          q.setText('Loading...');
        }
        setQuill(q);
            setQuill(q)
    }, []);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          setSnackbarOpen(false);
        }
      };

    const sendMail=()=>{
        setOpen(false)
        const sender_mail=localStorage.getItem("jwtToken1")
        const currentURL = window.location.href;
        const parts = currentURL.split('/');
        const lastPart = parts[parts.length - 1];

        const opts = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // name: usernameInput,
              sender_mail:sender_mail,
              collab_email: collab_email,
              code_string: lastPart
              // password: passwordInput,
            }),
          };

          fetch("http://127.0.0.1:5000/add_collab", opts)
          .then((resp) => {
            if (resp.status === 200) {
              setSnackbarOpen(true);   
              return resp.json();
            } else {
              throw new Error("OTP sent Failed");
            }
          })
          .then((data) => {
            console.log(data)
          })
          .catch((error) => {
            console.error("There was an error:", error);
        });
 }

    return (
        <>
            <div className="love"  style={{display:'flex',flexDirection:'row',marginTop:'2%',marginBottom:'2%'}}>
            <div style={{marginLeft:'3%'}}>
            <h2>Document Name</h2>
            <p>{documentName}</p>
            </div>
            <div style={{marginLeft:'3%'}}>
            <h2>Connected Clients:</h2>
            <ul>
                {connectedClients.map(clientName => (
                    <li key={clientName}>{clientName}</li>
                ))}
            </ul> </div>    
            </div>      
            <div className="container" ref={wrapperRef}></div>
            <Fab actions={actions} />
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}nth={nth} docname={documentName} onSave={handleSave}/>
            <Dialog open={open}>
                <DialogTitle>Enter the user mailID to add them as a collaborator</DialogTitle>
                <DialogContent>
                {/* <DialogContentText>OTP sent to {emailInput}</DialogContentText> */}
                <input type="text" value={collab_email} onChange={(e) => setCollab_email(e.target.value)} />
                </DialogContent>
                <DialogActions>
                <Button color="primary" onClick={sendMail}>
                    Send Document
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000} // Adjust the duration as needed
            onClose={handleSnackbarClose}
            >
                <Alert
                onClose={handleSnackbarClose}
                severity="success"
                sx={{ width: '100%' }}
                >
                File shared successfully ! 
                </Alert>
            </Snackbar>
            <ContentModal
            open={isModalOpen}
            onClose={closeModal}
            quillHtml={quillHtml}
            modalContent={modalContent}
            either={either}
            />

        </>
    );
}