<?php
  require '../../c.php';
  require '../../validation.php';

  header('Content-type: application/json');

  $json = file_get_contents('php://input');

  if (empty($json)) {
    InvalidUserInput();
  }

  $json = json_decode($json);
  if (empty($json) || empty($json->user)) {
    InvalidUserInput();
  }

  $user = $json->user;
  
  if (empty($user->firstname) || empty($user->lastname) || empty($user->username) || empty($user->email) || empty($user->password)) {
    InvalidUserInput();
  }

  // Returns error to user upon failing any of the checks
  ValidateFirstName($user->firstname);
  ValidateLastName($user->lastname);
  ValidateUserName($user->username);
  ValidateEmail($user->email);
  ValidatePassword($user->password);

  $hashedPassword = password_hash($user->password, PASSWORD_BCRYPT);
  $userID = uniqid();
  $email = $user->email;
  $firstName = $user->firstname;
  $lastName = $user->lastname;
  $userName = $user->username;
  $collegeid = explode("@", $user->email)[1];
  $collegeid = explode(".", $collegeid)[0];

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  $sessionToken = GetRandomString(30);
  $query = sprintf("INSERT INTO users (firstname, lastname, id, email, password, username, cookie, collegeid) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')", $conn->real_escape_string($firstName), $conn->real_escape_string($lastName), $conn->real_escape_string($userID), $conn->real_escape_string($email), $conn->real_escape_string($hashedPassword), $conn->real_escape_string($userName), $sessionToken, $conn->real_escape_string($collegeid));

  $res = $conn->query($query);

  //error in inserting the new user
  if ($res == FALSE) {
    InvalidUserInput();
  }

  setcookie('email', $email, time() + 604800, "/~cen4010_fa21_g11/", "lamp.cse.fau.edu", TRUE);
  setcookie('session_token', $sessionToken, time() + 604800, "/~cen4010_fa21_g11/", "lamp.cse.fau.edu", TRUE);

  echo json_encode(array('error' => FALSE, array(
    'email' => $email,
    'username' => $userName,
    'firstname' => $firstName,
    'lastname' => $lastName,
    'id' => $userID,
    'collegeid' => $collegeid
  )));
  $conn->close();
?>