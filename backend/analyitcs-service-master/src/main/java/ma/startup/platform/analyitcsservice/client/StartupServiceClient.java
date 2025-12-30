package ma.startup.platform.analyitcsservice.client;
import ma.startup.platform.analyitcsservice.dto.StartupDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "startup-service", url = "${startup.service.url}")
public interface StartupServiceClient {

    @GetMapping("/api/startups/me")
    StartupDTO getMyStartup(@RequestHeader("Authorization") String token);
}
