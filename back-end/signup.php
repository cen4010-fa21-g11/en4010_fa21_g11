<?php
  require '../c.php';
  require '../validation.php';

  header('Content-type: application/json');

  if (!isset($_POST) || !isset($_POST['user'])) {
    InvalidUserInput();
  }

  $user = json_decode($_POST['user'], TRUE, 10);

  if (empty($user)) {
    InvalidUserInput();
  }

  // Returns error to user upon failing any of the checks
  ValidateFirstName($user['firstname']);
  ValidateLastName($user['lastname']);
  ValidateUserName($user['username']);
  ValidateEmail($user['email']);
  ValidatePassword($user['password']);

  $hashedPassword = password_hash($user['password'], PASSWORD_BCRYPT);
  $userID = uniqid();
  $email = strtolower($user['email']);
  $firstName = strtolower($user['firstname']);
  $lastName = strtolower($user['lastname']);
  $userName = strtolower($user['username']);

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array('error' => "Internal Server Error"));
  }

  if (UserNameAlreadyInUse($conn, $userName)) {

  }

  $query = sprintf("INSERT INTO users (firstname, lastname, id, email, password, username) VALUES (%s, %s, %s, %s, %s)", $conn->real_escape_string($firstName), $conn->real_escape_string($lastName), $conn->real_escape_string($userID), $conn->real_escape_string($email), $conn->real_escape_string($hashedPassword), $conn->real_escape_string($userName));

  






?>