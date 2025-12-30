package ma.startup.platform.analyitcsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionDTO {
    private UUID id;
    private UUID startupId;
    private UUID investorId;
    private String message;
    private String statut;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
}
