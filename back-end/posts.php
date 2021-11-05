<?php
  require '../../c.php';

  if (empty($_GET) || empty($_GET['id']) || empty($_COOKIE) || empty($_COOKIE['email']) || empty($_COOKIE['session_token'])) {
    http_response_code(404);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $conn = new mysqli();





?>