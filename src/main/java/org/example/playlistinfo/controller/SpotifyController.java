package org.example.playlistinfo.controller;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.authorization.AuthorizationCodeUri;
import org.example.playlistinfo.authorization.SpotifyAuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.model_objects.specification.User;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfUsersPlaylistsRequest;
import se.michaelthelin.spotify.requests.data.users_profile.GetCurrentUsersProfileRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/java")
public class SpotifyController {

    private final AuthorizationCodeUri authorizationCodeUri;
    private final SpotifyAuthorizationService spotifyAuthorizationService;

    public SpotifyController(AuthorizationCodeUri authorizationCodeUri, SpotifyAuthorizationService spotifyAuthorizationService) {
        this.authorizationCodeUri = authorizationCodeUri;
        this.spotifyAuthorizationService = spotifyAuthorizationService;
    }

    @GetMapping("/authorize")
    public ResponseEntity<String> authorize() {
        return authorizationCodeUri.authorizationCodeUri();
    }

    @GetMapping("/spotify/user/playlists")
    public ResponseEntity<List<PlaylistSimplified>> getUserPlaylists() {
        String accessToken = spotifyAuthorizationService.getAccessToken();
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        GetCurrentUsersProfileRequest getCurrentUsersProfileRequest = spotifyApi.getCurrentUsersProfile()
                .build();

        try {
            final User user = getCurrentUsersProfileRequest.execute();
            GetListOfUsersPlaylistsRequest getListOfUsersPlaylistsRequest = spotifyApi
                    .getListOfUsersPlaylists(user.getId())
                    .build();
            final Paging<PlaylistSimplified> playlistSimplifiedPaging = getListOfUsersPlaylistsRequest.execute();
            return ResponseEntity.ok(Arrays.asList(playlistSimplifiedPaging.getItems()));
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
