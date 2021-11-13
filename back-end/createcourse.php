<?php
  require '../../c.php';

  header('Content-type: application/json');


  $json = file_get_contents('php://input');

  if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token']) || empty($json)) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $json = json_decode($json);

  if (empty($json) || empty($json->name)) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  $query = sprintf("SELECT * FROM users WHERE id='%s' AND cookie='%s'", $conn->real_escape_string($_COOKIE['userid']), $conn->real_escape_string($_COOKIE['session_token']));

  $res = $conn->query($query);

  if (!$res || !$res->num_rows) {
    $conn->close();
    http_response_code(401);  
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $user = $res->fetch_assoc();
  $courseID = uniqid();
  $query = sprintf("INSERT INTO courses (courseid, name, collegeid) VALUES ('%s', '%s', '%s')", $courseID, $conn->real_escape_string($json->name), $user['collegeid']);

  $res = $conn->query($query);

  if (!$res) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  echo json_encode(array('error' => FALSE, 'course' => array(
    'courseid' => $courseID,
    'name' => $json->name,
  )));
  $conn->close();
?>