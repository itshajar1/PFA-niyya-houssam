package ma.startup.platform.authservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.authservice.dto.UpdateUserRequest;
import ma.startup.platform.authservice.dto.UserResponse;
import ma.startup.platform.authservice.model.User;
import ma.startup.platform.authservice.service.JwtService;
import ma.startup.platform.authservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Enlever "Bearer "
            String email = jwtService.extractEmail(token);
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User currentUser = userService.getUserByEmail(email);

            User updatedUser = userService.updateUser(
                    currentUser.getId(),
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);
            User user = userService.getUserByEmail(email);
            userService.deleteUser(user.getId());
            return ResponseEntity.ok("Compte supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
