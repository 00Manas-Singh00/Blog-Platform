<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Set response code - 404 Not found
http_response_code(404);

// Tell the user
echo json_encode(array(
    "status" => "error",
    "message" => "Endpoint not found."
)); 