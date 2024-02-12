package authorization.client_credentials;

import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service
public class ClientCredentials {

    private static final Logger logger = LoggerFactory.getLogger(ClientCredentials.class);

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    private SpotifyApi spotifyApi;
    private ClientCredentialsRequest clientCredentialsRequest;

    @PostConstruct
    public void init() {
        spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .build();
        clientCredentialsRequest = spotifyApi.clientCredentials().build();
    }

    public String clientCredentials() {
        try {
            final se.michaelthelin.spotify.model_objects.credentials.ClientCredentials clientCredentials = clientCredentialsRequest
                    .execute();

            spotifyApi.setAccessToken(clientCredentials.getAccessToken());

            logger.info("アクセストークン: " + clientCredentials.getAccessToken());
            logger.info("有効期限: " + clientCredentials.getExpiresIn());

            return clientCredentials.getAccessToken();
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("エラーが発生しました: ", e);
            throw new RuntimeException(e);
        }
    }
}
