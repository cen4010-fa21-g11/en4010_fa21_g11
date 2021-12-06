import '../../main.css';
import { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Fade, Menu, MenuItem } from '@material-ui/core';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom';

function NavBar({ user, reset = null }) {

  const history = useHistory();

  function redirect(path) {
    if (path === "/posts" && reset) {
      reset(true);
    }
    else {
      history.push("/~cen4010_fa21_g11/project" + path);
    }
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
              Welcome, {user.firstname[0].toUpperCase() + user.firstname.substr(1).toLowerCase()}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={close}>
          Account
        </MenuItem>
        <MenuItem onClick={close}>
          My Posts
        </MenuItem>
        <MenuItem onClick={() => redirect("/createpost")}>
          Create Post
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
        <Typography onClick={() => redirect("/")} variant="h2" className="beacon-blue" style={{fontWeight: "normal", cursor: "pointer"}}>
          Beacon
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button style={{backgroundColor: "white", minWidth: 75, fontSize: "large"}} onClick={_ => redirect("/posts")}>
          Posts
        </Button>
        {!userLoggedIn() ? getLoginSigninButton() : getUserProfileButton()}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
