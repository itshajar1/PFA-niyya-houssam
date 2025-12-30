package ma.startup.platform.startupservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "founder_members", schema = "startup_schema")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FounderMember {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    @JsonIgnore
    private Startup startup;

    @Column(nullable = false)
    private String nom;

    private String role;

    @Column(name = "linked_in")
    private String linkedIn;

    private String photo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

