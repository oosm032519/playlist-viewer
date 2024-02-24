package org.example.playlistinfo.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.authorization.SpotifyAuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.special.SnapshotResult;
import se.michaelthelin.spotify.requests.data.playlists.AddItemsToPlaylistRequest;
import se.michaelthelin.spotify.requests.data.playlists.RemoveItemsFromPlaylistRequest;

import java.io.IOException;

@RestController
public class PlaylistController {
    private final SpotifyAuthorizationService spotifyAuthorizationService;

    @Autowired
    public PlaylistController(SpotifyAuthorizationService spotifyAuthorizationService) {
        this.spotifyAuthorizationService = spotifyAuthorizationService;
    }

    @GetMapping("/java/playlist/addTrack")
    public SnapshotResult addTrackToPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        String accessToken = spotifyAuthorizationService.getAccessToken();
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        AddItemsToPlaylistRequest addItemsToPlaylistRequest = spotifyApi
                .addItemsToPlaylist(playlistId, new String[]{"spotify:track:" + trackId})
                .build();

        try {
            return addItemsToPlaylistRequest.execute();
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @GetMapping("/java/playlist/removeTrack")
    public SnapshotResult removeTrackFromPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        String accessToken = spotifyAuthorizationService.getAccessToken();
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
        JsonArray tracks = JsonParser.parseString("[{\"uri\":\"spotify:track:" + trackId + "\"}]").getAsJsonArray();
        RemoveItemsFromPlaylistRequest removeItemsFromPlaylistRequest = spotifyApi
                .removeItemsFromPlaylist(playlistId, tracks)
                .build();

        try {
            return removeItemsFromPlaylistRequest.execute();
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
