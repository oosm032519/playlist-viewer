package org.example.playlistinfo.controller.spotify;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.config.SpotifyAccessTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.requests.data.playlists.AddItemsToPlaylistRequest;
import se.michaelthelin.spotify.requests.data.playlists.RemoveItemsFromPlaylistRequest;

import java.io.IOException;

@RestController
public class PlaylistModificationController {
    private final SpotifyAccessTokenService spotifyAccessTokenService;

    @Autowired
    public PlaylistModificationController(SpotifyAccessTokenService spotifyAccessTokenService) {
        this.spotifyAccessTokenService = spotifyAccessTokenService;
    }

    @GetMapping("/java/playlist/addTrack")
    public ResponseEntity<String> addTrackToPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        SpotifyApi spotifyApi = getSpotifyApi();
        AddItemsToPlaylistRequest addItemsToPlaylistRequest = spotifyApi
                .addItemsToPlaylist(playlistId, new String[]{"spotify:track:" + trackId})
                .build();

        try {
            addItemsToPlaylistRequest.execute();
            return ResponseEntity.ok("Track added successfully");
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return handleException(e);
        }
    }

    @GetMapping("/java/playlist/removeTrack")
    public ResponseEntity<String> removeTrackFromPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        SpotifyApi spotifyApi = getSpotifyApi();
        JsonArray tracks = JsonParser.parseString("[{\"uri\":\"spotify:track:" + trackId + "\"}]").getAsJsonArray();
        RemoveItemsFromPlaylistRequest removeItemsFromPlaylistRequest = spotifyApi
                .removeItemsFromPlaylist(playlistId, tracks)
                .build();

        try {
            removeItemsFromPlaylistRequest.execute();
            return ResponseEntity.ok("Track removed successfully");
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return handleException(e);
        }
    }

    private SpotifyApi getSpotifyApi() {
        String accessToken = spotifyAccessTokenService.getAccessToken();
        return new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
    }

    private ResponseEntity<String> handleException(Exception e) {
        if (e instanceof SpotifyWebApiException && e.getMessage().contains("You cannot")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        } else {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
