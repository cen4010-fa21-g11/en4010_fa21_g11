<?php
  require 'c.php';

  function InvalidUserInput() {
    http_response_code(400);
    exit(json_encode(array('error' => TRUE, 'message' => "Invalid user input")));
  }

  function ValidateName($name) {
    $len = strlen($name);
    if (empty($name) || !is_string($name) || $len < 3) {
      InvalidUserInput();
    }

    for ($i = 0; $i < $len; $i++) {
      if (!ctype_alpha($name[$i])) {
        InvalidUserInput();
      }
    }
  }


  function ValidateLastName($lastName) {
    ValidateName($lastName);
  }


  function ValidateFirstName($firstName) {
    ValidateName($firstName);
  }


  function ValidateUserName($userName) {
    $len = strlen($userName);
    if ($len < 3 || $len > 25) {
      InvalidUserInput();
    }
    for ($i = 0; $i < $len; $i++) {
      if (!ctype_alpha($userName[$i]) && !ctype_digit($userName[$i]) && $userName[$i] != '_') {
        InvalidUserInput();
      }
    }
  }


  function ValidateEmail($email) {
    if (empty($email) || !is_string($email) || strlen($email) > 50 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      InvalidUserInput();
    }
    $email = strtolower($email);
    $domain = explode('@', $email, 3);
    if (empty($domain[1]) || isset($domain[2])) {
      InvalidUserInput();
    }

    $extension = explode('.', $domain[1], 3);
    if (empty($extension[1]) || $extension[1] != "edu" || !empty($extension[2])) {
      InvalidUserInput();
    }
  }


  function ValidatePassword($password) {
    if (empty($password) || strlen($password) < 8) {
      InvalidUserInput();
    }

    $len = strlen($password);
    $has_digit = FALSE;
    $has_up = FALSE;
    $has_low = FALSE;

    for ($i = 0; $i < $len; $i++) {
      if (ctype_digit($password[$i])) {
        $has_digit = TRUE;
      }
      else {
        if (ctype_lower($password[$i])) {
          $has_low = TRUE;
        }
        else {
          $has_up = TRUE;
        }
      }
    }

    if (!$has_digit || !$has_low || !$has_up) {
      InvalidUserInput();
    }
  }

  function ValidateUserSession($userID, $session_token) {
    $conn = new mysqli($server, $username, $pwd, $db);
    if ($conn->connect_error) {
      return FALSE;
    }

    $query = sprintf("SELECT 1 FROM users WHERE cookie='%s' AND id='%s'", $conn->real_escape_string($session_token), $conn->real_escape_string($userID));
    $res = $conn->query($query);

    $conn->close();
    return $res != FALSE;
  }

  function GetRandomString($len) {
    $chars = "abcdefghijklmnopqrstuvwzyz0123456789";
    $l = strlen($chars) - 1;
    $res = "";
    for ($i = 0; $i < $len; $i++) {
      $res .= $chars[mt_rand(0, $l)];
    }
    return $res;
  }



?>