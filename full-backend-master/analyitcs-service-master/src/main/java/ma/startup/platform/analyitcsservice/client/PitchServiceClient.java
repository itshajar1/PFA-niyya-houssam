package ma.startup.platform.analyitcsservice.client;
import ma.startup.platform.analyitcsservice.dto.PitchDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "pitch-service", url = "${pitch.service.url}")
public interface PitchServiceClient {

    @GetMapping("/api/pitchs/me")
    List<PitchDTO> getMyPitchs(@RequestHeader("Authorization") String token);
}
