package ma.startup.platform.analyitcsservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.client.AuthServiceClient;
import ma.startup.platform.analyitcsservice.client.InvestorServiceClient;
import ma.startup.platform.analyitcsservice.client.PitchServiceClient;
import ma.startup.platform.analyitcsservice.client.StartupServiceClient;
import ma.startup.platform.analyitcsservice.dto.*;
import ma.startup.platform.analyitcsservice.model.Activity;
import ma.startup.platform.analyitcsservice.model.Dashboard;
import ma.startup.platform.analyitcsservice.repository.ActivityRepository;
import ma.startup.platform.analyitcsservice.repository.DashboardRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final ActivityRepository activityRepository;
    private final AuthServiceClient authServiceClient;
    private final StartupServiceClient startupServiceClient;
    private final PitchServiceClient pitchServiceClient;
    private final InvestorServiceClient investorServiceClient;

    /**
     * Get complete dashboard for current user
     * Aggregates data from all microservices
     */
    @Transactional
    public DashboardResponse getMyDashboard(String authHeader) {
        log.info("Fetching dashboard for current user");

        // 1. Get current user
        UserDTO user = authServiceClient.getCurrentUser(authHeader);

        // 2. Get or create dashboard record
        Dashboard dashboard = dashboardRepository.findByUserId(user.getId())
                .orElse(new Dashboard());
        dashboard.setUserId(user.getId());

        // 3. Aggregate data based on user role
        if ("STARTUP".equals(user.getRole())) {
            aggregateStartupData(dashboard, authHeader);
        } else if ("INVESTOR".equals(user.getRole())) {
            aggregateInvestorData(dashboard, authHeader);
        }

        // 4. Save updated dashboard
        dashboardRepository.save(dashboard);

        // 5. Get recent activities
        Pageable pageable = PageRequest.of(0, 10);
        List<Activity> activities = activityRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
        List<ActivityResponse> activityResponses = activities.stream()
                .map(ActivityResponse::fromActivity)
                .collect(Collectors.toList());

        // 6. Build response
        return DashboardResponse.builder()
                .profileCompletion(dashboard.getProfileCompletion())
                .pitchsGenerated(dashboard.getPitchsGenerated())
                .matchingInvestors(dashboard.getMatchingInvestors())
                .connectionsActive(dashboard.getConnectionsActive())
                .milestonesCompleted(dashboard.getMilestonesCompleted())
                .lastUpdated(dashboard.getLastUpdated())
                .recentActivities(activityResponses)
                .build();
    }

    /**
     * Aggregate data for STARTUP users
     */
    private void aggregateStartupData(Dashboard dashboard, String authHeader) {
        try {
            // Get startup profile
            StartupDTO startup = startupServiceClient.getMyStartup(authHeader);
            dashboard.setProfileCompletion(startup.getProfileCompletion() != null ? startup.getProfileCompletion() : 0);
            dashboard.setMilestonesCompleted(startup.getMilestonesCount());

            // Get pitchs count
            try {
                List<PitchDTO> pitchs = pitchServiceClient.getMyPitchs(authHeader);
                dashboard.setPitchsGenerated(pitchs != null ? pitchs.size() : 0);
            } catch (Exception e) {
                log.warn("Could not fetch pitchs: {}", e.getMessage());
                dashboard.setPitchsGenerated(0);
            }

            // Get matching investors count
            try {
                List<MatchingDTO> matches = investorServiceClient.getMyMatches(authHeader);
                dashboard.setMatchingInvestors(matches != null ? matches.size() : 0);
            } catch (Exception e) {
                log.warn("Could not fetch matches: {}", e.getMessage());
                dashboard.setMatchingInvestors(0);
            }

            // Get active connections count
            try {
                List<ConnectionDTO> connections = investorServiceClient.getActiveConnections(authHeader);
                dashboard.setConnectionsActive(connections != null ? connections.size() : 0);
            } catch (Exception e) {
                log.warn("Could not fetch connections: {}", e.getMessage());
                dashboard.setConnectionsActive(0);
            }

        } catch (Exception e) {
            log.error("Error aggregating startup data: {}", e.getMessage());
            // Set default values
            dashboard.setProfileCompletion(0);
            dashboard.setPitchsGenerated(0);
            dashboard.setMatchingInvestors(0);
            dashboard.setConnectionsActive(0);
            dashboard.setMilestonesCompleted(0);
        }
    }

    /**
     * Aggregate data for INVESTOR users
     */
    private void aggregateInvestorData(Dashboard dashboard, String authHeader) {
        try {
            // Get investor profile
            InvestorDTO investor = investorServiceClient.getMyInvestor(authHeader);
            dashboard.setProfileCompletion(100); // Investor profile is always complete once created

            // Investors don't have pitchs or milestones
            dashboard.setPitchsGenerated(0);
            dashboard.setMilestonesCompleted(0);

            // Get matching startups count (would need endpoint in investor-service)
            dashboard.setMatchingInvestors(0); // TODO: Implement when investor matching endpoint is ready

            // Get active connections count
            try {
                List<ConnectionDTO> connections = investorServiceClient.getActiveConnections(authHeader);
                dashboard.setConnectionsActive(connections != null ? connections.size() : 0);
            } catch (Exception e) {
                log.warn("Could not fetch connections: {}", e.getMessage());
                dashboard.setConnectionsActive(0);
            }

        } catch (Exception e) {
            log.error("Error aggregating investor data: {}", e.getMessage());
            // Set default values
            dashboard.setProfileCompletion(0);
            dashboard.setPitchsGenerated(0);
            dashboard.setMatchingInvestors(0);
            dashboard.setConnectionsActive(0);
            dashboard.setMilestonesCompleted(0);
        }
    }

    /**
     * Get detailed statistics
     */
    public DashboardResponse getStats(String authHeader) {
        log.info("Fetching detailed stats");
        return getMyDashboard(authHeader);
    }

    /**
     * Get progress over time (weekly/monthly)
     */
    public DashboardResponse getProgress(String authHeader) {
        log.info("Fetching progress data");
        return getMyDashboard(authHeader);
    }
}
