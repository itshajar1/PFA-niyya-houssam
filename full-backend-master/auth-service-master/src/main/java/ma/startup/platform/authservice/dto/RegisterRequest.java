package ma.startup.platform.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import ma.startup.platform.authservice.model.Role;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Mot de passe est obligatoire")
    @Size(min = 6, message = "Mot de passe doit contenir au moins 6 caractères")
    private String password;

    @NotNull(message = "Role est obligatoire")
    private Role role;
}
