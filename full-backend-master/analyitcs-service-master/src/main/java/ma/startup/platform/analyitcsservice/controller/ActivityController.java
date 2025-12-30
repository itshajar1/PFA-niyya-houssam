package ma.startup.platform.analyitcsservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.dto.ActivityResponse;
import ma.startup.platform.analyitcsservice.enums.ActivityType;
import ma.startup.platform.analyitcsservice.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/activities")
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final ActivityService activityService;

    /**
     * GET /api/dashboard/activities - Get recent activities
     */
    @GetMapping
    public ResponseEntity<?> getMyActivities(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false, defaultValue = "20") Integer limit) {
        try {
            log.info("GET /api/dashboard/activities - Fetching activities (limit: {})", limit);
            List<ActivityResponse> activities = activityService.getMyActivities(authHeader, limit);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            log.error("Error fetching activities: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/dashboard/activities/recent - Get activities from last 7 days
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentActivities(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/dashboard/activities/recent - Fetching recent activities");
            List<ActivityResponse> activities = activityService.getRecentActivities(authHeader);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            log.error("Error fetching recent activities: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/dashboard/activities/type/{type} - Get activities by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getActivitiesByType(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable ActivityType type,
            @RequestParam(required = false, defaultValue = "20") Integer limit) {
        try {
            log.info("GET /api/dashboard/activities/type/{} - Fetching activities by type", type);
            List<ActivityResponse> activities = activityService.getActivitiesByType(authHeader, type, limit);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            log.error("Error fetching activities by type: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * GET /api/dashboard/activities/count - Count total activities
     */
    @GetMapping("/count")
    public ResponseEntity<?> countMyActivities(@RequestHeader("Authorization") String authHeader) {
        try {
            log.info("GET /api/dashboard/activities/count - Counting activities");
            long count = activityService.countMyActivities(authHeader);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error counting activities: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
