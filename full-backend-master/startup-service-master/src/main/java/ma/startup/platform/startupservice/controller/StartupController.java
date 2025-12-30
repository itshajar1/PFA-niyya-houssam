package ma.startup.platform.startupservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.startupservice.client.UserDTO;
import ma.startup.platform.startupservice.dto.StartupRequest;
import ma.startup.platform.startupservice.dto.StartupResponse;
import ma.startup.platform.startupservice.model.Startup;
import ma.startup.platform.startupservice.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupController {

    private final StartupService startupService;

    @PostMapping
    public ResponseEntity<?> createStartup(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody StartupRequest request
    ) {
        try {
            // Vérifier l'utilisateur via Auth-Service
            UserDTO user = startupService.verifyUser(authHeader);

            Startup startup = startupService.createStartup(user.getId(), request);
            return ResponseEntity.ok(StartupResponse.fromStartup(startup));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyStartup(@RequestHeader("Authorization") String authHeader) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            Startup startup = startupService.getStartupByUserId(user.getId());
            return ResponseEntity.ok(StartupResponse.fromStartup(startup));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStartupById(@PathVariable UUID id) {
        try {
            Startup startup = startupService.getStartupById(id);
            return ResponseEntity.ok(StartupResponse.fromStartup(startup));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<StartupResponse>> getAllStartups() {
        List<Startup> startups = startupService.getAllStartups();
        List<StartupResponse> responses = startups.stream()
                .map(StartupResponse::fromStartup)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StartupResponse>> searchBySecteur(@RequestParam String secteur) {
        List<Startup> startups = startupService.getStartupsBySecteur(secteur);
        List<StartupResponse> responses = startups.stream()
                .map(StartupResponse::fromStartup)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyStartup(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody StartupRequest request
    ) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            Startup startup = startupService.updateStartup(user.getId(), request);
            return ResponseEntity.ok(StartupResponse.fromStartup(startup));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyStartup(@RequestHeader("Authorization") String authHeader) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            startupService.deleteStartup(user.getId());
            return ResponseEntity.ok("Startup supprimée avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getStartupByUserId(@PathVariable UUID userId) {
        try {
            Startup startup = startupService.getStartupByUserId(userId);
            return ResponseEntity.ok(StartupResponse.fromStartup(startup));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
