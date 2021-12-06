<?php
  require '../../c.php';


  /*
    Needed is user cookie's aka session token and user id
    Params for getting comments with POST are:
      replyto: string 13 len uuid of the post
  */

  /*
    Returns json in the format:
      error: boolean
      comment: array of comments

    comments are defined as:
      id: string uuid
      replyto: string uuid
      text: string
  */


  header('Content-type: application/json');

  if (empty($_COOKIE) || empty($_COOKIE['session_token']) || empty($_COOKIE['userid']) || empty($_GET['replyto'])) {
    if (empty($_GET['replyto'])) {
      echo "ITS THE REPLY TO";
    }
    http_response_code(400);
    echo "in cookie";
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server error")));
  }

  $query = sprintf("SELECT * FROM users WHERE id='%s' AND cookie='%s'", $conn->real_escape_string($_COOKIE['userid']), $conn->real_escape_string($_COOKIE['session_token']));

  $res = $conn->query($query);  

  if (!$res || !$res->num_rows) {
    $conn->close();
    http_response_code(400);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $user = $res->fetch_assoc();

  $query = sprintf("SELECT * FROM comments WHERE replyto='%s' AND collegeid='%s'", $conn->real_escape_string($_GET['replyto']), $conn->real_escape_string($user['collegeid']));

  $res = $conn->query($query);

  $arr = array();
  while ($row = $res->fetch_assoc()) {
    array_push($arr, array('id' => $row['id'], 'text' => $row['text'], 'replyto' => $row['replyto']));
  } 

  echo json_encode(array('error' => FALSE, 'comments' => $arr));

  $conn->close();
?>
