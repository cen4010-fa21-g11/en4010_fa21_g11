<?php
  require '../../c.php';

  header('Content-type: application/json');

  if (empty($_GET) || empty($_GET['courseid']) || empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token'])) {
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

  $query = sprintf("SELECT * FROM posts WHERE courseid='%s' AND collegeid='%s'", $conn->real_escape_string($_GET['courseid']) , $conn->real_escape_string($user['collegeid']));
  
  $res = $conn->query($query);
  if ($res === FALSE) {
    $conn->close();
    http_response_code(404);
    exit(json_encode(array('error' => TRUE, 'message' => "This post does not exist")));
  }

  $posts = array();
  while ($post = $res->fetch_assoc()) {
    unset($post['collegeid']);
    unset($post['courseid']);
    array_push($posts, $post);
  }

  echo json_encode(array('error' => FALSE, 'posts' => $posts));
  $conn->close();
?>