package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.service.SpotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;

import java.io.IOException;

@RestController
public class PlaylistModificationController {
    private final SpotifyService spotifyService;

    @Autowired
    public PlaylistModificationController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/java/playlist/addTrack")
    public ResponseEntity<String> addTrackToPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        try {
            String response = spotifyService.addTrackToPlaylist(trackId, playlistId);
            return ResponseEntity.ok(response);
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return handleException(e);
        }
    }

    @GetMapping("/java/playlist/removeTrack")
    public ResponseEntity<String> removeTrackFromPlaylist(@RequestParam String trackId, @RequestParam String playlistId) {
        try {
            String response = spotifyService.removeTrackFromPlaylist(trackId, playlistId);
            return ResponseEntity.ok(response);
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            return handleException(e);
        }
    }

    private ResponseEntity<String> handleException(Exception e) {
        if (e instanceof SpotifyWebApiException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        } else {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
