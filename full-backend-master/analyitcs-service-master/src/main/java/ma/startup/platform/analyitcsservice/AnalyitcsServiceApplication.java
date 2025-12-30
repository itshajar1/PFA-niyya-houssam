package ma.startup.platform.analyitcsservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AnalyitcsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalyitcsServiceApplication.class, args);
	}

}
