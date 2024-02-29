package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.service.SpotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;

import java.io.IOException;

@RestController  // RESTコントローラーとして機能
public class PlaylistModificationController {
    private final SpotifyService spotifyService;  // Spotifyサービス

    @Autowired  // Spotifyサービスの自動注入
    public PlaylistModificationController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/java/playlist/addTrack")  // トラックをプレイリストに追加するエンドポイント
    public ResponseEntity<String> addTrackToPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        try {
            String response = spotifyService.addTrackToPlaylist(trackId, playlistId);  // トラックをプレイリストに追加
            return ResponseEntity.ok(response);  // 成功した場合、レスポンスを返す
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return handleException(e);  // 例外を処理
        }
    }

    @GetMapping("/java/playlist/removeTrack")  // トラックをプレイリストから削除するエンドポイント
    public ResponseEntity<String> removeTrackFromPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        try {
            String response = spotifyService.removeTrackFromPlaylist(trackId, playlistId);  // トラックをプレイリストから削除
            return ResponseEntity.ok(response);  // 成功した場合、レスポンスを返す
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return handleException(e);  // 例外を処理
        }
    }

    private ResponseEntity<String> handleException(Exception e) {  // 例外を処理するメソッド
        if (e instanceof SpotifyWebApiException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());  // Spotify APIの例外の場合、403エラーを返す
        } else {
            throw new RuntimeException("Error: " + e.getMessage());  // その他の例外の場合、ランタイムエラーをスロー
        }
    }
}
