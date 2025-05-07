<?php
class UserPreferences {
    // Database connection and table name
    private $conn;
    private $table_name = "user_preferences";

    // Object properties
    public $id;
    public $clerk_id;
    public $theme;
    public $language;
    public $auto_save;
    public $two_factor_enabled;
    public $created_at;
    public $updated_at;

    // Constructor with DB
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get user preferences by Clerk ID
    public function getByClerkId() {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE clerk_id = ? LIMIT 0,1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->clerk_id);
            $stmt->execute();
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->id = $row['id'];
                $this->clerk_id = $row['clerk_id'];
                $this->theme = $row['theme'];
                $this->language = $row['language'];
                $this->auto_save = $row['auto_save'];
                $this->two_factor_enabled = $row['two_factor_enabled'];
                $this->created_at = $row['created_at'];
                $this->updated_at = $row['updated_at'];
                return true;
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Database error in UserPreferences::getByClerkId(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Create user preferences with default values
    public function create() {
        try {
            // Check if preferences already exist
            $check_query = "SELECT id FROM " . $this->table_name . " WHERE clerk_id = ?";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(1, $this->clerk_id);
            $check_stmt->execute();
            
            if($check_stmt->rowCount() > 0) {
                return $this->update(); // Update existing preferences instead
            }
            
            $query = "INSERT INTO " . $this->table_name . "
                    SET
                        clerk_id = :clerk_id, 
                        theme = :theme,
                        language = :language,
                        auto_save = :auto_save,
                        two_factor_enabled = :two_factor_enabled,
                        created_at = NOW(),
                        updated_at = NOW()";
                        
            $stmt = $this->conn->prepare($query);
            
            // Clean data
            $this->clerk_id = htmlspecialchars(strip_tags($this->clerk_id));
            $this->theme = htmlspecialchars(strip_tags($this->theme));
            $this->language = htmlspecialchars(strip_tags($this->language));
            
            // Set default values if not provided
            if(!isset($this->theme)) $this->theme = "system";
            if(!isset($this->language)) $this->language = "en";
            if(!isset($this->auto_save)) $this->auto_save = 1;
            if(!isset($this->two_factor_enabled)) $this->two_factor_enabled = 0;
            
            // Bind data
            $stmt->bindParam(":clerk_id", $this->clerk_id);
            $stmt->bindParam(":theme", $this->theme);
            $stmt->bindParam(":language", $this->language);
            $stmt->bindParam(":auto_save", $this->auto_save);
            $stmt->bindParam(":two_factor_enabled", $this->two_factor_enabled);
            
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            
            throw new Exception("Failed to create preferences: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in UserPreferences::create(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    // Update user preferences
    public function update() {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET
                        theme = :theme,
                        language = :language,
                        auto_save = :auto_save,
                        two_factor_enabled = :two_factor_enabled,
                        updated_at = NOW()
                    WHERE 
                        clerk_id = :clerk_id";
                        
            $stmt = $this->conn->prepare($query);
            
            // Clean data
            $this->clerk_id = htmlspecialchars(strip_tags($this->clerk_id));
            $this->theme = htmlspecialchars(strip_tags($this->theme));
            $this->language = htmlspecialchars(strip_tags($this->language));
            
            // Bind data
            $stmt->bindParam(":theme", $this->theme);
            $stmt->bindParam(":language", $this->language);
            $stmt->bindParam(":auto_save", $this->auto_save);
            $stmt->bindParam(":two_factor_enabled", $this->two_factor_enabled);
            $stmt->bindParam(":clerk_id", $this->clerk_id);
            
            if($stmt->execute()) {
                return true;
            }
            
            throw new Exception("Failed to update preferences: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in UserPreferences::update(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }
    
    // Delete user preferences (when deleting an account)
    public function delete() {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE clerk_id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->clerk_id);
            
            if($stmt->execute()) {
                return true;
            }
            
            throw new Exception("Failed to delete preferences: " . implode(", ", $stmt->errorInfo()));
        } catch (PDOException $e) {
            error_log("Database error in UserPreferences::delete(): " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }
} 