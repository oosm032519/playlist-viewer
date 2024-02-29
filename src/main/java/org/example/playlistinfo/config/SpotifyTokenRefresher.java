package org.example.playlistinfo.config;

import jakarta.annotation.PostConstruct;
import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;

import java.io.IOException;

@Service
public class SpotifyTokenRefresher {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyTokenRefresher.class);

    // SpotifyのクライアントID
    @Value("${spotify.client.id}")
    private String clientId;

    // Spotifyのクライアントシークレット
    @Value("${spotify.client.secret}")
    private String clientSecret;

    // SpotifyAccessTokenServiceのインスタンスを注入
    @Autowired
    private SpotifyAccessTokenService spotifyAccessTokenService;

    // SpotifyApiのインスタンスを作成
    private SpotifyApi spotifyApi;

    // トークンのリフレッシュリクエストを作成
    private AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest;

    @PostConstruct
    public void init() {
        // Spotifyのリフレッシュトークン
        String refreshToken = spotifyAccessTokenService.getRefreshToken();

        spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRefreshToken(refreshToken)
                .build();

        authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();
    }

    // 1時間ごとにトークンをリフレッシュする
    @Scheduled(fixedRate = 3600000) // 3600000 milliseconds = 1 hour
    public void authorizationCodeRefresh() {
        // Spotifyのリフレッシュトークン
        String refreshToken = spotifyAccessTokenService.getRefreshToken();

        // リフレッシュトークンがnullまたは空でないことを確認
        if (refreshToken != null && !refreshToken.isEmpty()) {
            spotifyApi = new SpotifyApi.Builder()
                    .setClientId(clientId)
                    .setClientSecret(clientSecret)
                    .setRefreshToken(refreshToken)
                    .build();

            authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                    .build();

            try {
                // リフレッシュリクエストを実行
                final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

                // 新しいアクセストークンを設定
                spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

                // トークンの有効期限を表示
                System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
            } catch (IOException | SpotifyWebApiException | ParseException e) {
                // エラーメッセージをログに出力
                logger.error("Error: " + e.getMessage(), e);
            }
        }
    }
}
