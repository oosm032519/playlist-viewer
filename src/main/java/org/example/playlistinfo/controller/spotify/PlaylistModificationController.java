package org.example.playlistinfo.controller.spotify;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.config.SpotifyAccessTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.special.SnapshotResult;
import se.michaelthelin.spotify.requests.data.playlists.AddItemsToPlaylistRequest;
import se.michaelthelin.spotify.requests.data.playlists.RemoveItemsFromPlaylistRequest;

import java.io.IOException;

@RestController // REST APIのコントローラー
public class PlaylistModificationController {
    private final SpotifyAccessTokenService spotifyAccessTokenService; // Spotifyのアクセストークンを取得するサービス

    @Autowired // 依存性注入
    public PlaylistModificationController(SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    @GetMapping("/java/playlist/addTrack") // GETリクエストで曲をプレイリストに追加するエンドポイント
    public SnapshotResult addTrackToPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        String accessToken = spotifyAccessTokenService.getAccessToken(); // アクセストークンを取得
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        AddItemsToPlaylistRequest addItemsToPlaylistRequest = spotifyApi
                .addItemsToPlaylist(playlistId, new String[]{"spotify:track:" + trackId})
                .build();

        try {
            return addItemsToPlaylistRequest.execute(); // リクエストを実行して結果を返す
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            throw new RuntimeException("Error: " + e.getMessage()); // エラーが発生した場合は例外をスロー
        }
    }

    @GetMapping("/java/playlist/removeTrack") // GETリクエストで曲をプレイリストから削除するエンドポイント
    public SnapshotResult removeTrackFromPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        String accessToken = spotifyAccessTokenService.getAccessToken(); // アクセストークンを取得
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        JsonArray tracks = JsonParser.parseString("[{\"uri\":\"spotify:track:" + trackId + "\"}]").getAsJsonArray();
        RemoveItemsFromPlaylistRequest removeItemsFromPlaylistRequest = spotifyApi
                .removeItemsFromPlaylist(playlistId, tracks)
                .build();

        try {
            return removeItemsFromPlaylistRequest.execute(); // リクエストを実行して結果を返す
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            throw new RuntimeException("Error: " + e.getMessage()); // エラーが発生した場合は例外をスロー
        }
    }
}
