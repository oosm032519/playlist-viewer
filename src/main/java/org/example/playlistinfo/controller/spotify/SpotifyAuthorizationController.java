package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.config.SpotifyAuthorizationUriGenerator;
import org.example.playlistinfo.config.SpotifyAccessTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfUsersPlaylistsRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController // REST APIのコントローラー
@RequestMapping("/java") // このコントローラーのルートURLを設定
public class SpotifyAuthorizationController {

    private final SpotifyAuthorizationUriGenerator spotifyAuthorizationUriGenerator;
    private final SpotifyAccessTokenService spotifyAccessTokenService;

    // コンストラクタ
    public SpotifyAuthorizationController(SpotifyAuthorizationUriGenerator spotifyAuthorizationUriGenerator, SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAuthorizationUriGenerator = spotifyAuthorizationUriGenerator;
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    // Spotifyの認証ページのURLを生成して返すエンドポイント
    @GetMapping("/authorize")
    public ResponseEntity<String> authorize() {
        return spotifyAuthorizationUriGenerator.authorizationCodeUri();
    }

    // ユーザーのプレイリストを取得するエンドポイント
    @GetMapping("/spotify/user/playlists")
    public ResponseEntity<List<PlaylistSimplified>> getUserPlaylists() {
        String accessToken = spotifyAccessTokenService.getAccessToken(); // アクセストークンを取得
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = spotifyApi.getCurrentUsersProfile()
                .build();

        try {
            final User user = getCurrentUsersProfileRequest.execute(); // ユーザー情報を取得
            GetListOfUsersPlaylistsRequest getListOfUsersPlaylistsRequest = spotifyApi
                    .getListOfUsersPlaylists(user.getId()) // ユーザーのプレイリストを取得するリクエストを作成
                    .build();
            final Paging<PlaylistSimplified> playlistSimplifiedPaging = getListOfUsersPlaylistsRequest.execute(); // リクエストを実行
            return ResponseEntity.ok(Arrays.asList(playlistSimplifiedPaging.getItems())); // プレイリストをレスポンスとして返す
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Error: " + e.getMessage()); // エラーメッセージを出力
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // エラーが発生した場合は500エラーを返す
        }
    }
}
