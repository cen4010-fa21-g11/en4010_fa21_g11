import '../../main.css';
import { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ user, loginUser}) {

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");

  const history = useHistory();

  function redirect(path) {
    history.push("/~cen4010_fa21_g11/project" + path);
  }

  useEffect(_ => {
    CookieLogin();
  }, []);

  function CookiesSet() {
    return document.cookie.indexOf("email") >= 0 && document.cookie.indexOf("session_token") >= 0;
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
    if (!email || !password) {
      console.log("Password or email is not set");
      return;
    }
    try {
      const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/login.php", {
        email: email,
        password: password
      });
      if (res.data.error === false) {
        let temp = res.data.user;
        temp.verified = true;
        loginUser(temp);
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
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <div>
        <TextField label="email" variant="outlined" value={email} onChange={e => changeEmail(e.target.value)} />
      </div>
      <div>
        <TextField label="password" variant="outlined" value={password} onChange={e => changePassword(e.target.value)} />
      </div>

      <Button onClick={e => LoginWithEmail()}>
        Login
      </Button>

      <Link to="/">
        <Button>
          Home
        </Button>
      </Link>
    </div>
  );
}

export default LoginPage;
