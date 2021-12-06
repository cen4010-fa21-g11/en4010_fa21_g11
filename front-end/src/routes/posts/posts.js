import '../../main.css';
import { Button, Box, Typography, TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';
import NavBar from '../../componets/navbar/navbar';
import Logo from '../../images/logo.jpg';
import axios from 'axios';
import ErrorScreen from '../../componets/errorscreen/errorscreen';
import LoadingScreen from '../../componets/loadingscreen/loadingscreen';
import { useHistory } from 'react-router';

function PostsPage({ user }) {

  const [posts, changePosts] = useState([]);
  const [error, changeError] = useState(null);
  const [courses, changeCourses] = useState([]);
  const [displayItem, changeDisplayItem] = useState("loading");
  const [currentCourse, changeCurrentCourse] = useState(null);
  const [reset, changeReset] = useState(false);
  const [currentPost, changeCurrentPost] = useState(null); 

  if (reset) {
    changeReset(false);
    console.log("calling reset");
    changePosts([]);
    changeError(null);
    changeCourses([]);
    changeDisplayItem("loading");
    changeCurrentCourse(null);
    GetCourses();
  }

  const history = useHistory();

  function redirect(path) {
    history.push("/~cen4010_fa21_g11/project" + path);
  }

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
        params: {
          courseid: id
        }
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
          <Button style={{color: "white", backgroundColor: "#4E4E4E", marginTop: 10, marginBottom: 10}} onClick={e => {
            console.log("STARTING CLICK");
            changeDisplayItem("comments");
            changeCurrentPost(post);
            console.log(post)
            console.log("After clicked comment");
          }}>
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


  // make message better
  function EmptyCourses() {
    return (
      <Box component="div" style={{textAlign: "center"}}>
        <Typography variant="h2" style={{fontWeight: "normal"}}>
          No Courses at your school
        </Typography>
        <Button style={{minWidth: 300, backgroundColor: "#7791F9", fontSize: 20, marginTop: 30}} onClick={() => redirect("/createpost")} >
          Be the very first to create one
        </Button>
      </Box>
    );
  }


  function Comments({ post }) {
    const [allComments, changeAllComments] = useState([]);
    const [loading, changeLoading] = useState(true);
    const [creatingComment, changeCreatingComment] = useState(false);
    const [text, changeText] = useState("");

    async function fetchComments(id) {
      if (id == null) {
        console.log("Got null id in fetch comment");
        return;
      }
      try {
        const res = await axios.get("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/getcomments.php", {
          params: {
            replyto: currentPost.id,
          }
        });
        if (res.data.error === false) {
          changeAllComments(res.data.comments);
        }
        else {
          console.log("Erorr is true in fetching comments");
          console.log(res);
        }
        
      }
      catch(e) {
        console.log("error getting comment id: ", id);
        console.log(e);
        console.log(e?.response?.data);
      }
    }

    useEffect(() => {
      async function fetchAllComments() {
        await fetchComments(post.id);
      }
      fetchAllComments();
      changeLoading(false);
    }, []);


    function displayComments() {
      return (
        <Box style={{fontSize: 30, margin: 30, textAlign: "center"}} component="div">
          {allComments.map((comment, index) => {
            return (
              <Box component="div" key={index} style={{marginTop: 40, textAlign: "center", border: "3px solid #7791F9", marginLeft: 50, marginRight: 50}}>
                <Typography display="inline" style={{fontSize: 30, margin: 20}}>{comment.text}</Typography>
              </Box>
            )
          })}
        </Box>
      )
    }
   
    function Loading() {
      return (
        <Box component="div" style={{fontSize: 60}}>
          Loading
        </Box>
      )
    }

    function displayCurrentPost() {
      return (
        <Box component="div" style={{border: "5px #7791F9", marginLeft: 50, marginRight: 50, marginTop: 100, marginBottom: 10, textAlign: "center", borderStyle: "outset", borderRadius: "15px"}}>
          <Typography style={{fontSize: 50}}>{currentPost.title}</Typography>
          <Box component="div" style={{textAlign: "center"}}>
            <Typography style={{fontSize: 35, marginBottom: 20}}>{currentPost.text}</Typography>
            <Button style={{fontSize: 25, backgroundColor: "#7791F9", marginBottom: 20}} onClick={e => changeCreatingComment(!creatingComment)}>Comment</Button>
          </Box>
       </Box>
      )
    }


    async function submit() {
      try {
        const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/createcomment.php", {
          text: text,
          replyto: currentPost.id
        });
        if (res.data.error === false) {
          changeAllComments([{id: res.data.id, text: text, replyto: currentPost.id}, ...allComments]);
          console.log("Success for adding comment");
          changeCreatingComment(false);
          changeText("");
        }
        else {
          console.log("Error was true for submit");
          console.log(res);
        }
      }
      catch (e) {
        console.log("Error in submitting comment");
        console.log(e);
        console.log(e?.response?.data);
      }
    }

    return (
      <Box component="div" style={{margin: 50}}>
        {displayCurrentPost()}
        {creatingComment ? 
          <Box component="div" style={{textAlign: "center"}}>
            <TextField value={text} style={{margin: 40, fontSize: 20, minWidth: 300}} required onChange={e => changeText(e.target.value)} multiline rows={3} label="comment" variant="outlined" />
            <Button style={{fontSize: 20, backgroundColor: "#7791F9", marginTop: 60}} onClick={e => submit()}>
              Post
            </Button>            
          </Box>
          : null
        }
        {loading ? <Loading /> : displayComments()}
      </Box>
    );
  }


  function NormalScreen() {
    if (error) {
      return <ErrorScreen errorMsg={error} />
    }

    if (displayItem === "loading") {
      return <LoadingScreen />
    }

    if (displayItem === "courses" && !courses.length) {
      return <EmptyCourses />
    }

    if (displayItem === "courses") {
      return <Courses />
    }
    
    if (displayItem === "posts") {
      return <Posts />
    }

    if (displayItem === "comments") {
      return <Comments post={currentPost} />
    }
  }

  return (
    <Box>
      <NavBar user={user} reset={changeReset} />
      <Box style={{marginTop: 10, display: "flex", marginBottom: 50}}>
        <img src={Logo} alt="lighthouse" style={{maxWidth: "10%"}} />
        <Box style={{textAlign: "center", flexGrow: 1}}>
          <Typography variant="h2" style={{marginTop: 10, fontWeight: "normal"}}>
            {error ? error : "Showing " + (displayItem === "posts" ? `posts in ${currentCourse}` : displayItem === "comments" ? "comments on a post" : "courses") + " at " + user.collegeid.toUpperCase()}
          </Typography>
        </Box>
      </Box>
      
      {NormalScreen()}
    </Box>
  );
}

export default PostsPage;
