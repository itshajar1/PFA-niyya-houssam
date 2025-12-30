package ma.startup.platform.startupservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.startupservice.dto.FounderMemberRequest;
import ma.startup.platform.startupservice.model.FounderMember;
import ma.startup.platform.startupservice.model.Startup;
import ma.startup.platform.startupservice.repository.FounderMemberRepository;
import ma.startup.platform.startupservice.repository.StartupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FounderMemberService {

    private final FounderMemberRepository founderMemberRepository;
    private final StartupRepository startupRepository;
    private final StartupService startupService;

    @Transactional
    public FounderMember addMember(UUID startupId, FounderMemberRequest request) {
        Startup startup = startupService.getStartupById(startupId);

        FounderMember member = new FounderMember();
        member.setStartup(startup);
        member.setNom(request.getNom());
        member.setRole(request.getRole());
        member.setLinkedIn(request.getLinkedIn());
        member.setPhoto(request.getPhoto());

        FounderMember savedMember = founderMemberRepository.save(member);

        // Recalculer le score de complétion
        startup.setProfileCompletion(startupService.calculateProfileCompletion(startup));
        startupRepository.save(startup);

        return savedMember;
    }

    public List<FounderMember> getTeamByStartupId(UUID startupId) {
        return founderMemberRepository.findByStartupId(startupId);
    }

    public FounderMember getMemberById(UUID id) {
        return founderMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre non trouvé"));
    }

    @Transactional
    public FounderMember updateMember(UUID id, FounderMemberRequest request) {
        FounderMember member = getMemberById(id);

        if (request.getNom() != null) {
            member.setNom(request.getNom());
        }
        if (request.getRole() != null) {
            member.setRole(request.getRole());
        }
        if (request.getLinkedIn() != null) {
            member.setLinkedIn(request.getLinkedIn());
        }
        if (request.getPhoto() != null) {
            member.setPhoto(request.getPhoto());
        }

        return founderMemberRepository.save(member);
    }

    @Transactional
    public void deleteMember(UUID id) {
        FounderMember member = getMemberById(id);
        Startup startup = member.getStartup();

        founderMemberRepository.delete(member);

        // Recalculer le score
        startup.setProfileCompletion(startupService.calculateProfileCompletion(startup));
        startupRepository.save(startup);
    }
}
