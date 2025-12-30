package ma.startup.platform.analyitcsservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.client.AuthServiceClient;
import ma.startup.platform.analyitcsservice.dto.StatsResponse;
import ma.startup.platform.analyitcsservice.dto.UserDTO;
import ma.startup.platform.analyitcsservice.repository.ActivityRepository;
import ma.startup.platform.analyitcsservice.repository.DashboardRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final DashboardRepository dashboardRepository;
    private final ActivityRepository activityRepository;
    private final AuthServiceClient authServiceClient;

    /**
     * Get platform overview (admin only)
     */
    public StatsResponse getPlatformOverview(String authHeader) {
        log.info("Fetching platform overview");

        // Verify admin role
        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Accès refusé: Seuls les administrateurs peuvent accéder aux statistiques globales");
        }

        // Get platform-wide statistics
        long totalUsers = dashboardRepository.count();
        long totalActivities = activityRepository.count();

        return StatsResponse.builder()
                .totalPitchs(0) // Would need to aggregate from all users
                .totalMatches(0)
                .totalConnections(0)
                .pendingConnections(0)
                .acceptedConnections(0)
                .rejectedConnections(0)
                .averageMatchScore(0.0)
                .profileCompletionPercentage(0)
                .build();
    }

    /**
     * Get startup statistics (admin only)
     */
    public StatsResponse getStartupsStats(String authHeader) {
        log.info("Fetching startups statistics");

        // Verify admin role
        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Accès refusé: Administrateur requis");
        }

        // TODO: Implement aggregated stats from all startups
        return StatsResponse.builder().build();
    }

    /**
     * Get pitch generation statistics (admin only)
     */
    public StatsResponse getPitchsStats(String authHeader) {
        log.info("Fetching pitchs statistics");

        // Verify admin role
        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Accès refusé: Administrateur requis");
        }

        // TODO: Implement aggregated pitch stats
        return StatsResponse.builder().build();
    }

    /**
     * Get matching statistics (admin only)
     */
    public StatsResponse getMatchingStats(String authHeader) {
        log.info("Fetching matching statistics");

        // Verify admin role
        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Accès refusé: Administrateur requis");
        }

        // TODO: Implement aggregated matching stats
        return StatsResponse.builder().build();
    }
}
