package ma.startup.platform.analyitcsservice.repository;

import ma.startup.platform.analyitcsservice.model.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, UUID> {

    Optional<Dashboard> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}
