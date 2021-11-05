import '../../main.css';
import { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Fade, Menu, MenuItem } from '@material-ui/core';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';

function NavBar({ user }) {

  const history = useHistory();

  function redirect(path) {
    history.push(path);
  }

  //for testing when user is logged in
  let devUser = {
    firstName: "TempUser",
    lastName: "LastName Temp user",
    email: "tempuser@somehting.edu",
    username: "temp_user",
    verified: true
  }

  function userLoggedIn() {
    return user && user.verified;
  }

  function click(e) {
    changeAnchor(e.currentTarget);
  }

  function close() {
    changeAnchor(null);
  }

  const [anchor, changeAnchor] = useState(null);
  const open = Boolean(anchor);


  function getUserProfileButton() {
    return (
    <div>
      <AccountCircleIcon style={{fontSize: 50, marginLeft: 20}} onClick={click}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="fade-menu"
      />
      <Menu id="fade-menu" open={open} anchorEl={anchor} onClose={close} TransitionComponent={Fade} MenuListProps={{'aria-labelledby': 'fade-button'}}>
        <MenuItem>
          <Box>
            <Typography style={{fontSize: 30}}>
              Welcome, {devUser.firstName[0].toUpperCase() + devUser.firstName.substr(1).toLowerCase()}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={close}>
          Account
        </MenuItem>
        <MenuItem onClick={close}>
          My Posts
        </MenuItem>
      </Menu>
    </div>)
  }


  function getLoginSigninButton() {
    return (<>
    <Button style={{backgroundColor: "white", marginLeft: 10, minWidth: 75, fontSize: "large"}} onClick={_ => redirect("/signup")}>
      Signup
    </Button>
    <Button style={{backgroundColor: "white", marginLeft: 10, minWidth: 75, fontSize: "large"}} onClick={_ => redirect("/login")}>
      Login
    </Button>
   </>)
  }


  return (
    <AppBar position="static" style={{backgroundColor: "#4E4E4E"}}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h2" className="beacon-blue" style={{fontWeight: "normal"}}>
            Beacon
          </Typography>
        </Box>
        <Button style={{backgroundColor: "white", minWidth: 75, fontSize: "large"}} onClick={_ => redirect("/posts")}>
          Posts
        </Button>
        {!userLoggedIn() ? getLoginSigninButton() : getUserProfileButton()}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
