package org.example.playlistinfo.config;

import lombok.Getter;
import org.example.playlistinfo.service.SpotifyApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Service
public class SpotifyAccessTokenService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAccessTokenService.class);

    @Getter
    public static SpotifyApi spotifyApi;

    private final SpotifyApiService spotifyApiService;

    @Autowired
    public SpotifyAccessTokenService(SpotifyApiService spotifyApiService) {
        this.spotifyApiService = spotifyApiService;
    }

    @PostConstruct
    public void init() {
        spotifyApi = spotifyApiService.getSpotifyApi();
    }

    public void authorizationCode(String code) {
        logger.info("認証コードを取得しました: " + code);
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                .build();
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            spotifyApiService.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApiService.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException e) {
            System.out.println("Error: " + e.getMessage());
        } catch (org.apache.hc.core5.http.ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public String getAccessToken() {
        return spotifyApi.getAccessToken();
    }

    public String getRefreshToken() {
        return spotifyApi.getRefreshToken();
    }
}
