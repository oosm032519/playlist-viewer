package org.example.playlistinfo.service;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;

@Getter
@Service
public class SpotifyApiService {

    private final SpotifyApi spotifyApi;

    @Autowired
    public SpotifyApiService(SpotifyApi spotifyApi) {
        this.spotifyApi = spotifyApi;
    }

    public void setAccessToken(String accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }

    public void setRefreshToken(String refreshToken) {
        spotifyApi.setRefreshToken(refreshToken);
    }
}
