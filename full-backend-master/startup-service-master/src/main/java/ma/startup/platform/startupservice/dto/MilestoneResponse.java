package ma.startup.platform.startupservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.startup.platform.startupservice.model.Milestone;
import ma.startup.platform.startupservice.model.StatusEnum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MilestoneResponse {

    private UUID id;
    private String titre;
    private String description;
    private StatusEnum statut;
    private LocalDate dateEcheance;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;

    public static MilestoneResponse fromMilestone(Milestone milestone) {
        return new MilestoneResponse(
                milestone.getId(),
                milestone.getTitre(),
                milestone.getDescription(),
                milestone.getStatut(),
                milestone.getDateEcheance(),
                milestone.getCompletedAt(),
                milestone.getCreatedAt()
        );
    }
}
