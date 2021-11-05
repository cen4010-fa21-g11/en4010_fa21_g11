import '../../main.css';
import { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ user, loginUser}) {

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");

  useEffect(_ => {
    CookieLogin();
  }, []);

  function CookiesSet(name) {
    return document.cookie.indexOf(name) !== -1;
  }

  async function CookieLogin() {
    if (!user || user.validated || !CookiesSet()) return;
    try {
      const res = await axios.post("http://localhost:3000/~cen4010_fa21_g11/api/login.php");
      if (res.data.error === false) {
        let temp = res.data.user;
        temp.validated = true;
        loginUser(temp);
      }
    }
    catch {
      console.log("Error with post request");
    }
  }

  async function LoginWithEmail() {
    if (!email || !password) return;
    try {
      const res = await axios.post("http://localhost:3000/~cen4010_fa21_g11/api/login.php", {
        email: email,
        password: password
      });
      if (res.data.error === false) {
        let temp = res.data.user;
        temp.validated = true;
        loginUser(temp);
      }
      console.log("Got result from login with email");
      console.log(res.data);
    }
    catch(error) {
      console.log("Error with login with email", error?.response?.data);
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
