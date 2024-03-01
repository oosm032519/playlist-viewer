package org.example.playlistinfo.controller.spotify;

import org.example.playlistinfo.config.SpotifyAccessTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

// Spotifyのコールバックを処理するコントローラ
@RestController
public class SpotifyCallbackController {
    private final SpotifyAccessTokenService spotifyAccessTokenService;
    private static final Logger logger = LoggerFactory.getLogger(SpotifyCallbackController.class);

    // SpotifyAccessTokenServiceを注入
    public SpotifyCallbackController(SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    // Spotifyからのコールバックを処理するエンドポイント
    @GetMapping("/callback")
    public void handleCallback(@RequestParam("code") String code, HttpServletResponse response) {
        try {
            // 認証コードを使用してアクセストークンを取得
            spotifyAccessTokenService.authorizationCode(code);

            // ルートURLにリダイレクトし、成功メッセージをクエリパラメータとして渡す
            response.sendRedirect("/?loginResult=success");
        } catch (Exception e) {
            // リダイレクトエラーをログに記録し、失敗メッセージをクエリパラメータとして渡す
            logger.error("Error occurred while redirecting", e);
            try {
                response.sendRedirect("/?loginResult=failure");
            } catch (IOException ioException) {
                logger.error("Error occurred while redirecting", ioException);
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        }
    }
}
