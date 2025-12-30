package ma.startup.platform.analyitcsservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.dto.StatsResponse;
import ma.startup.platform.analyitcsservice.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * GET /api/analytics/overview - Platform overview (admin only)
     */
    @GetMapping("/overview")
    public ResponseEntity<?> getPlatformOverview(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/analytics/overview - Fetching platform overview");
            StatsResponse response = analyticsService.getPlatformOverview(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching platform overview: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/analytics/startups-stats - Startups statistics (admin only)
     */
    @GetMapping("/startups-stats")
    public ResponseEntity<?> getStartupsStats(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/analytics/startups-stats - Fetching startups stats");
            StatsResponse response = analyticsService.getStartupsStats(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching startups stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/analytics/pitchs-stats - Pitch statistics (admin only)
     */
    @GetMapping("/pitchs-stats")
    public ResponseEntity<?> getPitchsStats(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/analytics/pitchs-stats - Fetching pitchs stats");
            StatsResponse response = analyticsService.getPitchsStats(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching pitchs stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/analytics/matching-stats - Matching statistics (admin only)
     */
    @GetMapping("/matching-stats")
    public ResponseEntity<?> getMatchingStats(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/analytics/matching-stats - Fetching matching stats");
            StatsResponse response = analyticsService.getMatchingStats(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching matching stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
