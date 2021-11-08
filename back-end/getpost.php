<?php
  require '../../c.php';

  header('Content-type: application/json');

  if (empty($_GET) || empty($_GET['cid']) || empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token']) || empty($_COOKIE['pid'])) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connection_error) {
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

  $query = sprintf("SELECT * FROM posts WHERE id='%s' AND courseid='%s' AND collegeid='%s'", $conn->real_escape_string($_COOKIE['pid']) ,$conn->real_escape_string($_COOKIE['cid']), $conn->real_escape_string($user['collegeid']));
  
  $res = $conn->query($query);
  if (!$res) {
    $conn->close();
    http_response_code(404);
    exit(json_encode(array('error' => TRUE, 'message' => "This post does not exist")));
  }

  $post = $res->fetch_assoc();
  unset($post['collegeid']);
  unset($post['courseid']);
  $post['error'] = FALSE;

  echo json_encode($post);
  $conn->close();
?>