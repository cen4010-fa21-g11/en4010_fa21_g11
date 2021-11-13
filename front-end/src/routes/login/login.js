import '../../main.css';
import { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../componets/navbar/navbar';
import Logo from '../../images/logo.jpg';

function LoginPage({ user, loginUser}) {

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [error, changeError] = useState("");

  let textFieldProps = {
    variant: "outlined",
    required: true,
    style: {
      minWidth: 300,
      marginBottom: 20
    }
  }

  const history = useHistory();

  function redirect(path) {
    history.push("/~cen4010_fa21_g11/project" + path);
  }

  useEffect(_ => {
    CookieLogin();
  }, []);

  function CookiesSet() {
    return document.cookie.indexOf("userid") >= 0 && document.cookie.indexOf("session_token") >= 0;
  }

  async function CookieLogin() {
    console.log("Starting login with cookie");
    if (user.verified || !CookiesSet()) {
      if (user.verified) {
        console.log("user is already verified");
      }
      else {
        console.log("Cookies are not set");
      }
      return;
    }
    try {
      const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/login.php");
      if (res.data.error === false) {
        let temp = res.data.user;
        temp.verified = true;
        loginUser(temp);
        console.log("Logged in the user");
        redirect("/");
      }
      else {
        console.log("looks like response code was alright but error is not false");
        console.log(res);
      }
    }
    catch(e) {
      console.log("Error with post request in login with cookie");
      console.log("Response: ", e);
    }
  }

  async function LoginWithEmail() {
    console.log("Starting login with email");
    if (!email || !password) return;
    try {
      const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/login.php", {
        email: email,
        password: password
      });
      if (res.data.error === false) {
        let temp = res.data.user;
        temp.verified = true;
        loginUser(temp);
        changeError("");
        redirect("/");
      }
      else {
        console.log("Axios request went throught but error is true");
      }
      console.log("Got result from login with email");
      console.log(res.data);
    }
    catch(error) {
      console.log("Error with login with email", error?.response?.data);
      console.log(error);
      changeError("Error login in, email or password maybe wrong");
    }
  }

  return (
    <Box>
      <Box style={{marginBottom: 20}}>
        <NavBar user={user} />
        <Box style={{display: "flex", textAlign: "center"}}>
          <img src={Logo} alt="lighthouse" style={{marginTop: 10, maxWidth: "10%"}} />
          <Typography variant="h2" style={{flexGrow: 1, marginTop: 20, fontWeight: "normal"}}>
            Login to your <Typography variant="inherit" className="beacon-blue">Beacon</Typography> Account
          </Typography>
        </Box>
      </Box>

      <Box style={{margin: 60, textAlign: "center"}}>
        <Box component="div">
          <TextField {...textFieldProps} error={error ? true : false} helperText={error} label="email" value={email} onChange={e => changeEmail(e.target.value)} />
        </Box>
        <Box component="div">
          <TextField {...textFieldProps} type="password" error={error ? true : false} helperText={error} label="password" value={password} onChange={e => changePassword(e.target.value)} />
        </Box>
        <Button style={{minWidth: 300, backgroundColor: "#7791F9", fontSize: 20, marginTop: 20}} onClick={e => LoginWithEmail()}>
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
