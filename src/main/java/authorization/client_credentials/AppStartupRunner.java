package authorization.client_credentials;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppStartupRunner {

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> System.out.println("Application started with option names : " + args.getOptionNames());
    }
}
