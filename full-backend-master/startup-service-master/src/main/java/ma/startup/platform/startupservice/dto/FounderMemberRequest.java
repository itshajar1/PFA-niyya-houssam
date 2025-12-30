package ma.startup.platform.startupservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FounderMemberRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String role;

    private String linkedIn;

    private String photo;
}
