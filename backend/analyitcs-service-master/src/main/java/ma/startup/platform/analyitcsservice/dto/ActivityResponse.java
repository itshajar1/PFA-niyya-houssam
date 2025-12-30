package ma.startup.platform.analyitcsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.startup.platform.analyitcsservice.enums.ActivityType;
import ma.startup.platform.analyitcsservice.model.Activity;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {

    private UUID id;
    private UUID userId;
    private ActivityType type;
    private String description;
    private String metadata;
    private LocalDateTime createdAt;

    public static ActivityResponse fromActivity(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getUserId(),
                activity.getType(),
                activity.getDescription(),
                activity.getMetadata(),
                activity.getCreatedAt()
        );
    }
}
