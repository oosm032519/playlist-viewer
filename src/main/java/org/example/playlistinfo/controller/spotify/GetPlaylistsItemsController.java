package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.service.SecurityUtils;
import org.example.playlistinfo.service.SpotifyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;

import java.io.IOException;
import java.util.Map;

@RestController  // RESTコントローラとしてクラスを宣言
public class GetPlaylistsItemsController {
    private static final Logger logger = LoggerFactory.getLogger(GetPlaylistsItemsController.class);

    private final SpotifyService spotifyService;  // Spotifyサービス

    // Spotifyサービスを引数に取るコンストラクタ
    public GetPlaylistsItemsController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    // プレイリストIDをパスパラメータとして取り、プレイリストのアイテムを取得するエンドポイント
    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistItems(@PathVariable String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        String username = SecurityUtils.getUsernameFromSecurityContext();  // セキュリティコンテキストからユーザ名を取得
        Map<String, Object> response = spotifyService.fetchPlaylistTracksAndCreateResponse(playlistId, username);  // プレイリストのトラックを取得し、レスポンスを作成
        return ResponseEntity.ok(response);  // レスポンスを返す
    }

    // IOExceptionをハンドルするメソッド
    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException e) {
        logger.error("Error occurred while fetching playlist items: ", e);  // エラーログを出力
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while fetching playlist items.");  // エラーレスポンスを返す
    }

    // SpotifyWebApiExceptionをハンドルするメソッド
    @ExceptionHandler(SpotifyWebApiException.class)
    public ResponseEntity<String> handleSpotifyWebApiException(SpotifyWebApiException e) {
        logger.error("Error occurred while interacting with Spotify API: ", e);  // エラーログを出力
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error occurred while interacting with Spotify API.");  // エラーレスポンスを返す
    }

    // ParseExceptionをハンドルするメソッド
    @ExceptionHandler(ParseException.class)
    public ResponseEntity<String> handleParseException(ParseException e) {
        logger.error("Error occurred while parsing the response from Spotify API: ", e);  // エラーログを出力
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Error occurred while parsing the response from Spotify API.");  // エラーレスポンスを返す
    }
}
