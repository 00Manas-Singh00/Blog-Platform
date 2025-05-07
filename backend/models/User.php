<?php
class User {
    // Database connection and table name
    private $conn;
    private $table_name = "users";

    // Object properties
    public $id;
    public $username;
    public $password;
    public $email;
    public $created_at;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create user
    public function create() {
        // Create query
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    username = :username,
                    password = :password,
                    email = :email";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        
        // Hash the password
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind data
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $password_hash);
        $stmt->bindParam(':email', $this->email);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Check if user exists and password is correct
    public function login() {
        // Create query
        $query = "SELECT
                    id, username, password
                FROM
                    " . $this->table_name . "
                WHERE
                    username = ?
                LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind username
        $stmt->bindParam(1, $this->username);

        // Execute query
        $stmt->execute();

        // Get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // If user exists
        if($row) {
            $this->id = $row['id'];
            
            // Verify password
            if(password_verify($this->password, $row['password'])) {
                return true;
            }
        }

        return false;
    }

    // Check if username exists
    public function usernameExists() {
        // Create query
        $query = "SELECT
                    id
                FROM
                    " . $this->table_name . "
                WHERE
                    username = ?
                LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind username
        $stmt->bindParam(1, $this->username);

        // Execute query
        $stmt->execute();

        // Get number of rows
        $num = $stmt->rowCount();

        // If username exists
        if($num > 0) {
            return true;
        }

        return false;
    }

    // Check if email exists
    public function emailExists() {
        // Create query
        $query = "SELECT
                    id
                FROM
                    " . $this->table_name . "
                WHERE
                    email = ?
                LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind email
        $stmt->bindParam(1, $this->email);

        // Execute query
        $stmt->execute();

        // Get number of rows
        $num = $stmt->rowCount();

        // If email exists
        if($num > 0) {
            return true;
        }

        return false;
    }
} 