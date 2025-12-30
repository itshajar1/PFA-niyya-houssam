package ma.startup.platform.startupservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.startupservice.dto.MilestoneRequest;
import ma.startup.platform.startupservice.model.Milestone;
import ma.startup.platform.startupservice.model.Startup;
import ma.startup.platform.startupservice.model.StatusEnum;
import ma.startup.platform.startupservice.repository.MilestoneRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final StartupService startupService;

    @Transactional
    public Milestone createMilestone(UUID startupId, MilestoneRequest request) {
        Startup startup = startupService.getStartupById(startupId);

        Milestone milestone = new Milestone();
        milestone.setStartup(startup);
        milestone.setTitre(request.getTitre());
        milestone.setDescription(request.getDescription());
        milestone.setStatut(request.getStatut() != null ? request.getStatut() : StatusEnum.TODO);
        milestone.setDateEcheance(request.getDateEcheance());

        return milestoneRepository.save(milestone);
    }

    public List<Milestone> getMilestonesByStartupId(UUID startupId) {
        return milestoneRepository.findByStartupId(startupId);
    }

    public List<Milestone> getMilestonesByStatus(UUID startupId, StatusEnum status) {
        return milestoneRepository.findByStartupIdAndStatut(startupId, status);
    }

    public Milestone getMilestoneById(UUID id) {
        return milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jalon non trouvé"));
    }

    @Transactional
    public Milestone updateMilestone(UUID id, MilestoneRequest request) {
        Milestone milestone = getMilestoneById(id);

        if (request.getTitre() != null) {
            milestone.setTitre(request.getTitre());
        }
        if (request.getDescription() != null) {
            milestone.setDescription(request.getDescription());
        }
        if (request.getStatut() != null) {
            milestone.setStatut(request.getStatut());
        }
        if (request.getDateEcheance() != null) {
            milestone.setDateEcheance(request.getDateEcheance());
        }

        return milestoneRepository.save(milestone);
    }

    @Transactional
    public Milestone markAsCompleted(UUID id) {
        Milestone milestone = getMilestoneById(id);
        milestone.setStatut(StatusEnum.COMPLETED);
        milestone.setCompletedAt(LocalDateTime.now());
        return milestoneRepository.save(milestone);
    }

    @Transactional
    public void deleteMilestone(UUID id) {
        Milestone milestone = getMilestoneById(id);
        milestoneRepository.delete(milestone);
    }

    public long countCompletedMilestones(UUID startupId) {
        return milestoneRepository.countByStartupIdAndStatut(startupId, StatusEnum.COMPLETED);
    }
}
