package com.vrv.VRV.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.vrv.VRV.Modal.User;
import com.vrv.VRV.Service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'VIEWER')")
    public ResponseEntity<User> findUserByJwt(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get all users (ADMIN only)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Find a user by email (ADMIN only)
    @GetMapping("/admin/user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> findUserByEmail(@RequestParam String email) {
        try {
            User user = userService.findUserByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Promote a user to Creator (ADMIN only)
    @PutMapping("/admin/{userId}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promoteToCreator(@PathVariable String userId) {
        try {
            User updatedUser = userService.promoteToCreator(userId);
            if (updatedUser == null) {
                return ResponseEntity.badRequest().body("Invalid user ID or user cannot be promoted.");
            }
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while promoting the user: " + e.getMessage());
        }
    }

    // Delete a user by ID (ADMIN only)
    @DeleteMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            boolean isDeleted = userService.deleteUser(userId);
            if (isDeleted) {
                return ResponseEntity.ok("User deleted successfully.");
            } else {
                return ResponseEntity.badRequest().body("User not found or cannot be deleted.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }
}
