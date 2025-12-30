package ma.startup.platform.analyitcsservice.repository;


import ma.startup.platform.analyitcsservice.enums.ActivityType;
import ma.startup.platform.analyitcsservice.model.Activity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    List<Activity> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    List<Activity> findByUserIdAndTypeOrderByCreatedAtDesc(UUID userId, ActivityType type, Pageable pageable);

    @Query("SELECT a FROM Activity a WHERE a.userId = :userId AND a.createdAt >= :startDate ORDER BY a.createdAt DESC")
    List<Activity> findRecentActivities(@Param("userId") UUID userId, @Param("startDate") LocalDateTime startDate);

    long countByUserId(UUID userId);

    long countByUserIdAndType(UUID userId, ActivityType type);
}
