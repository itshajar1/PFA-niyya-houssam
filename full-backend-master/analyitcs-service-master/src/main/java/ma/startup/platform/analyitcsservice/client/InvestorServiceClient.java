package ma.startup.platform.analyitcsservice.client;
import ma.startup.platform.analyitcsservice.dto.ConnectionDTO;
import ma.startup.platform.analyitcsservice.dto.InvestorDTO;
import ma.startup.platform.analyitcsservice.dto.MatchingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "investor-service", url = "${investor.service.url}")
public interface InvestorServiceClient {

    @GetMapping("/api/investors/me")
    InvestorDTO getMyInvestor(@RequestHeader("Authorization") String token);

    @GetMapping("/api/matching/for-me")
    List<MatchingDTO> getMyMatches(@RequestHeader("Authorization") String token);

    @GetMapping("/api/connections/active")
    List<ConnectionDTO> getActiveConnections(@RequestHeader("Authorization") String token);
}
