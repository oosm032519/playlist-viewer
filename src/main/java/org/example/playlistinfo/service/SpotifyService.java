package org.example.playlistinfo.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.entity.AnnotatedPlaylistTrack;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.AudioFeatures;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Playlist;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.requests.data.playlists.AddItemsToPlaylistRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;
import se.michaelthelin.spotify.requests.data.playlists.RemoveItemsFromPlaylistRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SpotifyService {
    private final SpotifyApi spotifyApi;

    public SpotifyService(SpotifyApi spotifyApi) {
        this.spotifyApi = spotifyApi;
    }

    public List<AnnotatedPlaylistTrack> fetchPlaylistTracks(String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        List<AnnotatedPlaylistTrack> playlistTracks = new ArrayList<>();
        int offset = 0;
        Paging<PlaylistTrack> playlistTrackPaging;

        do {
            GetPlaylistsItemsRequest getPlaylistsItemsRequest = spotifyApi
                    .getPlaylistsItems(playlistId)
                    .limit(100)
                    .offset(offset)
                    .build();

            playlistTrackPaging = getPlaylistsItemsRequest.execute();

            for (PlaylistTrack playlistTrack : playlistTrackPaging.getItems()) {
                String trackId = playlistTrack.getTrack().getId();
                GetAudioFeaturesForTrackRequest getAudioFeaturesForTrackRequest = spotifyApi.getAudioFeaturesForTrack(trackId)
                        .build();
                AudioFeatures audioFeatures = getAudioFeaturesForTrackRequest.execute();

                playlistTracks.add(new AnnotatedPlaylistTrack(playlistTrack, audioFeatures));
            }

            offset += playlistTrackPaging.getItems().length;
        } while (playlistTrackPaging.getNext() != null);

        return playlistTracks;
    }

    public Map<String, Object> fetchPlaylistTracksAndCreateResponse(String playlistId, String username) throws IOException, SpotifyWebApiException, ParseException {
        List<AnnotatedPlaylistTrack> playlistTracks = fetchPlaylistTracks(playlistId);
        Playlist playlist = spotifyApi.getPlaylist(playlistId).build().execute();

        Map<String, Object> response = new HashMap<>();
        response.put("tracks", playlistTracks);
        response.put("name", playlist.getName());

        if (username != null) {
            UserPlaylistService.saveUserPlaylist(username, playlistId, playlist.getName());
        }
        UserPlaylistService.deletePlaylistsWithNullNames();

        return response;
    }

    public String addTrackToPlaylist(String trackId, String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        AddItemsToPlaylistRequest addItemsToPlaylistRequest = spotifyApi
                .addItemsToPlaylist(playlistId, new String[]{"spotify:track:" + trackId})
                .build();
        addItemsToPlaylistRequest.execute();
        return "Track added successfully";
    }

    public String removeTrackFromPlaylist(String trackId, String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        JsonArray tracks = JsonParser.parseString("[{\"uri\":\"spotify:track:" + trackId + "\"}]").getAsJsonArray();
        RemoveItemsFromPlaylistRequest removeItemsFromPlaylistRequest = spotifyApi
                .removeItemsFromPlaylist(playlistId, tracks)
                .build();
        removeItemsFromPlaylistRequest.execute();
        return "Track removed successfully";
    }
}
