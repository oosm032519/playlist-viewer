package org.example.playlistinfo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import org.example.playlistinfo.service.SpotifyApiService;

import java.net.URI;

@Service
public class SpotifyAuthorizationUriGenerator {
    private final SpotifyApiService spotifyApiService;
    private AuthorizationCodeUriRequest authorizationCodeUriRequest;

    @Autowired
    public SpotifyAuthorizationUriGenerator(SpotifyApiService spotifyApiService) {
        this.spotifyApiService = spotifyApiService;
    }

    @PostConstruct
    public void init() {
        SpotifyApi spotifyApi = spotifyApiService.getSpotifyApi();
        this.authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
          .scope("playlist-read-private,playlist-read-collaborative,playlist-modify-private,playlist-modify-public")
          .show_dialog(true)
        .build();
    }

    public ResponseEntity<String> authorizationCodeUri() {
        final URI uri = authorizationCodeUriRequest.execute();
        return ResponseEntity.ok(uri.toString());
    }
}
