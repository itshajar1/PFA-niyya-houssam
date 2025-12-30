package ma.startup.platform.analyitcsservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.startup.platform.analyitcsservice.client.AuthServiceClient;
import ma.startup.platform.analyitcsservice.dto.ActivityResponse;
import ma.startup.platform.analyitcsservice.dto.UserDTO;
import ma.startup.platform.analyitcsservice.enums.ActivityType;
import ma.startup.platform.analyitcsservice.model.Activity;
import ma.startup.platform.analyitcsservice.repository.ActivityRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final AuthServiceClient authServiceClient;

    /**
     * Get recent activities for current user
     */
    public List<ActivityResponse> getMyActivities(String authHeader, Integer limit) {
        log.info("Fetching activities for current user");

        UserDTO user = authServiceClient.getCurrentUser(authHeader);

        Pageable pageable = PageRequest.of(0, limit != null ? limit : 20);
        List<Activity> activities = activityRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        return activities.stream()
                .map(ActivityResponse::fromActivity)
                .collect(Collectors.toList());
    }

    /**
     * Get activities by type
     */
    public List<ActivityResponse> getActivitiesByType(String authHeader, ActivityType type, Integer limit) {
        log.info("Fetching activities by type: {}", type);

        UserDTO user = authServiceClient.getCurrentUser(authHeader);

        Pageable pageable = PageRequest.of(0, limit != null ? limit : 20);
        List<Activity> activities = activityRepository.findByUserIdAndTypeOrderByCreatedAtDesc(
                user.getId(), type, pageable);

        return activities.stream()
                .map(ActivityResponse::fromActivity)
                .collect(Collectors.toList());
    }

    /**
     * Get recent activities (last 7 days)
     */
    public List<ActivityResponse> getRecentActivities(String authHeader) {
        log.info("Fetching recent activities (last 7 days)");

        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);

        List<Activity> activities = activityRepository.findRecentActivities(user.getId(), weekAgo);

        return activities.stream()
                .map(ActivityResponse::fromActivity)
                .collect(Collectors.toList());
    }

    /**
     * Log a new activity
     */
    @Transactional
    public ActivityResponse logActivity(UUID userId, ActivityType type, String description, String metadata) {
        log.info("Logging activity: {} for user: {}", type, userId);

        Activity activity = new Activity();
        activity.setUserId(userId);
        activity.setType(type);
        activity.setDescription(description);
        activity.setMetadata(metadata);

        Activity saved = activityRepository.save(activity);
        return ActivityResponse.fromActivity(saved);
    }

    /**
     * Count total activities for user
     */
    public long countMyActivities(String authHeader) {
        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        return activityRepository.countByUserId(user.getId());
    }

    /**
     * Count activities by type for user
     */
    public long countActivitiesByType(String authHeader, ActivityType type) {
        UserDTO user = authServiceClient.getCurrentUser(authHeader);
        return activityRepository.countByUserIdAndType(user.getId(), type);
    }
}
