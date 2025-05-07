<?php
class Comment {
    // Database connection and table name
    private $conn;
    private $table_name = "comments";

    // Object properties
    public $id;
    public $post_id;
    public $user_id;
    public $clerk_id;
    public $author_name;
    public $content;
    public $parent_id;
    public $is_approved;
    public $created_at;
    public $updated_at;
    public $replies = [];

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create comment
    public function create() {
        try {
            // Create query
            $query = "INSERT INTO " . $this->table_name . "
                    SET
                        post_id = :post_id,
                        user_id = :user_id,
                        clerk_id = :clerk_id,
                        author_name = :author_name,
                        content = :content,
                        parent_id = :parent_id,
                        is_approved = :is_approved";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->post_id = htmlspecialchars(strip_tags($this->post_id));
            $this->user_id = $this->user_id ? htmlspecialchars(strip_tags($this->user_id)) : null;
            $this->clerk_id = $this->clerk_id ? htmlspecialchars(strip_tags($this->clerk_id)) : null;
            $this->author_name = htmlspecialchars(strip_tags($this->author_name));
            $this->content = htmlspecialchars(strip_tags($this->content));
            $this->parent_id = $this->parent_id ? htmlspecialchars(strip_tags($this->parent_id)) : null;
            $this->is_approved = isset($this->is_approved) ? $this->is_approved : 0;

            // Bind data
            $stmt->bindParam(':post_id', $this->post_id);
            $stmt->bindParam(':user_id', $this->user_id);
            $stmt->bindParam(':clerk_id', $this->clerk_id);
            $stmt->bindParam(':author_name', $this->author_name);
            $stmt->bindParam(':content', $this->content);
            $stmt->bindParam(':parent_id', $this->parent_id);
            $stmt->bindParam(':is_approved', $this->is_approved);

            // Execute query
            if ($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }

            throw new Exception("Failed to create comment: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Comment::create(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Get comments by post ID
    public function getByPost($post_id, $include_replies = true, $only_approved = true) {
        try {
            $conditions = "c.post_id = :post_id";
            
            if ($only_approved) {
                $conditions .= " AND c.is_approved = 1";
            }
            
            if (!$include_replies) {
                $conditions .= " AND c.parent_id IS NULL";
            }
            
            $query = "SELECT
                        c.id, c.post_id, c.user_id, c.clerk_id, c.author_name, 
                        c.content, c.parent_id, c.is_approved, c.created_at
                    FROM
                        " . $this->table_name . " c
                    WHERE
                        " . $conditions . "
                    ORDER BY
                        c.created_at ASC";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind post_id
            $stmt->bindParam(':post_id', $post_id);

            // Execute query
            $stmt->execute();

            return $stmt;
        } catch (PDOException $e) {
            error_log("Database error in Comment::getByPost(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Get comment replies
    public function getReplies($comment_id, $only_approved = true) {
        try {
            $conditions = "parent_id = :comment_id";
            
            if ($only_approved) {
                $conditions .= " AND is_approved = 1";
            }
            
            $query = "SELECT
                        id, post_id, user_id, clerk_id, author_name, 
                        content, parent_id, is_approved, created_at
                    FROM
                        " . $this->table_name . "
                    WHERE
                        " . $conditions . "
                    ORDER BY
                        created_at ASC";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind comment_id
            $stmt->bindParam(':comment_id', $comment_id);

            // Execute query
            $stmt->execute();

            return $stmt;
        } catch (PDOException $e) {
            error_log("Database error in Comment::getReplies(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Get single comment by ID
    public function readOne() {
        try {
            // Create query
            $query = "SELECT
                        c.id, c.post_id, c.user_id, c.clerk_id, c.author_name, 
                        c.content, c.parent_id, c.is_approved, c.created_at
                    FROM
                        " . $this->table_name . " c
                    WHERE
                        c.id = ?
                    LIMIT 0,1";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Bind ID
            $stmt->bindParam(1, $this->id);

            // Execute query
            $stmt->execute();

            // Get retrieved row
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                // Set properties
                $this->post_id = $row['post_id'];
                $this->user_id = $row['user_id'];
                $this->clerk_id = $row['clerk_id'];
                $this->author_name = $row['author_name'];
                $this->content = $row['content'];
                $this->parent_id = $row['parent_id'];
                $this->is_approved = $row['is_approved'];
                $this->created_at = $row['created_at'];
                return true;
            }

            return false;
        } catch (PDOException $e) {
            error_log("Database error in Comment::readOne(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Update comment
    public function update() {
        try {
            // Create query
            $query = "UPDATE " . $this->table_name . "
                    SET
                        content = :content,
                        is_approved = :is_approved
                    WHERE
                        id = :id";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->content = htmlspecialchars(strip_tags($this->content));
            $this->is_approved = htmlspecialchars(strip_tags($this->is_approved));
            $this->id = htmlspecialchars(strip_tags($this->id));

            // Bind data
            $stmt->bindParam(':content', $this->content);
            $stmt->bindParam(':is_approved', $this->is_approved);
            $stmt->bindParam(':id', $this->id);

            // Execute query
            if ($stmt->execute()) {
                return true;
            }

            throw new Exception("Failed to update comment: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Comment::update(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Delete comment
    public function delete() {
        try {
            // Create query
            $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->id = htmlspecialchars(strip_tags($this->id));

            // Bind data
            $stmt->bindParam(1, $this->id);

            // Execute query
            if ($stmt->execute()) {
                return true;
            }

            throw new Exception("Failed to delete comment: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Comment::delete(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Approve comment
    public function approve() {
        try {
            // Create query
            $query = "UPDATE " . $this->table_name . " SET is_approved = 1 WHERE id = ?";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Clean data
            $this->id = htmlspecialchars(strip_tags($this->id));

            // Bind data
            $stmt->bindParam(1, $this->id);

            // Execute query
            if ($stmt->execute()) {
                return true;
            }

            throw new Exception("Failed to approve comment: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in Comment::approve(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Get all comments that need moderation
    public function getForModeration() {
        try {
            // Create query
            $query = "SELECT
                        c.id, c.post_id, c.user_id, c.clerk_id, c.author_name, 
                        c.content, c.parent_id, c.is_approved, c.created_at,
                        p.title as post_title
                    FROM
                        " . $this->table_name . " c
                    LEFT JOIN
                        posts p ON c.post_id = p.id
                    WHERE
                        c.is_approved = 0
                    ORDER BY
                        c.created_at ASC";

            // Prepare statement
            $stmt = $this->conn->prepare($query);

            // Execute query
            $stmt->execute();

            return $stmt;
        } catch (PDOException $e) {
            error_log("Database error in Comment::getForModeration(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }
} 