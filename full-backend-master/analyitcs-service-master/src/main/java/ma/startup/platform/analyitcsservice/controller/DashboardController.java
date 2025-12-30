package ma.startup.platform.analyitcsservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.dto.DashboardResponse;
import ma.startup.platform.analyitcsservice.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard/me - Get complete dashboard for current user
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyDashboard(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/dashboard/me - Fetching dashboard");
            DashboardResponse response = dashboardService.getMyDashboard(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching dashboard: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/dashboard/stats - Get detailed statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/dashboard/stats - Fetching detailed stats");
            DashboardResponse response = dashboardService.getStats(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/dashboard/progress - Get progress over time
     */
    @GetMapping("/progress")
    public ResponseEntity<?> getProgress(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/dashboard/progress - Fetching progress");
            DashboardResponse response = dashboardService.getProgress(authHeader);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching progress: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
