<?php
class Post {
    // Database connection and table name
    private $conn;
    private $table_name = "posts";

    // Object properties
    public $id;
    public $title;
    public $content;
    public $excerpt;
    public $author;
    public $created_at;
    public $category;
    public $tags;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all posts
    public function read() {
        // Create query
        $query = "SELECT
                    p.id, p.title, p.content, p.excerpt, p.author, p.created_at, p.category, p.tags
                FROM
                    " . $this->table_name . " p
                ORDER BY
                    p.created_at DESC";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    // Get single post
    public function readOne() {
        // Create query
        $query = "SELECT
                    p.id, p.title, p.content, p.excerpt, p.author, p.created_at, p.category, p.tags
                FROM
                    " . $this->table_name . " p
                WHERE
                    p.id = ?
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
            $this->title = $row['title'];
            $this->content = $row['content'];
            $this->excerpt = $row['excerpt'];
            $this->author = $row['author'];
            $this->created_at = $row['created_at'];
            $this->category = $row['category'];
            $this->tags = $row['tags'];
            return true;
        }
        
        return false;
    }

    // Create post
    public function create() {
        // Create query
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    title = :title,
                    content = :content,
                    excerpt = :excerpt,
                    author = :author,
                    category = :category,
                    tags = :tags";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->excerpt = htmlspecialchars(strip_tags($this->excerpt));
        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->tags = htmlspecialchars(strip_tags($this->tags));

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':excerpt', $this->excerpt);
        $stmt->bindParam(':author', $this->author);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':tags', $this->tags);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update post
    public function update() {
        // Create query
        $query = "UPDATE " . $this->table_name . "
                SET
                    title = :title,
                    content = :content,
                    excerpt = :excerpt,
                    author = :author,
                    category = :category,
                    tags = :tags
                WHERE
                    id = :id";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->excerpt = htmlspecialchars(strip_tags($this->excerpt));
        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->tags = htmlspecialchars(strip_tags($this->tags));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':excerpt', $this->excerpt);
        $stmt->bindParam(':author', $this->author);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':tags', $this->tags);
        $stmt->bindParam(':id', $this->id);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete post
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