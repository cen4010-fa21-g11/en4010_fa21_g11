import '../../main.css';
import { useState, useEffect } from 'react';
import NavBar from '../../componets/navbar/navbar';
import { Box, Typography, Button, TextField, FormControl, Select, MenuItem, InputLabel, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import Logo from '../../images/logo.jpg';
import axios from 'axios';
import { useHistory } from 'react-router';

function CreatePostPage({ user }) {

  const [title, changeTitle] = useState("");
  const [text, changeText] = useState("");
  const [selectedCourse, changeSelectedCourse] = useState("Null");
  const [courses, changeCourses] = useState([]);
  const [errors, changeErrors] = useState({});
  const [createCourse, changeCreateCourse] = useState(false);
  const [createCourseTitle, changeCreateCourseTitle] = useState("");

  const history = useHistory();

  function redirect(path) {
    history.push("/~cen4010_fa21_g11/project" + path);
  }
  
  useEffect(() => {
    FetchCourses();
  }, []);

  async function FetchCourses() {
    try {
      const res = await axios.get("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/getcourses.php");
      if (res.data.error === false) {
        console.log("Got courses");
        changeCourses(res.data.courses);
      }
    }
    catch(e) {
      console.log(e);
    }
  }

  const textFieldProps = {
    variant: "outlined",
    required: true,
    style: {
      minWidth: 300,
      marginBottom: 30
    }
  }

  function ValidateInput() {
    let newErrors = {};
    if (title.length < 5 || title.length > 50) {
      newErrors.title = "Title length must be between 5 and 50 characters";
    }
    if (text.length < 5 || text.length > 1000) {
      newErrors.text = "Text length must be between 5 and 1000 characters";
    }
    if ((!selectedCourse || selectedCourse === "Null") && !createCourse) {
      newErrors.course = "You must select a course";
    }
    if (createCourse && (!createCourseTitle || createCourseTitle.length < 5 || createCourseTitle.length > 50)) {
      newErrors.createcourse = "Must provide a course title between 5 and 50 characters";
    }

    changeErrors(newErrors);
    console.log(newErrors);
    return newErrors ? true : false;
  }

  async function CreatePost() {
    if (!ValidateInput()) return;
    if (!user || !user.verified) return;

    // needed as if we change selectedCourse, because it is a ll nhook wiot show
    // properly later in the function as the change does not work for this scope
    let currentCourse = selectedCourse;

    //create the course
    if (createCourse) {
      try {
        const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/createcourse.php", {
          name: createCourseTitle
        });
        if (res.data.error === false) {
          currentCourse = res.data.course.courseid;
        }
        else {
          console.log("Error is true for creating course");
          console.log(res);
          return;
        }
      }
      catch (e) {
        console.log("Unable to create post");
        console.log(e);
        console.log(e?.response?.data);
        return;
      }
    }

    //create the post
    try {
      console.log(currentCourse);
      const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/createpost.php", {
        title: title,
        text: text,
        courseid: currentCourse 
      });
      if (res.data.error === false) {
        console.log(res);
        console.log("Created");
        redirect("/posts");
      }
      else {
        console.log("Error is true");
      }
    }
    catch(e) {
      console.log("Error in create post");
      console.log(e);
      console.log(e?.response?.data);
    }
  }

  return (
    <Box style={{marginBottom: 100}}>
      <NavBar user={user} />
      <Box style={{display: "flex"}}>
        <img src={Logo} alt="lighthouse" style={{maxWidth: "10%", marginTop: 10}} />
        <Typography variant="h3" style={{flexGrow: 1, textAlign: "center", marginTop: 20, fontSize: 80}}>
          Create a post at {user.collegeid.toUpperCase()}
        </Typography>
      </Box>
      <Box style={{marginTop: 30, textAlign: "center"}}>
        <Box component="div">
          <TextField {...textFieldProps} error={errors.title ? true : false} helperText={errors.title} multiline rows={3} value={title} onChange={e => changeTitle(e.target.value)} label="Title" />
        </Box>
        <Box component="div">
          <TextField {...textFieldProps} error={errors.text ? true : false} helperText={errors.text} multiline rows={8} value={text} onChange={e => changeText(e.target.value)} label="Text" />
        </Box>
        <Box component="div" style={{marginBottom: 30}}>
          <FormControl variant="outlined" style={{minWidth: 300}}>
            <InputLabel>
              Course
            </InputLabel>
            <Select
              label="Course"
              value={selectedCourse}
              onChange={e => changeSelectedCourse(e.target.value)}
              error={errors.course ? true : false}
            >
              <MenuItem value={"Null"}>Null</MenuItem>
              {courses.map((course, index) => {
                return (
                  <MenuItem key={index} value={course.id}>
                    {course.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box style={{marginTop: 20}}>
          <Typography variant="h6">
            Dont see the course?
          </Typography>
          <FormGroup style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
            <FormControlLabel control={<Checkbox checked={createCourse} style={{color: "#7791F9"}} onChange={e => changeCreateCourse(e.target.checked)} />} label="Create Course" />
          </FormGroup>
        </Box>
        {createCourse && <Box style={{marginTop: 20}}>
          <TextField {...textFieldProps} label="Course Name" error={errors.createcourse ? true : false} helperText={errors.createcourse} value={createCourseTitle} onChange={e => changeCreateCourseTitle(e.target.value)} />
        </Box>}
        <Button onClick={() => CreatePost()} style={{minWidth: 300, backgroundColor: "#7791F9", fontSize: 20, marginTop: 15}}>
          Create
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePostPage;