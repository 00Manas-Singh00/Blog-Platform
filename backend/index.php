<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Response data
$response = array(
    "status" => "success",
    "message" => "Welcome to the Blog Platform API",
    "version" => "1.0.0",
    "endpoints" => array(
        "posts" => array(
            "read_all" => "/api/posts/read.php",
            "read_one" => "/api/posts/read_one.php?id=:id",
            "create" => "/api/posts/create.php",
            "update" => "/api/posts/update.php",
            "delete" => "/api/posts/delete.php"
        ),
        "categories" => array(
            "read_all" => "/api/categories/read.php",
            "create" => "/api/categories/create.php"
        ),
        "users" => array(
            "login" => "/api/users/login.php",
            "register" => "/api/users/register.php"
        )
    )
);

// Set response code - 200 OK
http_response_code(200);

// Return response
echo json_encode($response); 