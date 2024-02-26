package org.example.playlistinfo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.net.URI;

@Service // このクラスがサービスクラスであることを示す
public class SpotifyAuthorizationUriGenerator {
    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    @Value("${spotify.redirect.uri}")
    private String redirectUriStr;

    private AuthorizationCodeUriRequest authorizationCodeUriRequest;

    @PostConstruct // インスタンス生成後に実行されるメソッド
    public void init() {
        URI redirectUri = SpotifyHttpManager.makeUri(redirectUriStr);
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(redirectUri)
                .build();
        // 認証コードのリクエストを作成
        this.authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
//          .state("x4xkmn9pu3j6ukrs8n")
          .scope("playlist-read-private,playlist-read-collaborative,playlist-modify-private,playlist-modify-public")
          .show_dialog(true)
        .build();
    }

    // 認証コードのURIを取得するメソッド
    public ResponseEntity<String> authorizationCodeUri() {
        final URI uri = authorizationCodeUriRequest.execute();
        return ResponseEntity.ok(uri.toString());
    }
}
