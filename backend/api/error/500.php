<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Set response code - 500 Server error
http_response_code(500);

// Tell the user
echo json_encode(array(
    "status" => "error",
    "message" => "Server error occurred."
)); 