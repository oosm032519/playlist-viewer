package org.example.playlistinfo.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.apache.hc.core5.http.ParseException;
import org.example.playlistinfo.entity.AnnotatedPlaylistTrack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.*;
import se.michaelthelin.spotify.requests.data.playlists.AddItemsToPlaylistRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;
import se.michaelthelin.spotify.requests.data.playlists.RemoveItemsFromPlaylistRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetAudioFeaturesForTrackRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service  // SpotifyのAPIを利用するためのサービスクラス
public class SpotifyService {
    private final SpotifyApi spotifyApi;
    private final UserPlaylistService userPlaylistService;

    @Autowired  // コンストラクタインジェクション
    public SpotifyService(SpotifyApi spotifyApi, UserPlaylistService userPlaylistService) {
        this.spotifyApi = spotifyApi;
        this.userPlaylistService = userPlaylistService;
    }

    // プレイリストのトラックを取得するメソッド
    public List<AnnotatedPlaylistTrack> fetchPlaylistTracks(String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        List<AnnotatedPlaylistTrack> playlistTracks = new ArrayList<>();
        int offset = 0;
        Paging<PlaylistTrack> playlistTrackPaging;

        do {
            // プレイリストのアイテムを取得するリクエストを作成
            GetPlaylistsItemsRequest getPlaylistsItemsRequest = spotifyApi
                    .getPlaylistsItems(playlistId)
                    .limit(100)
                    .offset(offset)
                    .build();

            playlistTrackPaging = getPlaylistsItemsRequest.execute();

            // 各トラックのオーディオ特性を取得し、AnnotatedPlaylistTrackオブジェクトを作成
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

    // プレイリストのトラックを取得し、レスポンスを作成するメソッド
    public Map<String, Object> fetchPlaylistTracksAndCreateResponse(String playlistId, String username) throws IOException, SpotifyWebApiException, ParseException {
        List<AnnotatedPlaylistTrack> playlistTracks = fetchPlaylistTracks(playlistId);
        Playlist playlist = spotifyApi.getPlaylist(playlistId).build().execute();

        Map<String, Object> response = new HashMap<>();
        response.put("tracks", playlistTracks);
        response.put("name", playlist.getName());

        // ユーザー名がnullでない場合、ユーザーのプレイリストを保存
        if (username != null) {
            userPlaylistService.saveUserPlaylist(username, playlistId, playlist.getName());
        }
        userPlaylistService.deletePlaylistsWithNullNames();

        return response;
    }

    // プレイリストにトラックを追加するメソッド
    public String addTrackToPlaylist(String trackId, String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        AddItemsToPlaylistRequest addItemsToPlaylistRequest = spotifyApi
                .addItemsToPlaylist(playlistId, new String[]{"spotify:track:" + trackId})
                .build();
        addItemsToPlaylistRequest.execute();
        return "Track added successfully";
    }

    // プレイリストからトラックを削除するメソッド
    public String removeTrackFromPlaylist(String trackId, String playlistId) throws IOException, SpotifyWebApiException, ParseException {
        JsonArray tracks = JsonParser.parseString("[{\"uri\":\"spotify:track:" + trackId + "\"}]").getAsJsonArray();
        RemoveItemsFromPlaylistRequest removeItemsFromPlaylistRequest = spotifyApi
                .removeItemsFromPlaylist(playlistId, tracks)
                .build();
        removeItemsFromPlaylistRequest.execute();
        return "Track removed successfully";
    }

    public Track getTrack(String trackId) throws IOException, SpotifyWebApiException, ParseException {
        GetTrackRequest getTrackRequest = spotifyApi.getTrack(trackId).build();
        return getTrackRequest.execute();
    }

    public AudioFeatures getAudioFeaturesForTrack(String trackId) throws IOException, SpotifyWebApiException, ParseException {
        GetAudioFeaturesForTrackRequest getAudioFeaturesForTrackRequest = spotifyApi.getAudioFeaturesForTrack(trackId)
                .build();
        return getAudioFeaturesForTrackRequest.execute();
    }
}
