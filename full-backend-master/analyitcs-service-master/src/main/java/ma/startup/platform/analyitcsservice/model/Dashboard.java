package ma.startup.platform.analyitcsservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dashboards", schema = "analytics_schema")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "profile_completion")
    private Integer profileCompletion = 0;

    @Column(name = "pitchs_generated")
    private Integer pitchsGenerated = 0;

    @Column(name = "matching_investors")
    private Integer matchingInvestors = 0;

    @Column(name = "connections_active")
    private Integer connectionsActive = 0;

    @Column(name = "milestones_completed")
    private Integer milestonesCompleted = 0;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
