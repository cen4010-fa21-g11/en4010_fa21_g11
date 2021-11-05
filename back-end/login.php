<?php
  require '../../c.php';
  require '../../validation.php';
  
  header('Content-type: application/json');

  function InvalidCredentials() {
    http_response_code(400);
    exit(json_encode(array('error' => TRUE, 'message' => "Invalid Login")));
  }

  $json = file_get_contents('php://input');

  if (empty($json)) {
    if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token'])) {
      InvalidCredentials();
    }
    
    if (!ValidateUserSession($_COOKIE['userid'], $_COOKIE['session_token'])) {
      setcookie('userid', "", time() - 3600, '/');
      setcookie('session_token', "", time() - 3600, '/');
      InvalidCredentials();
    }
    exit(json_encode(array('error' => FALSE)));
  }

  $json = json_decode($json);

  if (empty($json->email) || empty($json->password)) {
    InvalidCredentials();
  }

  $conn = new mysqli($server, $username, $pwd, $db);
  if ($conn->connection_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  $query = sprintf("SELECT 1 FROM users WHERE email='%s'", $conn->real_escape_string($_POST['email']));
  $res = $conn->query($query);

  if (empty($res->num_rows)) {
    $conn->close();
    InvalidCredentials();
  }

  $row = $res->fetch_assoc();
  if (!password_verify($_POST['password'], $row['password'])) {
    $conn->close();
    InvalidCredentials();
  }

  $newSessionToken = GetRandomString(30);
  $query = sprintf("UPDATE users SET cookie='%s' WHERE id='%s'", $newSessionToken, $row['id']);
  $res = $conn->query($query);

  if (empty($res->num_rows)) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }
  
  //TO-DO figure out the route and change /~cen4010_fa21_g11/ to the proper route ex: /~cen4010_fa21_g11/final-project
  setcookie('email', $_POST['email'], time() + 604800, "/~cen4010_fa21_g11/", "lamp.cse.fau.edu", TRUE);
  setcookie('session_token', $newSessionToken, time() + 604800, "/~cen4010_fa21_g11/", "lamp.cse.fau.edu", TRUE);

  echo json_encode(array('error' => FALSE, 'user' => array(
    'email' => $row['email'],
    'firstname' => $row['firstname'],
    'lastname' => $row['lastname'],
    'username' => $row['username'],
    'id' => $row['id']
  )));

  $conn->close();
?>