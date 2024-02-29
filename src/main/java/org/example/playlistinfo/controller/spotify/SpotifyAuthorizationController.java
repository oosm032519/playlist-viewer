package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.config.SpotifyAccessTokenService;
import org.example.playlistinfo.config.SpotifyAuthorizationUriGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.exceptions.detailed.UnauthorizedException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfUsersPlaylistsRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.io.IOException;
import java.util.Arrays;

@RestController  // RESTコントローラとして機能するクラス
@RequestMapping("/java")  // このコントローラのエンドポイントの基本パスを設定
public class SpotifyAuthorizationController {

    private final SpotifyAuthorizationUriGenerator spotifyAuthorizationUriGenerator;
    private final SpotifyAccessTokenService spotifyAccessTokenService;
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAuthorizationController.class);

    // コンストラクタ
    public SpotifyAuthorizationController(SpotifyAuthorizationUriGenerator spotifyAuthorizationUriGenerator, SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAuthorizationUriGenerator = spotifyAuthorizationUriGenerator;
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    @GetMapping("/authorize")  // 認証コードのURIを取得するエンドポイント
    public ResponseEntity<String> authorize() {
        return spotifyAuthorizationUriGenerator.authorizationCodeUri();
    }

    @GetMapping("/spotify/user/playlists")  // ユーザーのプレイリストを取得するエンドポイント
    public ResponseEntity<?> getUserPlaylists() {
        String accessToken = spotifyAccessTokenService.getAccessToken();
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = spotifyApi.getCurrentUsersProfile()
                .build();

        try {
            final User user = getCurrentUsersProfileRequest.execute();
            GetListOfUsersPlaylistsRequest getListOfUsersPlaylistsRequest = spotifyApi
                    .getListOfUsersPlaylists(user.getId())
                    .build();
            final Paging<PlaylistSimplified> playlistSimplifiedPaging = getListOfUsersPlaylistsRequest.execute();
            return ResponseEntity.ok(Arrays.asList(playlistSimplifiedPaging.getItems()));
        } catch (UnauthorizedException e) {
            logger.error("Error: " + e.getMessage(), e);
            String errorMessage = "Spotifyへのログインが必要です。Spotifyにログインしてから再試行してください。";
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            logger.error("Error: " + e.getMessage(), e);
            String errorMessage;
            if (e instanceof SpotifyWebApiException) {
                errorMessage = "Spotify APIからの応答に問題がありました。しばらくしてから再度お試しください。";
            } else if (e instanceof IOException) {
                errorMessage = "通信エラーが発生しました。ネットワーク接続を確認してください。";
            } else {
                errorMessage = "予期しないエラーが発生しました。";
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);  // エラーメッセージを含むレスポンスを返す
        }
    }
}
