<?php
  require '../../c.php';

  header('Content-type: application/json');

  if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token']) || empty($_GET) || empty($_GET['id'])) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server errror")));
  }

  $query = sprintf("SELECT * FROM users WHERE id='%s' AND cookie='%s'", $conn->real_escape_string($_COOKIE['userid']), $conn->real_escape_string($_COOKIE['session_token']));

  $res = $conn->query($query);

  if (!$res) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server error")));
  }

  if (!$res->num_rows) {
    $conn->close();
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $user = $res->fetch_assoc();

  $query = sprintf("SELECT * FROM images WHERE imageid='%s' AND collegeid='%s'", $conn->real_escape_string($_GET['id']), $conn->real_escape_string($user['collegeid']));

  $res = $conn->query($query);

  if (!$res) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server error")));
  }

  if (!$res->num_rows) {
    $conn->close();
    http_response_code(404);
    exit(json_encode(array('error' => TRUE, 'message' => "404 Not Found")));
  }

  header_remove("Content-type");
  header('Expires: 0');
  header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
  header('Content-Transfer-Encoding: binary');
  header('Content-Disposition: attachment; filename='.basename($res['imagepath']));
  header('Content-Type: application/octet-stream');
  header('Content-Description: File Transfer');
  header('Pragma: public');
  header('Content-Length: ' . filesize($res['imagepath']));

  ob_clean();
  flush();
  readfile($res['imagepath']);

  $conn->close();
?>