<?php

  function InvalidUserInput() {
    http_response_code(400);
    exit(json_encode(array('error' => "Invalid User Input")));
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
    if ($len < 3) {
      InvalidUserInput();
    }
    for ($i = 0; $i < $len; $i++) {
      if (!ctype_alpha($userName[$i]) && !ctype_digit($userName[$i])) {
        InvalidUserInput();
      }
    }
  }


  function ValidateEmail($email) {
    if (empty($email) || !is_string($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
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
    $has_char = FALSE;
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
        $has_char = TRUE;
      }
    }

    if (!$has_char || !$has_digit || !$has_low || !$has_up) {
      InvalidUserInput();
    }
  }



  function UserNameAlreadyInUse($conn, $userName) {
    
  }




?>