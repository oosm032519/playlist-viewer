package org.example.playlistinfo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import org.apache.hc.core5.http.ParseException;

import java.io.IOException;

public class SpotifyTokenRefresher {
    // SpotifyのクライアントID
    @Value("${spotify.client.id}")
    private String clientId;

    // Spotifyのクライアントシークレット
    @Value("${spotify.client.secret}")
    private String clientSecret;

    // Spotifyのリフレッシュトークン
    @Value("${spotify.refresh.token}")
    private String refreshToken;

    // SpotifyApiのインスタンスを作成
    private final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientId)
            .setClientSecret(clientSecret)
            .setRefreshToken(refreshToken)
            .build();

    // トークンのリフレッシュリクエストを作成
    private final AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
            .build();

    // 1時間ごとにトークンをリフレッシュする
    @Scheduled(fixedRate = 3600000) // 3600000 milliseconds = 1 hour
    public void authorizationCodeRefresh() {
        try {
            // リフレッシュリクエストを実行
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

            // 新しいアクセストークンを設定
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

            // トークンの有効期限を表示
            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            // エラーメッセージを表示
            System.out.println("Error: " + e.getMessage());
        }
    }
}
