import "../App.css";

// Material UI imports
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import Paper from "@mui/material/Paper";
import LockIcon from "@mui/icons-material/Lock";

import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function App() {
  const [checked, setChecked] = useState(true);
  
  useEffect(()=>{

    const checking=localStorage.getItem("hello")
    if(checking){
      setChecked(true)
    }

  },[])

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="App" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={3} style={{ padding: "5%", paddingBottom: "50px", width:"60vh"}}>
        <div align="center">
          {checked ? (
            <Chip
              icon={<LockIcon />}
              label="Log In"
              variant="outlined"
              color="info"
            />
          ) : (
            <Chip
              icon={<FaceIcon />}
              label="Sign Up"
              variant="outlined"
              color="info"
            />
          )}
          <br />

          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>

        {checked ? <Login /> : <Signup />}
      </Paper>
    </div>
  );
}

export default App;
