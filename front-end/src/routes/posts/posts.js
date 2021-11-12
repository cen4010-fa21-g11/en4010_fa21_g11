import '../../main.css';
import { Button, Box, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import NavBar from '../../componets/navbar/navbar';
import Logo from '../../images/logo.jpg';
import axios from 'axios';
import ErrorScreen from '../../componets/errorscreen/errorscreen';
import LoadingScreen from '../../componets/loadingscreen/loadingscreen';

function PostsPage({ user }) {
  
  const [posts, changePosts] = useState([]);
  const [error, changeError] = useState(null);
  const [courses, changeCourses] = useState([]);
  const [displayItem, changeDisplayItem] = useState("loading");
  const [currentCourse, changeCurrentCourse] = useState(null);
  
  useEffect(() => {
    GetCourses();
  }, []);


  async function GetCourses() {
    try {
      let res = await axios.get("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/getcourses.php");
      if (res.data.error === false) {
        console.log("Got response");
        console.log(res);
        changeCourses(res.data.courses);
        changeError(null);
        changeDisplayItem("courses");
      }
      else {
        console.log(res);
        console.log("Error is true");
      }
    }  
    catch(e) {
      console.log(e);
      console.log(e?.response?.data);
      changeError("Unable to get courses");
    }
  }


  async function LoadPost(name, id) {
    try {
      const res = await axios.get("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/getposts.php", {
        courseid: id
      });
      if (res.data.error === false) {
        changeCurrentCourse(name);
        changeDisplayItem("posts")
        changePosts(res.data.posts);
        console.log(res.data.posts);
        changeError(null);
      }
      else {
        console.log(res);
        console.log("error is true");
      }
    }
    catch(e) {
      console.log(e);
      console.log(e?.response?.data);
    }
  }


  function Posts() {
    return posts.map((post, index) => {
      return (
        <Box key={index} style={{textAlign: "center", border: "5px #7791F9", marginBottom: 20, margin: 15, borderStyle: "outset", borderRadius: "15px"}}>
          <Typography variant="h3" style={{marginTop: 10}}>
            {post.title}
          </Typography>
          <Typography variant="h5">
            {post.text}
          </Typography>
          <Button style={{color: "white", backgroundColor: "#4E4E4E", marginTop: 10, marginBottom: 10}}>
            Comments
          </Button>
        </Box>
      );
    })
  }

  function Courses() {
    return courses.map((course, index) => {
      return (
        <Box key={index} component="div" style={{border: "5px #7791F9", textAlign: "center", margin: 15, borderStyle: "outset", borderRadius: "15px"}} >
          <Typography style={{fontSize: 40, marginBottom: 10}}>
            {course.name.split(" ").map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(" ")}
          </Typography>
          <Button style={{backgroundColor: "#4E4E4E", color: "white", marginBottom: 20}} onClick={() => LoadPost(course.name, course.id)}>
            See Posts
          </Button>
        </Box>
      );
    });
  }


  function NormalScreen() {
    if (displayItem === "loading") {
      return <LoadingScreen />
    }

    if (displayItem === "courses") {
      return <Courses />
    }
    
    if (displayItem === "posts") {
      return <Posts />
    }
  }


  return (
    <Box>
      <NavBar user={user} />
      <Box style={{marginTop: 10, display: "flex", marginBottom: 50}}>
        <img src={Logo} alt="lighthouse" style={{maxWidth: "10%"}} />
        <Box style={{textAlign: "center", flexGrow: 1}}>
          <Typography variant="h2" style={{marginTop: 10, fontWeight: "normal"}}>
            {error ? error : "Showing " + (posts.length ? `posts in ${currentCourse}` : "courses") + " at " + user.collegeid.toUpperCase()}
          </Typography>
        </Box>
      </Box>
      
      {error ? <ErrorScreen errorMsg={error} /> : NormalScreen()}
    </Box>
  );
}

export default PostsPage;
