<?php
  require '../../c.php';

  /*
    Needs user's cookies which contains user id and session token
    for the post data the params are 
      text: string
      repyto: string 13 len which is uuid
  */

  /*
    Returns json in format:
      error: boolean
      id: string uuid of created comment
  */


  header('Content-type: application/json');

  $json = file_get_contents('php://input');

  if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token']) || empty($json)) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $post = json_decode($json);

  if (empty($post) || empty($post->text) || empty($post->replyto)) {
    http_response_code(402);
    exit(json_encode(array('error' => TRUE, 'message' => "Invalid Input")));
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

  $uuid = uniqid();

  $query = sprintf("INSERT INTO comments (text, id, replyto, post, collegeid) VALUES ('%s', '%s', '%s', '%s', '%s')", $conn->real_escape_string(htmlspecialchars($post->text)), $uuid, $conn->real_escape_string($post->replyto), 'true', $conn->real_escape_string($user['collegeid']));

  $res = $conn->query($query);

  if ($res == FALSE) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal Server Error")));
  }

  echo json_encode(array('error' => FALSE, 'id' => $uuid));
  
  $conn->close();
?>
