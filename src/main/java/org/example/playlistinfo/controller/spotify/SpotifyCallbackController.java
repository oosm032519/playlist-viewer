package org.example.playlistinfo.controller.spotify;

import org.example.playlistinfo.config.SpotifyAccessTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@RestController // REST APIのコントローラー
public class SpotifyCallbackController {

    private final SpotifyAccessTokenService spotifyAccessTokenService; // Spotifyのアクセストークンを管理するサービス
    private static final Logger logger = LoggerFactory.getLogger(SpotifyCallbackController.class); // ロギングのためのロガー

    // コンストラクタ
    @Autowired
    public SpotifyCallbackController(SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    // Spotifyからのコールバックを処理するエンドポイント
    @GetMapping("/callback")
    public void handleCallback(@RequestParam("code") String code, HttpServletResponse response) {
        spotifyAccessTokenService.authorizationCode(code); // 認証コードを使用してアクセストークンを取得

        try {
            response.sendRedirect("/"); // ホームページにリダイレクト
        } catch (IOException e) {
            logger.error("Error occurred while redirecting", e); // リダイレクト中にエラーが発生した場合、エラーメッセージをログに出力
        }
    }
}
