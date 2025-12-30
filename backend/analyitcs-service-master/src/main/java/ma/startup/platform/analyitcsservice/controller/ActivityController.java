package ma.startup.platform.analyitcsservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.dto.ActivityRequestDTO;
import ma.startup.platform.analyitcsservice.dto.ActivityResponse;
import ma.startup.platform.analyitcsservice.enums.ActivityType;
import ma.startup.platform.analyitcsservice.service.ActivityService;

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
@GetMapping("/type/{type}/count")
public ResponseEntity<?> countByType(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable ActivityType type) {
    try {
        log.info("GET /api/dashboard/activities/type/{}/count - Counting activities", type);
        long count = activityService.countActivitiesByType(authHeader, type);
        return ResponseEntity.ok(count);
    } catch (Exception e) {
        log.error("Error counting activities by type {}: {}", type, e.getMessage());
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
    @PostMapping("/log")
public ResponseEntity<?> logActivity(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody ActivityRequestDTO request) {
    try {
        log.info("POST /api/analytics/activities/log - Logging activity for user: {}", request.getUserId());

        // Validate and log
        activityService.logActivity(
            UUID.fromString(request.getUserId()),
            request.getType(),
            request.getDescription(),
            request.getMetadata()
        );

        return ResponseEntity.ok().build();
    } catch (Exception e) {
        log.error("Error logging activity: {}", e.getMessage());
        return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
    }
}
}
