package authorization.client_credentials;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppStartupRunner {

    private final ClientCredentials clientCredentials;

    public AppStartupRunner(ClientCredentials clientCredentials) {
        this.clientCredentials = clientCredentials;
    }

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> clientCredentials.clientCredentials();
    }
}
