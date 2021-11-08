import '../../main.css';
import { Button, Box } from '@material-ui/core';
import { useState, useEffect } from 'react';
import NavBar from '../../componets/navbar/navbar';
import Logo from '../../images/logo.jpg';
import axios from 'axios';

function PostsPage({ user }) {

  const [posts, changePosts] = useState([]);
  const [error, changeError] = useState(false);
  const [courses, changeCourses] = useState([]);
  
  useEffect(() => {
    GetCourses();
  }, []);


  async function GetCourses() {
    try {
      let res = await axios.get("https://localhost:3000/~cen4010_fa21_g11/api/getcourse.php");
      if (res.data.error === false) {
        console.log("Got response");
        changeCourses(res.data.courses);
      }
    }  
    catch(e) {
      console.log(e);
      console.log(e?.response?.data);
    }
  }


  return (
    <div>
      <NavBar user={user} />
      <Box style={{marginTop: 10}}>
        <img src={Logo} alt="lighthouse" style={{maxWidth: "10%"}} />
      </Box>




     
    </div>
  );
}

export default PostsPage;
