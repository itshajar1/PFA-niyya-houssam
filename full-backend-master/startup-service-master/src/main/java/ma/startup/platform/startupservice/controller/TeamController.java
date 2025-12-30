package ma.startup.platform.startupservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.startupservice.client.UserDTO;
import ma.startup.platform.startupservice.dto.FounderMemberRequest;
import ma.startup.platform.startupservice.dto.FounderMemberResponse;
import ma.startup.platform.startupservice.model.FounderMember;
import ma.startup.platform.startupservice.model.Startup;
import ma.startup.platform.startupservice.repository.FounderMemberRepository;
import ma.startup.platform.startupservice.service.FounderMemberService;
import ma.startup.platform.startupservice.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/startups/me/team")
@RequiredArgsConstructor
public class TeamController {

    private final FounderMemberService founderMemberService;
    private final StartupService startupService;
    private final FounderMemberRepository founderMemberRepository;

    @PostMapping
    public ResponseEntity<?> addTeamMember(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody FounderMemberRequest request
    ) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            Startup startup = startupService.getStartupByUserId(user.getId());

            FounderMember member = founderMemberService.addMember(startup.getId(), request);
            return ResponseEntity.ok(FounderMemberResponse.fromFounderMember(member));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyTeam(@RequestHeader("Authorization") String authHeader) {
        try {
            UserDTO user = startupService.verifyUser(authHeader);
            Startup startup = startupService.getStartupByUserId(user.getId());

            List<FounderMember> team = founderMemberService.getTeamByStartupId(startup.getId());
            List<FounderMemberResponse> responses = team.stream()
                    .map(FounderMemberResponse::fromFounderMember)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeamMember(
            @PathVariable UUID id,
            @Valid @RequestBody FounderMemberRequest request
    ) {
        try {
            FounderMember member = founderMemberService.updateMember(id, request);
            return ResponseEntity.ok(FounderMemberResponse.fromFounderMember(member));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeamMember(@PathVariable UUID id) {
        try {
            founderMemberService.deleteMember(id);
            return ResponseEntity.ok("Membre supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    @GetMapping("/startup/{startupId}")
    public ResponseEntity<?> getTeamByStartupId(@PathVariable UUID startupId) {
        try {
            List<FounderMember> team = founderMemberRepository.findByStartupId(startupId);
            return ResponseEntity.ok(team);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
