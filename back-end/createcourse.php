<?php
  require '../../c.php';

  header('Content-type: application/json');

  $json = file_get_contents('php://input');

  // if users cookies are not set or no no info was sent
  if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token']) || empty($json)) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  // decode the json sent
  $json = json_decode($json);

  // if invalid json or no name sent
  if (empty($json) || empty($json->name)) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  // connect to databse
  $conn = new mysqli($server, $username, $pwd, $db);

  // error connecting
  if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  // create query string
  // and sanitize user cookies 
  $query = sprintf("SELECT * FROM users WHERE id='%s' AND cookie='%s'", $conn->real_escape_string($_COOKIE['userid']), $conn->real_escape_string($_COOKIE['session_token']));

  // execute the query
  $res = $conn->query($query);

  // if query failed or user cookies do not match that of a user
  if (!$res || !$res->num_rows) {
    $conn->close();
    http_response_code(401);  
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  // get the users data from query results
  $user = $res->fetch_assoc();

  // generate course unique id
  $courseID = uniqid();

  // craft query string for creating course
  // again must sanitize the data
  $query = sprintf("INSERT INTO courses (courseid, name, collegeid) VALUES ('%s', '%s', '%s')", $conn->real_escape_string($courseID), $conn->real_escape_string($json->name), $conn->real_escape_string($user['collegeid']));

  // execute that query
  $res = $conn->query($query);

  // if the query failed
  if (!$res) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  // send the data back to the user
  echo json_encode(array('error' => FALSE, 'course' => array(
    'courseid' => $courseID,
    'name' => $json->name,
  )));
  
  $conn->close();
?>