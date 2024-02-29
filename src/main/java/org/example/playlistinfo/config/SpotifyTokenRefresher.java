package org.example.playlistinfo.config;

import jakarta.annotation.PostConstruct;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.service.SpotifyApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Spotifyのアクセストークンサービス
    @Autowired
    private SpotifyAccessTokenService spotifyAccessTokenService;

    // SpotifyのAPIサービス
    @Autowired
    private SpotifyApiService spotifyApiService;

    // SpotifyのAPI
    private SpotifyApi spotifyApi;

    // 認証コードのリフレッシュリクエスト
    private AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest;

    // 初期化処理
    @PostConstruct
    public void init() {
        // SpotifyのAPIを取得
        spotifyApi = spotifyApiService.getSpotifyApi();

        // 認証コードのリフレッシュリクエストを作成
        authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();
    }

    // 1時間ごとに実行される認証コードのリフレッシュ処理
    @Scheduled(fixedRate = 3600000)
    public void authorizationCodeRefresh() {
        // リフレッシュトークンを取得
        String refreshToken = spotifyAccessTokenService.getRefreshToken();

        // リフレッシュトークンが存在する場合
        if (refreshToken != null && !refreshToken.isEmpty()) {
            // SpotifyのAPIを取得
            spotifyApi = spotifyApiService.getSpotifyApi();

            // 認証コードのリフレッシュリクエストを作成
            authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                    .build();

            try {
                // リフレッシュリクエストを実行
                final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

                // アクセストークンを設定
                spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

                // 有効期限を出力
                System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
            } catch (IOException | SpotifyWebApiException | ParseException e) {
                // エラーメッセージをログに出力
                logger.error("Error: " + e.getMessage(), e);
            }
        }
    }
}
