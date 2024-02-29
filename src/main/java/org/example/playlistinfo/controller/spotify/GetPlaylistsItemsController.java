package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.service.SecurityUtils;
import org.example.playlistinfo.service.SpotifyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;

import java.io.IOException;
import java.util.Map;

@RestController
public class GetPlaylistsItemsController {
    private static final Logger logger = LoggerFactory.getLogger(GetPlaylistsItemsController.class);

    private final SpotifyService spotifyService;

    public GetPlaylistsItemsController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistItems(@PathVariable String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        String username = SecurityUtils.getUsernameFromSecurityContext();
        Map<String, Object> response = spotifyService.fetchPlaylistTracksAndCreateResponse(playlistId, username);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException e) {
        logger.error("Error occurred while fetching playlist items: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while fetching playlist items.");
    }

    @ExceptionHandler(SpotifyWebApiException.class)
    public ResponseEntity<String> handleSpotifyWebApiException(SpotifyWebApiException e) {
        logger.error("Error occurred while interacting with Spotify API: ", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error occurred while interacting with Spotify API.");
    }

    @ExceptionHandler(ParseException.class)
    public ResponseEntity<String> handleParseException(ParseException e) {
        logger.error("Error occurred while parsing the response from Spotify API: ", e);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Error occurred while parsing the response from Spotify API.");
    }
}
