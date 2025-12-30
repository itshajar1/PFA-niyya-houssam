package ma.startup.platform.startupservice.repository;

import ma.startup.platform.startupservice.model.FounderMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FounderMemberRepository extends JpaRepository<FounderMember, UUID> {

    List<FounderMember> findByStartupId(UUID startupId);
    int countByStartupId(UUID startupId);
}
