package org.example.playlistinfo.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;
import org.example.playlistinfo.service.SpotifyApiService;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service  // サービスクラス
public class SpotifyClientAuthenticator {

    private static final Logger logger = LoggerFactory.getLogger(SpotifyClientAuthenticator.class);

    private final SpotifyApiService spotifyApiService;  // Spotify APIサービス
    private ClientCredentialsRequest clientCredentialsRequest;  // クライアント認証リクエスト

    @Autowired  // 依存性注入
    public SpotifyClientAuthenticator(SpotifyApiService spotifyApiService) {
        this.spotifyApiService = spotifyApiService;
    }

    @PostConstruct  // 初期化メソッド
    public void init() {
        SpotifyApi spotifyApi = spotifyApiService.getSpotifyApi();
        clientCredentialsRequest = spotifyApi.clientCredentials().build();
    }

    // クライアント認証を行うメソッド
    public String clientCredentials() {
        try {
            return executeClientCredentialsRequest();
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            logger.error("An error occurred: ", e);
            throw new RuntimeException(e);
        }
    }

    // クライアント認証リクエストを実行するプライベートメソッド
    private String executeClientCredentialsRequest() throws IOException, SpotifyWebApiException, org.apache.hc.core5.http.ParseException {
        final se.michaelthelin.spotify.model_objects.credentials.ClientCredentials clientCredentials = clientCredentialsRequest.execute();

        spotifyApiService.setAccessToken(clientCredentials.getAccessToken());

        logger.info("Access token: " + clientCredentials.getAccessToken());
        logger.info("Expires in: " + clientCredentials.getExpiresIn());

        return clientCredentials.getAccessToken();
    }
}
