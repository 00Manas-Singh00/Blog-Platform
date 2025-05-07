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
        try {
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
        } catch (PDOException $e) {
            error_log("Database error in Post::read(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Get single post
    public function readOne() {
        try {
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
        } catch (PDOException $e) {
            error_log("Database error in Post::readOne(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Create post
    public function create() {
        try {
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
            $this->category = $this->category ? htmlspecialchars(strip_tags($this->category)) : null;
            $this->tags = $this->tags ? htmlspecialchars(strip_tags($this->tags)) : null;

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

            throw new Exception("Failed to create post: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Post::create(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Update post
    public function update() {
        try {
            // First check if post exists
            $exists_query = "SELECT id FROM " . $this->table_name . " WHERE id = :id";
            $exists_stmt = $this->conn->prepare($exists_query);
            $exists_stmt->bindParam(':id', $this->id);
            $exists_stmt->execute();
            
            if ($exists_stmt->rowCount() === 0) {
                return false; // Post doesn't exist
            }
            
            // Prepare the query based on which fields are set
            $fields = [];
            $params = [];
            
            if (!empty($this->title)) {
                $fields[] = "title = :title";
                $params[':title'] = htmlspecialchars(strip_tags($this->title));
            }
            
            if (!empty($this->content)) {
                $fields[] = "content = :content";
                $params[':content'] = htmlspecialchars(strip_tags($this->content));
            }
            
            if (!empty($this->excerpt)) {
                $fields[] = "excerpt = :excerpt";
                $params[':excerpt'] = htmlspecialchars(strip_tags($this->excerpt));
            }
            
            if (!empty($this->author)) {
                $fields[] = "author = :author";
                $params[':author'] = htmlspecialchars(strip_tags($this->author));
            }
            
            if ($this->category !== null) {
                $fields[] = "category = :category";
                $params[':category'] = htmlspecialchars(strip_tags($this->category));
            }
            
            if ($this->tags !== null) {
                $fields[] = "tags = :tags";
                $params[':tags'] = htmlspecialchars(strip_tags($this->tags));
            }
            
            // If no fields to update, return success
            if (empty($fields)) {
                return true;
            }
            
            $query = "UPDATE " . $this->table_name . " SET " . implode(", ", $fields) . " WHERE id = :id";
            $params[':id'] = htmlspecialchars(strip_tags($this->id));
            
            // Prepare and execute
            $stmt = $this->conn->prepare($query);
            
            if($stmt->execute($params)) {
                return true;
            }
            
            throw new Exception("Failed to update post: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Post::update(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Delete post
    public function delete() {
        try {
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
                // Check if any row was actually deleted
                return $stmt->rowCount() > 0;
            }

            throw new Exception("Failed to delete post: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Post::delete(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }
} 