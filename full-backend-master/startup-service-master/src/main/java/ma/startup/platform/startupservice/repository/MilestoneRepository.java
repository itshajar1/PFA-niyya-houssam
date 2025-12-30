package ma.startup.platform.startupservice.repository;

import ma.startup.platform.startupservice.model.Milestone;
import ma.startup.platform.startupservice.model.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {

    List<Milestone> findByStartupId(UUID startupId);

    List<Milestone> findByStartupIdAndStatut(UUID startupId, StatusEnum statut);

    long countByStartupIdAndStatut(UUID startupId, StatusEnum statut);
}
