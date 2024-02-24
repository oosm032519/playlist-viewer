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

@RestController
public class SpotifyCallbackController {

    private final SpotifyAccessTokenService spotifyAccessTokenService;
    private static final Logger logger = LoggerFactory.getLogger(SpotifyCallbackController.class);

    @Autowired
    public SpotifyCallbackController(SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    @GetMapping("/callback")
    public void handleCallback(@RequestParam("code") String code, HttpServletResponse response) {
        spotifyAccessTokenService.authorizationCode(code);
        try {
            response.sendRedirect("/"); // ホームページにリダイレクト
        } catch (IOException e) {
            logger.error("Error occurred while redirecting", e);
        }
    }
}
