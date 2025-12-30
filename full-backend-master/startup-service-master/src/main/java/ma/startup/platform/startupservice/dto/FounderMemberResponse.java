package ma.startup.platform.startupservice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.startup.platform.startupservice.model.FounderMember;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FounderMemberResponse {

    private UUID id;
    private String nom;
    private String role;
    private String linkedIn;
    private String photo;
    private LocalDateTime createdAt;

    public static FounderMemberResponse fromFounderMember(FounderMember member) {
        return new FounderMemberResponse(
                member.getId(),
                member.getNom(),
                member.getRole(),
                member.getLinkedIn(),
                member.getPhoto(),
                member.getCreatedAt()
        );
    }
}
