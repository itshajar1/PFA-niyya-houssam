package ma.startup.platform.startupservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ma.startup.platform.startupservice.model.StatusEnum;

import java.time.LocalDate;

@Data
public class MilestoneRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    private StatusEnum statut;

    private LocalDate dateEcheance;
}
