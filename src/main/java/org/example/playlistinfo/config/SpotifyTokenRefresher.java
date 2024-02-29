package org.example.playlistinfo.config;

import jakarta.annotation.PostConstruct;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.service.SpotifyApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;

import java.io.IOException;

@Service
public class SpotifyTokenRefresher {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyTokenRefresher.class);

    @Autowired
    private SpotifyAccessTokenService spotifyAccessTokenService;

    @Autowired
    private SpotifyApiService spotifyApiService;

    private SpotifyApi spotifyApi;

    private AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest;

    @PostConstruct
    public void init() {

        spotifyApi = spotifyApiService.getSpotifyApi();

        authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();
    }

    @Scheduled(fixedRate = 3600000)
    public void authorizationCodeRefresh() {
        String refreshToken = spotifyAccessTokenService.getRefreshToken();

        if (refreshToken != null && !refreshToken.isEmpty()) {
            spotifyApi = spotifyApiService.getSpotifyApi();

            authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                    .build();

            try {
                final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

                spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

                System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
            } catch (IOException | SpotifyWebApiException | ParseException e) {
                logger.error("Error: " + e.getMessage(), e);
            }
        }
    }
}
