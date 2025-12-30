package ma.startup.platform.startupservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import ma.startup.platform.startupservice.client.AuthServiceClient;
import ma.startup.platform.startupservice.client.UserDTO;
import ma.startup.platform.startupservice.dto.StartupRequest;
import ma.startup.platform.startupservice.model.Startup;
import ma.startup.platform.startupservice.repository.FounderMemberRepository;
import ma.startup.platform.startupservice.repository.MilestoneRepository;
import ma.startup.platform.startupservice.repository.StartupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StartupService {

    private final StartupRepository startupRepository;
    private final MilestoneRepository milestoneRepository;
    private final AuthServiceClient authServiceClient;
    private final FounderMemberRepository founderMemberRepository;

    @Transactional
    public Startup createStartup(UUID userId, StartupRequest request) {
        // Vérifier si l'utilisateur a déjà une startup
        if (startupRepository.existsByUserId(userId)) {
            throw new RuntimeException("Cet utilisateur a déjà une startup");
        }

        Startup startup = new Startup();
        startup.setUserId(userId);
        startup.setNom(request.getNom());
        startup.setSecteur(request.getSecteur());
        startup.setDescription(request.getDescription());
        startup.setTags(request.getTags());
        startup.setLogo(request.getLogo());
        startup.setSiteWeb(request.getSiteWeb());
        startup.setDateCreation(request.getDateCreation());

        // Calculer le score initial
        startup.setProfileCompletion(calculateProfileCompletion(startup));

        return startupRepository.save(startup);
    }

    public Startup getStartupByUserId(UUID userId) {
        return startupRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Startup non trouvée pour cet utilisateur"));
    }

    public Startup getStartupById(UUID id) {
        return startupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Startup non trouvée"));
    }

    public List<Startup> getAllStartups() {
        return startupRepository.findAll();
    }

    public List<Startup> getStartupsBySecteur(String secteur) {
        return startupRepository.findBySecteur(secteur);
    }

    @Transactional
    public Startup updateStartup(UUID userId, StartupRequest request) {
        Startup startup = getStartupByUserId(userId);

        if (request.getNom() != null) {
            startup.setNom(request.getNom());
        }
        if (request.getSecteur() != null) {
            startup.setSecteur(request.getSecteur());
        }
        if (request.getDescription() != null) {
            startup.setDescription(request.getDescription());
        }
        if (request.getTags() != null) {
            startup.setTags(request.getTags());
        }
        if (request.getLogo() != null) {
            startup.setLogo(request.getLogo());
        }
        if (request.getSiteWeb() != null) {
            startup.setSiteWeb(request.getSiteWeb());
        }
        if (request.getDateCreation() != null) {
            startup.setDateCreation(request.getDateCreation());
        }

        // Recalculer le score
        startup.setProfileCompletion(calculateProfileCompletion(startup));

        return startupRepository.save(startup);
    }

    @Transactional
    public void deleteStartup(UUID userId) {
        Startup startup = getStartupByUserId(userId);
        startupRepository.delete(startup);
    }
    @Transactional
    public Integer calculateProfileCompletion(Startup startup) {
        int score = 0;

        if (startup.getNom() != null && !startup.getNom().isEmpty()) {
            score += 20;
        }
        if (startup.getSecteur() != null && !startup.getSecteur().isEmpty()) {
            score += 20;
        }
        if (startup.getDescription() != null && !startup.getDescription().isEmpty()) {
            score += 20;
        }
        if (startup.getTags() != null && !startup.getTags().isEmpty()) {
            score += 20;
        }
        if (startup.getTeam() != null && startup.getTeam().size() >= 2) {
            score += 20;
        }
        int teamSize = founderMemberRepository.countByStartupId(startup.getId());
        if (teamSize >= 2) {
            score += 20;
        }

        return score;
    }

    public UserDTO verifyUser(String authHeader) {
        return authServiceClient.getCurrentUser(authHeader);
    }
}
