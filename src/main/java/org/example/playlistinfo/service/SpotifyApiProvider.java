package org.example.playlistinfo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;

import java.net.URI;

@Service
public class SpotifyApiProvider {

    @Bean
    public SpotifyApi createSpotifyApi(@Value("${spotify.client.id}") String clientId,
                                       @Value("${spotify.client.secret}") String clientSecret,
                                       @Value("${spotify.redirect.uri}") String redirectUri) {
        return new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(URI.create(redirectUri))
                .build();
    }
}
