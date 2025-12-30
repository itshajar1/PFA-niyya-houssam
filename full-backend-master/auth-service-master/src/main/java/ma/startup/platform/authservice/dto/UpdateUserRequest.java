package ma.startup.platform.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Email(message = "Email invalide")
    private String email;

    @Size(min = 6, message = "Mot de passe doit contenir au moins 6 caractères")
    private String password;
}
