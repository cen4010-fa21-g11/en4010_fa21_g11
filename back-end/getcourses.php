<?php
  require '../../c.php';

  header('Content-type: application/json');

  if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token'])) {
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
  $query = sprintf("SELECT * FROM courses WHERE collegeid='%s'", $user['collegeid']);

  $res = $conn->query($query);

  if (!$res) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server errror")));
  }

  $courses = array();
  while ($row = $res->fetch_assoc()) {
    array_push($courses, array('id' => $row['courseid'], 'name' => $row['name']));
  }

  echo json_encode(array('error' => FALSE, 'courses' => $courses));
  $conn->close();
?>