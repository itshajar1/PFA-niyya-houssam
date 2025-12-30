package ma.startup.platform.startupservice.repository;

import ma.startup.platform.startupservice.model.Startup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StartupRepository extends JpaRepository<Startup, UUID> {

    Optional<Startup> findByUserId(UUID userId);

    List<Startup> findBySecteur(String secteur);

    boolean existsByUserId(UUID userId);
}
