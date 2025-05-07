<?php
class Category {
    // Database connection and table name
    private $conn;
    private $table_name = "categories";

    // Object properties
    public $id;
    public $name;
    public $description;
    public $created_at;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all categories
    public function read() {
        // Create query
        $query = "SELECT
                    id, name, description, created_at
                FROM
                    " . $this->table_name . "
                ORDER BY
                    name";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Read single category
    public function readOne() {
        // Create query
        $query = "SELECT
                    id, name, description, created_at
                FROM
                    " . $this->table_name . "
                WHERE
                    id = ?
                LIMIT 0,1";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(1, $this->id);

        // Execute query
        $stmt->execute();

        // Get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            // Set properties
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->created_at = $row['created_at'];
            return true;
        }

        return false;
    }

    // Create category
    public function create() {
        // Create query
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    description = :description";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update category
    public function update() {
        // Create query
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    description = :description
                WHERE
                    id = :id";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':id', $this->id);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete category
    public function delete() {
        // Create query
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean id
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind id
        $stmt->bindParam(1, $this->id);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }
} 