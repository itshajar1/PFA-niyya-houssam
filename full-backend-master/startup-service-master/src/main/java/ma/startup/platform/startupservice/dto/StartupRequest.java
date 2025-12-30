package ma.startup.platform.startupservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StartupRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 3, max = 255, message = "Le nom doit contenir entre 3 et 255 caractères")
    private String nom;

    @NotBlank(message = "Le secteur est obligatoire")
    private String secteur;

    @Size(max = 5000, message = "Description trop longue")
    private String description;

    private String tags;

    private String logo;

    private String siteWeb;

    private LocalDate dateCreation;
}
