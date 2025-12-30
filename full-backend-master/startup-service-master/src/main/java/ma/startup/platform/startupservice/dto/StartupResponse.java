package ma.startup.platform.startupservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.startup.platform.startupservice.model.Startup;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StartupResponse {

    private UUID id;
    private UUID userId;
    private String nom;
    private String secteur;
    private String description;
    private String tags;
    private Integer profileCompletion;
    private String logo;
    private String siteWeb;
    private LocalDate dateCreation;
    private LocalDateTime createdAt;
    private int teamCount;
    private int milestonesCount;

    public static StartupResponse fromStartup(Startup startup) {
        return new StartupResponse(
                startup.getId(),
                startup.getUserId(),
                startup.getNom(),
                startup.getSecteur(),
                startup.getDescription(),
                startup.getTags(),
                startup.getProfileCompletion(),
                startup.getLogo(),
                startup.getSiteWeb(),
                startup.getDateCreation(),
                startup.getCreatedAt(),
                startup.getTeam() != null ? startup.getTeam().size() : 0,
                startup.getMilestones() != null ? startup.getMilestones().size() : 0
        );
    }
}
