package ma.startup.platform.analyitcsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchingDTO {
    private UUID matchId;
    private Integer score;
}
