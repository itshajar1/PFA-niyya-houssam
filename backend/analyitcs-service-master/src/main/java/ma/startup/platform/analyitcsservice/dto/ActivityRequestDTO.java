// package ma.startup.platform.investorservice.dto;

package ma.startup.platform.analyitcsservice.dto;

import ma.startup.platform.analyitcsservice.enums.ActivityType;

public class ActivityRequestDTO {
    private String userId; // The user who receives the activity (startup owner)
    private ActivityType type;
    private String description;
    private String metadata;

    // Constructors, Getters, Setters
    public ActivityRequestDTO() {}

    public ActivityRequestDTO(String userId, ActivityType type, String description, String metadata) {
        this.userId = userId;
        this.type = type;
        this.description = description;
        this.metadata = metadata;
    }

    // Getters & Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public ActivityType getType() { return type; }
    public void setType(ActivityType type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}