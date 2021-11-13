<?php
  require '../../c.php';

  define('KB', 1024);
  define('MB', 1048576);

  //image upload not yet tested
  function UploadImage($conn, $collegeid, $courseid) {
    if ($_FILES['img']['error'] != UPLOAD_ERR_OK || $_FILES['img']['size'] == 0) {
      throw new Exception("Error with file uplod");
    }
    if ($_FILES['img']['size'] > 5 * MB) {
      throw new Exception("To large of file");
    }
    if (is_uploaded_file($_FILES['img']['tmp_name']) === FALSE) {
      throw new Exception("Invalid FIle");
    }

    $id = uniqid();
    $name = $id;
    $type = exif_imagetype($_FILES['img']['tmp_name']);
    $allowed = array(IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_GIF);

    if ($type == IMAGETYPE_JPEG) {
      $name = $name . '.jpg';
    }
    else if ($type == IMAGETYPE_PNG) {
      $name = $name . '.png';
    }
    else if ($type == IMAGETYPE_GIF) {
      $name = $name . '.gif';
    }
    else {
      throw new Exception("Invalid file");
    }

    $ret = move_uploaded_file($_FILES['img']['tmp_name'], 'images/' . $name);
    if ($ret === FLASE) {
      throw new Exception("Error in file");
    }

    $query = sprintf("INSERT INTO images VALUES (imageid, imagepath, collegeid, courseid) VALUES ('%s', '%s' ,'%s', '%s')", $id, 'image/' . $name, $collegeid, $conn->real_escape_string($courseid));
    $res = $conn->query($query);

    if (!$res) {
      throw new Exception("Internal server error");
    }
    return $id;
  }

  header('Content-type: application/json');

  if (empty($_COOKIE) || empty($_COOKIE['userid']) || empty($_COOKIE['session_token'])) {
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $json = file_get_contents('php://input');

  if (empty($json)) {
    http_response_code(400);
    exit(json_encode(array('error' => TRUE, 'message' => "Invalid user input")));
  }

  $json = json_decode($json);

  if (empty($json) || empty($json->title) || empty($json->text) || empty($json->courseid)) {
    http_response_code(400);
    exit(json_encode(array('error' => TRUE, 'message' => "Invalid user input")));
  }

  if (!is_string($json->title) || !is_string($json->text) || !is_string($json->courseid) || strlen($json->title) > 50 || strlen($json->text) > 1000 || strlen($json->courseid) != 13 || strlen($json->text) < 5 || strlen($json->title) < 5) {
    http_response_code(400);
    var_dump($json);
    exit(json_encode(array('error' => TRUE, 'message' => 'Invalid user input')));
  }

  $conn = new mysqli($server, $username, $pwd, $db);

  if ($conn->connect_error) {
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server error")));
  }

  $query = sprintf("SELECT * FROM users WHERE id='%s' AND cookie='%s'", $conn->real_escape_string($_COOKIE['userid']), $conn->real_escape_string($_COOKIE['session_token']));

  $user = $conn->query($query);

  if (!$user) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server error")));
  }

  if (!$user->num_rows) {
    $conn->close();
    http_response_code(401);
    exit(json_encode(array('error' => TRUE, 'message' => "You do not have access")));
  }

  $user = $user->fetch_assoc();

  $postid = uniqid();

  $imageID = "";
  $imageError = FALSE;

  if (!empty($_FILES) && !empty($_FILES['img'])) {
    try {
      $imageID = InsertImage($conn, $user['collegeid'], $json->courseid);
    }
    catch (Exception $e) {
      $imageError = $e->getMessage();
    }
  }

  if ($imageError) {
    $conn->close();
    http_response_code(400);
    exit(json_encode(array('error' => TRUE, 'message' => $imageError)));
  }

  $query = sprintf("INSERT INTO posts (id, title, text, userid, image, courseid, collegeid) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s')", $postid, $conn->real_escape_string($json->title), $conn->real_escape_string($json->text), $user['id'], $imageID, $conn->real_escape_string($json->courseid), $user['collegeid']);

  $res = $conn->query($query);

  if (!$res) {
    $conn->close();
    http_response_code(500);
    exit(json_encode(array('error' => TRUE, 'message' => "Internal server error")));
  }


  echo json_encode(array('error' => FALSE, 'imageid' => $imageID, 'text' => $conn->real_escape_string($json->text), 'title' => $conn->real_escape_string($json->title)));

  $conn->close();
?>