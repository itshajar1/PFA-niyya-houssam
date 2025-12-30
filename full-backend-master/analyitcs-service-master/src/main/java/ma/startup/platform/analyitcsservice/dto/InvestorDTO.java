package ma.startup.platform.analyitcsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvestorDTO {
    private UUID id;
    private UUID userId;
    private String nom;
    private String type;
    private String secteursInterets;
    private BigDecimal montantMin;
    private BigDecimal montantMax;
    private String description;
    private String localisation;
    private String portfolio;
    private String siteWeb;
    private String email;
    private LocalDateTime createdAt;
}
