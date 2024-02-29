package org.example.playlistinfo.controller.spotify;

import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.entity.AnnotatedPlaylistTrack;
import org.example.playlistinfo.security.SpotifyClientAuthenticator;
import org.example.playlistinfo.service.UserPlaylistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class GetPlaylistsItemsController {
    private static final Logger logger = LoggerFactory.getLogger(GetPlaylistsItemsController.class);

    private final SpotifyApi spotifyApi;

    public GetPlaylistsItemsController(final SpotifyClientAuthenticator spotifyClientAuthenticator) {
        String accessToken = spotifyClientAuthenticator.clientCredentials();
        this.spotifyApi = new SpotifyApi.Builder()
                .setAccessToken(accessToken)
                .build();
    }

    @GetMapping("/playlist/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistItems(@PathVariable String playlistId) {
        try {
            String username = getUsernameFromSecurityContext();
            List<AnnotatedPlaylistTrack> playlistTracks = fetchPlaylistTracks(playlistId, 0, new ArrayList<>());
            Playlist playlist = spotifyApi.getPlaylist(playlistId).build().execute();

            Map<String, Object> response = createResponse(playlistTracks, playlist);

            if (username != null) {
                UserPlaylistService.saveUserPlaylist(username, playlistId, playlist.getName());
            }
            UserPlaylistService.deletePlaylistsWithNullNames();

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error occurred while fetching playlist items: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (SpotifyWebApiException | ParseException e) {
            logger.error("Error occurred while interacting with Spotify API: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    private String getUsernameFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null && authentication.getPrincipal() instanceof UserDetails) ? ((UserDetails) authentication.getPrincipal()).getUsername() : null;
    }

    private Map<String, Object> createResponse(List<AnnotatedPlaylistTrack> playlistTracks, Playlist playlist) {
        Map<String, Object> response = new HashMap<>();
        response.put("tracks", playlistTracks);
        response.put("name", playlist.getName());
        return response;
    }

    private List<AnnotatedPlaylistTrack> fetchPlaylistTracks(String playlistId, int offset, List<AnnotatedPlaylistTrack> playlistTracks) throws IOException, SpotifyWebApiException, ParseException {
        GetPlaylistsItemsRequest getPlaylistsItemsRequest = spotifyApi
                .getPlaylistsItems(playlistId)
                .limit(100)
                .offset(offset)
                .build();

        Paging<PlaylistTrack> playlistTrackPaging = getPlaylistsItemsRequest.execute();

        for (PlaylistTrack playlistTrack : playlistTrackPaging.getItems()) {
            String trackId = playlistTrack.getTrack().getId();
            GetAudioFeaturesForTrackRequest getAudioFeaturesForTrackRequest = spotifyApi.getAudioFeaturesForTrack(trackId)
                    .build();
            AudioFeatures audioFeatures = getAudioFeaturesForTrackRequest.execute();

            playlistTracks.add(new AnnotatedPlaylistTrack(playlistTrack, audioFeatures));
        }

        if (playlistTrackPaging.getNext() != null) {
            fetchPlaylistTracks(playlistId, playlistTrackPaging.getOffset() + playlistTrackPaging.getItems().length, playlistTracks);
        }

        return playlistTracks;
    }
}
