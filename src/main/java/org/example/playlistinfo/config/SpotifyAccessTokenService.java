package org.example.playlistinfo.config;

import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service // このクラスがサービスクラスであることを示す
public class SpotifyAccessTokenService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAccessTokenService.class);

    // SpotifyのクライアントID
    @Value("${spotify.client.id}")
    private String clientId;

    // Spotifyのクライアントシークレット
    @Value("${spotify.client.secret}")
    private String clientSecret;

    // SpotifyのリダイレクトURI
    @Value("${spotify.redirect.uri}")
    private String redirectUri;

    // SpotifyApiのインスタンス
    @Getter
    private static SpotifyApi spotifyApi;

    // サービスクラスの初期化処理
    @PostConstruct
    public void init() {
        spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(SpotifyHttpManager.makeUri(redirectUri))
                .build();
    }

    // 認証コードを使用してアクセストークンを取得する
    public void authorizationCode(String code) {
        logger.info("認証コードを取得しました: " + code);
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            // アクセストークンとリフレッシュトークンを設定する
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException e) {
            System.out.println("Error: " + e.getMessage());
        } catch (org.apache.hc.core5.http.ParseException e) {
            throw new RuntimeException(e);
        }
    }

    // アクセストークンを取得する
    public String getAccessToken() {
        return spotifyApi.getAccessToken();
    }

    // リフレッシュトークンを取得する
    public String getRefreshToken() {
        return spotifyApi.getRefreshToken();
    }
}
