import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Alert,
  Stack,
  Box
} from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [usernameInput, setUsernameInput] = useState();
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formValid, setFormValid] = useState();
  const [success, setSuccess] = useState();
  const [open, setOpen] = useState(false);
  const [otptyped, setOtptyped] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [otpValidated, setOtpValidated] = useState(false);
  const [tpButton, settpButton] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleUsername = () => {
    if (!usernameInput) {
      setUsernameError(true);
      return;
    }
    setUsernameError(false);
  };

  const handleEmail = () => {
    if (!isEmail(emailInput)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
  };

  const handlePassword = () => {
    if (!passwordInput || passwordInput.length < 5 || passwordInput.length > 20) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  const handleSubmit = () => {
    setSuccess(null);

    if (usernameError || !usernameInput) {
      setFormValid("Username is set btw 5 - 15 characters long. Please Re-Enter");
      return;
    }

    if (emailError || !emailInput) {
      setFormValid("Email is Invalid. Please Re-Enter");
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid("Password is set btw 5 - 20 characters long. Please Re-Enter");
      return;
    }

    setFormValid(null);

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // name: usernameInput,
        email: emailInput,
        // password: passwordInput,
      }),
    };


    fetch("http://127.0.0.1:5000/generate_otp", opts)
      .then((resp) => {
        if (resp.status === 200) {
          console.log("OTP sent successfully");
          setOpen(true)
          return resp.json();
        } else {
          throw new Error("OTP sent Failed");
        }
      })
      .then((data) => {
        localStorage.setItem("xzcdcvf",data.otp);
        setSuccess("OTP Sent Successfully");
      })
      .catch((error) => {
        console.error("There was an error:", error);
        setFormValid("OTP Failed. Please try again later.");
      });
  };

  const validateOtp =()=>{

    const entered_otp=otptyped
    const stored_otp=localStorage.getItem("xzcdcvf")
    if(entered_otp === stored_otp){
      console.log("OTP Matched");
      setSuccessMessage('OTP Verification Successful');
      setSnackbarOpen(true); 
      setOpen(false)
      setOtpValidated(true);
      settpButton(false)
      localStorage.removeItem("xzcdcvf")
    }
    else{
      setSuccess("Please Re-Enter the OTP")
    }

  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      setSnackbarOpen(false);
    }
  };

  const registerApi=()=>{
    
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: usernameInput,
        email: emailInput,
        password: passwordInput,
      }),
    };


    fetch("http://127.0.0.1:5000/register", opts)
      .then((resp) => {
        console.log(resp.statusText)
        if (resp.status === 200) {
          return resp.json();
        } else {
          throw new Error("Registration Failed");
        }
      })
      .then((data) => {
        console.log("Response JSON:", data);
        if(data.status === 201){
          setFormValid(data.message);
        }
        else if(data.status === 200)
        { 
          setSuccessMessage("Registration Successful ! Now Login using the credentials");
          setSnackbarOpen(true);
          setFormValid("")
          setEmailInput('');
          setPasswordInput('');
          setUsernameInput('');
          }
      })
      .catch((error) => {
        console.error("There was an error:", error);
        setFormValid("Registration Failed. Please try again later.");
      });
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <TextField
          error={usernameError}
          label="Username"
          id="standard-basic"
          variant="standard"
          sx={{ width: "100%" }}
          size="small"
          value={usernameInput}
          InputProps={{}}
          onChange={(event) => {
            setUsernameInput(event.target.value);
          }}
          onBlur={handleUsername}
        />
      </div>

      <div style={{ marginTop: "5px" }}>
        <TextField
          label="Email Address"
          fullWidth
          error={emailError}
          id="standard-basic"
          variant="standard"
          sx={{ width: "100%" }}
          value={emailInput}
          InputProps={{}}
          size="small"
          onBlur={handleEmail}
          onChange={(event) => {
            setEmailInput(event.target.value);
          }}
        />
      </div>
      <div style={{ marginTop: "5px" }}>
        <FormControl sx={{ width: "100%" }} variant="standard">
          <InputLabel
            error={passwordError}
            htmlFor="standard-adornment-password"
          >
            Password
          </InputLabel>
          <Input
            error={passwordError}
            onBlur={handlePassword}
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={(event) => {
              setPasswordInput(event.target.value);
            }}
            value={passwordInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
      <Box style={{height:15}}>

      </Box>
      <div style={{ marginTop: "10px" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={registerApi}
          disabled={!otpValidated} // Disable the button if otpValidated is false
        >
          Register
        </Button>
        <Box style={{height:25}}>

        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!tpButton} 
        >
          Request for OTP
        </Button>
      </div>

      {/* Show Form Error if any */}
      {formValid && (
        <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
          <Alert severity="error" size="small">
            {formValid}
          </Alert>
        </Stack>
      )}

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
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Show Success if no issues */}
      {success && ( 
                      <Dialog open={open}>
                      <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
                        <Alert severity="success" size="small">
                          {success}
                        </Alert>
                      </Stack>
                      <DialogTitle>Enter the OTP</DialogTitle>
                      <DialogContent>
                        <DialogContentText>OTP sent to {emailInput}</DialogContentText>
                        <input type="text" value={otptyped} onChange={(e) => setOtptyped(e.target.value)} />
                      </DialogContent>
                      <DialogActions>
                        <Button color="primary" onClick={validateOtp}>
                          Check
                        </Button>
                      </DialogActions>
                    </Dialog>
      )}
    </div>
  );
}
