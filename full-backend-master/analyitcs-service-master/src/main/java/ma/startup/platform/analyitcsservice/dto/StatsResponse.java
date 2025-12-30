package ma.startup.platform.analyitcsservice.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsResponse {

    private Integer totalPitchs;
    private Integer totalMatches;
    private Integer totalConnections;
    private Integer pendingConnections;
    private Integer acceptedConnections;
    private Integer rejectedConnections;
    private Double averageMatchScore;
    private Integer profileCompletionPercentage;
}
