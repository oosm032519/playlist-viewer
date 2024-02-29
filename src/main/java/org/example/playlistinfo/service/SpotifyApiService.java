package org.example.playlistinfo.service;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;

import javax.annotation.PostConstruct;

@Service
public class SpotifyApiService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    @Value("${spotify.redirect.uri}")
    private String redirectUri;

    @Getter
    private SpotifyApi spotifyApi;

    @PostConstruct
    public void init() {
        spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(SpotifyHttpManager.makeUri(redirectUri))
                .build();
    }

    public void setAccessToken(String accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }

    public void setRefreshToken(String refreshToken) {
        spotifyApi.setRefreshToken(refreshToken);
    }
}
