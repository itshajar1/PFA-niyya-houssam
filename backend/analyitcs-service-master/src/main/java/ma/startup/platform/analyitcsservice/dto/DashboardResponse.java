package ma.startup.platform.analyitcsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Integer profileCompletion;
    private Integer pitchsGenerated;
    private Integer matchingInvestors;
    private Integer connectionsActive;
    private Integer milestonesCompleted;
    private LocalDateTime lastUpdated;
    private List<ActivityResponse> recentActivities;
}
