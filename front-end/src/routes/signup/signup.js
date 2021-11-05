import '../../main.css';
import { useState } from 'react';
import { Button, TextField, Typography, Box } from '@material-ui/core';
import axios from 'axios';
import NavBar from '../../componets/navbar/navbar';
import Logo from '../../images/logo.jpg';

function SignUpPage({ user, loginUser }) {

  const [email, changeEmail] = useState("");
  const [firstName, changeFirstName] = useState("");
  const [lastName, changeLastName] = useState("");
  const [userName, changeUserName] = useState("");
  const [password, changePassword] = useState("");
  const [confirmedPassword, changeConfirmedPassword] = useState("");
  const [errors, changeErrors] = useState({});

  function ValidUserName() {
    if (!userName || userName.length < 3 || userName.length > 25) {
      return "Username must be between 3 and 35 characters";
    }
    if (userName.match(/[^a-z0-9_]/i)) {
      return "Usernames can only contain letters and numbers";
    }
    return null;
  }

  function ValidFirstName() {
    if (!firstName || firstName.length < 3 || firstName.length > 25) {
      return "First Name must be between 3 and 35 characters";
    }
    if (firstName.match(/[^a-z]/i)) {
      return "First name can only contain letters";
    }
    return null;   
  }
  
  function ValidLastName() {
    if (!lastName || lastName.length < 3 || lastName.length > 25) {
      return "Last name must be between 3 and 35 characters";
    }
    if (lastName.match(/[^a-z]/i)) {
      return "Last Name can only contain letters";
    }
    return null;   
  }

  function ValidEmail() {
    if (!email || email.match(/^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/) || !email.toLowerCase().endsWith(".edu")) {
      return "You must enter an email address from university";
    }
    return null;
  }

  function ValidPassword() {
    if (password !== confirmedPassword) {
      return "Passwords do not match";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    let lowerCase = false;
    let upperCase = false;
    let number = false;
    for (let i = 0; i < password.length; ++i) {
      if (password[i] >= '0' && password[i] <= '9') number = true;
      else if (password[i] <= 'z' && password[i] >= 'a') lowerCase = true;
      else if (password[i] <= 'Z' && password[i] >= 'A') upperCase = true;
    }
    if (!lowerCase || !upperCase || !number) {
      return "Passwords must contain an uppercase, lowercase and number";
    }
    return null;
  }

  function ValidateUserInfomation() {
    let newErrors = {}
    newErrors.userName = ValidUserName();
    newErrors.firstName = ValidFirstName();
    newErrors.lastName = ValidLastName();
    newErrors.email = ValidEmail();
    newErrors.password = ValidPassword();
    changeErrors(newErrors);
    console.log(newErrors)
    return Object.values(newErrors).every(x => x === null);
  }


  async function CreateUser() {
    if (!ValidateUserInfomation()) {
      console.log("Invalid creds");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/~cen4010_fa21_g11/api/signup.php", {
        user: {
          email: email,
          firstname: firstName,
          lastname: lastName,
          username: userName,
          password: password
        }
      });
      console.log("Created user");
      console.log(res.data);
      loginUser(res.data.user);
    }
    catch(error) {
      console.log("Failed to create user", error?.response?.data);
    }
  }


  const textFieldProps = {
    required: true,
    size: "large",
    style: {
      minWidth: 280,
      marginBottom: 20
    },
    variant: "outlined"
  }


  return (
    <div>
      <NavBar user={user}/>
      <Box style={{display: "flex", textAlign: "center"}}>
        <img src={Logo} alt="lighthouse" style={{marginTop: 10, maxWidth: "10%"}} />
        <Typography variant="h3" style={{flex: 1, marginTop: 40, fontSize: 60}}>
          Sign up to <Typography variant="inherit" className="beacon-blue">Beacon</Typography>!
        </Typography>
      </Box>
      <Box style={{margin: 50, textAlign: "center"}}>
        <Box>
          <TextField {...textFieldProps} helperText={errors.email} error={errors.email ? true : false} label="email" value={email} onChange={e => changeEmail(e.target.value)} />
        </Box>
        <Box>
          <TextField {...textFieldProps} helperText={errors.firstName} error={errors.firstName ? true : false} label="first name" value={firstName} onChange={e => changeFirstName(e.target.value)} />
        </Box>
        <Box>
          <TextField {...textFieldProps} helperText={errors.lastName} error={errors.lastName ? true : false} label="last name" value={lastName} onChange={e => changeLastName(e.target.value)} />
        </Box>
        <Box>
          <TextField {...textFieldProps} helperText={errors.userName} error={errors.userName ? true : false} label="user name" value={userName} onChange={e => changeUserName(e.target.value)} />  
        </Box>
        <Box>
          <TextField {...textFieldProps} error={errors.password ? true : false} type="password" label="password" value={password} onChange={e => changePassword(e.target.value)} />
        </Box>
        <Box>
          <TextField {...textFieldProps} helperText={errors.password} error={errors.password ? true : false} type="password" label="confirm password" value={confirmedPassword} onChange={e => changeConfirmedPassword(e.target.value)} />
        </Box>
        <Box>
          <Button style={{minWidth: 280, backgroundColor: "#7791F9", fontSize: 20}} onClick={_ => CreateUser()}>
            Submit
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default SignUpPage;
