package ma.startup.platform.analyitcsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PitchDTO {
    private UUID id;
    private UUID startupId;
    private String probleme;
    private String solution;
    private String cible;
    private String avantage;
    private String pitchGenere;
    private String type;
    private Integer rating;
    private Boolean isFavorite;
    private LocalDateTime createdAt;
}
