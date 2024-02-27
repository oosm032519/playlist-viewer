package org.example.playlistinfo.security;

import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service // このクラスをSpringのサービスとして登録
public class SpotifyClientAuthenticator {

    private static final Logger logger = LoggerFactory.getLogger(SpotifyClientAuthenticator.class); // ロギングのためのロガー

    @Value("${spotify.client.id}") // application.propertiesからSpotifyのクライアントIDを取得
    private String clientId;

    @Value("${spotify.client.secret}") // application.propertiesからSpotifyのクライアントシークレットを取得
    private String clientSecret;

    private SpotifyApi spotifyApi;
    private ClientCredentialsRequest clientCredentialsRequest;

    @PostConstruct // インスタンス生成後に実行されるメソッド
    public void init() {
        spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .build();
        clientCredentialsRequest = spotifyApi.clientCredentials().build();
    }

    // Spotifyのクライアント認証を行い、アクセストークンを取得するメソッド
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

    @Bean // SpotifyApiのインスタンスをSpringのBeanとして登録
    public SpotifyApi spotifyApi() {
        return new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .build();
    }
}
