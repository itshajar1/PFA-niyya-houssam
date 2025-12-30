package ma.startup.platform.startupservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.startupservice.client.UserDTO;
import ma.startup.platform.startupservice.dto.MilestoneRequest;
import ma.startup.platform.startupservice.dto.MilestoneResponse;
import ma.startup.platform.startupservice.model.Milestone;
import ma.startup.platform.startupservice.model.Startup;
import ma.startup.platform.startupservice.repository.MilestoneRepository;
import ma.startup.platform.startupservice.service.MilestoneService;
import ma.startup.platform.startupservice.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/startups/me/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;
    private final StartupService startupService;
    private final MilestoneRepository milestoneRepository;

    @PostMapping
    public ResponseEntity<?> createMilestone(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody MilestoneRequest request
    ) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            Startup startup = startupService.getStartupByUserId(user.getId());

            Milestone milestone = milestoneService.createMilestone(startup.getId(), request);
            return ResponseEntity.ok(MilestoneResponse.fromMilestone(milestone));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyMilestones(@RequestHeader("Authorization") String authHeader) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            Startup startup = startupService.getStartupByUserId(user.getId());

            List<Milestone> milestones = milestoneService.getMilestonesByStartupId(startup.getId());
            List<MilestoneResponse> responses = milestones.stream()
                    .map(MilestoneResponse::fromMilestone)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMilestone(
            @PathVariable UUID id,
            @Valid @RequestBody MilestoneRequest request
    ) {
        try {
            Milestone milestone = milestoneService.updateMilestone(id, request);
            return ResponseEntity.ok(MilestoneResponse.fromMilestone(milestone));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> markAsCompleted(@PathVariable UUID id) {
        try {
            Milestone milestone = milestoneService.markAsCompleted(id);
            return ResponseEntity.ok(MilestoneResponse.fromMilestone(milestone));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMilestone(@PathVariable UUID id) {
        try {
            milestoneService.deleteMilestone(id);
            return ResponseEntity.ok("Jalon supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
    @GetMapping("/startup/{startupId}")
    public ResponseEntity<?> getMilestonesByStartupId(@PathVariable UUID startupId) {
        try {
            List<Milestone> milestones = milestoneRepository.findByStartupId(startupId);
            return ResponseEntity.ok(milestones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
