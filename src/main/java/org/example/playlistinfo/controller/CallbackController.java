package org.example.playlistinfo.controller;

import org.example.playlistinfo.authorization.SpotifyAuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@RestController
public class CallbackController {

    private final SpotifyAuthorizationService spotifyAuthorizationService;
    private static final Logger logger = LoggerFactory.getLogger(CallbackController.class);

    @Autowired
    public CallbackController(SpotifyAuthorizationService spotifyAuthorizationService) {
        this.spotifyAuthorizationService = spotifyAuthorizationService;
    }

    @GetMapping("/callback")
    public void handleCallback(@RequestParam("code") String code, HttpServletResponse response) {
        spotifyAuthorizationService.authorizationCode(code);
        try {
            response.sendRedirect("/"); // ホームページにリダイレクト
        } catch (IOException e) {
            logger.error("Error occurred while redirecting", e);
        }
    }
}
