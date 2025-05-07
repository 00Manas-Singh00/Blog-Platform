<?php
class UserProfile {
    // Database connection and table name
    private $conn;
    private $table_name = "user_profiles";

    // Object properties
    public $id;
    public $user_id;
    public $clerk_id;
    public $display_name;
    public $bio;
    public $avatar_url;
    public $website;
    public $social_links;
    public $created_at;
    public $updated_at;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get user profile by Clerk ID
    public function getByClerkId() {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE clerk_id = ? LIMIT 0,1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->clerk_id);
            $stmt->execute();
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->id = $row['id'];
                $this->user_id = $row['user_id'];
                $this->clerk_id = $row['clerk_id'];
                $this->display_name = $row['display_name'];
                $this->bio = $row['bio'];
                $this->avatar_url = $row['avatar_url'];
                $this->website = $row['website'];
                $this->social_links = $row['social_links'];
                $this->created_at = $row['created_at'];
                $this->updated_at = $row['updated_at'];
                return true;
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Database error in UserProfile::getByClerkId(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Create user profile
    public function create() {
        try {
            // Check if profile already exists
            $check_query = "SELECT id FROM " . $this->table_name . " WHERE clerk_id = ?";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(1, $this->clerk_id);
            $check_stmt->execute();
            
            if($check_stmt->rowCount() > 0) {
                return $this->update(); // Update existing profile instead
            }
            
            $query = "INSERT INTO " . $this->table_name . "
                    SET
                        user_id = :user_id,
                        clerk_id = :clerk_id, 
                        display_name = :display_name,
                        bio = :bio,
                        avatar_url = :avatar_url,
                        website = :website,
                        social_links = :social_links,
                        created_at = NOW(),
                        updated_at = NOW()";
                        
            $stmt = $this->conn->prepare($query);
            
            // Clean data
            $this->user_id = htmlspecialchars(strip_tags($this->user_id));
            $this->clerk_id = htmlspecialchars(strip_tags($this->clerk_id));
            $this->display_name = htmlspecialchars(strip_tags($this->display_name));
            $this->bio = htmlspecialchars(strip_tags($this->bio));
            $this->avatar_url = htmlspecialchars(strip_tags($this->avatar_url));
            $this->website = htmlspecialchars(strip_tags($this->website));
            // social_links can be stored as JSON
            
            // Bind data
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":clerk_id", $this->clerk_id);
            $stmt->bindParam(":display_name", $this->display_name);
            $stmt->bindParam(":bio", $this->bio);
            $stmt->bindParam(":avatar_url", $this->avatar_url);
            $stmt->bindParam(":website", $this->website);
            $stmt->bindParam(":social_links", $this->social_links);
            
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            
            throw new Exception("Failed to create profile: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in UserProfile::create(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Update user profile
    public function update() {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET
                        display_name = :display_name,
                        bio = :bio,
                        avatar_url = :avatar_url,
                        website = :website,
                        social_links = :social_links,
                        updated_at = NOW()
                    WHERE 
                        clerk_id = :clerk_id";
                        
            $stmt = $this->conn->prepare($query);
            
            // Clean data
            $this->display_name = htmlspecialchars(strip_tags($this->display_name));
            $this->bio = htmlspecialchars(strip_tags($this->bio));
            $this->avatar_url = htmlspecialchars(strip_tags($this->avatar_url));
            $this->website = htmlspecialchars(strip_tags($this->website));
            $this->clerk_id = htmlspecialchars(strip_tags($this->clerk_id));
            
            // Bind data
            $stmt->bindParam(":display_name", $this->display_name);
            $stmt->bindParam(":bio", $this->bio);
            $stmt->bindParam(":avatar_url", $this->avatar_url);
            $stmt->bindParam(":website", $this->website);
            $stmt->bindParam(":social_links", $this->social_links);
            $stmt->bindParam(":clerk_id", $this->clerk_id);
            
            if($stmt->execute()) {
                return true;
            }
            
            throw new Exception("Failed to update profile: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in UserProfile::update(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }
    
    // Delete user profile
    public function delete() {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE clerk_id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->clerk_id);
            
            if($stmt->execute()) {
                return true;
            }
            
            throw new Exception("Failed to delete profile: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in UserProfile::delete(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }
} 