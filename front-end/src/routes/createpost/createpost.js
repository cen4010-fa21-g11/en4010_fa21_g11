
import { useState, useEffect } from 'react';
import NavBar from '../../componets/navbar/navbar';
import { Box, Typography, Button, TextField, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import Logo from '../../images/logo.jpg';
import axios from 'axios';

function CreatePostPage({ user }) {

  const [title, changeTitle] = useState("");
  const [text, changeText] = useState("");
  const [selectedCourse, changeSelectedCourse] = useState("Null");
  const [courses, changeCourses] = useState([]);
  const [errors, changeErrors] = useState({});

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

  let devUser = {
    collegeid: "fau"
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
    if (!selectedCourse || selectedCourse === "Null") {
      newErrors.course = "You must select a course";
    }

    changeErrors(newErrors);
    console.log(newErrors);
    return newErrors ? true : false;
  }

  async function CreatePost() {
    if (!ValidateInput()) return;
    if (!user || !user.verified) return;
    try {
      const res = await axios.post("https://lamp.cse.fau.edu/~cen4010_fa21_g11/api/createpost.php", {
        title: title,
        text: text,
        courseid: selectedCourse
      });
      if (res.data.errors === false) {
        
      }
    }
    catch(e) {
      console.log(e);
    }
  }


  return (
    <Box style={{marginBottom: 100}}>
      <NavBar user={user} />
      <Box style={{display: "flex"}}>
        <img src={Logo} alt="lighthouse" style={{maxWidth: "10%", marginTop: 10}} />
        <Typography variant="h3" style={{flexGrow: 1, textAlign: "center", marginTop: 20, fontSize: 80}}>
          Create a post at {devUser.collegeid.toUpperCase()}
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
              helperText={errors.course}
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
        <Button onClick={() => CreatePost()} style={{minWidth: 300, backgroundColor: "#7791F9", fontSize: 20}}>
          Create
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePostPage;